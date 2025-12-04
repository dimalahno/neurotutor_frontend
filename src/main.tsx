import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#27E5FF", // Aqua Neon
            dark: "#20b7cc",
        },
        secondary: {
            main: "#6CEBFF", // Soft Cyan
            light: "#9df3ff",
        },
        background: {
            default: "#F9F9F9", // Soft Light Background
            paper: "#FFFFFF",
        },
        text: {
            primary: "#333333",
            secondary: "#4F4F4F",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background:
                        "linear-gradient(180deg, rgba(76,175,80,0.08) 0%, rgba(3,169,244,0.06) 55%, rgba(255,152,0,0.04) 100%), #F9F9F9",
                    color: "#333333",
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
