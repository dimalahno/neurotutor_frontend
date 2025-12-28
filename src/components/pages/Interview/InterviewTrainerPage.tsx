import { ArrowBack } from "@mui/icons-material";
import {
    Button,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import type { Course } from "../../../types/content";

type InterviewLesson = {
    courseTitle: string;
    lessonId: string;
    lessonIndex: number;
    lessonTitle: string;
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
            lessonId: lesson.lesson_id,
            lessonIndex: lesson.index,
            lessonTitle: lesson.title,
        })),
    );

    const containerCardStyles = {
        p: 3,
        background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
        border: "1px solid rgba(3,169,244,0.15)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    };

    const lessonCardStyles = {
        p: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        background: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(3,169,244,0.12)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    };

    return (
        <Stack spacing={3}>
            <Button onClick={onBack} startIcon={<ArrowBack />} color="primary" sx={{ alignSelf: "flex-start" }}>
                Назад
            </Button>
            <Paper sx={containerCardStyles}>
                <Typography variant="h5" gutterBottom>
                    Тренажёр собеседований
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Выберите урок, чтобы потренироваться отвечать на вопросы и закреплять материал перед
                    собеседованием.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {lessons.length === 0 ? (
                    <Typography color="text.secondary">Пока нет уроков для подготовки.</Typography>
                ) : (
                    <Stack spacing={2}>
                        <Typography variant="subtitle1">Уроки</Typography>
                        <Grid container spacing={2}>
                            {lessons.map((lesson) => (
                                <Grid item xs={12} sm={6} key={lesson.lessonId}>
                                    <Paper sx={lessonCardStyles}>
                                        <Typography variant="overline" color="text.secondary">
                                            {lesson.courseTitle}
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            Урок {lesson.lessonIndex}: {lesson.lessonTitle}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Разберите вопросы и задания этого урока, чтобы уверенно чувствовать себя на интервью.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onOpenLesson(lesson.lessonId)}
                                        >
                                            Открыть урок
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                )}
            </Paper>
        </Stack>
    );
}
