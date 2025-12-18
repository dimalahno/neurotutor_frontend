import { ArrowBack } from "@mui/icons-material";
import { Button, Paper, Stack, Typography } from "@mui/material";

interface PlaceholderPageProps {
    title: string;
    description: string;
    onBack: () => void;
}

export function PlaceholderPage({ description, onBack, title }: PlaceholderPageProps) {
    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(3,169,244,0.06), rgba(255,152,0,0.06))",
                border: "1px solid rgba(3,169,244,0.15)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
        >
            <Stack spacing={3}>
                <Button onClick={onBack} startIcon={<ArrowBack />} color="primary">
                    Назад
                </Button>
                <Stack spacing={1}>
                    <Typography variant="h5" fontWeight={700}>
                        {title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {description}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
