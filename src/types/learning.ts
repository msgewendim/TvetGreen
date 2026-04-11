/**
 * Learning Platform Type Definitions (Simplified)
 *
 * Stripped-down types for the TvetGreen Learning Platform.
 * Supports multi-language titles/descriptions and flat lesson structure.
 */

/**
 * Multi-language text object
 */
export interface MultiLangText {
	en: string;
	sw: string;
	am: string;
}

/**
 * Course Instructor Information
 */
export interface Instructor {
	name: string;
	avatar?: string;
}

/**
 * Course Level
 */
export type CourseLevel = "beginner" | "intermediate" | "advanced";

/**
 * Course Information
 */
export interface Course {
	id: string;
	title: MultiLangText;
	description: MultiLangText;
	thumbnail: string;
	instructor: Instructor;
	duration: number; // total seconds
	lessonCount: number;
	level: CourseLevel;
	categoryId: string;
}

/**
 * Individual Lesson
 */
export interface Lesson {
	id: string;
	courseId: string;
	order: number;
	title: MultiLangText;
	description: MultiLangText;
	duration: number; // seconds
	videoId: string;
}

/**
 * Lesson Progress Tracking
 */
export interface LessonProgress {
	lessonId: string;
	courseId: string;
	completed: boolean;
	lastPosition: number; // seconds
	lastWatchedAt: string; // ISO date string
}

/**
 * Learning Store State
 */
export interface LearningState {
	// Static data
	courses: Course[];
	lessons: Lesson[];

	// User data (persisted)
	lessonProgress: LessonProgress[];

	// UI state
	isLoading: boolean;
	error: string | null;

	// Actions
	loadData: () => Promise<void>;
	updateLessonProgress: (
		lessonId: string,
		position: number,
		duration: number,
	) => Promise<void>;
	markLessonComplete: (lessonId: string) => Promise<void>;

	// Selectors
	getCourseProgress: (courseId: string) => number;
	getLastWatchedLesson: () => Lesson | null;
	getNextLesson: (courseId: string, currentOrder: number) => Lesson | null;
	getPreviousLesson: (courseId: string, currentOrder: number) => Lesson | null;
	getLessonsForCourse: (courseId: string) => Lesson[];
}
