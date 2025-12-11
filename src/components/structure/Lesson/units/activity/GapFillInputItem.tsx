import { useMemo, useState } from "react";
import { Stack, TextField, Typography } from "@mui/material";

type GapFillInputItemProps = {
    index: number;
    sentence: string;
    correct: string;
};

export function GapFillInputItem({ index, sentence, correct }: GapFillInputItemProps) {
    const [value, setValue] = useState("");

    const { isCorrect, hasInput } = useMemo(() => {
        const normalizedInput = value.trim().toLowerCase();
        const normalizedCorrect = correct.trim().toLowerCase();

        return {
            hasInput: normalizedInput.length > 0,
            isCorrect: normalizedInput === normalizedCorrect,
        };
    }, [correct, value]);

    const helperText = hasInput ? (isCorrect ? "Верно!" : "Попробуйте ещё раз") : "Введите ответ";
    const color: "primary" | "success" | "error" = isCorrect ? "success" : hasInput ? "error" : "primary";

    return (
        <Stack spacing={1} sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography>
                {index}. {sentence}
            </Typography>
            <TextField
                fullWidth
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={correct}
                color={color}
                label="Ваш ответ"
                helperText={helperText}
            />
        </Stack>
    );
}
