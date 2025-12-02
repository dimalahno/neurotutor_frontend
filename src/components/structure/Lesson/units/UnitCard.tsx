import { Paper, Stack, Typography } from "@mui/material";
import type { LessonUnit } from "../../../../types/content";
import { ActivityList } from "./activity/ActivityList";

export function UnitCard({ unit }: { unit: LessonUnit }) {
    return (
        <Paper key={unit.id} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={0.5}>
                <Typography variant="subtitle2" color="text.secondary">
                    {unit.order}. {unit.type}
                </Typography>
                <Typography variant="subtitle1">{unit.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {unit.description}
                </Typography>

                <ActivityList activities={unit.activities} />

                <Typography variant="caption" color="text.secondary">
                    {unit.activities.length} активностей ·{" "}
                    {unit.activities.some((activity) => activity.llmCheck?.enabled)
                        ? "Есть задания с LLM"
                        : "Проверка правилами"}
                </Typography>
            </Stack>
        </Paper>
    );
}
