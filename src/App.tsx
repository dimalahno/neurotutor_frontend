import { Alert, AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CoursePage } from "./components/pages/Course/CoursePage";
import { LessonPage } from "./components/pages/Lesson/LessonPage";
import { RegistrationPage } from "./components/pages/Registration/RegistrationPage";
import { API_BASE_URL } from "./config";
import type { ApiState, Course, Lesson } from "./types/content";

type PageKey = "course" | "lesson" | "register";

function App() {
    const [activePage, setActivePage] = useState<PageKey>("course");
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
    const [trainingAnchor, setTrainingAnchor] = useState<null | HTMLElement>(null);
    const [supportAnchor, setSupportAnchor] = useState<null | HTMLElement>(null);

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

    const renderContent = () => {
        if (activePage === "course") {
            if (coursesState.loading) return <Typography>Загружаем курсы...</Typography>;
            if (coursesState.error || !coursesState.data) return <Alert severity="error">{coursesState.error}</Alert>;

            return (
                <CoursePage
                    courses={coursesState.data}
                    onOpenLesson={(lessonId) => {
                        setSelectedLessonId(lessonId);
                        setActivePage("lesson");
                    }}
                />
            );
        }

        if (activePage === "register") {
            return <RegistrationPage onBack={() => setActivePage("course")} />;
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
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        NeuroTutor MVP
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexGrow: 1,
                            justifyContent: "center",
                        }}
                    >
                        <>
                            <Button
                                color="inherit"
                                onClick={(event) => setTrainingAnchor(event.currentTarget)}
                            >
                                Обучение
                            </Button>
                            <Menu
                                anchorEl={trainingAnchor}
                                open={Boolean(trainingAnchor)}
                                onClose={() => setTrainingAnchor(null)}
                            >
                                <MenuItem onClick={() => setTrainingAnchor(null)}>Курсы</MenuItem>
                                <MenuItem onClick={() => setTrainingAnchor(null)}>Определение уровня</MenuItem>
                                <MenuItem onClick={() => setTrainingAnchor(null)}>Разговорный клуб</MenuItem>
                                <MenuItem onClick={() => setTrainingAnchor(null)}>
                                    Тренажёр собеседований
                                </MenuItem>
                            </Menu>
                        </>

                        <>
                            <Button
                                color="inherit"
                                onClick={(event) => setSupportAnchor(event.currentTarget)}
                            >
                                Поддержка
                            </Button>
                            <Menu
                                anchorEl={supportAnchor}
                                open={Boolean(supportAnchor)}
                                onClose={() => setSupportAnchor(null)}
                            >
                                <MenuItem onClick={() => setSupportAnchor(null)}>Помощь</MenuItem>
                                <MenuItem onClick={() => setSupportAnchor(null)}>FAQ</MenuItem>
                                <MenuItem onClick={() => setSupportAnchor(null)}>Политика конфиденциальности</MenuItem>
                                <MenuItem onClick={() => setSupportAnchor(null)}>Договор оферты</MenuItem>
                                <MenuItem onClick={() => setSupportAnchor(null)}>Контакты</MenuItem>
                            </Menu>
                        </>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button color="inherit">Вход</Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setTrainingAnchor(null);
                                setSupportAnchor(null);
                                setActivePage("register");
                            }}
                        >
                            Регистрация
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
                {renderContent()}
            </Container>

            <Box component="footer" sx={{ py: 2, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                    NeuroTutor · React + FastAPI · {new Date().getFullYear()}
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
