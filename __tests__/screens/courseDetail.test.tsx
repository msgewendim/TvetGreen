import type React from "react";
import { render } from "@testing-library/react-native";

jest.mock("react-native-safe-area-context", () => {
	const React = require("react");
	return {
		useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
		SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
			React.createElement(React.Fragment, null, children),
	};
});

jest.mock("@/design-system", () => ({
	colors: {
		background: { primary: "#FEF9F1", secondary: "#FFFFFF" },
		text: { primary: "#1F2937", secondary: "#6B7280", tertiary: "#9CA3AF", inverse: "#FFF" },
		primary: { main: "#16A34A", surface: "#F0FDF4" },
		neutral: { 200: "#E5E7EB" },
		feedback: { success: "#22C55E" },
	},
	spacing: {
		xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
		radius: { sm: 8, md: 12 },
	},
}));

jest.mock("@/src/utils/appRoutes", () => ({
	ROUTES: { VIDEO_PLAYER: (c: string, l: string) => `/video/${c}/${l}` },
}));

jest.mock("expo-router", () => ({
	useLocalSearchParams: () => ({ id: "course-1" }),
	useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@/src/hooks/useLanguage", () => ({
	useLanguage: () => ({
		t: (key: string, params?: Record<string, unknown>) => {
			if (key === "learning.startLearning") return "Start Learning";
			if (key === "learning.continueLearning") return "Continue Learning";
			if (key === "learning.curriculum") return "Curriculum";
			if (key === "learning.lessons" && params) return `${params.count} lessons`;
			if (key === "learning.lessons_progress" && params)
				return `${params.completed} of ${params.total} lessons`;
			if (key === "learning.errors.courseNotFound") return "Course not found";
			return key;
		},
		currentLanguage: "en",
	}),
}));

const mockStoreState = jest.fn();
jest.mock("@/src/store/learningStore", () => ({
	useLearningStore: (selector: (state: Record<string, unknown>) => unknown) =>
		selector(mockStoreState()),
}));

jest.mock("react-native-paper", () => {
	const React = require("react");
	const { Text: RNText, View, TouchableOpacity } = require("react-native");
	const ListItem = ({ title, description, left, right, onPress, testID }: Record<string, unknown>) =>
		React.createElement(
			TouchableOpacity,
			{ onPress, testID },
			left ? (left as () => React.ReactNode)() : null,
			React.createElement(RNText, null, title),
			description ? React.createElement(RNText, null, description) : null,
			right ? (right as () => React.ReactNode)() : null,
		);
	return {
		Text: ({ children, style }: Record<string, unknown>) =>
			React.createElement(RNText, { style }, children),
		Button: ({ children, onPress, testID }: Record<string, unknown>) =>
			React.createElement(TouchableOpacity, { onPress, testID },
				React.createElement(RNText, null, children)),
		Divider: () => React.createElement(View, null),
		Icon: ({ source, testID }: Record<string, unknown>) =>
			React.createElement(View, { testID, "data-icon": source }),
		List: { Item: ListItem },
	};
});

const CourseDetailScreen = require("../../app/(tabs)/(home)/course/[id]").default;

const baseCourse = {
	id: "course-1",
	title: { en: "Digital Literacy", sw: "", am: "" },
	description: { en: "Learn digital skills", sw: "", am: "" },
	thumbnail: "https://example.com/thumb.jpg",
	instructor: { name: "Sarah" },
	duration: 3600,
	lessonCount: 3,
	level: "beginner",
	categoryId: "digital",
};

const baseLessons = [
	{ id: "l1", courseId: "course-1", order: 1, title: { en: "Lesson 1", sw: "", am: "" }, description: { en: "", sw: "", am: "" }, duration: 480, videoId: "abc" },
	{ id: "l2", courseId: "course-1", order: 2, title: { en: "Lesson 2", sw: "", am: "" }, description: { en: "", sw: "", am: "" }, duration: 540, videoId: "def" },
	{ id: "l3", courseId: "course-1", order: 3, title: { en: "Lesson 3", sw: "", am: "" }, description: { en: "", sw: "", am: "" }, duration: 600, videoId: "ghi" },
];

describe("CourseDetailScreen progress features", () => {
	it("shows checkmark indicator on completed lessons", () => {
		mockStoreState.mockReturnValue({
			courses: [baseCourse],
			getLessonsForCourse: () => baseLessons,
			lessonProgress: [
				{ lessonId: "l1", courseId: "course-1", completed: true, lastPosition: 480, lastWatchedAt: "2026-04-01" },
			],
		});

		const { toJSON } = render(<CourseDetailScreen />);
		const tree = JSON.stringify(toJSON());

		// Completed lesson should have a checkmark indicator (testID or icon)
		expect(tree).toContain("lesson-complete-l1");
	});

	it("does NOT show checkmark on incomplete lessons", () => {
		mockStoreState.mockReturnValue({
			courses: [baseCourse],
			getLessonsForCourse: () => baseLessons,
			lessonProgress: [
				{ lessonId: "l1", courseId: "course-1", completed: true, lastPosition: 480, lastWatchedAt: "2026-04-01" },
			],
		});

		const { toJSON } = render(<CourseDetailScreen />);
		const tree = JSON.stringify(toJSON());

		expect(tree).not.toContain("lesson-complete-l2");
		expect(tree).not.toContain("lesson-complete-l3");
	});

	it("shows 'Continue Learning' button when course is in progress", () => {
		mockStoreState.mockReturnValue({
			courses: [baseCourse],
			getLessonsForCourse: () => baseLessons,
			lessonProgress: [
				{ lessonId: "l1", courseId: "course-1", completed: true, lastPosition: 480, lastWatchedAt: "2026-04-01" },
			],
		});

		const { toJSON } = render(<CourseDetailScreen />);
		const tree = JSON.stringify(toJSON());

		expect(tree).toContain("Continue Learning");
		expect(tree).not.toContain("Start Learning");
	});

	it("shows 'Start Learning' button when course is not started", () => {
		mockStoreState.mockReturnValue({
			courses: [baseCourse],
			getLessonsForCourse: () => baseLessons,
			lessonProgress: [],
		});

		const { toJSON } = render(<CourseDetailScreen />);
		const tree = JSON.stringify(toJSON());

		expect(tree).toContain("Start Learning");
	});
});
