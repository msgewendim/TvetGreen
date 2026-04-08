import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TourPhase =
	| "home"
	| "courses"
	| "course-detail"
	| "complete"
	| null;

const ONBOARDING_COMPLETE_KEY = "@onboarding_complete";
const TOUR_COMPLETE_KEY = "@tour_complete";

interface OnboardingState {
	onboardingComplete: boolean;
	tourComplete: boolean;
	tourPhase: TourPhase;

	completeOnboarding: () => Promise<void>;
	completeTour: () => Promise<void>;
	setTourPhase: (phase: TourPhase) => void;
	resetTour: () => Promise<void>;
	loadPersistedState: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
	onboardingComplete: false,
	tourComplete: false,
	tourPhase: null,

	completeOnboarding: async () => {
		set({ onboardingComplete: true });
		await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
	},

	completeTour: async () => {
		set({ tourComplete: true });
		await AsyncStorage.setItem(TOUR_COMPLETE_KEY, "true");
	},
	setTourPhase: (phase: TourPhase) => {
		set({ tourPhase: phase });
	},
	resetTour: async () => {
		set({ tourComplete: false, tourPhase: "home" });
		await AsyncStorage.removeItem(TOUR_COMPLETE_KEY);
	},
	loadPersistedState: async () => {
		const [onboardingValue, tourValue] = await Promise.all([
			AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY),
			AsyncStorage.getItem(TOUR_COMPLETE_KEY),
		]);
		set({
			onboardingComplete: onboardingValue === "true",
			tourComplete: tourValue === "true",
		});
	},
}));
