import type { Lesson } from "../../../types/content";
import { LessonPage } from "../Lesson/LessonPage";
import cefrTestData from "../../../../mock_data/cefr_test.json";

type PlacementLessonData = Omit<Lesson, "_id"> & { index?: number };

const placementData = cefrTestData as PlacementLessonData;

const placementLesson: Lesson = {
    _id: "cefr-test",
    ...placementData,
    index: placementData.index && placementData.index > 0 ? placementData.index : 1,
};

export function LevelPage({ onBack }: { onBack: () => void }) {
    return <LessonPage lesson={placementLesson} onBack={onBack} headerLabel="Тест" backLabel="Назад" />;
}
