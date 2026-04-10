import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { CopilotStep, walkthroughable } from "react-native-copilot";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import type { VideoPlayerRef } from "@/src/components/VideoPlayer/types";
import { colors, spacing } from "@/design-system";
import { ROUTES } from "@/src/utils/appRoutes";
import { useLearningStore } from "@/src/store/learningStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLesson } from "@/src/hooks/useLesson";

const WalkthroughView = walkthroughable(View);

const PROGRESS_INTERVAL_MS = 10_000;

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
	const [isReady, setIsReady] = useState(false);
	const playerRef = useRef<VideoPlayerRef>(null);
	const lastPositionRef = useRef(0);
	// Use lesson duration from data as initial fallback
	const lastDurationRef = useRef(lessonData.duration);

	// Read position synchronously from ref and update lastPosition refs
	const syncPosition = useCallback(() => {
		const ref = playerRef.current;
		if (!ref) return;

		// expo-video: sync access via getter
		const ct = ref.currentTime;
		const dur = ref.duration;
		if (ct > 0) {
			lastPositionRef.current = ct;
			lastDurationRef.current = dur;
		}
	}, []);

	// Read position (async for YouTube, sync for expo-video) and save to store
	const saveProgress = useCallback(async () => {
		const ref = playerRef.current;
		if (!ref || !lessonId) return;

		// Try sync first (expo-video)
		syncPosition();

		// YouTube: async fallback if sync returned 0
		if (lastPositionRef.current === 0 && ref.playerRef?.getCurrentTime) {
			try {
				const ct = await ref.playerRef.getCurrentTime();
				const dur = await ref.playerRef.getDuration?.();
				if (ct && ct > 0) {
					lastPositionRef.current = ct;
					lastDurationRef.current = dur ?? 0;
				}
			} catch {
				// player may be disposed
			}
		}

		if (lastPositionRef.current > 0 && lastDurationRef.current > 0) {
			updateLessonProgress(
				lessonId,
				lastPositionRef.current,
				lastDurationRef.current,
			);
		}
	}, [lessonId, updateLessonProgress, syncPosition]);

	// Poll every 10s and save progress
	useEffect(() => {
		if (!isReady || !lessonId) return;

		// Save immediately on ready (captures duration)
		saveProgress();

		const interval = setInterval(saveProgress, PROGRESS_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [isReady, lessonId, saveProgress]);

	// Save position on unmount — sync read + save
	useEffect(() => {
		return () => {
			syncPosition();
			if (lessonId && lastPositionRef.current > 0) {
				updateLessonProgress(
					lessonId,
					lastPositionRef.current,
					lastDurationRef.current,
				);
			}
		};
	}, [lessonId, updateLessonProgress, syncPosition]);

	const handlePrevious = async () => {
		if (lessonData.previousLesson && courseId) {
			await saveProgress();
			router.replace(
				ROUTES.VIDEO_PLAYER(courseId, lessonData.previousLesson.id) as never,
			);
		}
	};

	const handleNext = async () => {
		if (lessonData.nextLesson && courseId) {
			await saveProgress();
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
			<CopilotStep
				text={t("tour.video.player")}
				order={1}
				name="videoPlayer"
			>
				<WalkthroughView style={styles.videoSection}>
					{videoError ? (
						<View style={styles.errorContainer}>
							<Text variant="bodyLarge" style={styles.errorText}>
								{videoError}
							</Text>
						</View>
					) : lessonData.videoSource.source ? (
						<VideoPlayer
							ref={playerRef}
							source={lessonData.videoSource.source}
							onReady={() => setIsReady(true)}
							onError={handleVideoError}
							style={styles.video}
						/>
					) : (
						<View style={styles.videoPlaceholder}>
							<ActivityIndicator size="large" color={colors.primary.main} />
						</View>
					)}
				</WalkthroughView>
			</CopilotStep>

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
				<CopilotStep
					text={t("tour.video.navigation")}
					order={2}
					name="videoNavigation"
				>
					<WalkthroughView style={styles.navRow}>
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
					</WalkthroughView>
				</CopilotStep>
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
