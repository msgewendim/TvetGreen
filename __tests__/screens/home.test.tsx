import type React from "react";
import { render } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import HomeScreen from "../../app/(tabs)/index";

// Mock safe area context
jest.mock("react-native-safe-area-context", () => {
	const React = require("react");
	const insets = { top: 0, bottom: 0, left: 0, right: 0 };
	const frame = { x: 0, y: 0, width: 375, height: 812 };

	const InsetsContext = React.createContext(insets);
	const FrameContext = React.createContext(frame);

	return {
		SafeAreaInsetsContext: InsetsContext,
		SafeAreaFrameContext: FrameContext,
		useSafeAreaInsets: () => insets,
		useSafeAreaFrame: () => frame,
		SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
			React.createElement(
				FrameContext.Provider,
				{ value: frame },
				React.createElement(InsetsContext.Provider, { value: insets }, children),
			),
		SafeAreaConsumer: InsetsContext.Consumer,
		SafeAreaView: ({ children }: { children: React.ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		initialWindowMetrics: { frame, insets },
	};
});

// Mock the design-system tokens
jest.mock("@/design-system", () => ({
	colors: {
		background: { primary: "#FEF9F1", secondary: "#FFFFFF", tertiary: "#F9FAFB" },
		text: { primary: "#1F2937", secondary: "#6B7280", tertiary: "#9CA3AF", inverse: "#FFFFFF" },
		primary: { main: "#16A34A", surface: "#F0FDF4" },
		neutral: { 200: "#E5E7EB" },
	},
	spacing: {
		xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
		radius: { sm: 8, md: 12 },
	},
}));

// Mock the learning store with course data
jest.mock("@/src/store/learningStore", () => ({
	useLearningStore: (selector: (state: Record<string, unknown>) => unknown) => {
		const state = {
			courses: [
				{
					id: "course_1",
					title: "Organic Farming",
					description: "Learn sustainable farming techniques for better yield.",
					thumbnail: "https://example.com/thumb.jpg",
					categoryId: "agriculture",
					lessonCount: 6,
				},
				{
					id: "course_2",
					title: "Solar Energy Basics",
					description: "Introduction to solar panel installation and maintenance.",
					thumbnail: "https://example.com/thumb2.jpg",
					categoryId: "greenEnergy",
					lessonCount: 5,
				},
			],
			lessons: [
				{ id: "l1", courseId: "course_1", title: "Intro", duration: "10:00", order: 1 },
				{ id: "l2", courseId: "course_1", title: "Soil", duration: "12:00", order: 2 },
			],
			lessonProgress: [],
			loadData: jest.fn(),
		};
		return selector(state);
	},
}));

function renderWithPaper(ui: React.ReactElement) {
	return render(<PaperProvider>{ui}</PaperProvider>);
}

describe("HomeScreen", () => {
	it("renders without crashing", () => {
		renderWithPaper(<HomeScreen />);
	});

	it("displays app title", () => {
		const { toJSON } = renderWithPaper(<HomeScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("GreenSkills");
	});

	it("displays Courses section title", () => {
		const { toJSON } = renderWithPaper(<HomeScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("Courses");
	});

	it("displays course items from the store", () => {
		const { toJSON } = renderWithPaper(<HomeScreen />);
		const tree = JSON.stringify(toJSON());
		expect(tree).toContain("Organic Farming");
		expect(tree).toContain("Solar Energy Basics");
	});
});
