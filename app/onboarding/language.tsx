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
import { useLanguage } from "@/hooks/useLanguage";
import type { SupportedLanguage } from "@/i18n.config";

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
					<ArrowLeft size={24} color="#2F4F4F" strokeWidth={2} />
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
									<CheckCircle size={24} color="#2E8B57" strokeWidth={2} />
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
										color={language.voiceSupport ? "#32CD32" : "#A0A0A0"}
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
					<ChevronRight size={24} color="#FDF5E6" strokeWidth={2} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDF5E6",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 20,
	},
	backButton: {
		backgroundColor: "#FFF",
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	headerContent: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#8B4513",
	},
	progressContainer: {
		paddingHorizontal: 20,
		marginBottom: 24,
	},
	progressBar: {
		height: 4,
		backgroundColor: "#E0E0E0",
		borderRadius: 2,
		marginBottom: 8,
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#2E8B57",
		borderRadius: 2,
	},
	progressText: {
		fontSize: 14,
		color: "#8B4513",
		fontWeight: "500",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 16,
	},
	languageCard: {
		backgroundColor: "#FFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 12,
		borderWidth: 2,
		borderColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	languageCardSelected: {
		borderColor: "#2E8B57",
		backgroundColor: "#E8F5E8",
	},
	languageInfo: {
		flex: 1,
	},
	languageHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	languageFlag: {
		fontSize: 32,
		marginRight: 16,
	},
	languageNames: {
		flex: 1,
	},
	languageName: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 2,
	},
	languageNameSelected: {
		color: "#2E8B57",
	},
	languageNative: {
		fontSize: 16,
		color: "#8B4513",
	},
	languageNativeSelected: {
		color: "#2E8B57",
		fontWeight: "600",
	},
	languageDescription: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 12,
		lineHeight: 20,
	},
	languageDescriptionSelected: {
		color: "#2F4F4F",
	},
	languageFeatures: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	featureBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		gap: 4,
	},
	featureBadgeActive: {
		backgroundColor: "#E8F5E8",
	},
	featureBadgeInactive: {
		backgroundColor: "#F5F5F5",
	},
	featureText: {
		fontSize: 12,
		fontWeight: "500",
	},
	featureTextActive: {
		color: "#32CD32",
	},
	featureTextInactive: {
		color: "#A0A0A0",
	},
	testVoiceButton: {
		backgroundColor: "#87CEEB",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	testVoiceText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	noteContainer: {
		backgroundColor: "#FFF9E6",
		padding: 16,
		borderRadius: 12,
		marginTop: 16,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#DAA520",
	},
	noteTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 8,
	},
	noteText: {
		fontSize: 14,
		color: "#8B4513",
		lineHeight: 20,
	},
	buttonContainer: {
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	continueButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#2E8B57",
		paddingVertical: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	continueText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FDF5E6",
		marginRight: 8,
	},
});
