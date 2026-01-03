import { Alert, AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CoursePage } from "./components/pages/Course/CoursePage";
import { LevelPage } from "./components/pages/Level/LevelPage";
import { LessonPage } from "./components/pages/Lesson/LessonPage";
import { LoginPage, type LoginFormValues } from "./components/pages/Login/LoginPage";
import { InterviewTrainerPage } from "./components/pages/Interview/InterviewTrainerPage";
import { VoiceChat } from "./components/pages/Interview/VoiceChat";
import { RegistrationPage } from "./components/pages/Registration/RegistrationPage";
import { SpeakingClubChatPage } from "./components/pages/SpeakingClub/SpeakingClubChatPage";
import { SpeakingClubPage, type SpeakingTopic } from "./components/pages/SpeakingClub/SpeakingClubPage";
import { StartPage } from "./components/pages/Start/StartPage";
import { API_BASE_URL } from "./config";
import type { ApiState, Course, Lesson } from "./types/content";
import type { AuthTokens, UserProfile } from "./utils/auth";
import {
    buildFullName,
    clearStoredTokens,
    extractSubFromJwt,
    loadStoredTokens,
    persistTokens,
} from "./utils/auth";

type PageKey =
    | "home"
    | "course"
    | "lesson"
    | "register"
    | "login"
    | "level"
    | "club"
    | "club-chat"
    | "interview"
    | "interview-chat";

