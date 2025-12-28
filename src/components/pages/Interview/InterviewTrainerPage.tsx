import { ArrowBack } from "@mui/icons-material";
import { Button, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import type { Course, LessonSummary } from "../../../types/content";

type InterviewLesson = {
    courseTitle: string;
    lesson: LessonSummary;
};

interface InterviewTrainerPageProps {
    courses: Course[];
    onBack: () => void;
    onOpenLesson: (lessonId: string) => void;
}

export function InterviewTrainerPage({ courses, onBack, onOpenLesson }: InterviewTrainerPageProps) {
    const lessons: InterviewLesson[] = courses.flatMap((course) =>
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
                    Тренажёр собеседований
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Выберите урок, чтобы потренироваться отвечать на вопросы и закреплять материал перед
                    собеседованием.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {lessons.length === 0 ? (
                    <Typography color="text.secondary">Пока нет уроков для подготовки.</Typography>
                ) : (
                    <List>
                        {lessons.map((lesson) => (
                            <ListItem key={lesson.lesson.lesson_id} divider>
                                <ListItemText
                                    primary={`Урок ${lesson.lesson.index}: ${lesson.lesson.title}`}
                                    secondary={`Курс: ${lesson.courseTitle}`}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => onOpenLesson(lesson.lesson.lesson_id)}
                                >
                                    Открыть урок
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Stack>
    );
}
