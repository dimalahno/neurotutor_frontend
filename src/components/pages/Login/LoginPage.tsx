import { type ChangeEvent, type FormEvent, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export type LoginFormValues = {
    email: string;
    password: string;
};

type Props = {
    loading: boolean;
    error: string | null;
    onSubmit: (values: LoginFormValues) => Promise<void>;
    onBack: () => void;
};

export function LoginPage({ loading, error, onSubmit, onBack }: Props) {
    const [formValues, setFormValues] = useState<LoginFormValues>({ email: "", password: "" });
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleChange = (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setValidationError(null);

        if (!formValues.email || !formValues.password) {
            setValidationError("Введите email и пароль");
            return;
        }

        await onSubmit(formValues);
    };

    return (
        <Stack spacing={3} alignItems="center">
            <Box textAlign="center">
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Вход в аккаунт
                </Typography>
                <Typography color="text.secondary">Введите свои данные для авторизации.</Typography>
            </Box>

            <Card sx={{ width: "100%", maxWidth: 480, boxShadow: "0 12px 36px rgba(0,0,0,0.08)" }}>
                <CardContent>
                    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                        <TextField
                            required
                            label="Email"
                            type="email"
                            value={formValues.email}
                            onChange={handleChange("email")}
                            placeholder="user@example.com"
                        />
                        <TextField
                            required
                            label="Пароль"
                            type="password"
                            value={formValues.password}
                            onChange={handleChange("password")}
                        />

                        {validationError && <Alert severity="warning">{validationError}</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={onBack} disabled={loading}>
                                Назад
                            </Button>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? "Входим..." : "Войти"}
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}
