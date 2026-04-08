import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TourPhase =
	| "home"
	| "courses"
	| "course-detail"
	| "complete"
	| null;

const LANGUAGE_CHOSEN_KEY = "@tvetgreen_language_chosen";
const ONBOARDING_COMPLETE_KEY = "@onboarding_complete";
const TOUR_COMPLETE_KEY = "@tour_complete";

interface OnboardingState {
	languageChosen: boolean;
	onboardingComplete: boolean;
	tourComplete: boolean;
	tourPhase: TourPhase;

	markLanguageChosen: () => Promise<void>;
	completeOnboarding: () => Promise<void>;
	completeTour: () => Promise<void>;
	setTourPhase: (phase: TourPhase) => void;
	resetTour: () => Promise<void>;
	loadPersistedState: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
	languageChosen: false,
	onboardingComplete: false,
	tourComplete: false,
	tourPhase: null,

	markLanguageChosen: async () => {
		set({ languageChosen: true });
		await AsyncStorage.setItem(LANGUAGE_CHOSEN_KEY, "true");
	},

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
		const [languageValue, onboardingValue, tourValue] = await Promise.all([
			AsyncStorage.getItem(LANGUAGE_CHOSEN_KEY),
			AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY),
			AsyncStorage.getItem(TOUR_COMPLETE_KEY),
		]);
		set({
			languageChosen: languageValue === "true",
			onboardingComplete: onboardingValue === "true",
			tourComplete: tourValue === "true",
		});
	},
}));
