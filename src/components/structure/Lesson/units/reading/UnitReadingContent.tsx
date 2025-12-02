import { Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import type { GlossaryEntry, LessonReading, LessonReadingTextBlock } from "../../../../../types/content";

function ReadingTextSection({ text }: { text: LessonReading["text"] }) {
    const sortedBlocks = [...text.content_data].sort((a, b) => a.order_id - b.order_id);

    return (
        <Stack spacing={1.5}>
            {text.description ? (
                <Typography variant="body1" color="text.primary">
                    {text.description}
                </Typography>
            ) : null}

            <Stack spacing={1}>
                {sortedBlocks.map((block) => (
                    <ReadingParagraph key={`${block.order_id}-${block.profession ?? "text"}`} block={block} />
                ))}
            </Stack>
        </Stack>
    );
}

function ReadingParagraph({ block }: { block: LessonReadingTextBlock }) {
    return (
        <Stack spacing={0.5}>
            {block.profession ? (
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {block.profession}
                </Typography>
            ) : null}
            <Typography variant="body2" color="text.secondary">
                {block.content_text}
            </Typography>
        </Stack>
    );
}

function GlossaryList({ glossary }: { glossary: GlossaryEntry[] }) {
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

export function UnitReadingContent({ reading }: { reading: LessonReading }) {
    const hasGlossary = (reading.glossary?.length ?? 0) > 0;

    return (
        <Stack spacing={2} sx={{ p: 2, borderRadius: 2, border: 1, borderColor: "divider", backgroundColor: "grey.50" }}>
            <Stack spacing={0.5}>
                <Typography variant="subtitle2" color="text.secondary">
                    Чтение
                </Typography>
                <Typography variant="h6">{reading.title}</Typography>
                {reading.audioUrl ? (
                    <Typography variant="body2" color="text.secondary">
                        Аудио: {reading.audioUrl}
                    </Typography>
                ) : null}
            </Stack>

            <ReadingTextSection text={reading.text} />

            {hasGlossary ? (
                <>
                    <Divider />
                    <GlossaryList glossary={reading.glossary ?? []} />
                </>
            ) : null}
        </Stack>
    );
}
