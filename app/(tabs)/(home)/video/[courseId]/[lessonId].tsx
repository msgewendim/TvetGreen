import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { colors, spacing } from "@/design-system";
import { ROUTES } from "@/src/utils/appRoutes";
import { useLearningStore } from "@/src/store/learningStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLesson } from "@/src/hooks/useLesson";

const SCREEN_WIDTH = Dimensions.get("window").width;
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16);

export default function VideoPlayerScreen() {
	const { courseId, lessonId } = useLocalSearchParams<{
		courseId: string;
		lessonId: string;
	}>();
	const router = useRouter();
	const { t } = useLanguage();
	const lessonData = useLesson();
	const updateLessonProgress = useLearningStore((s) => s.updateLessonProgress);

	const [videoError, setVideoError] = useState<string | null>(null);
	const lastPositionRef = useRef(0);
	const lastDurationRef = useRef(0);

	const handleProgress = useCallback(
		(progress: { currentTime: number; duration: number }) => {
			if (!lessonId) return;
			lastPositionRef.current = progress.currentTime;
			lastDurationRef.current = progress.duration;
			updateLessonProgress(lessonId, progress.currentTime, progress.duration);
		},
		[lessonId, updateLessonProgress],
	);

	// Save position on unmount
	useEffect(() => {
		return () => {
			if (lessonId && lastPositionRef.current > 0) {
				updateLessonProgress(
					lessonId,
					lastPositionRef.current,
					lastDurationRef.current,
				);
			}
		};
	}, [lessonId, updateLessonProgress]);

	const handlePrevious = () => {
		if (lessonData.previousLesson && courseId) {
			router.replace(
				ROUTES.VIDEO_PLAYER(courseId, lessonData.previousLesson.id) as never,
			);
		}
	};

	const handleNext = () => {
		if (lessonData.nextLesson && courseId) {
			router.replace(
				ROUTES.VIDEO_PLAYER(courseId, lessonData.nextLesson.id) as never,
			);
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
						onProgress={handleProgress}
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
					{t("video.lesson_of", {
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
