import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import { useDownloadStore } from "@/src/store/downloadStore";

const SAMPLE_VIDEO_URLS = [
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

interface LessonData {
	title: string;
	courseTitle: string;
	lessonNumber: number;
	totalLessons: number;
	instructor: string;
	duration: string;
	description: string;
	videoUrl: string;
	isDownloaded: boolean;
	lastPosition: number;
	nextLesson?: {
		id: string;
		title: string;
		duration: string;
	};
}

export function useLesson(): LessonData {
	const { courseId, lessonId } = useLocalSearchParams<{
		courseId: string;
		lessonId: string;
	}>();

	const getLessonById = useLearningStore((s) => s.getLessonById);
	const getCourseById = useLearningStore((s) => s.getCourseById);
	const getNextLesson = useLearningStore((s) => s.getNextLesson);
	const getLessonProgress = useLearningStore((s) => s.getLessonProgress);
	const lessons = useLearningStore((s) => s.lessons);
	const getLocalUri = useDownloadStore((s) => s.getLocalUri);

	const lessonData = useMemo<LessonData>(() => {
		const lesson = lessonId ? getLessonById(lessonId) : undefined;
		const course = courseId
			? getCourseById(courseId)
			: lesson
				? getCourseById(lesson.courseId)
				: undefined;

		if (!lesson || !course) {
			return {
				title: "Lesson Not Found",
				courseTitle: "",
				lessonNumber: 0,
				totalLessons: 0,
				instructor: "",
				duration: "0:00",
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
		const next = getNextLesson(lesson.id);
		const progress = getLessonProgress(lesson.id);

		// Priority: local download > YouTube URL (if videoId) > sample MP4
		const localUri = getLocalUri(lesson.id);
		let videoUrl: string;
		if (localUri) {
			videoUrl = localUri;
		} else if (lesson.videoId) {
			videoUrl = lesson.videoId;
		} else {
			videoUrl = SAMPLE_VIDEO_URLS[lessonIndex % SAMPLE_VIDEO_URLS.length];
		}

		return {
			title: lesson.title,
			courseTitle: course.title,
			lessonNumber: lessonIndex + 1,
			totalLessons: courseLessons.length,
			instructor: course.instructor.name,
			duration: lesson.duration,
			description: lesson.description || "",
			videoUrl,
			isDownloaded: localUri !== null,
			lastPosition: progress?.lastPosition ?? 0,
			nextLesson: next
				? {
						id: next.id,
						title: next.title,
						duration: next.duration,
					}
				: undefined,
		};
	}, [
		lessonId,
		courseId,
		getLessonById,
		getCourseById,
		getNextLesson,
		getLessonProgress,
		lessons,
		getLocalUri,
	]);

	return lessonData;
}
