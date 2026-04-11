import type React from "react";
import { Platform } from "react-native";
import { createContext, useCallback, useContext, useEffect } from "react";
import { CopilotProvider, useCopilot } from "react-native-copilot";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import { spacing } from "@/design-system";

interface TourContextValue {
	startTour: () => void;
	dismissTour: () => void;
	isTourActive: boolean;
}

const TourContext = createContext<TourContextValue>({
	startTour: () => {},
	dismissTour: () => {},
	isTourActive: false,
});

export function useTour() {
	return useContext(TourContext);
}

/**
 * Inner component that lives inside CopilotProvider so it can
 * access useCopilot() and wire copilotEvents to our tour state.
 */
function TourEventBridge({ children }: { children: React.ReactNode }) {
	const { copilotEvents, start, stop } = useCopilot();
	const completeTour = useOnboardingStore((s) => s.completeTour);
	const setTourPhase = useOnboardingStore((s) => s.setTourPhase);
	const tourPhase = useOnboardingStore((s) => s.tourPhase);

	const isTourActive = tourPhase !== null;

	const startTour = useCallback(() => {
		setTourPhase("home");
		start();
	}, [setTourPhase, start]);

	const dismissTour = useCallback(async () => {
		await stop();
		await completeTour();
		setTourPhase(null);
	}, [stop, completeTour, setTourPhase]);

	// Listen for copilot's own stop event (finish button, skip, outside click)
	useEffect(() => {
		const handleStop = async () => {
			await completeTour();
			setTourPhase(null);
		};
		copilotEvents.on("stop", handleStop);
		return () => {
			copilotEvents.off("stop", handleStop);
		};
	}, [copilotEvents, completeTour, setTourPhase]);

	return (
		<TourContext.Provider value={{ startTour, dismissTour, isTourActive }}>
			{children}
		</TourContext.Provider>
	);
}

export function TourProvider({ children }: { children: React.ReactNode }) {
	const { t } = useLanguage();

	return (
		<CopilotProvider
			overlay={Platform.OS === "web" ? "view" : "svg"}
			animated
			backdropColor="rgba(0, 0, 0, 0.7)"
			tooltipStyle={{
				borderRadius: spacing.radius.md,
				paddingHorizontal: spacing.lg,
				paddingVertical: spacing.md,
			}}
			arrowColor="transparent"
			stopOnOutsideClick
			labels={{
				previous: t("common.back"),
				next: t("common.next"),
				skip: t("onboarding.skip"),
				finish: t("common.done"),
			}}
		>
			<TourEventBridge>{children}</TourEventBridge>
		</CopilotProvider>
	);
}
