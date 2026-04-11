import { useRouter } from "expo-router";
import { ROUTES } from "@/src/utils/appRoutes";
import { StyleSheet, View } from "react-native";
import {
	Button,
	RadioButton,
	Surface,
	Text,
	TouchableRipple,
} from "react-native-paper";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import type { SupportedLanguage } from "@/i18n.config";
import { colors, spacing } from "@/design-system";

export default function LanguageSelectionScreen() {
	const router = useRouter();
	const { currentLanguage, supportedLanguages, changeLanguage, t } =
		useLanguage();
	const markLanguageChosen = useOnboardingStore((s) => s.markLanguageChosen);

	const handleSelectLanguage = async (code: SupportedLanguage) => {
		await changeLanguage(code);
	};

	const handleContinue = async () => {
		await markLanguageChosen();
		router.replace(ROUTES.AUTH_PHONE as never);
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text variant="displayLarge" style={styles.globeIcon}>
					🌍
				</Text>

				{/* Language Options — self-labeling in own script */}
				<View style={styles.optionsContainer}>
					{supportedLanguages.map((language) => {
						const isSelected = currentLanguage === language.code;
						return (
							<TouchableRipple
								key={language.code}
								onPress={() =>
									handleSelectLanguage(language.code as SupportedLanguage)
								}
								accessibilityLabel={`Select ${language.name}`}
								accessibilityRole="button"
								accessibilityState={{ selected: isSelected }}
								borderless
								style={styles.ripple}
							>
								<Surface
									style={[
										styles.languageCard,
										isSelected && styles.languageCardSelected,
									]}
									elevation={isSelected ? 2 : 1}
								>
									<View style={styles.languageRow}>
										<Text style={styles.flag}>{language.flag}</Text>
										<View style={styles.languageNames}>
											<Text
												variant="titleMedium"
												style={
													isSelected ? styles.nativeNameSelected : undefined
												}
											>
												{language.nativeName}
											</Text>
											<Text variant="bodySmall" style={styles.englishName}>
												{language.name}
											</Text>
										</View>
										<RadioButton
											value={language.code}
											status={isSelected ? "checked" : "unchecked"}
											onPress={() =>
												handleSelectLanguage(language.code as SupportedLanguage)
											}
											color={colors.primary.main}
										/>
									</View>
								</Surface>
							</TouchableRipple>
						);
					})}
				</View>

				<Text variant="bodySmall" style={styles.changeLaterNote}>
					{t("onboarding.language.changeLater")}
				</Text>
			</View>

			{/* Continue Button */}
			<View style={styles.buttonContainer}>
				<Button
					mode="contained"
					onPress={handleContinue}
					buttonColor={colors.primary.main}
					textColor={colors.text.inverse}
					contentStyle={styles.continueContent}
					labelStyle={styles.continueLabel}
					accessibilityLabel={t("common.continue")}
				>
					{t("common.continue")}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.lg,
		justifyContent: "center",
		alignItems: "center",
	},
	globeIcon: {
		fontSize: 64,
		marginBottom: spacing.xl,
	},
	optionsContainer: {
		width: "100%",
		gap: spacing.md,
		marginBottom: spacing.lg,
	},
	ripple: {
		borderRadius: spacing.radius.md,
	},
	languageCard: {
		borderRadius: spacing.radius.md,
		padding: spacing.lg,
		borderWidth: 2,
		borderColor: colors.border.light,
	},
	languageCardSelected: {
		borderColor: colors.primary.main,
		backgroundColor: colors.primary.surface,
	},
	languageRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	flag: {
		fontSize: 32,
		marginRight: spacing.md,
	},
	languageNames: {
		flex: 1,
	},
	nativeNameSelected: {
		color: colors.primary.main,
	},
	englishName: {
		color: colors.text.secondary,
	},
	changeLaterNote: {
		color: colors.text.secondary,
		textAlign: "center",
	},
	buttonContainer: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing["2xl"],
	},
	continueContent: {
		height: spacing.minTouchTarget,
	},
	continueLabel: {
		fontSize: 16,
		fontWeight: "700",
	},
});
