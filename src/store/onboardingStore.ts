import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/src/utils/storageKeys";

export type TourPhase =
	| "home"
	| "courses"
	| "course-detail"
	| "complete"
	| null;

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
		await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_CHOSEN, "true");
	},

	completeOnboarding: async () => {
		set({ onboardingComplete: true });
		await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
	},

	completeTour: async () => {
		set({ tourComplete: true });
		await AsyncStorage.setItem(STORAGE_KEYS.TOUR_COMPLETE, "true");
	},
	setTourPhase: (phase: TourPhase) => {
		set({ tourPhase: phase });
	},
	resetTour: async () => {
		set({ tourComplete: false, tourPhase: "home" });
		await AsyncStorage.removeItem(STORAGE_KEYS.TOUR_COMPLETE);
	},
	loadPersistedState: async () => {
		const [languageValue, onboardingValue, tourValue] = await Promise.all([
			AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_CHOSEN),
			AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE),
			AsyncStorage.getItem(STORAGE_KEYS.TOUR_COMPLETE),
		]);
		set({
			languageChosen: languageValue === "true",
			onboardingComplete: onboardingValue === "true",
			tourComplete: tourValue === "true",
		});
	},
}));
