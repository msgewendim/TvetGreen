import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { colors, spacing } from "@/design-system";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useCallback, useState } from "react";
import { useLesson } from "@/src/hooks/useLesson";

const SCREEN_WIDTH = Dimensions.get("window").width;
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16);

export default function VideoPlayerScreen() {
	const { courseId } = useLocalSearchParams<{
		courseId: string;
		lessonId: string;
	}>();
	const router = useRouter();
	const { t } = useLanguage();
	const lessonData = useLesson();

	const [videoError, setVideoError] = useState<string | null>(null);

	const handlePrevious = () => {
		if (lessonData.previousLesson) {
			router.replace(
				`/video/${courseId}/${lessonData.previousLesson.id}` as never,
			);
		}
	};

	const handleNext = () => {
		if (lessonData.nextLesson) {
			router.replace(`/video/${courseId}/${lessonData.nextLesson.id}` as never);
		}
	};

	const handleVideoError = useCallback(
		(err: Error) => {
			setVideoError(err.message || t("errors.videoLoadFailed"));
		},
		[t],
	);

	const isFirstLesson = lessonData.previousLesson === null;
	const isLastLesson = lessonData.nextLesson === null;

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
			bounces={false}
			showsVerticalScrollIndicator={false}
		>
			{/* Video — native controls */}
			<View style={styles.videoSection}>
				{videoError ? (
					<View style={styles.errorContainer}>
						<Text variant="bodyLarge" style={styles.errorText}>
							{videoError}
						</Text>
					</View>
				) : lessonData.videoSource.source ? (
					<VideoPlayer
						source={lessonData.videoSource.source}
						onReady={() => {}}
						onError={handleVideoError}
						style={styles.video}
					/>
				) : (
					<View style={styles.videoPlaceholder}>
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				)}
			</View>

			{/* Lesson info */}
			<View style={styles.infoContainer}>
				<Text variant="titleLarge" style={styles.lessonTitle}>
					{lessonData.title}
				</Text>

				<Text variant="bodySmall" style={styles.lessonLabel}>
					{t("video.lessonOf", {
						current: lessonData.lessonNumber,
						total: lessonData.totalLessons,
					})}
				</Text>

				{lessonData.description ? (
					<Text variant="bodyMedium" style={styles.description}>
						{lessonData.description}
					</Text>
				) : null}

				{/* Navigation buttons */}
				<View style={styles.navRow}>
					<Button
						mode="outlined"
						onPress={handlePrevious}
						disabled={isFirstLesson}
						style={styles.navButton}
						testID="prev-button"
					>
						{t("common.previous")}
					</Button>
					<Button
						mode="contained"
						onPress={handleNext}
						disabled={isLastLesson}
						style={styles.navButton}
						buttonColor={colors.primary.main}
						testID="next-button"
					>
						{t("common.next")}
					</Button>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	content: {
		paddingBottom: spacing.xl,
	},
	videoSection: {
		width: SCREEN_WIDTH,
		height: VIDEO_HEIGHT,
		backgroundColor: "#000",
	},
	video: {
		width: "100%",
		height: "100%",
	},
	videoPlaceholder: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
	errorContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.text.primary,
	},
	errorText: {
		color: colors.text.inverse,
		textAlign: "center",
		paddingHorizontal: spacing.lg,
	},
	infoContainer: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
	},
	lessonTitle: {
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	lessonLabel: {
		color: colors.text.tertiary,
		marginBottom: spacing.md,
	},
	description: {
		color: colors.text.secondary,
		lineHeight: 24,
		marginBottom: spacing.lg,
	},
	navRow: {
		flexDirection: "row",
		gap: spacing.md,
	},
	navButton: {
		flex: 1,
	},
});
