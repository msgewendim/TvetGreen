import React from "react";
import { render } from "@testing-library/react-native";
import OnboardingLayout from "@/app/onboarding/_layout";

// Mock Stack from expo-router
const mockScreens: string[] = [];
jest.mock("expo-router", () => ({
	Stack: Object.assign(
		({ children }: { children: React.ReactNode }) => <>{children}</>,
		{
			Screen: ({ name }: { name: string }) => {
				mockScreens.push(name);
				return null;
			},
		},
	),
}));

beforeEach(() => {
	mockScreens.length = 0;
});

describe("OnboardingLayout", () => {
	it("only declares screens that exist (no goals or voice-setup)", () => {
		render(<OnboardingLayout />);

		expect(mockScreens).toContain("welcome");
		expect(mockScreens).toContain("language");
		expect(mockScreens).toContain("complete");
		expect(mockScreens).not.toContain("goals");
		expect(mockScreens).not.toContain("voice-setup");
	});
});
