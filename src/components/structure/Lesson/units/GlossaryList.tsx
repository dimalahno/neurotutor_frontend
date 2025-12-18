import { List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import type { GlossaryEntry } from "../../../../types/content";

export function GlossaryList({ glossary }: { glossary: GlossaryEntry[] }) {
    if (glossary.length === 0) return null;

    return (
        <Stack spacing={1}>
            <Typography variant="subtitle1">Глоссарий</Typography>
            <List dense>
                {glossary.map((entry) => (
                    <ListItem key={entry.word} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <ListItemText
                            primary={
                                <Typography variant="body1" fontWeight={600}>
                                    {entry.word}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body2" color="text.secondary">
                                    {entry.definition}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
