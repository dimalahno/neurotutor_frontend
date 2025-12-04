import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { AgendaEntry } from "../../../../types/content";

export type AgendaListEntry = AgendaEntry & { name: string };

export function AgendaList({ entries }: { entries: AgendaListEntry[] }) {
    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">План урока</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {entries.map((item) => (
                        <ListItem key={item.name} divider>
                            <ListItemText primary={`${item.order_id}. ${item.name}`} secondary={item.description} />
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
}
