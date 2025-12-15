import { API_BASE_URL } from "../config";

type MockResponse = {
    status: string;
    message?: string;
    [key: string]: unknown;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitTextForCheck(text: string): Promise<MockResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/task/check_text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
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
        if (payload.modelAnswer) {
            formData.append("modelAnswer", payload.modelAnswer);
        }
        if (payload.targetPatterns?.length) {
            formData.append("targetPatterns", JSON.stringify(payload.targetPatterns));
        }
        if (payload.keywords?.length) {
            formData.append("keywords", JSON.stringify(payload.keywords));
        }
        if (payload.systemPrompt) {
            formData.append("systemPrompt", payload.systemPrompt);
        }
        if (payload.scoringDimensions?.length) {
            formData.append("scoringDimensions", JSON.stringify(payload.scoringDimensions));
        }

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
