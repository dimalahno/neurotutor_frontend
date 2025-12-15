import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import type { LessonUnit } from "../../../../types/content";
import { ActivityList } from "./activity/ActivityList";
import { UnitGrammarExplanation } from "./grammar/UnitGrammarExplanation";
import { UnitReadingContent } from "./reading/UnitReadingContent";

export function UnitCard({ unit }: { unit: LessonUnit }) {
    const reading = unit.type === "reading" ? unit.reading : undefined;
    const grammarExplanation = unit.type === "grammar" ? unit.explanation : undefined;

    return (
        <Accordion disableGutters variant="outlined" slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack spacing={0.5} width="100%">
                    <Typography variant="subtitle1">{unit.order}. {unit.title}</Typography>
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
                    {grammarExplanation ? <UnitGrammarExplanation explanation={grammarExplanation} /> : null}
                    <ActivityList activities={unit.activities} />
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}
