import { Button, Chip, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import type { Course } from "../../../types/content";

export function CoursePage({ courses, onOpenLesson }: { courses: Course[]; onOpenLesson: (lessonId: string) => void }) {
    const cardStyles = {
        p: 3,
        background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
        border: "1px solid rgba(3,169,244,0.15)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    };

    return (
        <Stack spacing={3}>
            {courses.map((course) => (
                <Paper key={course._id} sx={cardStyles}>
                    <Typography variant="h5" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {course.description}
                    </Typography>
                    {course.level && (
                        <Chip label={`Уровень: ${course.level}`} color="secondary" size="small" sx={{ mb: 2 }} />
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                        Содержание курса
                    </Typography>
                    <List>
                        {course.lessons.map((lesson) => (
                            <ListItem key={lesson.lesson_id} divider>
                                <ListItemText primary={`Урок ${lesson.index}: ${lesson.title}`} />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => onOpenLesson(lesson.lesson_id)}
                                >
                                    Открыть урок
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ))}
        </Stack>
    );
}