function App() {
    const [activePage, setActivePage] = useState<PageKey>("home");
    const [coursesState, setCoursesState] = useState<ApiState<Course[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [lessonState, setLessonState] = useState<ApiState<Lesson>>({
        data: null,
        loading: false,
        error: null,
    });
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [speakingTopic, setSpeakingTopic] = useState<SpeakingTopic | null>(null);
    const [authState, setAuthState] = useState<{ loading: boolean; error: string | null }>({
        loading: false,
        error: null,
    });
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const goHome = () => {
        setActivePage("home");
        setSelectedLessonId(null);
        setSpeakingTopic(null);
    };

    const fetchUserProfile = async (sub: string, tokens: AuthTokens) => {
        const response = await fetch(`${API_BASE_URL}/users/${sub}`, {
            headers: {
                Authorization: `${tokens.token_type} ${tokens.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Не удалось загрузить профиль пользователя");
        }

        const json = (await response.json()) as UserProfile;
        setUserProfile(json);
    };

    const handleLogin = async ({ email, password }: LoginFormValues) => {
        setAuthState({ loading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Не удалось выполнить вход");
            }

            const tokens = (await response.json()) as AuthTokens;
            persistTokens(tokens);

            const sub = extractSubFromJwt(tokens.access_token);
            if (!sub) {
                throw new Error("Не удалось определить пользователя из токена");
            }

            await fetchUserProfile(sub, tokens);
            setActivePage("home");
            setAuthState({ loading: false, error: null });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setAuthState({ loading: false, error: message });
        }
    };

    const handleLogout = () => {
        clearStoredTokens();
        setUserProfile(null);
        setAuthState({ loading: false, error: null });
        goHome();
    };

    useEffect(() => {
        const fetchCourses = async () => {
            setCoursesState({ data: null, loading: true, error: null });
            try {
                const response = await fetch(`${API_BASE_URL}/content/courses`);

                if (!response.ok) {
                    throw new Error("Не удалось загрузить список курсов");
                }

                const json = (await response.json()) as Course[];
                setCoursesState({ data: json, loading: false, error: null });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                setCoursesState({ data: null, loading: false, error: message });
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const tokens = loadStoredTokens();
        if (!tokens) return;

        const sub = extractSubFromJwt(tokens.access_token);
        if (!sub) return;

        setAuthState({ loading: true, error: null });

        fetchUserProfile(sub, tokens)
            .then(() => setAuthState({ loading: false, error: null }))
            .catch((error) => {
                const message = error instanceof Error ? error.message : String(error);
                setAuthState({ loading: false, error: message });
            });
    }, []);

    useEffect(() => {
        if (!selectedLessonId) return;

        const fetchLesson = async () => {
            setLessonState({ data: null, loading: true, error: null });
            try {
                const response = await fetch(`${API_BASE_URL}/content/lessons/${selectedLessonId}`);

                if (!response.ok) {
                    throw new Error("Не удалось загрузить данные урока");
                }

                const json = (await response.json()) as Lesson;
                setLessonState({ data: json, loading: false, error: null });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                setLessonState({ data: null, loading: false, error: message });
            }
        };

        fetchLesson();
    }, [selectedLessonId]);

    const userFullName = buildFullName(userProfile);

    const renderContent = () => {
        if (activePage === "home") {
            return (
                <StartPage
                    onOpenCourses={() => {
                        setSelectedLessonId(null);
                        setActivePage("course");
                    }}
                    onOpenLevelCheck={() => setActivePage("level")}
                    onOpenSpeakingClub={() => setActivePage("club")}
                    onOpenInterviewTrainer={() => setActivePage("interview")}
                />
            );
        }

        if (activePage === "course") {
            if (coursesState.loading) return <Typography>Загружаем курсы...</Typography>;
            if (coursesState.error || !coursesState.data) return <Alert severity="error">{coursesState.error}</Alert>;

            return (
                <CoursePage
                    courses={coursesState.data}
                    onBack={goHome}
                    onOpenLesson={(lessonId) => {
                        setSelectedLessonId(lessonId);
                        setActivePage("lesson");
                    }}
                />
            );
        }

        if (activePage === "interview-chat") {
            if (!selectedLessonId) return <Alert severity="info">Выберите урок, чтобы начать разговор.</Alert>;

            if (!userProfile) {
                return <Alert severity="warning">Авторизуйтесь, чтобы начать голосовое общение.</Alert>;
            }

            return (
                <VoiceChat
                    initialLessonId={selectedLessonId}
                    initialUserId={userProfile.id}
                    lessonTitle={lessonState.data?.title}
                    onBack={() => setActivePage("interview")}
                />
            );
        }

        if (activePage === "login") {
            return (
                <LoginPage
                    loading={authState.loading}
                    error={authState.error}
                    onSubmit={handleLogin}
                    onBack={goHome}
                />
            );
        }

        if (activePage === "register") {
            return <RegistrationPage onBack={goHome} />;
        }

        if (activePage === "level") {
            return (
                <LevelPage onBack={goHome} />
            );
        }

        if (activePage === "club") {
            if (coursesState.loading) return <Typography>Загружаем темы...</Typography>;
            if (coursesState.error || !coursesState.data) return <Alert severity="error">{coursesState.error}</Alert>;

            return (
                <SpeakingClubPage
                    courses={coursesState.data}
                    onBack={goHome}
                    onStartChat={(topic) => {
                        setSpeakingTopic(topic);
                        setActivePage("club-chat");
                    }}
                />
            );
        }

        if (activePage === "club-chat") {
            if (!speakingTopic) {
                return <Alert severity="info">Выберите тему для общения.</Alert>;
            }

            return <SpeakingClubChatPage topic={speakingTopic} onBack={() => setActivePage("club")} />;
        }

        if (activePage === "interview") {
            if (coursesState.loading) return <Typography>Загружаем уроки...</Typography>;
            if (coursesState.error || !coursesState.data) return <Alert severity="error">{coursesState.error}</Alert>;

            return (
                <InterviewTrainerPage
                    courses={coursesState.data}
                    onBack={goHome}
                    onOpenLesson={(lessonId) => {
                        setSelectedLessonId(lessonId);
                        setActivePage("interview-chat");
                    }}
                />
            );
        }

        if (!selectedLessonId) return <Alert severity="info">Выберите урок, чтобы просмотреть детали.</Alert>;

        if (lessonState.loading) return <Typography>Загружаем урок...</Typography>;
        if (lessonState.error || !lessonState.data) return <Alert severity="error">{lessonState.error}</Alert>;

        return <LessonPage lesson={lessonState.data} onBack={() => setActivePage("course")} />;
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background:
                    "linear-gradient(180deg, rgba(76,175,80,0.08) 0%, rgba(3,169,244,0.06) 55%, rgba(255,152,0,0.04) 100%)",
            }}
        >
            <AppBar
                position="static"
                sx={{
                    backgroundImage: "linear-gradient(90deg, #4CAF50 0%, #03A9F4 100%)",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
                        NU
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {userFullName && (
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                                {userFullName}
                            </Typography>
                        )}
                        <Button
                            color="inherit"
                            onClick={() => {
                                if (userProfile) {
                                    handleLogout();
                                } else {
                                    setActivePage("login");
                                }
                            }}
                            disabled={authState.loading}
                        >
                            {userProfile ? "Выход" : authState.loading ? "Входим..." : "Вход"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setActivePage("register");
                            }}
                        >
                            Регистрация
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {authState.error && (
                <Container sx={{ mt: 2 }}>
                    <Alert severity="error">{authState.error}</Alert>
                </Container>
            )}

            <Container maxWidth="md" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
                {renderContent()}
            </Container>

            <Box component="footer" sx={{ py: 2, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                    Neural University · {new Date().getFullYear()}
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
