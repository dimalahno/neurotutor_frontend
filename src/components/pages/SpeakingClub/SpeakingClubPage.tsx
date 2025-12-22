import { ArrowBack } from "@mui/icons-material";
import { Button, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import type { Course, LessonSummary } from "../../../types/content";

export type SpeakingTopic = {
    courseTitle: string;
    lesson: LessonSummary;
};

interface SpeakingClubPageProps {
    courses: Course[];
    onBack: () => void;
    onStartChat: (topic: SpeakingTopic) => void;
}

export function SpeakingClubPage({ courses, onBack, onStartChat }: SpeakingClubPageProps) {
    const topics = courses.flatMap((course) =>
        course.lessons.map((lesson) => ({
            courseTitle: course.title,
            lesson,
        })),
    );

    const cardStyles = {
        p: 3,
        background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
        border: "1px solid rgba(3,169,244,0.15)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    };

    return (
        <Stack spacing={3}>
            <Button onClick={onBack} startIcon={<ArrowBack />} color="primary" sx={{ alignSelf: "flex-start" }}>
                Назад
            </Button>
            <Paper sx={cardStyles}>
                <Typography variant="h5" gutterBottom>
                    Разговорный клуб
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Выберите тему для общения из списка уроков.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {topics.length === 0 ? (
                    <Typography color="text.secondary">Пока нет тем для обсуждения.</Typography>
                ) : (
                    <List>
                        {topics.map((topic) => (
                            <ListItem key={topic.lesson.lesson_id} divider>
                                <ListItemText
                                    primary={`Тема ${topic.lesson.index}: ${topic.lesson.title}`}
                                    secondary={`Курс: ${topic.courseTitle}`}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => onStartChat(topic)}
                                >
                                    Начать общение
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Stack>
    );
}
