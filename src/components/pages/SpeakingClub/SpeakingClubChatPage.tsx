import { ArrowBack } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { API_BASE_URL } from "../../../config";
import { extractSubFromJwt, loadStoredTokens } from "../../../utils/auth";
import type { SpeakingTopic } from "./SpeakingClubPage";

type ChatMessage = {
    role: string;
    text: string;
};

type ChatResponse = {
    session_id: string;
    message: string;
    chat: ChatMessage[];
};

interface SpeakingClubChatPageProps {
    topic: SpeakingTopic;
    onBack: () => void;
}

export function SpeakingClubChatPage({ topic, onBack }: SpeakingClubChatPageProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tokens = useMemo(() => loadStoredTokens(), []);

    const headers = useMemo(
        () => ({
            "Content-Type": "application/json",
            ...(tokens ? { Authorization: `${tokens.token_type} ${tokens.access_token}` } : {}),
        }),
        [tokens],
    );

    const userIdFromToken = useMemo(() => {
        if (!tokens) return null;

        const sub = extractSubFromJwt(tokens.access_token);
        if (!sub) return null;

        const numeric = Number(sub);
        return Number.isNaN(numeric) ? sub : numeric;
    }, [tokens]);

    useEffect(() => {
        const startChat = async () => {
            if (!userIdFromToken) {
                setError("Не удалось определить пользователя. Авторизуйтесь, чтобы начать чат.");
                return;
            }

            setStarting(true);
            setError(null);
            setMessages([]);
            setSessionId(null);

            try {
                const response = await fetch(`${API_BASE_URL}/chat/start`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        lesson_id: topic.lesson.lesson_id,
                        user_id: userIdFromToken,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Не удалось начать разговор");
                }

                const data = (await response.json()) as ChatResponse;
                const chatMessages = data.chat?.length ? data.chat : data.message ? [{ role: "assistant", text: data.message }] : [];
                setSessionId(data.session_id);
                setMessages(chatMessages);
            } catch (startError) {
                const message = startError instanceof Error ? startError.message : String(startError);
                setError(message);
            } finally {
                setStarting(false);
            }
        };

        startChat();
    }, [headers, topic.lesson.lesson_id, userIdFromToken]);

    const sendMessage = async () => {
        if (!messageInput.trim() || !sessionId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/chat/message`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    session_id: sessionId,
                    text: messageInput.trim(),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Не удалось отправить сообщение");
            }

            const data = (await response.json()) as ChatResponse;
            setMessages(data.chat ?? []);
            setMessageInput("");
        } catch (sendError) {
            const message = sendError instanceof Error ? sendError.message : String(sendError);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        void sendMessage();
    };

    const getAuthorLabel = (role: string) => {
        if (role === "user") return "Вы";
        if (role === "assistant") return "ИИ-собеседник";
        return "Система";
    };

    return (
        <Stack spacing={3}>
            <Button onClick={onBack} startIcon={<ArrowBack />} color="primary" sx={{ alignSelf: "flex-start" }}>
                Назад к темам
            </Button>

            <Paper
                sx={{
                    p: 3,
                    background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
                    border: "1px solid rgba(3,169,244,0.15)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="h5">Чат по теме</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {topic.lesson.title}
                    </Typography>
                    <Chip
                        label={`Курс: ${topic.courseTitle}`}
                        color="secondary"
                        size="small"
                        sx={{ alignSelf: "flex-start" }}
                    />
                </Stack>

                <Stack spacing={2} sx={{ mt: 3 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    {starting ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CircularProgress size={20} />
                            <Typography color="text.secondary">Запускаем чат...</Typography>
                        </Stack>
                    ) : (
                        <Stack spacing={2}>
                            {messages.map((message, index) => {
                                const isUser = message.role === "user";

                                return (
                                    <Box
                                        key={`${message.role}-${index}`}
                                        sx={{
                                            display: "flex",
                                            justifyContent: isUser ? "flex-end" : "flex-start",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                maxWidth: "75%",
                                                borderRadius: 2,
                                                backgroundColor: isUser
                                                    ? "rgba(3,169,244,0.15)"
                                                    : "rgba(76,175,80,0.12)",
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">
                                                {getAuthorLabel(message.role)}
                                            </Typography>
                                            <Typography variant="body2">{message.text}</Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                </Stack>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                        <TextField
                            value={messageInput}
                            onChange={(event) => setMessageInput(event.target.value)}
                            label="Ваш ответ"
                            placeholder="Введите сообщение"
                            fullWidth
                            multiline
                            minRows={2}
                            disabled={starting || loading || !sessionId}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={starting || loading || !sessionId || !messageInput.trim()}
                        >
                            {loading ? "Отправка..." : "Отправить"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Stack>
    );
}
