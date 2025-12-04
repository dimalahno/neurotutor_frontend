import { Alert, AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CoursePage } from "./components/pages/Course/CoursePage";
import { LessonPage } from "./components/pages/Lesson/LessonPage";
import type { ApiState, Course, Lesson } from "./types/content";

type PageKey = "course" | "lesson";

const API_BASE_URL = "http://127.0.0.1:8088/content";

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

    useEffect(() => {
        const fetchCourses = async () => {
            setCoursesState({ data: null, loading: true, error: null });
            try {
                const response = await fetch(`${API_BASE_URL}/courses`);

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
                const response = await fetch(`${API_BASE_URL}/lessons/${selectedLessonId}`);

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
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        NeuroTutor MVP
                    </Typography>
                    <Button
                        color={activePage === "course" ? "secondary" : "inherit"}
                        onClick={() => setActivePage("course")}
                    >
                        Курс
                    </Button>
                    <Button
                        color={activePage === "lesson" ? "secondary" : "inherit"}
                        onClick={() => setActivePage("lesson")}
                    >
                        Урок
                    </Button>
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
