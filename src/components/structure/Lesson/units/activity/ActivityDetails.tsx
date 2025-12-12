import React, {useMemo, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box, Button,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type {
    Activity,
    ErrorCorrectionActivity,
    GapFillActivity,
    ListenAndRepeatActivity,
    ListeningMultipleChoiceActivity,
    MatchingActivity,
    MultipleChoiceActivity,
    OpenAnswerActivity,
    RoleplayActivity,
    SpeakingPromptActivity,
    TableCompletionActivity,
    VocabListActivity,
    WordOrderActivity,
} from "../../../../../types/content";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { GapFillInputItem } from "./GapFillInputItem";
import { AudioFetchPlayer } from "../../../../AudioFetchPlayer";
import { ResponseInputPanel } from "./ResponseInputPanel";

const activityLabels: Record<string, string> = {
    speaking_prompt: "Говорение",
    vocab_list: "Список слов",
    matching: "Соотнесение",
    gap_fill: "Вставить пропуски",
    multiple_choice: "Тест с вариантами",
    open_answer: "Свободный ответ",
    table_completion: "Таблица",
    word_order: "Порядок слов",
    error_correction: "Исправление ошибок",
    llm_adaptive: "Адаптивное задание",
    listen_and_repeat: "Повтори за диктором",
    listening_multiple_choice: "Аудирование",
    roleplay: "Ролевая игра",
    llm_summary_feedback: "Итоговый фидбек",
};

function formatActivityTitle(activity: Activity, index: number) {
    const label = activityLabels[activity.type] ?? activity.type;
    return `${index}. ${label}`;
}

function ActivityMeta() {
    const chips: string[] = [];

    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {chips.map((label) => (
                <Chip key={label} label={label} size="small" />
            ))}
        </Stack>
    );
}

function SpeakingPromptDetails({ activity }: { activity: SpeakingPromptActivity }) {
    const hasQuestions = activity.questions?.length > 0;

    return (
        <Stack spacing={2}>
            {hasQuestions ? (
                <List dense>
                    {activity.questions.map((question) => (
                        <ListItem key={question.id} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="subtitle2">{question.prompt}</Typography>
                            {question.modelAnswer ? (
                                <Typography variant="body2" color="text.secondary">
                                    Answer example: {question.modelAnswer}
                                </Typography>
                            ) : null}
                            {question.targetPatterns ? (
                                <Typography variant="body2" color="text.secondary">
                                    Phrase patterns: {question.targetPatterns.join("; ")}
                                </Typography>
                            ) : null}
                            {question.keywords ? (
                                <Typography variant="body2" color="text.secondary">
                                    Key words: {question.keywords.join(", ")}
                                </Typography>
                            ) : null}
                            <ResponseInputPanel inputType={question.inputType ?? activity.inputType} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <ResponseInputPanel inputType={activity.inputType} />
            )}
        </Stack>
    );
}

function VocabListDetails({ activity }: { activity: VocabListActivity }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mt: 1,
            }}
        >
            {activity.words.map((word) => (
                <FlipCard
                    key={word.term}
                    front={<Typography variant="h6">{word.term}</Typography>}
                    back={
                        <Stack spacing={0.5}>
                            <Typography variant="subtitle1">{word.definition}</Typography>
                            {word.example ? (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    Example: {word.example}
                                </Typography>
                            ) : null}
                        </Stack>
                    }
                />
            ))}
        </Box>
    );
}

function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <Box sx={{ perspective: 1000, cursor: "pointer" }} onClick={() => setFlipped((prev) => !prev)}>
            <Box
                sx={{
                    position: "relative",
                    height: "100%",
                    minHeight: 150,
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                <CardFace>{front}</CardFace>
                <CardFace isBack>{back}</CardFace>
            </Box>
        </Box>
    );
}

function CardFace({ children, isBack = false }: { children: React.ReactNode; isBack?: boolean }) {
    return (
        <Box
            sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 2,
                boxSizing: "border-box",
                backfaceVisibility: "hidden",
                bgcolor: "background.paper",
                transform: isBack ? "rotateY(180deg)" : "rotateY(0deg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0.5,
            }}
        >
            {children}
        </Box>
    );
}

