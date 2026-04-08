import { useRouter } from "expo-router";
import { CircleCheck as CheckCircle } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "@/src/hooks/useLanguage";
import type { SupportedLanguage } from "@/i18n.config";
import { colors, spacing, typography } from "@/design-system";

export default function LanguageSelectionScreen() {
	const router = useRouter();
	const { currentLanguage, supportedLanguages, changeLanguage, t } =
		useLanguage();
	const [selectedLanguage, setSelectedLanguage] =
		useState<SupportedLanguage>(currentLanguage);

	const handleContinue = async () => {
		await changeLanguage(selectedLanguage);
		router.replace("/(auth)/phone" as never);
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{/* Globe icon area */}
				<View style={styles.iconContainer}>
					<Text style={styles.globeIcon}>🌍</Text>
				</View>

				{/* Language Options — self-labeling in own script */}
				<View style={styles.optionsContainer}>
					{supportedLanguages.map((language) => (
						<TouchableOpacity
							key={language.code}
							style={[
								styles.languageCard,
								selectedLanguage === language.code &&
									styles.languageCardSelected,
							]}
							onPress={() =>
								setSelectedLanguage(language.code as SupportedLanguage)
							}
							accessibilityLabel={`Select ${language.name}`}
							accessibilityRole="button"
							accessibilityState={{
								selected: selectedLanguage === language.code,
							}}
						>
							<View style={styles.languageRow}>
								<Text style={styles.flag}>{language.flag}</Text>
								<View style={styles.languageNames}>
									<Text
										style={[
											styles.nativeName,
											selectedLanguage === language.code &&
												styles.nativeNameSelected,
										]}
									>
										{language.nativeName}
									</Text>
									<Text style={styles.englishName}>{language.name}</Text>
								</View>
								{selectedLanguage === language.code && (
									<CheckCircle
										size={24}
										color={colors.primary.main}
										strokeWidth={2}
									/>
								)}
							</View>
						</TouchableOpacity>
					))}
				</View>

				{/* Change later note */}
				<Text style={styles.changeLaterNote}>
					{t("onboarding.language.changeLater")}
				</Text>
			</View>

			{/* Continue Button */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.continueButton}
					onPress={handleContinue}
					accessibilityLabel={t("common.continue")}
					accessibilityRole="button"
				>
					<Text style={styles.continueText}>{t("common.continue")}</Text>
				</TouchableOpacity>
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
		paddingTop: 80,
		alignItems: "center",
	},
	iconContainer: {
		marginBottom: spacing.xl,
	},
	globeIcon: {
		fontSize: 64,
	},
	optionsContainer: {
		width: "100%",
		gap: spacing.md,
		marginBottom: spacing.lg,
	},
	languageCard: {
		backgroundColor: colors.background.secondary,
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
	nativeName: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	nativeNameSelected: {
		color: colors.primary.main,
	},
	englishName: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
	changeLaterNote: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		textAlign: "center",
	},
	buttonContainer: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing["2xl"],
	},
	continueButton: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.main,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		minHeight: spacing.minTouchTarget,
	},
	continueText: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
	},
});
