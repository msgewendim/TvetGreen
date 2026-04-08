import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import { useDownloadStore } from "@/src/store/downloadStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import type { MultiLangText } from "@/src/types/learning";

interface LessonData {
	title: string;
	courseTitle: string;
	lessonNumber: number;
	totalLessons: number;
	instructor: string;
	duration: number;
	description: string;
	videoUrl: string;
	isDownloaded: boolean;
	lastPosition: number;
	nextLesson?: {
		id: string;
		title: string;
		duration: number;
	};
	previousLesson?: {
		id: string;
	};
}

export function useLesson(): LessonData {
	const { courseId, lessonId } = useLocalSearchParams<{
		courseId: string;
		lessonId: string;
	}>();

	const { currentLanguage } = useLanguage();

	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const lessonProgress = useLearningStore((s) => s.lessonProgress);
	const getNextLesson = useLearningStore((s) => s.getNextLesson);
	const getPreviousLesson = useLearningStore((s) => s.getPreviousLesson);
	const getLocalUri = useDownloadStore((s) => s.getLocalUri);

	const lessonData = useMemo<LessonData>(() => {
		const loc = (text: string | MultiLangText): string =>
			typeof text === "string" ? text : text[currentLanguage] || text.en;
		const lesson = lessonId ? lessons.find((l) => l.id === lessonId) : undefined;
		const course = courseId
			? courses.find((c) => c.id === courseId)
			: lesson
				? courses.find((c) => c.id === lesson.courseId)
				: undefined;

		if (!lesson || !course) {
			return {
				title: "Lesson Not Found",
				courseTitle: "",
				lessonNumber: 0,
				totalLessons: 0,
				instructor: "",
				duration: 0,
				description: "",
				videoUrl: "",
				isDownloaded: false,
				lastPosition: 0,
			};
		}

		const courseLessons = lessons
			.filter((l) => l.courseId === course.id)
			.sort((a, b) => a.order - b.order);
		const lessonIndex = courseLessons.findIndex((l) => l.id === lesson.id);
		const next = getNextLesson(course.id, lesson.order);
		const prev = getPreviousLesson(course.id, lesson.order);
		const progress = lessonProgress.find((p) => p.lessonId === lesson.id);

		// Priority: local download > videoId (YouTube or URL)
		const localUri = getLocalUri(lesson.id);
		const videoUrl = localUri || lesson.videoId;

		return {
			title: loc(lesson.title),
			courseTitle: loc(course.title),
			lessonNumber: lessonIndex + 1,
			totalLessons: courseLessons.length,
			instructor: course.instructor.name,
			duration: lesson.duration,
			description: loc(lesson.description),
			videoUrl,
			isDownloaded: localUri !== null,
			lastPosition: progress?.lastPosition ?? 0,
			nextLesson: next
				? {
						id: next.id,
						title: loc(next.title),
						duration: next.duration,
					}
				: undefined,
			previousLesson: prev ? { id: prev.id } : undefined,
		};
	}, [
		lessonId,
		courseId,
		courses,
		lessons,
		lessonProgress,
		getNextLesson,
		getPreviousLesson,
		getLocalUri,
		currentLanguage,
	]);

	return lessonData;
}
