import {
    Alert,
    AppBar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type LessonSummary = {
    lesson_id: string;
    index: number;
    title: string;
};

type Course = {
    _id: string;
    slug: string;
    title: string;
    description: string;
    level?: string;
    lessons: LessonSummary[];
};

type AgendaEntry = {
    order_id: number;
    description: string;
};

type Agenda = Record<string, AgendaEntry>;

type Activity = {
    id: string;
    type: string;
    prompt?: string;
    autoCheck?: {
        type: string;
    };
    llmCheck?: {
        enabled: boolean;
    };
};

type LessonUnit = {
    id: string;
    type: string;
    title: string;
    description: string;
    order: number;
    activities: Activity[];
};

type Lesson = {
    _id: string;
    index: number;
    title: string;
    lang_level: string[];
    estimatedTimeMinutes: number;
    agenda: Agenda;
    units: LessonUnit[];
};

type ApiState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};

const API_BASE_URL = "http://127.0.0.1:8088/content";

function CoursePage({
    courses,
    onOpenLesson,
}: {
    courses: Course[];
    onOpenLesson: (lessonId: string) => void;
}) {
    return (
        <Stack spacing={3}>
            {courses.map((course) => (
                <Paper key={course._id} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {course.description}
                    </Typography>
                    {course.level && (
                        <Chip
                            label={`Уровень: ${course.level}`}
                            color="secondary"
                            size="small"
                            sx={{ mb: 2 }}
                        />
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                        Содержание курса
                    </Typography>
                    <List>
                        {course.lessons.map((lesson) => (
                            <ListItem key={lesson.lesson_id} divider>
                                <ListItemText
                                    primary={`Урок ${lesson.index}: ${lesson.title}`}
                                    secondary={`ID: ${lesson.lesson_id}`}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => onOpenLesson(lesson.lesson_id)}
                                >
                                    Открыть урок
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ))}
        </Stack>
    );
}

function LessonPage({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
    const agendaEntries = useMemo(
        () =>
            Object.entries(lesson.agenda)
                .map(([name, entry]) => ({ name, ...entry }))
                .sort((a, b) => a.order_id - b.order_id),
        [lesson.agenda],
    );

    const sortedUnits = useMemo(
        () => [...lesson.units].sort((a, b) => a.order - b.order),
        [lesson.units],
    );

    const totalActivities = useMemo(
        () =>
            lesson.units.reduce((sum, unit) => {
                const activitiesCount = unit.activities ? unit.activities.length : 0;
                return sum + activitiesCount;
            }, 0),
        [lesson.units],
    );

    return (
        <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Typography variant="overline" color="text.secondary">
                            Урок {lesson.index}
                        </Typography>
                        <Typography variant="h4">{lesson.title}</Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            {lesson.lang_level.map((level) => (
                                <Chip key={level} label={level} color="primary" size="small" />
                            ))}
                            <Chip
                                label={`${lesson.estimatedTimeMinutes} мин.`}
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                label={`${lesson.units.length} юнитов / ${totalActivities} активностей`}
                                variant="outlined"
                                size="small"
                            />
                        </Stack>
                    </Stack>

                    <Button variant="outlined" onClick={onBack} sx={{ alignSelf: "flex-start" }}>
                        Назад к курсу
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    План урока
                </Typography>
                <List>
                    {agendaEntries.map((item) => (
                        <ListItem key={item.name} divider>
                            <ListItemText
                                primary={`${item.order_id}. ${item.name}`}
                                secondary={item.description}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Юниты и активности
                </Typography>
                <Stack spacing={2}>
                    {sortedUnits.map((unit) => (
                        <Paper key={unit.id} variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {unit.order}. {unit.type}
                                </Typography>
                                <Typography variant="subtitle1">{unit.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {unit.description}
                                </Typography>

                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {unit.activities.map((activity) => (
                                        <Chip
                                            key={activity.id}
                                            label={activity.type}
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Stack>

                                <Typography variant="caption" color="text.secondary">
                                    {unit.activities.length} активностей ·
                                    {" "}
                                    {unit.activities.some((activity) => activity.llmCheck?.enabled)
                                        ? "Есть задания с LLM"
                                        : "Проверка правилами"}
                                </Typography>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Paper>
        </Stack>
    );
}

type PageKey = "course" | "lesson";

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
            if (coursesState.error || !coursesState.data)
                return <Alert severity="error">{coursesState.error}</Alert>;

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

        if (!selectedLessonId)
            return <Alert severity="info">Выберите урок, чтобы просмотреть детали.</Alert>;

        if (lessonState.loading) return <Typography>Загружаем урок...</Typography>;
        if (lessonState.error || !lessonState.data)
            return <Alert severity="error">{lessonState.error}</Alert>;

        return <LessonPage lesson={lessonState.data} onBack={() => setActivePage("course")} />;
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
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

            <Container sx={{ mt: 3, mb: 3, flexGrow: 1 }}>{renderContent()}</Container>

            <Box component="footer" sx={{ py: 2, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                    NeuroTutor · React + FastAPI · {new Date().getFullYear()}
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
