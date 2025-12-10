import React, { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
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
    return (
        <Stack spacing={2}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            {activity.questions?.length > 0 && (
                <List dense>
                    {activity.questions.map((question) => (
                        <ListItem key={question.id} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="subtitle2">{question.prompt}</Typography>
                            {question.expectedAnswerType ? (
                                <Typography variant="caption" color="text.secondary">
                                    Тип ответа: {question.expectedAnswerType}
                                </Typography>
                            ) : null}
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
                <FlipCard key={word.term} term={word.term} definition={word.definition} example={word.example} />
            ))}
        </Box>
    );
}

function FlipCard({
    term,
    definition,
    example,
}: {
    term: string;
    definition: string;
    example?: string;
}) {
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
                <CardFace>
                    <Typography variant="h6">{term}</Typography>
                </CardFace>
                <CardFace isBack>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1">{definition}</Typography>
                        {example ? (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                Example: {example}
                            </Typography>
                        ) : null}
                    </Stack>
                </CardFace>
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
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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

function WordOrderDetails({ activity }: { activity: WordOrderActivity }) {
    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <List dense>
                {activity.items.map((item, index) => (
                    <ListItem key={index} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography variant="body2" color="text.secondary">
                            Слова: {item.words.join(" ")}
                        </Typography>
                        <Typography variant="body1">Решение: {item.solution}</Typography>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function ErrorCorrectionDetails({ activity }: { activity: ErrorCorrectionActivity }) {
    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <List dense>
                {activity.items.map((item, index) => (
                    <ListItem key={index} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography color="error">{item.incorrect}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Исправление: {item.correct}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function ListenAndRepeatDetails({ activity }: { activity: ListenAndRepeatActivity }) {
    return (
        <Stack spacing={1}>
            <AudioFetchPlayer audioFileName={activity.audioUrl} />
            <Grid container spacing={2}>
                {activity.wordList.map((word) => (
                    <Grid item xs={12} sm={6} md={4} key={word}>
                        <Card variant="outlined" sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography align="center" fontWeight="bold">
                                    {word}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}

function ListeningMultipleChoiceDetails({ activity }: { activity: ListeningMultipleChoiceActivity }) {
    return (
        <Stack spacing={2}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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
    const inputTypes = Array.isArray(activity.inputType) ? activity.inputType : [activity.inputType];

    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
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
                    </ListItem>
                ))}
            </List>
            <ResponseInputPanel inputType={inputTypes} />
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
