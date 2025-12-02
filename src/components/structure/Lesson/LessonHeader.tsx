import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Lesson } from "../../../types/content";

export function LessonHeader({ lesson, totalActivities, onBack }: { lesson: Lesson; totalActivities: number; onBack: () => void }) {
    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                        Урок {lesson.index}
                    </Typography>
                    <Typography variant="h4">{lesson.title}</Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {lesson.lang_level.map((level: string) => (
                            <Chip key={level} label={level} color="primary" size="small" />
                        ))}
                        <Chip label={`${lesson.estimatedTimeMinutes} мин.`} variant="outlined" size="small" />
                        <Chip
                            label={`${lesson.units.length} юнитов / ${totalActivities} активностей`}
                            variant="outlined"
                            size="small"
                        />
                    </Stack>
                </Stack>

                <Button variant="outlined" onClick={onBack} sx={{ alignSelf: "flex-start" }}>
                    Назад к курсу
                </Button>
            </Stack>
        </Paper>
    );
}
