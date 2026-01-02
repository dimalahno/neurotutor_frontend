import {
    Alert,
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../../../config.ts";

type ChatStatus = "idle" | "created" | "connecting" | "active" | "ended" | "error";

type StartResponse = { session_id: string; greeting: string; status: "created" };
type OfferResponse = {
    session_id: string;
    call_id: string;
    sdp_answer: string;
    status: "active";
};
type StopResponse = { session_id: string; status: "ended" };

interface VoiceChatProps {
    initialLessonId?: string;
    initialUserId?: number;
}

// ключ для восстановления/добивания хвоста
const STORAGE_SESSION_KEY = "voice_session_id";

const postJson = async <T,>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request to ${url} failed`);
    }

    return (await response.json()) as T;
};

export function VoiceChat({
                              initialLessonId = "",
                              initialUserId,
                          }: VoiceChatProps) {
    const [lessonId, setLessonId] = useState(initialLessonId);
    const [userId, setUserId] = useState(
        initialUserId !== undefined ? String(initialUserId) : "",
    );
    const [status, setStatus] = useState<ChatStatus>("idle");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [callId, setCallId] = useState<string | null>(null);
    const [greeting, setGreeting] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    // refs для “последних” значений (нужны в pagehide/visibility handlers)
    const sessionIdRef = useRef<string | null>(null); // <-- NEW
    const userIdRef = useRef<string>(""); // <-- NEW

    const greetPayload = useMemo(() => {
        if (!greeting) return null;
        return {
            type: "conversation.item.create",
            item: {
                type: "message",
                role: "assistant",
                content: [
                    {
                        type: "input_text",
                        text: greeting,
                    },
                ],
            },
        };
    }, [greeting]);

    const cleanup = useCallback(() => {
        dataChannelRef.current?.close();
        dataChannelRef.current = null;

        peerRef.current?.getSenders().forEach((sender) => sender.track?.stop());
        peerRef.current?.getReceivers().forEach((receiver) => receiver.track?.stop());
        peerRef.current?.close();
        peerRef.current = null;

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;

        if (audioRef.current) {
            audioRef.current.srcObject = null;
        }

        setStatus((prev) => (prev === "idle" ? prev : "ended"));
        setCallId(null);
        dataChannelRef.current = null;
    }, []);

    // best-effort stop (без await) для закрытия/рефреша вкладки
    const stopBestEffort = useCallback((sid: string, uid: number) => {
        try {
            fetch(`${API_BASE_URL}/voice/stop`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sid, user_id: uid }),
                keepalive: true, // даёт шанс запросу уйти при закрытии вкладки
            });
        } catch {
            // ignore
        }
    }, []);

    const handleStop = useCallback(async () => {
        try {
            if (sessionId && userId.trim()) {
                await postJson<StopResponse>(`${API_BASE_URL}/voice/stop`, {
                    session_id: sessionId,
                    user_id: Number(userId),
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        } finally {
            cleanup();
            setSessionId(null);
            sessionIdRef.current = null; // синхронизируем ref
            localStorage.removeItem(STORAGE_SESSION_KEY); // убираем хвост
        }
    }, [cleanup, sessionId, userId]);

    const setupPeerConnection = useCallback(
        async (session: StartResponse, numericUserId: number) => {
            const pc = new RTCPeerConnection();
            peerRef.current = pc;

            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = localStream;
            localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

            const dc = pc.createDataChannel("oai-events");
            dataChannelRef.current = dc;

            dc.onopen = () => {
                if (greetPayload) {
                    dc.send(JSON.stringify(greetPayload));
                }
                dc.send(
                    JSON.stringify({
                        type: "response.create",
                        response: { modalities: ["audio"] },
                    }),
                );
            };

            dc.onmessage = (event) => {
                console.log("Data channel message:", event.data);
            };

            dc.onclose = () => {
                dataChannelRef.current = null;
            };

            pc.ontrack = (event) => {
                const [remoteStream] = event.streams;
                if (remoteStream && audioRef.current) {
                    audioRef.current.srcObject = remoteStream;
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const offerResponse = await postJson<OfferResponse>(`${API_BASE_URL}/voice/webrtc/offer`, {
                session_id: session.session_id,
                user_id: numericUserId,
                sdp_offer: offer.sdp ?? "",
            });

            setCallId(offerResponse.call_id);
            await pc.setRemoteDescription({ type: "answer", sdp: offerResponse.sdp_answer });
            setStatus(offerResponse.status);
        },
        [greetPayload],
    );

    useEffect(() => {
        setLessonId(initialLessonId);
    }, [initialLessonId]);

    useEffect(() => {
        if (initialUserId === undefined) return;
        setUserId(String(initialUserId));
    }, [initialUserId]);


    // синхронизация sessionId/userId в refs + localStorage для "хвоста"
    useEffect(() => {
        sessionIdRef.current = sessionId; // <-- NEW
        if (sessionId) localStorage.setItem(STORAGE_SESSION_KEY, sessionId); // <-- NEW
        else localStorage.removeItem(STORAGE_SESSION_KEY); // <-- NEW
    }, [sessionId]);

    useEffect(() => {
        userIdRef.current = userId; // <-- NEW
    }, [userId]);

    const handleStart = useCallback(
        async (explicitLessonId?: string, explicitUserId?: number) => {
            setError(null);

            // если уже есть активная сессия — сначала корректно останавливаем
            if (sessionIdRef.current) {
                await handleStop(); // <-- NEW
            } else {
                cleanup();
            }

            setStatus("connecting");

            const effectiveLessonId = explicitLessonId ?? lessonId.trim();
            const numericUserId = explicitUserId ?? Number(userId);

            if (!effectiveLessonId) {
                setError("Укажите lessonId или выберите тему");
                setStatus("error");
                return;
            }

            if (!Number.isFinite(numericUserId)) {
                setError("Укажите корректный userId");
                setStatus("error");
                return;
            }

            setLessonId(effectiveLessonId);

            try {
                const startResponse = await postJson<StartResponse>(`${API_BASE_URL}/voice/start`, {
                    lesson_id: effectiveLessonId,
                    user_id: numericUserId,
                });

                setStatus(startResponse.status);
                setSessionId(startResponse.session_id);
                setGreeting(startResponse.greeting);

                await setupPeerConnection(startResponse, numericUserId);
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
                setStatus("error");
                cleanup();
                setSessionId(null);
                sessionIdRef.current = null; // <-- NEW
                localStorage.removeItem(STORAGE_SESSION_KEY); // <-- NEW
            }
        },
        [cleanup, handleStop, lessonId, setupPeerConnection, userId],
    );

    // при закрытии/рефреше вкладки — best-effort stop + локальный cleanup
    useEffect(() => {
        const onPageHide = () => {
            const sid = sessionIdRef.current ?? localStorage.getItem(STORAGE_SESSION_KEY);
            const uid = Number(userIdRef.current);

            cleanup(); // <-- NEW: закрываем WebRTC локально

            if (sid && Number.isFinite(uid)) {
                stopBestEffort(sid, uid); // <-- NEW: пытаемся остановить серверную сессию
            }
        };

        window.addEventListener("pagehide", onPageHide); // <-- NEW
        const onVisibility = () => {
            if (document.visibilityState === "hidden") onPageHide(); // <-- NEW
        };
        document.addEventListener("visibilitychange", onVisibility); // <-- NEW

        return () => {
            window.removeEventListener("pagehide", onPageHide);
            document.removeEventListener("visibilitychange", onVisibility);
            onPageHide(); // <-- NEW: при размонтировании компонента тоже добиваем хвост
        };
    }, [cleanup, stopBestEffort]);


    // при загрузке страницы пробуем остановить хвост прошлой сессии
    // (например, если вкладку закрыли и stop не успел уйти)
    useEffect(() => {
        const sid = localStorage.getItem(STORAGE_SESSION_KEY);
        const uid = Number(userIdRef.current);

        if (sid && Number.isFinite(uid)) {
            void postJson<StopResponse>(`${API_BASE_URL}/voice/stop`, {
                session_id: sid,
                user_id: uid,
            })
                .catch(() => null)
                .finally(() => localStorage.removeItem(STORAGE_SESSION_KEY));
        }
    }, []);

    return (
        <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
            <Paper
                sx={{
                    p: 3,
                    background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
                    border: "1px solid rgba(3,169,244,0.15)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h5">Voice Chat (WebRTC)</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Запустите голосовой чат.
                    </Typography>
                </Stack>

                <Stack spacing={2} sx={{ mt: 3 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleStart()}
                            disabled={status === "connecting"}
                        >
                            {status === "connecting" ? "Подключение..." : "Start"}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleStop}>
                            Stop
                        </Button>
                        <Chip
                            label={`Статус: ${status}`}
                            color={status === "error" || status === "ended" ? "secondary" : "primary"}
                            variant="outlined"
                            sx={{ ml: { xs: 0, sm: "auto" } }}
                        />
                    </Stack>

                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: "rgba(3,169,244,0.08)",
                            border: "1px solid rgba(3,169,244,0.12)",
                        }}
                    >
                        <Stack spacing={0.5}>
                            {sessionId && (
                                <Typography variant="body2" color="text.secondary">
                                    session_id: <strong>{sessionId}</strong>
                                </Typography>
                            )}
                            {callId && (
                                <Typography variant="body2" color="text.secondary">
                                    call_id: <strong>{callId}</strong>
                                </Typography>
                            )}
                            {greeting && (
                                <Typography variant="body2">
                                    <strong>Greeting:</strong> {greeting}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Аудиопоток
                        </Typography>
                        <audio ref={audioRef} autoPlay controls style={{ width: "100%" }} />
                    </Box>
                </Stack>
            </Paper>
        </Stack>
    );
}
