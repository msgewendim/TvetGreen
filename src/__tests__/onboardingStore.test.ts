import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingStore } from "@/src/store/onboardingStore";

// Reset store and AsyncStorage between tests
beforeEach(async () => {
	await AsyncStorage.clear();
	useOnboardingStore.setState({
		languageChosen: false,
		onboardingComplete: false,
		tourComplete: false,
		tourPhase: null,
	});
});

describe("OnboardingStore", () => {
	it("initializes with all flags false and tourPhase null", () => {
		const state = useOnboardingStore.getState();

		expect(state.languageChosen).toBe(false);
		expect(state.onboardingComplete).toBe(false);
		expect(state.tourComplete).toBe(false);
		expect(state.tourPhase).toBeNull();
	});

	it("markLanguageChosen sets flag and persists to AsyncStorage", async () => {
		await useOnboardingStore.getState().markLanguageChosen();

		expect(useOnboardingStore.getState().languageChosen).toBe(true);
		const stored = await AsyncStorage.getItem("@tvetgreen_language_chosen");
		expect(stored).toBe("true");
	});

	it("completeOnboarding sets flag and persists to AsyncStorage", async () => {
		await useOnboardingStore.getState().completeOnboarding();

		expect(useOnboardingStore.getState().onboardingComplete).toBe(true);
		const stored = await AsyncStorage.getItem("@onboarding_complete");
		expect(stored).toBe("true");
	});

	it("completeTour sets flag and persists to AsyncStorage", async () => {
		await useOnboardingStore.getState().completeTour();

		expect(useOnboardingStore.getState().tourComplete).toBe(true);
		const stored = await AsyncStorage.getItem("@tour_complete");
		expect(stored).toBe("true");
	});

	it("loadPersistedState restores onboarding and tour flags from AsyncStorage", async () => {
		// Simulate previously persisted state
		await AsyncStorage.setItem("@onboarding_complete", "true");
		await AsyncStorage.setItem("@tour_complete", "true");

		await useOnboardingStore.getState().loadPersistedState();

		expect(useOnboardingStore.getState().onboardingComplete).toBe(true);
		expect(useOnboardingStore.getState().tourComplete).toBe(true);
	});

	it("tourPhase is not persisted — resets to null after loadPersistedState", async () => {
		// Set tourPhase to something
		useOnboardingStore.getState().setTourPhase("courses");
		expect(useOnboardingStore.getState().tourPhase).toBe("courses");

		// Simulate app restart: reset in-memory state, then load persisted
		useOnboardingStore.setState({ tourPhase: null });
		await useOnboardingStore.getState().loadPersistedState();

		expect(useOnboardingStore.getState().tourPhase).toBeNull();
	});

	it("resetTour clears tourComplete flag and sets tourPhase to home", async () => {
		// Complete the tour first
		await useOnboardingStore.getState().completeTour();
		expect(useOnboardingStore.getState().tourComplete).toBe(true);

		// Reset for replay
		await useOnboardingStore.getState().resetTour();

		expect(useOnboardingStore.getState().tourComplete).toBe(false);
		expect(useOnboardingStore.getState().tourPhase).toBe("home");
		const stored = await AsyncStorage.getItem("@tour_complete");
		expect(stored).toBeNull();
	});
});
