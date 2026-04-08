import { useRouter } from "expo-router";
import {
	ArrowLeft,
	CircleCheck as CheckCircle,
	ChevronRight,
	Volume2,
} from "lucide-react-native";
import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useLanguage } from "@/src/hooks/useLanguage";
import type { SupportedLanguage } from "@/i18n.config";
import { colors, spacing, typography } from "@/design-system";

export default function LanguageSelectionScreen() {
	const router = useRouter();
	const { t, currentLanguage, supportedLanguages, changeLanguage } =
		useLanguage();
	const [selectedLanguage, setSelectedLanguage] =
		useState<SupportedLanguage>(currentLanguage);

	const languages = supportedLanguages.map((lang) => ({
		...lang,
		voiceSupport: true, // All our supported languages have voice support
		description:
			lang.code === "en"
				? "International language"
				: lang.code === "sw"
					? "East African lingua franca"
					: "Ethiopia's official language",
	}));

	const handleContinue = async () => {
		// Save language preference
		await changeLanguage(selectedLanguage);
		router.replace("/(tabs)");
	};

	const testVoice = (languageCode: string) => {
		// Mock voice test
		console.log("Testing voice for:", languageCode);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<ArrowLeft size={24} color={colors.text.primary} strokeWidth={2} />
				</TouchableOpacity>

				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>
						{t("onboarding.selectLanguage")}
					</Text>
					<Text style={styles.headerSubtitle}>
						{t("profile.selectLanguage")}
					</Text>
				</View>
			</View>

			{/* Progress Indicator */}
			<View style={styles.progressContainer}>
				<View style={styles.progressBar}>
					<View style={[styles.progressFill, { width: "25%" }]} />
				</View>
				<Text style={styles.progressText}>Step 1 of 4</Text>
			</View>

			{/* Language Options */}
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<Text style={styles.sectionTitle}>{t("courses.allCourses")}</Text>

				{languages.map((language) => (
					<TouchableOpacity
						key={language.code}
						style={[
							styles.languageCard,
							selectedLanguage === language.code && styles.languageCardSelected,
						]}
						onPress={() =>
							setSelectedLanguage(language.code as SupportedLanguage)
						}
					>
						<View style={styles.languageInfo}>
							<View style={styles.languageHeader}>
								<Text style={styles.languageFlag}>{language.flag}</Text>
								<View style={styles.languageNames}>
									<Text
										style={[
											styles.languageName,
											selectedLanguage === language.code &&
											styles.languageNameSelected,
										]}
									>
										{language.name}
									</Text>
									<Text
										style={[
											styles.languageNative,
											selectedLanguage === language.code &&
											styles.languageNativeSelected,
										]}
									>
										{language.nativeName}
									</Text>
								</View>

								{selectedLanguage === language.code && (
									<CheckCircle size={24} color={colors.primary.main} strokeWidth={2} />
								)}
							</View>

							<Text
								style={[
									styles.languageDescription,
									selectedLanguage === language.code &&
									styles.languageDescriptionSelected,
								]}
							>
								{language.description}
							</Text>

							<View style={styles.languageFeatures}>
								<View
									style={[
										styles.featureBadge,
										language.voiceSupport
											? styles.featureBadgeActive
											: styles.featureBadgeInactive,
									]}
								>
									<Volume2
										size={14}
										color={language.voiceSupport ? colors.feedback.success : colors.text.disabled}
										strokeWidth={2}
									/>
									<Text
										style={[
											styles.featureText,
											language.voiceSupport
												? styles.featureTextActive
												: styles.featureTextInactive,
										]}
									>
										{t("profile.voiceGuide")}
									</Text>
								</View>

								{language.voiceSupport && (
									<TouchableOpacity
										style={styles.testVoiceButton}
										onPress={() => testVoice(language.code)}
									>
										<Text style={styles.testVoiceText}>
											{t("voice.tapToSpeak")}
										</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</TouchableOpacity>
				))}

				{/* Language Note */}
				<View style={styles.noteContainer}>
					<Text style={styles.noteTitle}>📝 Note</Text>
					<Text style={styles.noteText}>
						You can change your language preference anytime in settings. Voice
						support helps with hands-free navigation and is especially useful
						for learners who prefer audio guidance.
					</Text>
				</View>
			</ScrollView>

			{/* Continue Button */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.continueButton}
					onPress={handleContinue}
				>
					<Text style={styles.continueText}>{t("common.continue")}</Text>
					<ChevronRight size={24} color={colors.text.inverse} strokeWidth={2} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.tertiary,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingTop: 60,
		paddingBottom: spacing.lg,
	},
	backButton: {
		backgroundColor: colors.background.secondary,
		width: spacing.minTouchTarget,
		height: spacing.minTouchTarget,
		borderRadius: spacing.minTouchTarget / 2,
		justifyContent: "center",
		alignItems: "center",
		marginRight: spacing.md,
		...spacing.shadow.sm,
	},
	headerContent: {
		flex: 1,
	},
	headerTitle: {
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	headerSubtitle: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
	},
	progressContainer: {
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	progressBar: {
		height: 4,
		backgroundColor: colors.neutral[200],
		borderRadius: 2,
		marginBottom: spacing.sm,
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary.main,
		borderRadius: 2,
	},
	progressText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		fontWeight: typography.fontWeight.medium,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.lg,
	},
	sectionTitle: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
	},
	languageCard: {
		backgroundColor: colors.background.secondary,
		borderRadius: spacing.radius.md,
		padding: spacing.lg,
		marginBottom: spacing.md,
		borderWidth: 2,
		borderColor: "transparent",
		...spacing.shadow.sm,
	},
	languageCardSelected: {
		borderColor: colors.primary.main,
		backgroundColor: colors.primary.surface,
	},
	languageInfo: {
		flex: 1,
	},
	languageHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	languageFlag: {
		fontSize: 32,
		marginRight: spacing.md,
	},
	languageNames: {
		flex: 1,
	},
	languageName: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	languageNameSelected: {
		color: colors.primary.main,
	},
	languageNative: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
	},
	languageNativeSelected: {
		color: colors.primary.main,
		fontWeight: typography.fontWeight.semibold,
	},
	languageDescription: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		marginBottom: spacing.md,
		lineHeight: 20,
	},
	languageDescriptionSelected: {
		color: colors.text.primary,
	},
	languageFeatures: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	featureBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.md,
		gap: spacing.xs,
	},
	featureBadgeActive: {
		backgroundColor: colors.feedback.successLight,
	},
	featureBadgeInactive: {
		backgroundColor: colors.neutral[100],
	},
	featureText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.medium,
	},
	featureTextActive: {
		color: colors.feedback.success,
	},
	featureTextInactive: {
		color: colors.text.disabled,
	},
	testVoiceButton: {
		backgroundColor: colors.feedback.info,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: spacing.radius.md,
	},
	testVoiceText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.background.secondary,
	},
	noteContainer: {
		backgroundColor: colors.accent.surface,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		marginTop: spacing.md,
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: colors.categories.construction,
	},
	noteTitle: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	noteText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		lineHeight: 20,
	},
	buttonContainer: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing["2xl"],
	},
	continueButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.main,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		...spacing.shadow.lg,
	},
	continueText: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginRight: spacing.sm,
	},
});
