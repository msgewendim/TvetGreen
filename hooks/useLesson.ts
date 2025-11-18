import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";

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
	nextLesson?: {
		id: number;
		title: string;
		duration: string;
	};
}

export function useLesson(): LessonData {
	const { lessonId } = useLocalSearchParams();

	// Mock lesson data - in real app, this would fetch from API
	const lessonData = useMemo<LessonData>(() => {
		return {
			title: "Soil Preparation Techniques",
			courseTitle: "Sustainable Agriculture Basics",
			lessonNumber: Number.parseInt(lessonId as string, 10) || 8,
			totalLessons: 12,
			instructor: "Dr. Amara Ketema",
			duration: "12 min",
			description:
				"Learn the essential techniques for preparing soil for optimal crop growth.",
			videoUrl:
				"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			isDownloaded: true,
			nextLesson: {
				id: Number.parseInt(lessonId as string, 10) + 1 || 9,
				title: "Composting Methods",
				duration: "15 min",
			},
		};
	}, [lessonId]);

	return lessonData;
}
