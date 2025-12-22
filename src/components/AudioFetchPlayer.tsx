import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

interface AudioFetchPlayerProps {
    audioFileName: string;
}

export function AudioFetchPlayer({ audioFileName }: AudioFetchPlayerProps) {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (audioSrc) {
                URL.revokeObjectURL(audioSrc);
            }
        };
    }, [audioSrc]);

    const fetchAudio = async () => {
        const response = await fetch(`${API_BASE_URL}/lessons-files/${audioFileName}`);

        if (!response.ok) {
            throw new Error("Не удалось получить аудиофайл");
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (audioSrc) {
            URL.revokeObjectURL(audioSrc);
        }

        setAudioSrc(objectUrl);
        return objectUrl;
    };

    const handleLoadAudio = async () => {
        setLoading(true);
        setError(null);

        try {
            await fetchAudio();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Произошла ошибка при загрузке аудио";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAudio = async () => {
        setDownloading(true);
        setError(null);

        try {
            const objectUrl = audioSrc ?? (await fetchAudio());
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = audioFileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Произошла ошибка при скачивании аудио";
            setError(message);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Button
                    variant="contained"
                    startIcon={audioSrc ? <RefreshIcon /> : <PlayArrowIcon />}
                    onClick={handleLoadAudio}
                    disabled={loading}
                >
                    {loading ? "Загрузка..." : audioSrc ? "Обновить аудио" : "Послушать"}
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadAudio}
                    disabled={downloading}
                >
                    {downloading ? "Скачивание..." : "Скачать"}
                </Button>
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
