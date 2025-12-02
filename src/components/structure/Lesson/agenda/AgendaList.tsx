import { List, ListItem, ListItemText, Typography } from "@mui/material";
import type { AgendaEntry } from "../../../../types/content";

export type AgendaListEntry = AgendaEntry & { name: string };

export function AgendaList({ entries }: { entries: AgendaListEntry[] }) {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                План урока
            </Typography>
            <List>
                {entries.map((item) => (
                    <ListItem key={item.name} divider>
                        <ListItemText primary={`${item.order_id}. ${item.name}`} secondary={item.description} />
                    </ListItem>
                ))}
            </List>
        </>
    );
}
