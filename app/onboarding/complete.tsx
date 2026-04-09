import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { ROUTES } from "@/src/utils/appRoutes";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { colors, spacing } from "@/design-system";

const AUTO_TRANSITION_MS = 2000;

export default function CompleteScreen() {
	const router = useRouter();
	const { t } = useLanguage();
	const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

	useEffect(() => {
		const timer = setTimeout(async () => {
			await completeOnboarding();
			router.replace(ROUTES.TABS as never);
		}, AUTO_TRANSITION_MS);

		return () => clearTimeout(timer);
	}, [completeOnboarding, router]);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.checkmark}>✅</Text>
				<Text variant="displayMedium" style={styles.title}>
					{t("onboarding.complete.title")}
				</Text>
				<Text variant="bodyLarge" style={styles.subtitle}>
					{t("onboarding.complete.subtitle")}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary.main,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
		paddingHorizontal: spacing.xl,
	},
	checkmark: {
		fontSize: 80,
		marginBottom: spacing.xl,
	},
	title: {
		color: colors.text.inverse,
		textAlign: "center",
		marginBottom: spacing.md,
	},
	subtitle: {
		color: colors.text.inverse,
		textAlign: "center",
		opacity: 0.9,
	},
});
