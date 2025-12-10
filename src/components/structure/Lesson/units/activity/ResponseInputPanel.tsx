import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { submitAudioForCheck, submitTextForCheck } from "../../../../../utils/taskCheckMocks";

const normalizeInputTypes = (inputType?: string | string[]) => {
    if (!inputType) return [] as string[];
    const list = Array.isArray(inputType) ? inputType : [inputType];
    return Array.from(new Set(list.filter(Boolean)));
};

export function ResponseInputPanel({ inputType }: { inputType?: string | string[] }) {
    const inputTypes = useMemo(() => normalizeInputTypes(inputType), [inputType]);
    const chunksRef = useRef<BlobPart[]>([]);
    const recorderRef = useRef<MediaRecorder | null>(null);

    const [textValue, setTextValue] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (recorderRef.current) {
                recorderRef.current.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    if (inputTypes.length === 0) return null;

    const handleSendText = async () => {
        setError(null);
        setFeedback(null);
        setIsSubmitting(true);
        try {
            const response = await submitTextForCheck(textValue.trim());
            setFeedback(response.message ?? "Текст отправлен на проверку (заглушка)");
        } catch (sendError) {
            const message = sendError instanceof Error ? sendError.message : String(sendError);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const startRecording = async () => {
        setError(null);
        setFeedback(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            chunksRef.current = [];
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach((track) => track.stop());
            };
            recorder.start();
            recorderRef.current = recorder;
            setIsRecording(true);
            setAudioBlob(null);
            setAudioUrl(null);
        } catch (recordError) {
            const message = recordError instanceof Error ? recordError.message : String(recordError);
            setError(`Не удалось начать запись: ${message}`);
        }
    };

    const stopRecording = () => {
        recorderRef.current?.stop();
        recorderRef.current = null;
        setIsRecording(false);
    };

    const handleSendAudio = async () => {
        if (!audioBlob) return;
        setError(null);
        setFeedback(null);
        setIsSubmitting(true);
        try {
            const response = await submitAudioForCheck(audioBlob);
            setFeedback(response.message ?? "Аудио отправлено на проверку (заглушка)");
        } catch (sendError) {
            const message = sendError instanceof Error ? sendError.message : String(sendError);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <Divider />
            <Typography variant="subtitle2">Ответ</Typography>

            {inputTypes.includes("text") ? (
                <Stack spacing={1}>
                    <TextField
                        label="Введите ответ"
                        placeholder="Напишите свой ответ здесь"
                        multiline
                        minRows={3}
                        value={textValue}
                        onChange={(event) => setTextValue(event.target.value)}
                    />
                    <Box>
                        <Button
                            variant="contained"
                            onClick={handleSendText}
                            disabled={isSubmitting || textValue.trim().length === 0}
                        >
                            Отправить текст
                        </Button>
                    </Box>
                </Stack>
            ) : null}

            {inputTypes.includes("audio") ? (
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant={isRecording ? "outlined" : "contained"}
                            color={isRecording ? "warning" : "primary"}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? "Остановить запись" : "Записать аудио"}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={!audioBlob || isSubmitting}
                            onClick={handleSendAudio}
                        >
                            Отправить аудио
                        </Button>
                    </Stack>
                    {audioUrl ? (
                        <audio controls src={audioUrl} style={{ width: "100%" }} />
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Нажмите «Записать аудио», чтобы захватить голосовой ответ.
                        </Typography>
                    )}
                </Stack>
            ) : null}

            {feedback ? <Alert severity="success">{feedback}</Alert> : null}
            {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
    );
}
