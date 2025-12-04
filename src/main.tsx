import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#A86BFF", // Primary Violet
            dark: "#8B4DFF", // Primary Purple Neon
        },
        secondary: {
            main: "#27E5FF", // Aqua Neon accent
            light: "#6CEBFF", // Soft Cyan accent
        },
        background: {
            default: "#F2EDFF", // Soft Lavender Background
            paper: "#ffffff",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: "radial-gradient(circle at 20% 20%, #FFFFFF 0, #F2EDFF 45%), radial-gradient(circle at 80% 0%, #FFFFFF 0, #F2EDFF 40%)",
                    color: "#14072B",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
