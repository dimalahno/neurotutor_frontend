import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack, Typography } from "@mui/material";
import { AudioFetchPlayer } from "../../../../AudioFetchPlayer";
import type { LessonReading, LessonReadingTextBlock } from "../../../../../types/content";
import { GlossaryList } from "../GlossaryList";

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

export function UnitReadingContent({ reading }: { reading: LessonReading }) {
    const hasGlossary = (reading.glossary?.length ?? 0) > 0;

    return (
        <Accordion
            disableGutters
            variant="outlined"
            slotProps={{ transition: { unmountOnExit: true } }}
            sx={{
                borderRadius: 2,
                "&:before": { display: "none" },
                overflow: "hidden",
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                <Stack spacing={0.5} sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Чтение
                    </Typography>
                    <Typography variant="h6">{reading.title}</Typography>
                </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ borderTop: "1px solid", borderColor: "divider", backgroundColor: "grey.50" }}>
                <Stack spacing={2}>
                    {reading.audioUrl ? <AudioFetchPlayer audioFileName={reading.audioUrl} /> : null}

                    <ReadingTextSection text={reading.text} />

                    {hasGlossary ? (
                        <>
                            <Divider />
                            <GlossaryList glossary={reading.glossary ?? []} />
                        </>
                    ) : null}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}
