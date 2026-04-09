import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import { useDownloadStore } from "@/src/store/downloadStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import { detectVideoSource, type VideoSource } from "@/src/utils/videoSource";
import type { MultiLangText } from "@/src/types/learning";

export interface LessonData {
	title: string;
	courseTitle: string;
	lessonNumber: number;
	totalLessons: number;
	duration: number;
	description: string;
	videoSource: VideoSource;
	nextLesson: { id: string; title: string; duration: number } | null;
	previousLesson: { id: string } | null;
}

const EMPTY_LESSON: LessonData = {
	title: "Lesson Not Found",
	courseTitle: "",
	lessonNumber: 0,
	totalLessons: 0,
	duration: 0,
	description: "",
	videoSource: { source: "", type: "url" },
	nextLesson: null,
	previousLesson: null,
};

export function useLesson(): LessonData {
	const { courseId, lessonId } = useLocalSearchParams<{
		courseId: string;
		lessonId: string;
	}>();

	const { currentLanguage } = useLanguage();

	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const getNextLesson = useLearningStore((s) => s.getNextLesson);
	const getPreviousLesson = useLearningStore((s) => s.getPreviousLesson);
	const getLocalUri = useDownloadStore((s) => s.getLocalUri);

	return useMemo<LessonData>(() => {
		const loc = (text: string | MultiLangText): string =>
			typeof text === "string" ? text : text[currentLanguage] || text.en;

		const lesson = lessonId
			? lessons.find((l) => l.id === lessonId)
			: undefined;
		const course = courseId
			? courses.find((c) => c.id === courseId)
			: lesson
				? courses.find((c) => c.id === lesson.courseId)
				: undefined;

		if (!lesson || !course) return EMPTY_LESSON;

		const courseLessons = lessons
			.filter((l) => l.courseId === course.id)
			.sort((a, b) => a.order - b.order);
		const lessonIndex = courseLessons.findIndex((l) => l.id === lesson.id);

		const next = getNextLesson(course.id, lesson.order);
		const prev = getPreviousLesson(course.id, lesson.order);
		const localUri = getLocalUri(lesson.id);
		const videoSource = detectVideoSource(lesson.videoId, localUri);

		return {
			title: loc(lesson.title),
			courseTitle: loc(course.title),
			lessonNumber: lessonIndex + 1,
			totalLessons: courseLessons.length,
			duration: lesson.duration,
			description: loc(lesson.description),
			videoSource,
			nextLesson: next
				? { id: next.id, title: loc(next.title), duration: next.duration }
				: null,
			previousLesson: prev ? { id: prev.id } : null,
		};
	}, [
		lessonId,
		courseId,
		courses,
		lessons,
		getNextLesson,
		getPreviousLesson,
		getLocalUri,
		currentLanguage,
	]);
}
