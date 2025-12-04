import { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

interface AudioFetchPlayerProps {
    audioFileName: string;
    title?: string;
}

export function AudioFetchPlayer({ audioFileName, title = "Аудиофайл" }: AudioFetchPlayerProps) {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (audioSrc) {
                URL.revokeObjectURL(audioSrc);
            }
        };
    }, [audioSrc]);

    const handleLoadAudio = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:8088/lessons-files/${audioFileName}`);

            if (!response.ok) {
                throw new Error("Не удалось получить аудиофайл");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            if (audioSrc) {
                URL.revokeObjectURL(audioSrc);
            }

            setAudioSrc(objectUrl);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Произошла ошибка при загрузке аудио";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={1}>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
                <Typography>{audioFileName}</Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Button
                    variant="contained"
                    startIcon={audioSrc ? <RefreshIcon /> : <PlayArrowIcon />}
                    onClick={handleLoadAudio}
                    disabled={loading}
                >
                    {loading ? "Загрузка..." : audioSrc ? "Обновить аудио" : "Получить аудио"}
                </Button>
                {!audioSrc ? (
                    <Typography variant="body2" color="text.secondary">
                        Нажмите, чтобы загрузить трек и воспроизвести его.
                    </Typography>
                ) : null}
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            {audioSrc ? (
                <audio controls src={audioSrc} style={{ width: "100%" }}>
                    Ваш браузер не поддерживает воспроизведение аудио.
                </audio>
            ) : null}
        </Stack>
    );
}
