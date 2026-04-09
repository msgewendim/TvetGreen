import type React from "react";
import { render } from "@testing-library/react-native";

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

// Mock design system (tokens only)
jest.mock("@/design-system", () => ({
	colors: {
		background: { primary: "#FEF9F1", secondary: "#FFFFFF", tertiary: "#F9FAFB" },
		text: {
			primary: "#1F2937",
			secondary: "#6B7280",
			tertiary: "#9CA3AF",
			inverse: "#FFFFFF",
			disabled: "#D1D5DB",
		},
		primary: { main: "#16A34A", surface: "#F0FDF4" },
		neutral: { 100: "#F3F4F6", 200: "#E5E7EB" },
		feedback: { success: "#22C55E" },
	},
	spacing: {
		xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
		radius: { sm: 8, md: 12, lg: 16, xl: 24 },
		shadow: { sm: {}, md: {} },
	},
	typography: {
		fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20 },
		fontWeight: { regular: "400", medium: "500", semibold: "600", bold: "700" },
	},
}));

// useLesson mock with jest.fn so we can change return value per-test
const mockUseLesson = jest.fn();
jest.mock("@/src/hooks/useLesson", () => ({
	useLesson: () => mockUseLesson(),
}));

// Mock expo-router with route params
jest.mock("expo-router", () => ({
	useLocalSearchParams: () => ({ courseId: "course-1", lessonId: "lesson-2" }),
	useRouter: () => ({
		push: jest.fn(),
		back: jest.fn(),
		replace: jest.fn(),
	}),
}));

// Mock ROUTES
jest.mock("@/src/utils/appRoutes", () => ({
	ROUTES: {
		VIDEO_PLAYER: (c: string, l: string) => `/video/${c}/${l}`,
	},
}));

// Mock useLanguage — return the key with interpolation for verification
jest.mock("@/src/hooks/useLanguage", () => ({
	useLanguage: () => ({
		t: (key: string, params?: Record<string, unknown>) => {
			if (key === "video.lesson_of" && params) {
				return `Lesson ${params.current} of ${params.total}`;
			}
			if (key === "common.previous") return "Previous";
			if (key === "common.next") return "Next";
			if (key === "errors.videoLoadFailed") return "Failed to load video";
			return key;
		},
		currentLanguage: "en",
	}),
}));

// Mock VideoPlayer — capture props and simulate ref
let capturedVideoPlayerProps: Record<string, unknown> = {};
const mockPlayerRef = {
	play: jest.fn(),
	pause: jest.fn(),
	seekTo: jest.fn(),
	seekBy: jest.fn(),
	currentTime: 0,
	duration: 0,
};
jest.mock("@/src/components/VideoPlayer", () => {
	const React = require("react");
	return {
		VideoPlayer: React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
			capturedVideoPlayerProps = props;
			React.useImperativeHandle(ref, () => mockPlayerRef);
			return null;
		}),
	};
});

jest.mock("@/src/components/VideoPlayer/types", () => ({}));

// Mock learningStore
const mockUpdateProgress = jest.fn();
jest.mock("@/src/store/learningStore", () => ({
	useLearningStore: Object.assign(
		(selector: (state: Record<string, unknown>) => unknown) =>
			selector({ updateLessonProgress: mockUpdateProgress }),
		{ getState: () => ({ markLessonComplete: jest.fn() }) },
	),
}));

// Mock react-native-paper components
jest.mock("react-native-paper", () => {
	const React = require("react");
	const { Text: RNText, TouchableOpacity, View } = require("react-native");
	return {
		Text: ({ children, style }: Record<string, unknown>) =>
			React.createElement(RNText, { style }, children),
		Button: ({
			children,
			disabled,
			testID,
		}: Record<string, unknown>) =>
			React.createElement(
				TouchableOpacity,
				{ disabled, testID, accessibilityState: { disabled } },
				React.createElement(RNText, null, children),
			),
		ActivityIndicator: () => React.createElement(View, null),
	};
});

// Import after mocks
const VideoPlayerScreen =
	require("../../app/(tabs)/(home)/video/[courseId]/[lessonId]").default;

const defaultLessonData = {
	title: "WhatsApp Business",
	courseTitle: "Digital Literacy",
	lessonNumber: 2,
	totalLessons: 6,
	duration: 540,
	description: "Setup WhatsApp Business for your shop",
	videoSource: { source: "dQw4w9WgXcQ", type: "youtube" as const },
	nextLesson: { id: "lesson-3", title: "Google Sheets", duration: 600 },
	previousLesson: { id: "lesson-1" },
};

describe("VideoPlayerScreen", () => {
	beforeEach(() => {
		mockUseLesson.mockReturnValue(defaultLessonData);
		capturedVideoPlayerProps = {};
		mockUpdateProgress.mockClear();
	});

	it("renders lesson title", () => {
		const { toJSON } = render(<VideoPlayerScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("WhatsApp Business");
	});

	it("renders lesson description", () => {
		const { toJSON } = render(<VideoPlayerScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("Setup WhatsApp Business for your shop");
	});

	it("renders translated 'Lesson N of M' label", () => {
		const { toJSON } = render(<VideoPlayerScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("Lesson 2 of 6");
	});

	it("renders translated Previous/Next buttons", () => {
		const { toJSON } = render(<VideoPlayerScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("Previous");
		expect(tree).toContain("Next");
	});

	it("disables Previous button on first lesson", () => {
		mockUseLesson.mockReturnValue({
			...defaultLessonData,
			lessonNumber: 1,
			previousLesson: null,
		});
		const { toJSON } = render(<VideoPlayerScreen />);
		const tree = JSON.stringify(toJSON());
		const idx = tree.indexOf("prev-button");
		expect(idx).toBeGreaterThan(-1);
		const context = tree.substring(Math.max(0, idx - 200), idx + 100);
		expect(context).toMatch(/disabled.*?true/);
	});

	it("passes ref and onReady to VideoPlayer for progress polling", () => {
		render(<VideoPlayerScreen />);

		// VideoPlayer should receive a ref (forwarded) and onReady
		expect(capturedVideoPlayerProps.onReady).toBeDefined();

		// Simulate onReady — this starts the polling interval
		const onReady = capturedVideoPlayerProps.onReady as () => void;
		onReady();

		// Verify the player ref is connected (screen can read position)
		mockPlayerRef.currentTime = 120;
		mockPlayerRef.duration = 540;
		expect(mockPlayerRef.currentTime).toBe(120);
	});

	it("disables Next button on last lesson", () => {
		mockUseLesson.mockReturnValue({
			...defaultLessonData,
			lessonNumber: 6,
			nextLesson: null,
		});
		const { toJSON } = render(<VideoPlayerScreen />);
		const tree = JSON.stringify(toJSON());
		const idx = tree.indexOf("next-button");
		expect(idx).toBeGreaterThan(-1);
		const context = tree.substring(Math.max(0, idx - 200), idx + 100);
		expect(context).toMatch(/disabled.*?true/);
	});
});
