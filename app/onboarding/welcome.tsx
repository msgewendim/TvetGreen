import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors, spacing, typography } from "@/design-system";

const SLIDES = [
	{ key: "slide1", emoji: "📚" },
	{ key: "slide2", emoji: "📥" },
	{ key: "slide3", emoji: "📊" },
] as const;

export default function WelcomeScreen() {
	const router = useRouter();
	const { t } = useLanguage();
	const [currentSlide, setCurrentSlide] = useState(0);

	const isLastSlide = currentSlide === SLIDES.length - 1;

	const handleNext = () => {
		if (isLastSlide) {
			router.push("/onboarding/complete" as never);
		} else {
			setCurrentSlide((prev) => prev + 1);
		}
	};

	const handleSkip = () => {
		router.push("/onboarding/complete" as never);
	};

	const slide = SLIDES[currentSlide];

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.emojiContainer}>
					<Text style={styles.emoji}>{slide.emoji}</Text>
				</View>

				<Text style={styles.title}>
					{t(`onboarding.welcome.${slide.key}.title`)}
				</Text>
				<Text style={styles.subtitle}>
					{t(`onboarding.welcome.${slide.key}.subtitle`)}
				</Text>

				{/* Slide Indicators */}
				<View style={styles.slideIndicators}>
					{SLIDES.map((s, index) => (
						<View
							key={s.key}
							style={[
								styles.slideIndicator,
								index === currentSlide && styles.slideIndicatorActive,
							]}
						/>
					))}
				</View>
			</View>

			{/* Buttons */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.nextButton}
					onPress={handleNext}
					accessibilityLabel={
						isLastSlide ? t("onboarding.getStarted") : t("common.next")
					}
					accessibilityRole="button"
				>
					<Text style={styles.nextText}>
						{isLastSlide ? t("onboarding.getStarted") : t("common.next")}
					</Text>
					<ChevronRight size={24} color={colors.text.inverse} strokeWidth={2} />
				</TouchableOpacity>

				{!isLastSlide && (
					<TouchableOpacity
						style={styles.skipButton}
						onPress={handleSkip}
						accessibilityLabel={t("onboarding.skip")}
						accessibilityRole="button"
					>
						<Text style={styles.skipText}>{t("onboarding.skip")}</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary.main,
		justifyContent: "space-between",
		paddingHorizontal: spacing.lg,
		paddingTop: 80,
		paddingBottom: spacing["2xl"],
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emojiContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: spacing.xl,
	},
	emoji: {
		fontSize: 56,
	},
	title: {
		fontSize: typography.fontSize["3xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		textAlign: "center",
		marginBottom: spacing.md,
	},
	subtitle: {
		fontSize: typography.fontSize.base,
		color: colors.text.inverse,
		textAlign: "center",
		lineHeight: 24,
		opacity: 0.9,
		paddingHorizontal: spacing.md,
		marginBottom: spacing["2xl"],
	},
	slideIndicators: {
		flexDirection: "row",
		gap: 8,
	},
	slideIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "rgba(255, 255, 255, 0.4)",
	},
	slideIndicatorActive: {
		backgroundColor: colors.text.inverse,
		width: 24,
	},
	buttonContainer: {
		alignItems: "center",
	},
	nextButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.accent.main,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.md,
		minWidth: 200,
	},
	nextText: {
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
