import { API_BASE_URL } from "../config";

type MockResponse = {
    status: string;
    message?: string;
    [key: string]: unknown;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TextCheckPayload = {
    systemPrompt?: string;
    scoringDimensions?: string[];
};

export async function submitTextForCheck(text: string, payload: TextCheckPayload = {}): Promise<MockResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/task/check_text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                systemPrompt: payload.systemPrompt ?? "",
                scoringDimensions: payload.scoringDimensions ?? [],
            }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка ответа: ${response.status}`);
        }

        return (await response.json()) as MockResponse;
    } catch (error) {
        console.warn("Используем заглушку для /task/check_text", error);
        await delay(300);
        return {
            status: "stub",
            message: "Текст принят (заглушка)",
            length: text.length,
            systemPrompt: payload.systemPrompt ?? "",
            scoringDimensions: payload.scoringDimensions ?? [],
        };
    }
}

type AudioCheckPayload = {
    modelAnswer?: string;
    targetPatterns?: string[];
    keywords?: string[];
    systemPrompt?: string;
    scoringDimensions?: string[];
};

export async function submitAudioForCheck(audio: Blob, payload: AudioCheckPayload = {}): Promise<MockResponse> {
    try {
        const formData = new FormData();
        formData.append("file", audio, "recording.webm");

        formData.append("meta", JSON.stringify({
            modelAnswer: payload.modelAnswer ?? "",
            targetPatterns: payload.targetPatterns ?? [],
            keywords: payload.keywords ?? [],
            systemPrompt: payload.systemPrompt ?? "",
            scoringDimensions: payload.scoringDimensions ?? [],
        }));

        const response = await fetch(`${API_BASE_URL}/task/check_audio`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Ошибка ответа: ${response.status}`);
        }

        return (await response.json()) as MockResponse;
    } catch (error) {
        console.warn("Используем заглушку для /task/check_audio", error);
        await delay(300);
        return {
            status: "stub",
            message: "Аудио принято (заглушка)",
            size: audio.size,
        };
    }
}
