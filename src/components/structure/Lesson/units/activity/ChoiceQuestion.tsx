import React, { useState } from "react";
import { Alert, Card, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";

export type ChoiceQuestionProps = {
    question: string;
    options: string[];
    correctIndex: number;
};

export function ChoiceQuestion({ question, options, correctIndex }: ChoiceQuestionProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setSelectedIndex(Number(value));
    };

    const isAnswered = selectedIndex !== null;
    const isCorrect = isAnswered && selectedIndex === correctIndex;

    return (
        <Card variant="outlined">
            <Stack spacing={1.5} sx={{ p: 2 }}>
                <Typography variant="subtitle1">{question}</Typography>

                <RadioGroup value={selectedIndex !== null ? String(selectedIndex) : ""} onChange={handleChange}>
                    {options.map((option, index) => (
                        <FormControlLabel key={`${option}-${index}`} value={String(index)} control={<Radio />} label={option} />
                    ))}
                </RadioGroup>

                {isAnswered ? (
                    <Alert severity={isCorrect ? "success" : "error"}>
                        {isCorrect ? "Верно!" : `Неверно. Правильный ответ: ${options[correctIndex]}`}
                    </Alert>
                ) : null}
            </Stack>
        </Card>
    );
}
