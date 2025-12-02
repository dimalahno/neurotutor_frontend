import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import type { LessonUnitExplanation } from "../../../../../types/content";

function ExplanationExamples({ examples }: { examples: string[] }) {
    return (
        <Stack spacing={0.5}>
            <Typography variant="subtitle2">Примеры</Typography>
            <List dense sx={{ pl: 1 }}>
                {examples.map((example, index) => (
                    <ListItem key={index} disablePadding alignItems="flex-start">
                        <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                            <RadioButtonUncheckedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={example} primaryTypographyProps={{ variant: "body2" }} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

export function UnitGrammarExplanation({ explanation }: { explanation: LessonUnitExplanation }) {
    return (
        <Accordion disableGutters variant="outlined" slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Грамматическое объяснение</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary">
                        {explanation.text}
                    </Typography>

                    {explanation.examples && explanation.examples.length > 0 ? (
                        <ExplanationExamples examples={explanation.examples} />
                    ) : null}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}
