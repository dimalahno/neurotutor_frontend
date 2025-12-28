import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {API_BASE_URL} from "../../../config.ts";

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
    autoStart?: boolean;
}

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

export function VoiceChat({ initialLessonId = "", initialUserId, autoStart = false }: VoiceChatProps) {
    const [lessonId, setLessonId] = useState(initialLessonId);
    const [userId, setUserId] = useState(initialUserId !== undefined ? String(initialUserId) : "");
    const [status, setStatus] = useState<ChatStatus>("idle");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [callId, setCallId] = useState<string | null>(null);
    const [greeting, setGreeting] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [autoStartKey, setAutoStartKey] = useState<string | null>(null);

    const peerRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

    const handleStart = useCallback(
        async (explicitLessonId?: string, explicitUserId?: number) => {
            setError(null);
            cleanup();
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
            }
        },
        [cleanup, lessonId, setupPeerConnection, userId],
    );

    useEffect(() => {
        if (!autoStart || !initialLessonId || initialUserId === undefined) return;

        const nextKey = `${initialLessonId}-${initialUserId}`;
        if (nextKey === autoStartKey) return;

        setAutoStartKey(nextKey);
        void handleStart(initialLessonId, initialUserId);
    }, [autoStart, autoStartKey, handleStart, initialLessonId, initialUserId]);

    return (
        <div style={{ display: "grid", gap: "12px", maxWidth: 600 }}>
            <h2>Voice Chat (WebRTC)</h2>

            <section>
                <h3>Темы</h3>
            </section>

            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleStart()} disabled={status === "connecting"}>
                    Start
                </button>
                <button onClick={handleStop}>Stop</button>
            </div>

            <div>
                <div>Статус: {status}</div>
                {sessionId && <div>session_id: {sessionId}</div>}
                {callId && <div>call_id: {callId}</div>}
                {greeting && (
                    <div>
                        <strong>Greeting:</strong> {greeting}
                    </div>
                )}
                {error && <div style={{ color: "red" }}>Ошибка: {error}</div>}
            </div>

            <audio ref={audioRef} autoPlay controls style={{ width: "100%" }} />
        </div>
    );
}
