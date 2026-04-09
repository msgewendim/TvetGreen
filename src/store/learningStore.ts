/**
 * Learning Platform Zustand Store (Simplified)
 *
 * Centralized state management for the learning platform.
 * Persists only lessonProgress to AsyncStorage.
 */

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
	LearningState,
	Course,
	Lesson,
	LessonProgress,
} from "@/src/types/learning";
import { STORAGE_KEYS } from "@/src/utils/storageKeys";
import { shouldAutoComplete } from "@/src/utils/progressUtils";

// Import static data
import coursesData from "@/src/data/courses/courses.json";
import lessonsData from "@/src/data/courses/lessons.json";

/**
 * Load persisted lesson progress from AsyncStorage
 */
const loadPersistedProgress = async (): Promise<LessonProgress[]> => {
	try {
		const json = await AsyncStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
		return json ? JSON.parse(json) : [];
	} catch (error) {
		console.error("Error loading persisted progress:", error);
		return [];
	}
};

/**
 * Save lesson progress to AsyncStorage
 */
const saveProgress = async (progress: LessonProgress[]): Promise<void> => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEYS.LESSON_PROGRESS,
			JSON.stringify(progress),
		);
	} catch (error) {
		console.error("Error saving progress:", error);
	}
};

/**
 * Learning Store
 */
export const useLearningStore = create<LearningState>((set, get) => ({
	// Initial state
	courses: [],
	lessons: [],
	lessonProgress: [],
	isLoading: false,
	error: null,

	/**
	 * Load static data and restore persisted progress
	 */
	loadData: async () => {
		set({ isLoading: true, error: null });

		try {
			const courses = coursesData.courses as Course[];
			const lessons = lessonsData.lessons as Lesson[];
			const lessonProgress = await loadPersistedProgress();

			set({
				courses,
				lessons,
				lessonProgress,
				isLoading: false,
			});
		} catch (error) {
			console.error("Error loading data:", error);
			set({
				error: error instanceof Error ? error.message : "Failed to load data",
				isLoading: false,
			});
		}
	},

	/**
	 * Update lesson progress (called during video playback)
	 */
	updateLessonProgress: async (
		lessonId: string,
		position: number,
		_duration: number,
	) => {
		const { lessonProgress, lessons } = get();
		const lesson = lessons.find((l) => l.id === lessonId);
		if (!lesson) return;

		const existing = lessonProgress.find((p) => p.lessonId === lessonId);
		const now = new Date().toISOString();
		const completed =
			existing?.completed || shouldAutoComplete(position, lesson.duration);

		let updatedProgress: LessonProgress[];

		if (existing) {
			updatedProgress = lessonProgress.map((p) =>
				p.lessonId === lessonId
					? { ...p, lastPosition: position, lastWatchedAt: now, completed }
					: p,
			);
		} else {
			const newEntry: LessonProgress = {
				lessonId,
				courseId: lesson.courseId,
				completed,
				lastPosition: position,
				lastWatchedAt: now,
			};
			updatedProgress = [...lessonProgress, newEntry];
		}

		set({ lessonProgress: updatedProgress });
		await saveProgress(updatedProgress);
	},

	/**
	 * Mark a lesson as completed
	 */
	markLessonComplete: async (lessonId: string) => {
		const { lessonProgress, lessons } = get();
		const lesson = lessons.find((l) => l.id === lessonId);
		if (!lesson) return;

		const existing = lessonProgress.find((p) => p.lessonId === lessonId);
		const now = new Date().toISOString();

		let updatedProgress: LessonProgress[];

		if (existing) {
			updatedProgress = lessonProgress.map((p) =>
				p.lessonId === lessonId
					? { ...p, completed: true, lastWatchedAt: now }
					: p,
			);
		} else {
			const newEntry: LessonProgress = {
				lessonId,
				courseId: lesson.courseId,
				completed: true,
				lastPosition: 0,
				lastWatchedAt: now,
			};
			updatedProgress = [...lessonProgress, newEntry];
		}

		set({ lessonProgress: updatedProgress });
		await saveProgress(updatedProgress);
	},

	/**
	 * Calculate course completion percentage
	 */
	getCourseProgress: (courseId: string): number => {
		const { lessons, lessonProgress } = get();
		const courseLessons = lessons.filter((l) => l.courseId === courseId);

		if (courseLessons.length === 0) return 0;

		const completedCount = courseLessons.filter((lesson) => {
			const progress = lessonProgress.find((p) => p.lessonId === lesson.id);
			return progress?.completed;
		}).length;

		return Math.round((completedCount / courseLessons.length) * 100);
	},

	/**
	 * Get the most recently watched lesson
	 */
	getLastWatchedLesson: (): Lesson | null => {
		const { lessonProgress, lessons } = get();

		if (lessonProgress.length === 0) return null;

		const sorted = [...lessonProgress].sort(
			(a, b) =>
				new Date(b.lastWatchedAt).getTime() -
				new Date(a.lastWatchedAt).getTime(),
		);

		const lastProgress = sorted[0];
		return lessons.find((l) => l.id === lastProgress.lessonId) ?? null;
	},

	/**
	 * Get the next lesson in a course by order
	 */
	getNextLesson: (courseId: string, currentOrder: number): Lesson | null => {
		const { lessons } = get();
		const courseLessons = lessons
			.filter((l) => l.courseId === courseId)
			.sort((a, b) => a.order - b.order);

		const nextLesson = courseLessons.find((l) => l.order > currentOrder);
		return nextLesson ?? null;
	},

	/**
	 * Get the previous lesson in a course by order
	 */
	getPreviousLesson: (
		courseId: string,
		currentOrder: number,
	): Lesson | null => {
		const { lessons } = get();
		const courseLessons = lessons
			.filter((l) => l.courseId === courseId)
			.sort((a, b) => b.order - a.order);

		const prevLesson = courseLessons.find((l) => l.order < currentOrder);
		return prevLesson ?? null;
	},

	/**
	 * Get all lessons for a course, sorted by order
	 */
	getLessonsForCourse: (courseId: string): Lesson[] => {
		const { lessons } = get();
		return lessons
			.filter((l) => l.courseId === courseId)
			.sort((a, b) => a.order - b.order);
	},
}));

/**
 * Initialize the learning store on app load
 */
export const initializeLearningStore = async () => {
	await useLearningStore.getState().loadData();
};
