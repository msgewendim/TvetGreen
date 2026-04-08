jest.mock("react-native-copilot", () => ({
	CopilotProvider: ({ children }: { children: React.ReactNode }) => children,
	CopilotStep: ({ children }: { children: React.ReactNode }) => children,
	walkthroughable: (component: unknown) => component,
	useCopilot: () => ({
		start: jest.fn(),
		stop: jest.fn(),
		currentStep: null,
		isStarted: false,
		goToNext: jest.fn(),
		goToPrevious: jest.fn(),
	}),
}));

import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { useTour, TourProvider } from "@/src/providers/tour/TourProvider";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

beforeEach(async () => {
	await AsyncStorage.clear();
	useOnboardingStore.setState({
		onboardingComplete: false,
		tourComplete: false,
		tourPhase: null,
	});
});

describe("TourProvider", () => {
	it("exports useTour hook with startTour, dismissTour, and isTourActive", () => {
		expect(useTour).toBeDefined();
		expect(typeof useTour).toBe("function");
	});

	it("dismissTour sets tourComplete=true in OnboardingStore", async () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<TourProvider>{children}</TourProvider>
		);

		const { result } = renderHook(() => useTour(), { wrapper });

		await act(async () => {
			await result.current.dismissTour();
		});

		expect(useOnboardingStore.getState().tourComplete).toBe(true);
		expect(useOnboardingStore.getState().tourPhase).toBeNull();
	});
});
