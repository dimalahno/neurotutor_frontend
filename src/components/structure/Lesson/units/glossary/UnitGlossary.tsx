import { Stack } from "@mui/material";
import type { GlossaryEntry } from "../../../../../types/content";
import { GlossaryList } from "../GlossaryList";

export function UnitGlossary({ glossary }: { glossary?: GlossaryEntry[] }) {
    if (!glossary || glossary.length === 0) return null;

    return (
        <Stack spacing={1.5}>
            <GlossaryList glossary={glossary} />
        </Stack>
    );
}
