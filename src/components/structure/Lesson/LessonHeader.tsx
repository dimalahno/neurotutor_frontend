import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Lesson } from "../../../types/content";

export function LessonHeader({
    lesson,
    totalActivities,
    onBack,
    label = "Урок",
    backLabel = "Назад к курсу",
}: {
    lesson: Lesson;
    totalActivities: number;
    onBack: () => void;
    label?: string;
    backLabel?: string;
}) {
    const panelStyles = {
        p: 3,
        background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
        border: "1px solid rgba(3,169,244,0.15)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    };

    return (
        <Paper sx={panelStyles}>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                        {label} {lesson.index}
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

                <Button variant="contained" color="secondary" onClick={onBack} sx={{ alignSelf: "flex-start" }}>
                    {backLabel}
                </Button>
            </Stack>
        </Paper>
    );
}
