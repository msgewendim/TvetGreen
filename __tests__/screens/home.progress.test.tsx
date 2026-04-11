import type React from "react";
import { render } from "@testing-library/react-native";

// Mock react-native-copilot
jest.mock("react-native-copilot", () => ({
	CopilotStep: ({ children }: { children: React.ReactNode }) => children,
	walkthroughable: (component: unknown) => component,
	useCopilot: () => ({ start: jest.fn(), stop: jest.fn() }),
}));

// Mock TourProvider
jest.mock("@/src/providers/tour/TourProvider", () => ({
	useTour: () => ({
		startTour: jest.fn(),
		dismissTour: jest.fn(),
		isTourActive: false,
	}),
}));

// Mock onboarding store
jest.mock("@/src/store/onboardingStore", () => ({
	useOnboardingStore: (selector: (state: Record<string, unknown>) => unknown) => {
		const state = { onboardingComplete: true, tourComplete: true, tourPhase: null };
		return selector(state);
	},
}));

// Mock safe area context
jest.mock("react-native-safe-area-context", () => {
	const React = require("react");
	const insets = { top: 0, bottom: 0, left: 0, right: 0 };
	return {
		useSafeAreaInsets: () => insets,
		SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
			React.createElement(React.Fragment, null, children),
	};
});

// Mock design system (tokens)
jest.mock("@/design-system", () => ({
	colors: {
		background: { primary: "#FEF9F1", secondary: "#FFFFFF", tertiary: "#F9FAFB" },
		text: { primary: "#1F2937", secondary: "#6B7280", tertiary: "#9CA3AF", inverse: "#FFF" },
		primary: { main: "#16A34A", surface: "#F0FDF4" },
		neutral: { 200: "#E5E7EB" },
	},
	spacing: {
		xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
		radius: { sm: 8, md: 12, lg: 16, xl: 24 },
	},
}));

// Mock ROUTES
jest.mock("@/src/utils/appRoutes", () => ({
	ROUTES: {
		VIDEO_PLAYER: (c: string, l: string) => `/video/${c}/${l}`,
		COURSE_DETAIL: (c: string) => `/course/${c}`,
	},
}));

// Mock expo-router
jest.mock("expo-router", () => ({
	useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

// Mock useLanguage
jest.mock("@/src/hooks/useLanguage", () => ({
	useLanguage: () => ({
		t: (key: string, params?: Record<string, unknown>) => {
			if (key === "learning.continueLearning") return "Continue Learning";
			if (key === "courses.title") return "Courses";
			if (key === "learning.lessons" && params) return `${params.count} lessons`;
			if (key === "learning.lessons_progress" && params)
				return `${params.completed} of ${params.total} lessons`;
			return key;
		},
		currentLanguage: "en",
	}),
}));

// Mock learningStore — mutable state for per-test control
const mockStoreState = jest.fn();
jest.mock("@/src/store/learningStore", () => ({
	useLearningStore: (selector: (state: Record<string, unknown>) => unknown) =>
		selector(mockStoreState()),
}));

// Mock Paper components
jest.mock("react-native-paper", () => {
	const React = require("react");
	const { Text: RNText, View, TouchableOpacity } = require("react-native");
	const CardContent = ({ children }: Record<string, unknown>) =>
		React.createElement(View, null, children);
	const CardComponent = ({ children, onPress, style }: Record<string, unknown>) =>
		React.createElement(TouchableOpacity, { onPress, style }, children);
	CardComponent.Content = CardContent;
	return {
		Text: ({ children, style, testID }: Record<string, unknown>) =>
			React.createElement(RNText, { style, testID }, children),
		Card: CardComponent,
		Divider: () => React.createElement(View, null),
		ProgressBar: ({ progress, testID }: Record<string, unknown>) =>
			React.createElement(View, { testID, accessibilityValue: { now: progress } }),
	};
});

const HomeScreen = require("../../app/(tabs)/(home)/index").default;

const baseCourses = [
	{
		id: "course-1",
		title: { en: "Digital Literacy", sw: "Ujuzi", am: "ዲጂታል" },
		description: { en: "Learn digital skills", sw: "", am: "" },
		thumbnail: "https://example.com/thumb.jpg",
		instructor: { name: "Sarah" },
		duration: 3600,
		lessonCount: 3,
		level: "beginner",
		categoryId: "digital",
	},
];

const baseLessons = [
	{ id: "l1", courseId: "course-1", order: 1, title: { en: "Lesson 1", sw: "", am: "" }, description: { en: "", sw: "", am: "" }, duration: 480, videoId: "abc" },
	{ id: "l2", courseId: "course-1", order: 2, title: { en: "Lesson 2", sw: "", am: "" }, description: { en: "", sw: "", am: "" }, duration: 540, videoId: "def" },
	{ id: "l3", courseId: "course-1", order: 3, title: { en: "Lesson 3", sw: "", am: "" }, description: { en: "", sw: "", am: "" }, duration: 600, videoId: "ghi" },
];

describe("HomeScreen progress features", () => {
	it("shows 'Continue Learning' card with lesson progress text when user has watch history", () => {
		mockStoreState.mockReturnValue({
			courses: baseCourses,
			lessons: baseLessons,
			lessonProgress: [
				{ lessonId: "l1", courseId: "course-1", completed: true, lastPosition: 480, lastWatchedAt: "2026-04-01T00:00:00Z" },
				{ lessonId: "l2", courseId: "course-1", completed: false, lastPosition: 200, lastWatchedAt: "2026-04-02T00:00:00Z" },
			],
			loadData: jest.fn(),
			getCourseProgress: () => 33,
		});

		const { toJSON } = render(<HomeScreen />);
		const tree = JSON.stringify(toJSON());

		expect(tree).toContain("Continue Learning");
		// Should show "1 of 3 lessons" for course progress
		expect(tree).toContain("1 of 3 lessons");
	});

	it("shows progress bar on course cards when course has been started", () => {
		mockStoreState.mockReturnValue({
			courses: baseCourses,
			lessons: baseLessons,
			lessonProgress: [
				{ lessonId: "l1", courseId: "course-1", completed: true, lastPosition: 480, lastWatchedAt: "2026-04-01T00:00:00Z" },
			],
			loadData: jest.fn(),
			getCourseProgress: () => 33,
		});

		const { toJSON } = render(<HomeScreen />);
		const tree = JSON.stringify(toJSON());

		// Should show "1 of 3 lessons" on the course card
		expect(tree).toContain("1 of 3 lessons");
	});
});
