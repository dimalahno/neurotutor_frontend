import { ArrowForward } from "@mui/icons-material";
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

interface StartPageProps {
    onOpenCourses: () => void;
    onOpenLevelCheck: () => void;
    onOpenSpeakingClub: () => void;
    onOpenInterviewTrainer: () => void;
}

const cards = [
    {
        title: "Курсы",
        description: "Структурированные программы с уроками и практическими заданиями.",
        action: "onOpenCourses" as const,
    },
    {
        title: "Определение уровня",
        description: "Быстрый тест, который поможет подобрать подходящий маршрут обучения.",
        action: "onOpenLevelCheck" as const,
    },
    {
        title: "Разговорный клуб",
        description: "Практика разговорной речи в дружелюбном формате.",
        action: "onOpenSpeakingClub" as const,
    },
    {
        title: "Тренажёр собеседований",
        description: "Отрабатывайте ответы на популярные вопросы и получайте обратную связь.",
        action: "onOpenInterviewTrainer" as const,
    },
];

export function StartPage({ onOpenCourses, onOpenInterviewTrainer, onOpenLevelCheck, onOpenSpeakingClub }: StartPageProps) {
    const actions = {
        onOpenCourses,
        onOpenInterviewTrainer,
        onOpenLevelCheck,
        onOpenSpeakingClub,
    };

    return (
        <Stack spacing={3} sx={{ py: 2 }}>
            <Stack spacing={1}>
                <Typography variant="h4" fontWeight={700}>
                    Обучение
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Выберите направление, с которого хотите начать.
                </Typography>
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                }}
            >
                {cards.map(({ title, description, action }) => (
                    <Card
                        key={title}
                        elevation={6}
                        sx={{
                            height: "100%",
                            borderRadius: 3,
                            background: "linear-gradient(135deg, rgba(76,175,80,0.06), rgba(3,169,244,0.08))",
                            border: "1px solid rgba(3,169,244,0.15)",
                        }}
                    >
                        <CardActionArea
                            sx={{ height: "100%" }}
                            onClick={() => {
                                const handler = actions[action];
                                handler();
                            }}
                        >
                            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                    <Typography variant="h6" fontWeight={700}>
                                        {title}
                                    </Typography>
                                    <ArrowForward color="primary" />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Stack>
    );
}
