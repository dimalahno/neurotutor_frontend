export type LessonSummary = {
    lesson_id: string;
    index: number;
    title: string;
};

export type Course = {
    _id: string;
    slug: string;
    title: string;
    description: string;
    level?: string;
    lessons: LessonSummary[];
};

export type AgendaEntry = {
    order_id: number;
    description: string;
};

export type Agenda = Record<string, AgendaEntry>;

export type LlmCheck = {
    enabled: boolean;
    provider?: string;
    systemPrompt?: string;
    scoringDimensions?: string[];
    maxScore?: number;
};

type ActivityBase<TType extends string> = {
    id: string;
    type: TType;
    prompt?: string;
    llmCheck?: LlmCheck;
};

export type SpeakingPromptQuestion = {
    id: string;
    prompt: string;
    modelAnswer?: string;
    targetPatterns?: string[];
    keywords?: string[];
    inputType?: string | string[];
};

export type SpeakingPromptActivity = ActivityBase<"speaking_prompt"> & {
    inputType: string | string[];
    show_question_mode?: string;
    questions: SpeakingPromptQuestion[];
};

export type VocabListActivity = ActivityBase<"vocab_list"> & {
    words: {
        term: string;
        definition: string;
        example?: string;
    }[];
};

export type MatchingActivity = ActivityBase<"matching"> & {
    items: {
        question: string;
        options: string[];
        correctIndex: number;
    }[];
};

export type GapFillActivity = ActivityBase<"gap_fill"> & {
    items: {
        sentence: string;
        correct: string;
    }[];
};

export type MultipleChoiceActivity = ActivityBase<"multiple_choice"> & {
    items: {
        question: string;
        options: string[];
        correctIndex: number;
    }[];
};

export type OpenAnswerActivity = ActivityBase<"open_answer"> & {
    inputType: string | string[];
    guidelines?: string[];
};

export type TableCompletionActivity = ActivityBase<"table_completion"> & {
    instruction?: string;
    table: {
        rows: Record<string, string>[];
    };
};

export type WordOrderActivity = ActivityBase<"word_order"> & {
    items: {
        words: string[];
        correct: string;
        inputType?: string[];
    }[];
};

export type ErrorCorrectionActivity = ActivityBase<"error_correction"> & {
    items: {
        sentence: string;
        correct: string;
    }[];
};

export type LlmAdaptiveActivity = ActivityBase<"llm_adaptive">;

export type ListenAndRepeatActivity = ActivityBase<"listen_and_repeat"> & {
    audioUrl: string;
    words: {
        term: string;
        translation: string;
        transcript: string;
    }[];
};

export type ListeningMultipleChoiceActivity = ActivityBase<"listening_multiple_choice"> & {
    tracks: {
        title: string;
        trackId: string;
        audioUrl?: string;
    }[];
    items: {
        question: string;
        options: string[];
        correctIndex: number;
    }[];
};

export type RoleplayActivity = ActivityBase<"roleplay"> & {
    inputType: string | string[];
    turns: {
        id: string;
        role: string;
        type: string;
        text?: string;
        targetPatterns?: string[];
        keywords?: string[];
        modelAnswer?: string;
        inputType?: string | string[];
    }[];
};

export type LlmSummaryFeedbackActivity = ActivityBase<"llm_summary_feedback">;

export type Activity =
    | SpeakingPromptActivity
    | VocabListActivity
    | MatchingActivity
    | GapFillActivity
    | MultipleChoiceActivity
    | OpenAnswerActivity
    | TableCompletionActivity
    | WordOrderActivity
    | ErrorCorrectionActivity
    | LlmAdaptiveActivity
    | ListenAndRepeatActivity
    | ListeningMultipleChoiceActivity
    | RoleplayActivity
    | LlmSummaryFeedbackActivity
    | ActivityBase<string>;

export type LessonUnit = {
    id: string;
    type: string;
    title: string;
    description: string;
    order: number;
    reading?: LessonReading;
    explanation?: LessonUnitExplanation;
    activities: Activity[];
};

export type LessonUnitExplanation = {
    text: string;
    examples?: string[];
};

export type LessonReading = {
    id: string;
    title: string;
    text: {
        description?: string;
        content_data: LessonReadingTextBlock[];
    };
    audioUrl?: string;
    glossary?: GlossaryEntry[];
};

export type LessonReadingTextBlock = {
    order_id: number;
    profession?: string;
    content_text: string;
    is_tts?: boolean;
};

export type GlossaryEntry = {
    word: string;
    definition: string;
};

export type Lesson = {
    _id: string;
    index: number;
    title: string;
    lang_level: string[];
    estimatedTimeMinutes: number;
    agenda: Agenda;
    units: LessonUnit[];
};

export type ApiState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};
