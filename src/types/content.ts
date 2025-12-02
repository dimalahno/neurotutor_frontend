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

export type Activity = {
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

export type LessonUnit = {
    id: string;
    type: string;
    title: string;
    description: string;
    order: number;
    activities: Activity[];
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
