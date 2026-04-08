import type React from "react";
import { Platform } from "react-native";
import { createContext, useCallback, useContext } from "react";
import { CopilotProvider } from "react-native-copilot";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors, spacing } from "@/design-system";

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

export function TourProvider({ children }: { children: React.ReactNode }) {
	const tourComplete = useOnboardingStore((s) => s.tourComplete);
	const tourPhase = useOnboardingStore((s) => s.tourPhase);
	const completeTour = useOnboardingStore((s) => s.completeTour);
	const setTourPhase = useOnboardingStore((s) => s.setTourPhase);
	const { t } = useLanguage();

	const isTourActive = tourPhase !== null;

	const startTour = useCallback(() => {
		setTourPhase("home");
	}, [setTourPhase]);

	const dismissTour = useCallback(async () => {
		await completeTour();
		setTourPhase(null);
	}, [completeTour, setTourPhase]);

	return (
		<TourContext.Provider value={{ startTour, dismissTour, isTourActive }}>
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
				{children}
			</CopilotProvider>
		</TourContext.Provider>
	);
}
