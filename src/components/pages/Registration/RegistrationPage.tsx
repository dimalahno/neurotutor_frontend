import { type ChangeEvent, type FormEvent, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { API_BASE_URL } from "../../../config";

type RegistrationForm = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    middle_name: string;
};

type Props = {
    onBack: () => void;
};

export function RegistrationPage({ onBack }: Props) {
    const [formData, setFormData] = useState<RegistrationForm>({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        middle_name: "",
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (field: keyof RegistrationForm) => (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!formData.email || !formData.password) {
            setErrorMessage("Заполните обязательные поля: Email и Пароль");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Не удалось создать аккаунт");
            }

            setSuccessMessage("Аккаунт успешно создан! Теперь вы можете войти.");
            setFormData({ email: "", password: "", first_name: "", last_name: "", middle_name: "" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Неизвестная ошибка";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={3} alignItems="center">
            <Box textAlign="center">
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Создать аккаунт
                </Typography>
                <Typography color="text.secondary">Заполните форму, чтобы зарегистрироваться в системе.</Typography>
            </Box>

            <Card sx={{ width: "100%", maxWidth: 560, boxShadow: "0 12px 36px rgba(0,0,0,0.08)" }}>
                <CardContent>
                    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                        <TextField
                            required
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            placeholder="user@example.com"
                        />
                        <TextField
                            required
                            label="Пароль"
                            type="password"
                            value={formData.password}
                            onChange={handleChange("password")}
                        />
                        <TextField
                            label="Имя"
                            value={formData.first_name}
                            onChange={handleChange("first_name")}
                        />
                        <TextField
                            label="Фамилия"
                            value={formData.last_name}
                            onChange={handleChange("last_name")}
                        />
                        <TextField
                            label="Отчество"
                            value={formData.middle_name}
                            onChange={handleChange("middle_name")}
                        />

                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={onBack} disabled={loading}>
                                Назад
                            </Button>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? <CircularProgress size={22} color="inherit" /> : "Зарегистрироваться"}
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}
