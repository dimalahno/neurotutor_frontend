import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import type { LessonUnit } from "../../../../types/content";
import { ActivityList } from "./activity/ActivityList";
import { UnitReadingContent } from "./reading/UnitReadingContent";

export function UnitCard({ unit }: { unit: LessonUnit }) {
    const hasLLMTasks = unit.activities.some((activity) => activity.llmCheck?.enabled);
    const activitiesCount = unit.activities.length;
    const reading = unit.type === "reading" ? unit.reading : undefined;

    return (
        <Accordion disableGutters variant="outlined" slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack spacing={0.5} width="100%">
                    <Typography variant="subtitle2" color="text.secondary">
                        {unit.order}. {unit.type}
                    </Typography>
                    <Typography variant="subtitle1">{unit.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {activitiesCount} активностей · {hasLLMTasks ? "Есть задания с LLM" : "Проверка правилами"}
                    </Typography>
                </Stack>
            </AccordionSummary>

            <AccordionDetails>
                <Stack spacing={1.5}>
                    {unit.description && (
                        <Typography variant="body2" color="text.secondary">
                            {unit.description}
                        </Typography>
                    )}
                    {reading ? <UnitReadingContent reading={reading} /> : null}
                    <ActivityList activities={unit.activities} />
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}
