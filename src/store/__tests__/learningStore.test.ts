/**
 * Learning Store Tests (TDD - RED phase)
 *
 * Tests for the simplified learning store with:
 * - Data loading from JSON
 * - Lesson progress tracking
 * - Course progress calculation
 * - Lesson navigation (next/previous)
 */

import { useLearningStore } from "../learningStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/src/utils/storageKeys";

// Reset store between tests
beforeEach(() => {
	useLearningStore.setState({
		courses: [],
		lessons: [],
		lessonProgress: [],
		isLoading: false,
		error: null,
	});
	(AsyncStorage.clear as jest.Mock)();
});

describe("learningStore", () => {
	describe("loadData", () => {
		it("loads courses and lessons from JSON", async () => {
			const { loadData } = useLearningStore.getState();

			await loadData();

			const state = useLearningStore.getState();
			expect(state.courses.length).toBeGreaterThan(0);
			expect(state.lessons.length).toBeGreaterThan(0);
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
		});

		it("sets isLoading while loading", async () => {
			const { loadData } = useLearningStore.getState();

			const promise = loadData();
			// isLoading should be true during loading
			expect(useLearningStore.getState().isLoading).toBe(true);

			await promise;
			expect(useLearningStore.getState().isLoading).toBe(false);
		});

		it("restores persisted lesson progress from AsyncStorage", async () => {
			const mockProgress = [
				{
					lessonId: "lesson_1",
					courseId: "course_1",
					completed: false,
					lastPosition: 120,
					lastWatchedAt: "2026-01-01T00:00:00Z",
				},
			];
			(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
				JSON.stringify(mockProgress),
			);

			await useLearningStore.getState().loadData();

			const state = useLearningStore.getState();
			expect(state.lessonProgress).toEqual(mockProgress);
		});
	});

	describe("updateLessonProgress", () => {
		it("saves watch position for a lesson", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 120, 600);

			const progress = useLearningStore
				.getState()
				.lessonProgress.find((p) => p.lessonId === lesson.id);

			expect(progress).toBeDefined();
			expect(progress?.lastPosition).toBe(120);
			expect(progress?.courseId).toBe(lesson.courseId);
			expect(progress?.completed).toBe(false);
		});

		it("updates existing progress entry", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 120, 600);
			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 300, 600);

			const allProgress = useLearningStore
				.getState()
				.lessonProgress.filter((p) => p.lessonId === lesson.id);

			expect(allProgress.length).toBe(1);
			expect(allProgress[0].lastPosition).toBe(300);
		});

		it("persists progress to AsyncStorage", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 120, 600);

			expect(AsyncStorage.setItem).toHaveBeenCalledWith(
				STORAGE_KEYS.LESSON_PROGRESS,
				expect.any(String),
			);
		});

		it("auto-marks lesson complete when position reaches 90% of duration", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0]; // duration is 480

			// 90% of 480 = 432
			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 440, lesson.duration);

			const progress = useLearningStore
				.getState()
				.lessonProgress.find((p) => p.lessonId === lesson.id);

			expect(progress?.completed).toBe(true);
		});

		it("does NOT auto-complete when below 90%", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			// 80% of 480 = 384
			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 384, lesson.duration);

			const progress = useLearningStore
				.getState()
				.lessonProgress.find((p) => p.lessonId === lesson.id);

			expect(progress?.completed).toBe(false);
		});

		it("sets lastWatchedAt timestamp", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 120, 600);

			const progress = useLearningStore
				.getState()
				.lessonProgress.find((p) => p.lessonId === lesson.id);

			expect(progress?.lastWatchedAt).toBeDefined();
			expect(new Date(progress?.lastWatchedAt ?? "").getTime()).not.toBeNaN();
		});
	});

	describe("markLessonComplete", () => {
		it("marks a lesson as completed", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			await useLearningStore.getState().markLessonComplete(lesson.id);

			const progress = useLearningStore
				.getState()
				.lessonProgress.find((p) => p.lessonId === lesson.id);

			expect(progress).toBeDefined();
			expect(progress?.completed).toBe(true);
			expect(progress?.courseId).toBe(lesson.courseId);
		});

		it("updates existing progress to completed", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;
			const lesson = lessons[0];

			// First update progress
			await useLearningStore
				.getState()
				.updateLessonProgress(lesson.id, 120, 600);
			// Then mark complete
			await useLearningStore.getState().markLessonComplete(lesson.id);

			const allProgress = useLearningStore
				.getState()
				.lessonProgress.filter((p) => p.lessonId === lesson.id);

			expect(allProgress.length).toBe(1);
			expect(allProgress[0].completed).toBe(true);
			expect(allProgress[0].lastPosition).toBe(120); // preserves position
		});
	});

	describe("getCourseProgress", () => {
		it("returns 0 for a course with no completed lessons", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];

			const progress = useLearningStore.getState().getCourseProgress(course.id);
			expect(progress).toBe(0);
		});

		it("returns percentage based on completed lessons", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];
			const courseLessons = useLearningStore
				.getState()
				.lessons.filter((l) => l.courseId === course.id);

			// Complete first lesson
			await useLearningStore.getState().markLessonComplete(courseLessons[0].id);

			const progress = useLearningStore.getState().getCourseProgress(course.id);

			const expected = Math.round((1 / courseLessons.length) * 100);
			expect(progress).toBe(expected);
		});

		it("returns 100 when all lessons are completed", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];
			const courseLessons = useLearningStore
				.getState()
				.lessons.filter((l) => l.courseId === course.id);

			// Complete all lessons
			for (const lesson of courseLessons) {
				await useLearningStore.getState().markLessonComplete(lesson.id);
			}

			const progress = useLearningStore.getState().getCourseProgress(course.id);
			expect(progress).toBe(100);
		});

		it("returns 0 for a non-existent course", () => {
			const progress = useLearningStore
				.getState()
				.getCourseProgress("non_existent");
			expect(progress).toBe(0);
		});
	});

	describe("getLastWatchedLesson", () => {
		it("returns null when no lessons have been watched", async () => {
			await useLearningStore.getState().loadData();

			const result = useLearningStore.getState().getLastWatchedLesson();
			expect(result).toBeNull();
		});

		it("returns the most recently watched lesson", async () => {
			await useLearningStore.getState().loadData();

			const lessons = useLearningStore.getState().lessons;

			// Watch lesson 0 first, then lesson 1
			await useLearningStore
				.getState()
				.updateLessonProgress(lessons[0].id, 60, 600);

			// Small delay to ensure different timestamps
			await new Promise((r) => setTimeout(r, 10));

			await useLearningStore
				.getState()
				.updateLessonProgress(lessons[1].id, 30, 600);

			const lastWatched = useLearningStore.getState().getLastWatchedLesson();
			expect(lastWatched).toBeDefined();
			expect(lastWatched?.id).toBe(lessons[1].id);
		});
	});

	describe("getNextLesson", () => {
		it("returns the next lesson in sequence", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];
			const courseLessons = useLearningStore
				.getState()
				.getLessonsForCourse(course.id);

			const next = useLearningStore
				.getState()
				.getNextLesson(course.id, courseLessons[0].order);

			expect(next).toBeDefined();
			expect(next?.order).toBe(courseLessons[0].order + 1);
			expect(next?.courseId).toBe(course.id);
		});

		it("returns null for the last lesson", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];
			const courseLessons = useLearningStore
				.getState()
				.getLessonsForCourse(course.id);
			const lastLesson = courseLessons[courseLessons.length - 1];

			const next = useLearningStore
				.getState()
				.getNextLesson(course.id, lastLesson.order);
			expect(next).toBeNull();
		});
	});

	describe("getPreviousLesson", () => {
		it("returns the previous lesson in sequence", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];
			const courseLessons = useLearningStore
				.getState()
				.getLessonsForCourse(course.id);

			const prev = useLearningStore
				.getState()
				.getPreviousLesson(course.id, courseLessons[1].order);

			expect(prev).toBeDefined();
			expect(prev?.order).toBe(courseLessons[0].order);
			expect(prev?.courseId).toBe(course.id);
		});

		it("returns null for the first lesson", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];
			const courseLessons = useLearningStore
				.getState()
				.getLessonsForCourse(course.id);

			const prev = useLearningStore
				.getState()
				.getPreviousLesson(course.id, courseLessons[0].order);
			expect(prev).toBeNull();
		});
	});

	describe("getLessonsForCourse", () => {
		it("returns all lessons for a course sorted by order", async () => {
			await useLearningStore.getState().loadData();

			const courses = useLearningStore.getState().courses;
			const course = courses[0];

			const lessons = useLearningStore
				.getState()
				.getLessonsForCourse(course.id);

			expect(lessons.length).toBeGreaterThan(0);
			expect(lessons.every((l) => l.courseId === course.id)).toBe(true);

			// Check sorted by order
			for (let i = 1; i < lessons.length; i++) {
				expect(lessons[i].order).toBeGreaterThan(lessons[i - 1].order);
			}
		});

		it("returns empty array for non-existent course", () => {
			const lessons = useLearningStore
				.getState()
				.getLessonsForCourse("non_existent");
			expect(lessons).toEqual([]);
		});
	});
});
