import { Stack } from "@mui/material";
import type { LessonUnit } from "../../../../types/content";
import { UnitCard } from "./UnitCard";

export function UnitsList({ units }: { units: LessonUnit[] }) {
    return (
        <Stack spacing={2}>
            {units.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
            ))}
        </Stack>
    );
}
