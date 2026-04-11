import { renderHook } from "@testing-library/react-native";
import { useLesson } from "@/src/hooks/useLesson";

// Mock expo-router to provide route params
const mockParams: Record<string, string> = {};
jest.mock("expo-router", () => ({
	useLocalSearchParams: () => mockParams,
	useRouter: () => ({
		push: jest.fn(),
		back: jest.fn(),
		replace: jest.fn(),
	}),
}));

// Mock useLanguage to return English
jest.mock("@/src/hooks/useLanguage", () => ({
	useLanguage: () => ({ currentLanguage: "en", t: (k: string) => k }),
}));

// Mock learningStore with real-ish data
const mockLearningState = {
	courses: [
		{
			id: "course-1",
			title: { en: "Digital Literacy", sw: "Ujuzi", am: "ዲጂታል" },
			description: { en: "Learn digital skills", sw: "", am: "" },
			thumbnail: "",
			instructor: { name: "Sarah Nakamya" },
			duration: 3600,
			lessonCount: 3,
			level: "beginner" as const,
			categoryId: "digital-literacy",
		},
	],
	lessons: [
		{
			id: "lesson-1",
			courseId: "course-1",
			order: 1,
			title: { en: "Smartphone Basics", sw: "Simu", am: "ስማርትፎን" },
			description: { en: "Learn basics", sw: "", am: "" },
			duration: 480,
			videoId: "dQw4w9WgXcQ",
		},
		{
			id: "lesson-2",
			courseId: "course-1",
			order: 2,
			title: { en: "WhatsApp Business", sw: "WhatsApp", am: "WhatsApp" },
			description: { en: "Setup WhatsApp", sw: "", am: "" },
			duration: 540,
			videoId: "https://example.com/lesson2.mp4",
		},
		{
			id: "lesson-3",
			courseId: "course-1",
			order: 3,
			title: { en: "Google Sheets", sw: "Sheets", am: "Sheets" },
			description: { en: "Create spreadsheets", sw: "", am: "" },
			duration: 600,
			videoId: "ZbZSe6N_BXs",
		},
	],
	lessonProgress: [],
	getNextLesson: (courseId: string, currentOrder: number) => {
		const lessons = mockLearningState.lessons
			.filter((l) => l.courseId === courseId)
			.sort((a, b) => a.order - b.order);
		return lessons.find((l) => l.order > currentOrder) ?? null;
	},
	getPreviousLesson: (courseId: string, currentOrder: number) => {
		const lessons = mockLearningState.lessons
			.filter((l) => l.courseId === courseId)
			.sort((a, b) => b.order - a.order);
		return lessons.find((l) => l.order < currentOrder) ?? null;
	},
};

jest.mock("@/src/store/learningStore", () => ({
	useLearningStore: (selector: (state: typeof mockLearningState) => unknown) =>
		selector(mockLearningState),
}));

// Mock downloadStore
jest.mock("@/src/store/downloadStore", () => ({
	useDownloadStore: (selector: (state: Record<string, unknown>) => unknown) =>
		selector({ getLocalUri: () => null }),
}));

describe("useLesson", () => {
	beforeEach(() => {
		mockParams.courseId = "course-1";
		mockParams.lessonId = "lesson-2";
	});

	it("returns correct lesson data for a middle lesson", () => {
		const { result } = renderHook(() => useLesson());

		expect(result.current.title).toBe("WhatsApp Business");
		expect(result.current.courseTitle).toBe("Digital Literacy");
		expect(result.current.lessonNumber).toBe(2);
		expect(result.current.totalLessons).toBe(3);
		expect(result.current.duration).toBe(540);
		expect(result.current.description).toBe("Setup WhatsApp");
		expect(result.current.videoSource).toEqual({
			source: "https://example.com/lesson2.mp4",
			type: "url",
		});
	});

	it("returns previousLesson=null for the first lesson", () => {
		mockParams.lessonId = "lesson-1";
		const { result } = renderHook(() => useLesson());

		expect(result.current.lessonNumber).toBe(1);
		expect(result.current.previousLesson).toBeNull();
		expect(result.current.nextLesson).not.toBeNull();
	});

	it("returns nextLesson=null for the last lesson", () => {
		mockParams.lessonId = "lesson-3";
		const { result } = renderHook(() => useLesson());

		expect(result.current.lessonNumber).toBe(3);
		expect(result.current.nextLesson).toBeNull();
		expect(result.current.previousLesson).not.toBeNull();
	});

	it("returns error state for non-existent lesson", () => {
		mockParams.lessonId = "non-existent";
		const { result } = renderHook(() => useLesson());

		expect(result.current.title).toBe("Lesson Not Found");
		expect(result.current.videoSource.source).toBe("");
		expect(result.current.nextLesson).toBeNull();
		expect(result.current.previousLesson).toBeNull();
	});
});