function MatchingDetails({ activity }: { activity: MatchingActivity }) {
    return (
        <Stack spacing={2}>
            <Stack spacing={1.5}>
                {activity.items.map((item, index) => (
                    <ChoiceQuestion
                        key={`${item.question}-${index}`}
                        question={`${index + 1}. ${item.question}`}
                        options={item.options}
                        correctIndex={item.correctIndex}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

function GapFillDetails({ activity }: { activity: GapFillActivity }) {
    return (
        <Stack spacing={2}>
            <Stack spacing={1.5}>
                {activity.items.map((item, index) => (
                    <GapFillInputItem
                        key={`${item.sentence}-${index}`}
                        index={index + 1}
                        sentence={item.sentence}
                        correct={item.correct}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

function MultipleChoiceDetails({ activity }: { activity: MultipleChoiceActivity }) {
    return (
        <Stack spacing={2}>
            <Stack spacing={1.5}>
                {activity.items.map((item, index) => (
                    <ChoiceQuestion
                        key={`${item.question}-${index}`}
                        question={`${index + 1}. ${item.question}`}
                        options={item.options}
                        correctIndex={item.correctIndex}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

function OpenAnswerDetails({ activity }: { activity: OpenAnswerActivity }) {
    return (
        <Stack spacing={1}>
            {activity.guidelines ? (
                <Box>
                    <Typography variant="subtitle2">Подсказки:</Typography>
                    <List dense>
                        {activity.guidelines.map((guide) => (
                            <ListItem key={guide}>
                                <ListItemText primary={guide} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ) : null}
            <ResponseInputPanel inputType={activity.inputType} />
        </Stack>
    );
}

function TableCompletionDetails({ activity }: { activity: TableCompletionActivity }) {
    const headers = activity.table.rows.length > 0 ? Object.keys(activity.table.rows[0]) : [];

    return (
        <Stack spacing={1}>
            {activity.instruction ? (
                <Typography variant="body2" color="text.secondary">
                    {activity.instruction}
                </Typography>
            ) : null}
            <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activity.table.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {headers.map((header) => (
                                <TableCell key={header}>{row[header]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
}

function WordSelector({
                          words,
                          correct
                      }: {
    words: string[];
    correct: string;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    const [result, setResult] = useState<null | "correct" | "wrong">(null);

    const toggleWord = (word: string) => {
        if (selected.includes(word)) {
            setSelected(selected.filter(w => w !== word));
            return;
        }
        setSelected([...selected, word]);
    };

    const checkAnswer = () => {
        const userAnswerRaw = selected.join(" ").trim();
        const normalizedCorrect = correct.trim();

        // убрать пробелы перед пунктуацией
        const userAnswer = userAnswerRaw.replace(/\s+([.,!?;:])/g, "$1");

        if (userAnswer === normalizedCorrect) {
            setResult("correct");
        } else {
            setResult("wrong");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

            {/* Выбор слов */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {words.map((w, i) => {
                    const isSelected = selected.includes(w);
                    return (
                        <Chip
                            key={i}
                            label={w}
                            variant={isSelected ? "filled" : "outlined"}
                            color={isSelected ? "primary" : "default"}
                            onClick={() => toggleWord(w)}
                        />
                    );
                })}
            </Box>

            {/* Собранный ответ */}
            <Typography variant="body2">
                Ваш ответ: {selected.join(" ")}
            </Typography>

            {/* Кнопка проверки */}
            <Button
                variant="contained"
                onClick={checkAnswer}
                disabled={selected.length === 0}
                sx={{ alignSelf: "flex-start" }}
            >
                Проверить
            </Button>

            {/* Результат */}
            {result === "correct" && (
                <Typography sx={{ color: "success.main" }}>
                    ✔ Правильно!
                </Typography>
            )}

            {result === "wrong" && (
                <Typography sx={{ color: "error.main" }}>
                    ✖ Неправильно
                </Typography>
            )}
        </Box>
    );
}

function WordOrderDetails({ activity }: { activity: WordOrderActivity }) {
    const itemsWithShuffledWords = useMemo(() => {
        return activity.items.map(item => ({
            ...item,
            shuffledWords: [...item.words].sort(() => Math.random() - 0.5)
        }));
    }, [activity]);

    return (
        <Stack spacing={1}>
            <List dense>
                {itemsWithShuffledWords.map((item, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%"
                        }}
                    >
                        <Typography variant="body1">Задание:</Typography>

                        {/* Новый компонент выбора слов */}
                        <WordSelector words={item.shuffledWords} correct={item.correct} />

                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Правильный ответ: {item.correct}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function ErrorCorrectionDetails({ activity }: { activity: ErrorCorrectionActivity }) {
    return (
        <Stack spacing={1}>
            <List dense>
                {activity.items.map((item, index) => (
                    <GapFillInputItem
                        key={`${item.sentence}-${index}`}
                        index={index + 1}
                        sentence={item.sentence}
                        correct={item.correct}
                    />
                ))}
            </List>
        </Stack>
    );
}

function ListenAndRepeatDetails({ activity }: { activity: ListenAndRepeatActivity }) {
    return (
        <Stack spacing={1}>
            <AudioFetchPlayer audioFileName={activity.audioUrl} />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                }}
            >
                {activity.words.map((word) => (
                    <FlipCard
                        key={word.term}
                        front={<Typography variant="h6">{word.term}</Typography>}
                        back={
                            <Stack spacing={0.5} alignItems="center">
                                <Typography variant="subtitle1">{word.translation}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {word.transcript}
                                </Typography>
                            </Stack>
                        }
                    />
                ))}
            </Box>
        </Stack>
    );
}

function ListeningMultipleChoiceDetails({ activity }: { activity: ListeningMultipleChoiceActivity }) {
    return (
        <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle2">Треки:</Typography>
                        <List dense>
                            {activity.tracks.map((track) => (
                                <ListItem key={track.trackId} sx={{ alignItems: "flex-start" }}>
                                    <Stack spacing={1} sx={{ width: "100%" }}>
                                        <ListItemText primary={track.title} />
                                        {track.audioUrl ? (
                                            <AudioFetchPlayer audioFileName={track.audioUrl} />
                                        ) : (
                                            <Alert severity="warning">Для этого трека не указан аудиофайл.</Alert>
                                        )}
                                    </Stack>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
            <Divider />
            <Stack spacing={1.5}>
                <Typography variant="subtitle2">Вопросы:</Typography>
                {activity.items.map((item, index) => (
                    <ChoiceQuestion
                        key={`${item.question}-${index}`}
                        question={`${index + 1}. ${item.question}`}
                        options={item.options}
                        correctIndex={item.correctIndex}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

function RoleplayDetails({ activity }: { activity: RoleplayActivity }) {
    return (
        <Stack spacing={1}>
            <List dense>
                {activity.turns.map((turn) => (
                    <ListItem key={turn.id} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography variant="subtitle2">
                            {turn.role.toUpperCase()}: {turn.text}
                        </Typography>
                        {turn.targetPatterns ? (
                            <Typography variant="body2" color="text.secondary">
                                Phrase patterns: {turn.targetPatterns.join("; ")}
                            </Typography>
                        ) : null}
                        {turn.modelAnswer ? (
                            <Typography variant="body2" color="text.secondary">
                                Answer example: {turn.modelAnswer}
                            </Typography>
                        ) : null}
                        <ResponseInputPanel inputType={turn.inputType} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function SimplePrompt({ activity }: { activity: Activity }) {
    return activity.prompt ? <Typography>{activity.prompt}</Typography> : <Alert severity="info">Описание не задано.</Alert>;
}

function renderActivityContent(activity: Activity) {
    switch (activity.type) {
        case "speaking_prompt":
            return <SpeakingPromptDetails activity={activity as SpeakingPromptActivity} />;
        case "vocab_list":
            return <VocabListDetails activity={activity as VocabListActivity} />;
        case "matching":
            return <MatchingDetails activity={activity as MatchingActivity} />;
        case "gap_fill":
            return <GapFillDetails activity={activity as GapFillActivity} />;
        case "multiple_choice":
            return <MultipleChoiceDetails activity={activity as MultipleChoiceActivity} />;
        case "open_answer":
            return <OpenAnswerDetails activity={activity as OpenAnswerActivity} />;
        case "table_completion":
            return <TableCompletionDetails activity={activity as TableCompletionActivity} />;
        case "word_order":
            return <WordOrderDetails activity={activity as WordOrderActivity} />;
        case "error_correction":
            return <ErrorCorrectionDetails activity={activity as ErrorCorrectionActivity} />;
        case "listen_and_repeat":
            return <ListenAndRepeatDetails activity={activity as ListenAndRepeatActivity} />;
        case "listening_multiple_choice":
            return <ListeningMultipleChoiceDetails activity={activity as ListeningMultipleChoiceActivity} />;
        case "roleplay":
            return <RoleplayDetails activity={activity as RoleplayActivity} />;
        case "llm_adaptive":
        case "llm_summary_feedback":
            return <SimplePrompt activity={activity} />;
        default:
            return <SimplePrompt activity={activity} />;
    }
}

export function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
    return (
        <Accordion
            disableGutters
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                "&:before": { display: "none" },
                overflow: "hidden",
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                <Stack spacing={0.5} sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {formatActivityTitle(activity, index)}
                    </Typography>
                    <Typography variant="h6">{activity.prompt || "Vocabulary"}</Typography>
                    <ActivityMeta />
                </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                {renderActivityContent(activity)}
            </AccordionDetails>
        </Accordion>
    );
}
