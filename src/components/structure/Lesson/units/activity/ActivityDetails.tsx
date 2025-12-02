import {
    Alert,
    Box,
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

function ActivityMeta({ activity }: { activity: Activity }) {
    const chips: string[] = [];

    if (activity.autoCheck?.type) {
        chips.push(`Автопроверка: ${activity.autoCheck.type}`);
    }

    chips.push(activity.llmCheck?.enabled ? `LLM: ${activity.llmCheck.mode ?? "включено"}` : "LLM: выключено");

    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {chips.map((label) => (
                <Chip key={label} label={label} size="small" />
            ))}
        </Stack>
    );
}

function SpeakingPromptDetails({ activity }: { activity: SpeakingPromptActivity }) {
    const inputTypes = Array.isArray(activity.inputType) ? activity.inputType : [activity.inputType];
    return (
        <Stack spacing={2}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {inputTypes.map((type) => (
                    <Chip key={type} label={`Формат ответа: ${type}`} size="small" />
                ))}
                {activity.show_question_mode ? (
                    <Chip label={`Показ вопросов: ${activity.show_question_mode}`} size="small" color="secondary" />
                ) : null}
            </Stack>
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
                                    Пример ответа: {question.modelAnswer}
                                </Typography>
                            ) : null}
                            {question.targetPatterns ? (
                                <Typography variant="body2" color="text.secondary">
                                    Шаблоны: {question.targetPatterns.join("; ")}
                                </Typography>
                            ) : null}
                            {question.keywords ? (
                                <Typography variant="body2" color="text.secondary">
                                    Ключевые слова: {question.keywords.join(", ")}
                                </Typography>
                            ) : null}
                        </ListItem>
                    ))}
                </List>
            )}
        </Stack>
    );
}

function VocabListDetails({ activity }: { activity: VocabListActivity }) {
    return (
        <List dense>
            {activity.words.map((word) => (
                <ListItem key={word.term} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="subtitle1">{word.term}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {word.definition}
                    </Typography>
                    {word.example ? (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Пример: {word.example}
                        </Typography>
                    ) : null}
                </ListItem>
            ))}
        </List>
    );
}

function MatchingDetails({ activity }: { activity: MatchingActivity }) {
    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <List dense>
                {activity.items.map((item, index) => (
                    <ListItem key={`${item.left}-${index}`} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography variant="subtitle1">{item.left}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Варианты: {item.rightOptions.join(" · ")}
                        </Typography>
                        <Typography variant="body2">Правильный ответ: {item.rightOptions[item.correctIndex]}</Typography>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function GapFillDetails({ activity }: { activity: GapFillActivity }) {
    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <List dense>
                {activity.items.map((item, index) => (
                    <ListItem key={`${item.sentence}-${index}`} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography>{item.sentence}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ответ: {item.correct}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function MultipleChoiceDetails({ activity }: { activity: MultipleChoiceActivity }) {
    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <List dense>
                {activity.items.map((item, index) => (
                    <ListItem key={`${item.question}-${index}`} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography variant="subtitle1">{item.question}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Варианты: {item.options.join(" · ")}
                        </Typography>
                        <Typography variant="body2">Правильный ответ: {item.options[item.correctIndex]}</Typography>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function OpenAnswerDetails({ activity }: { activity: OpenAnswerActivity }) {
    const inputTypes = Array.isArray(activity.inputType) ? activity.inputType : [activity.inputType];

    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {inputTypes.map((type) => (
                    <Chip key={type} label={`Формат ответа: ${type}`} size="small" />
                ))}
            </Stack>
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
            <Typography>Аудиотрек: {activity.audioUrl}</Typography>
            <List dense>
                {activity.wordList.map((word) => (
                    <ListItem key={word}>
                        <ListItemText primary={word} />
                    </ListItem>
                ))}
            </List>
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
                        <ListItem key={track.trackId}>
                            <ListItemText primary={track.title} secondary={`ID: ${track.trackId}`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider />
            <Box>
                <Typography variant="subtitle2">Вопросы:</Typography>
                <List dense>
                    {activity.items.map((item, index) => (
                        <ListItem key={index} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="subtitle1">{item.question}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Варианты: {item.options.join(" · ")}
                            </Typography>
                            <Typography variant="body2">Правильный ответ: {item.options[item.correctIndex]}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Stack>
    );
}

function RoleplayDetails({ activity }: { activity: RoleplayActivity }) {
    const inputTypes = Array.isArray(activity.inputType) ? activity.inputType : [activity.inputType];

    return (
        <Stack spacing={1}>
            {activity.prompt ? <Typography>{activity.prompt}</Typography> : null}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {activity.scenario ? <Chip label={`Сценарий: ${activity.scenario}`} size="small" color="secondary" /> : null}
                {inputTypes.map((type) => (
                    <Chip key={type} label={`Формат: ${type}`} size="small" />
                ))}
            </Stack>
            <List dense>
                {activity.turns.map((turn) => (
                    <ListItem key={turn.id} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Typography variant="subtitle2">
                            {turn.role.toUpperCase()}: {turn.text}
                        </Typography>
                        {turn.targetPatterns ? (
                            <Typography variant="body2" color="text.secondary">
                                Шаблоны: {turn.targetPatterns.join("; ")}
                            </Typography>
                        ) : null}
                        {turn.modelAnswer ? (
                            <Typography variant="body2" color="text.secondary">
                                Пример ответа: {turn.modelAnswer}
                            </Typography>
                        ) : null}
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
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 }}>
            <Stack spacing={1.5}>
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {formatActivityTitle(activity, index)}
                    </Typography>
                    <Typography variant="h6">{activity.prompt || "Активность"}</Typography>
                    <ActivityMeta activity={activity} />
                </Stack>
                <Divider />
                {renderActivityContent(activity)}
            </Stack>
        </Box>
    );
}
