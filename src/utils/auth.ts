export type AuthTokens = {
    access_token: string;
    refresh_token: string;
    token_type: string;
};

export type UserProfile = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    status_id: number;
    created_at: string;
    updated_at: string;
};

export function persistTokens(tokens: AuthTokens) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("token_type", tokens.token_type);
}

export function loadStoredTokens(): AuthTokens | null {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const token_type = localStorage.getItem("token_type");

    if (!access_token || !refresh_token || !token_type) {
        return null;
    }

    return { access_token, refresh_token, token_type };
}

function decodeBase64Url(value: string) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(normalized + padding);
    return decoded;
}

export function extractSubFromJwt(token: string): string | null {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    try {
        const payload = JSON.parse(decodeBase64Url(parts[1]));
        const sub = payload.sub;
        return typeof sub === "string" || typeof sub === "number" ? String(sub) : null;
    } catch (error) {
        console.error("Не удалось разобрать токен", error);
        return null;
    }
}

export function buildFullName(profile: UserProfile | null) {
    if (!profile) return "";

    return [profile.last_name, profile.first_name, profile.middle_name].filter(Boolean).join(" ");
}
