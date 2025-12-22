import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { SpeakingTopic } from "./SpeakingClubPage";

interface SpeakingClubChatPageProps {
    topic: SpeakingTopic;
    onBack: () => void;
}

const mockMessages = [
    {
        id: "system",
        author: "Модератор",
        text: "Добро пожаловать! Обсуждаем тему и делимся своими мыслями.",
        tone: "neutral" as const,
    },
    {
        id: "assistant",
        author: "ИИ-собеседник",
        text: "Привет! Какой опыт у тебя связан с этой темой?",
        tone: "assistant" as const,
    },
    {
        id: "user",
        author: "Вы",
        text: "Хочу потренироваться, как рассказывать о себе.",
        tone: "user" as const,
    },
];

export function SpeakingClubChatPage({ topic, onBack }: SpeakingClubChatPageProps) {
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
                    {mockMessages.map((message) => (
                        <Box
                            key={message.id}
                            sx={{
                                display: "flex",
                                justifyContent: message.tone === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    maxWidth: "75%",
                                    borderRadius: 2,
                                    backgroundColor:
                                        message.tone === "user"
                                            ? "rgba(3,169,244,0.15)"
                                            : "rgba(76,175,80,0.12)",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    {message.author}
                                </Typography>
                                <Typography variant="body2">{message.text}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Stack>
    );
}
