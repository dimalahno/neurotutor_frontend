import { useMemo } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import type { AgendaEntry, Lesson, LessonUnit } from "../../../types/content";
import { LessonHeader } from "../../structure/Lesson/LessonHeader";
import { AgendaList } from "../../structure/Lesson/agenda/AgendaList";
import { UnitsList } from "../../structure/Lesson/units/UnitsList";

function mapAgendaToEntries(agenda: Record<string, AgendaEntry>) {
    return Object.entries(agenda)
        .map(([name, entry]) => ({ name, ...entry }))
        .sort((a, b) => a.order_id - b.order_id);
}

function sortUnits(units: LessonUnit[]) {
    return [...units].sort((a, b) => a.order - b.order);
}

export function LessonPage({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
    const agendaEntries = useMemo(() => mapAgendaToEntries(lesson.agenda), [lesson.agenda]);
    const sortedUnits = useMemo(() => sortUnits(lesson.units), [lesson.units]);

    const totalActivities = useMemo(
        () =>
            lesson.units.reduce((sum, unit) => {
                const activitiesCount = unit.activities ? unit.activities.length : 0;
                return sum + activitiesCount;
            }, 0),
        [lesson.units],
    );

    const panelStyles = {
        p: 3,
        background: "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(3,169,244,0.06))",
        border: "1px solid rgba(3,169,244,0.15)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    };

    return (
        <Stack spacing={3}>
            <LessonHeader lesson={lesson} totalActivities={totalActivities} onBack={onBack} />

            <Paper sx={panelStyles}>
                <AgendaList entries={agendaEntries} />
            </Paper>

            <Paper sx={panelStyles}>
                <Typography variant="h6" gutterBottom>
                    Юниты и активности
                </Typography>
                <UnitsList units={sortedUnits} />
            </Paper>
        </Stack>
    );
}
