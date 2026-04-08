import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { ChevronRight } from "lucide-react-native";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors, spacing } from "@/design-system";

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

				<Text variant="displayMedium" style={styles.title}>
					{t(`onboarding.welcome.${slide.key}.title`)}
				</Text>
				<Text variant="bodyLarge" style={styles.subtitle}>
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
				<Button
					mode="contained"
					onPress={handleNext}
					buttonColor={colors.accent.main}
					textColor={colors.text.inverse}
					contentStyle={styles.nextContent}
					labelStyle={styles.nextLabel}
					icon={({ color }) => (
						<ChevronRight size={20} color={color} strokeWidth={2} />
					)}
					contentStyleRightIcon
					accessibilityLabel={
						isLastSlide ? t("onboarding.getStarted") : t("common.next")
					}
				>
					{isLastSlide ? t("onboarding.getStarted") : t("common.next")}
				</Button>

				{!isLastSlide && (
					<Button
						mode="text"
						onPress={handleSkip}
						textColor="rgba(255, 255, 255, 0.8)"
						accessibilityLabel={t("onboarding.skip")}
					>
						{t("onboarding.skip")}
					</Button>
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
		color: colors.text.inverse,
		textAlign: "center",
		marginBottom: spacing.md,
	},
	subtitle: {
		color: colors.text.inverse,
		textAlign: "center",
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
	nextContent: {
		height: spacing.minTouchTarget,
		minWidth: 200,
	},
	nextLabel: {
		fontSize: 16,
		fontWeight: "700",
	},
});
