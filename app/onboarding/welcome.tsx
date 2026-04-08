import { useRouter } from "expo-router";
import { ChevronRight, Volume2, VolumeX } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors, spacing, typography } from "@/design-system";

export default function WelcomeScreen() {
	const router = useRouter();
	const { t } = useLanguage();
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [currentSlide, setCurrentSlide] = useState(0);

	const welcomeSlides = [
		{
			title: t("onboarding.welcome"),
			subtitle: t("onboarding.welcomeMessage"),
			description:
				"Join thousands of learners across East Africa building better futures through education.",
			image:
				"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
			emoji: "🌍",
		},
		{
			title: "Learn Anywhere, Anytime",
			subtitle: "Offline-first education",
			description: t("downloads.downloadCourses"),
			image:
				"https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
			emoji: "📱",
		},
		{
			title: "Voice-Guided Learning",
			subtitle: "Designed for everyone",
			description: t("onboarding.voiceDescription"),
			image:
				"https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg",
			emoji: "🎤",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % welcomeSlides.length);
		}, 4000);

		return () => clearInterval(timer);
	}, [welcomeSlides.length]);

	const currentSlideData = welcomeSlides[currentSlide];

	return (
		<View style={styles.container}>
			<ImageBackground
				source={{ uri: currentSlideData.image }}
				style={styles.backgroundImage}
				imageStyle={styles.backgroundImageStyle}
			>
				<View style={styles.overlay}>
					{/* Audio Toggle */}
					<TouchableOpacity
						style={styles.audioToggle}
						onPress={() => setAudioEnabled(!audioEnabled)}
					>
						{audioEnabled ? (
							<Volume2 size={24} color={colors.text.inverse} strokeWidth={2} />
						) : (
							<VolumeX size={24} color={colors.text.inverse} strokeWidth={2} />
						)}
					</TouchableOpacity>

					{/* Content */}
					<View style={styles.content}>
						<View style={styles.emojiContainer}>
							<Text style={styles.emoji}>{currentSlideData.emoji}</Text>
						</View>

						<Text style={styles.title}>{currentSlideData.title}</Text>
						<Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
						<Text style={styles.description}>
							{currentSlideData.description}
						</Text>

						{/* Slide Indicators */}
						<View style={styles.slideIndicators}>
							{welcomeSlides.map((slide, index) => (
								<TouchableOpacity
									key={slide.emoji}
									style={[
										styles.slideIndicator,
										index === currentSlide && styles.slideIndicatorActive,
									]}
									onPress={() => setCurrentSlide(index)}
								/>
							))}
						</View>
					</View>

					{/* Get Started Button */}
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.getStartedButton}
							onPress={() => router.push("/onboarding/language")}
						>
							<Text style={styles.getStartedText}>
								{t("onboarding.getStarted")}
							</Text>
							<ChevronRight size={24} color={colors.text.inverse} strokeWidth={2} />
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.skipButton}
							onPress={() => router.replace("/(tabs)")}
						>
							<Text style={styles.skipText}>{t("onboarding.skip")}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		justifyContent: "space-between",
	},
	backgroundImageStyle: {
		opacity: 0.8,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(22, 163, 74, 0.85)", // colors.primary.main with opacity
		justifyContent: "space-between",
		paddingHorizontal: spacing.lg,
		paddingTop: 60,
		paddingBottom: spacing.xl,
	},
	audioToggle: {
		alignSelf: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	emojiContainer: {
		backgroundColor: "rgba(254, 249, 241, 0.2)", // colors.background.primary with opacity
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: spacing.xl,
	},
	emoji: {
		fontSize: 48,
	},
	title: {
		fontSize: typography.fontSize["3xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		textAlign: "center",
		marginBottom: spacing.md,
	},
	subtitle: {
		fontSize: typography.fontSize.xl,
		color: colors.text.inverse,
		textAlign: "center",
		marginBottom: spacing.md,
		opacity: 0.9,
	},
	description: {
		fontSize: typography.fontSize.base,
		color: colors.text.inverse,
		textAlign: "center",
		lineHeight: 24,
		marginBottom: spacing["2xl"],
		opacity: 0.9,
	},
	slideIndicators: {
		flexDirection: "row",
		gap: 8,
	},
	slideIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "rgba(254, 249, 241, 0.4)", // colors.background.primary with opacity
	},
	slideIndicatorActive: {
		backgroundColor: colors.text.inverse,
		width: 24,
	},
	buttonContainer: {
		alignItems: "center",
	},
	getStartedButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.accent.main,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.md,
		...spacing.shadow.lg,
	},
	getStartedText: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginRight: spacing.sm,
	},
	skipButton: {
		paddingVertical: spacing.md,
	},
	skipText: {
		fontSize: typography.fontSize.base,
		color: colors.text.inverse,
		opacity: 0.8,
	},
});
