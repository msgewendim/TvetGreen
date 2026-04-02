import {
	ActivityIndicator,
	Alert,
	Dimensions,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { LessonInfoPanel } from "@/src/components/video";
import { colors } from "@/design-system";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLearningStore } from "@/src/store/learningStore";
import { useLesson } from "@/src/hooks/useLesson";
import type { VideoPlayerRef } from "@/src/components/VideoPlayer";
import { usePlatform } from "@/src/hooks/usePlatform";

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
	const playerRef = useRef<VideoPlayerRef>(null);

	const updateLastAccessed = useLearningStore((s) => s.updateLastAccessed);
	const updateLessonProgress = useLearningStore((s) => s.updateLessonProgress);

	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const lastPositionRef = useRef(0);
	const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const { isWeb } = usePlatform();

	// Validate route parameters
	const hasValidParams = Boolean(courseId?.trim() && lessonId?.trim());
	const isLessonNotFound = lessonData.title === "Lesson Not Found";

	useEffect(() => {
		if (courseId) {
			updateLastAccessed(courseId);
		}
	}, [courseId, updateLastAccessed]);

	// Save progress every 10s while playing
	useEffect(() => {
		if (!isPlaying || !isLoaded || !lessonId || !courseId) return;

		progressIntervalRef.current = setInterval(() => {
			const ref = playerRef.current as any;
			if (!ref) return;

			let ct = 0;
			let dur = 0;

			if (ref.player) {
				ct = ref.player.currentTime ?? 0;
				dur = ref.player.duration ?? 0;
			} else if (ref.playerRef) {
				// YouTube — async, fire and forget
				ref.playerRef.getCurrentTime?.().then((t: number) => {
					ref.playerRef.getDuration?.().then((d: number) => {
						if (t > 0 && d > 0) {
							lastPositionRef.current = t;
							updateLessonProgress(lessonId, courseId, t, d, t);
						}
					});
				});
				return;
			}

			if (ct > 0 && dur > 0) {
				lastPositionRef.current = ct;
				updateLessonProgress(lessonId, courseId, ct, dur, ct);
			}
		}, 10000);

		return () => {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, [isPlaying, isLoaded, lessonId, courseId, updateLessonProgress]);

	// Save on unmount
	useEffect(() => {
		return () => {
			if (lessonId && courseId && lastPositionRef.current > 0) {
				updateLessonProgress(
					lessonId,
					courseId,
					lastPositionRef.current,
					0,
					lastPositionRef.current,
				);
			}
		};
	}, [lessonId, courseId, updateLessonProgress]);

	const handleComplete = useCallback(() => {
		if (lessonId && courseId) {
			updateLessonProgress(lessonId, courseId, 0, 0, 0);
		}
		Alert.alert(
			t("video.completed"),
			"Great job! You've completed this lesson.",
			[
				{ text: t("video.replay"), style: "cancel" },
				{
					text: t("video.nextLesson"),
					onPress: () => {
						if (lessonData.nextLesson) {
							router.replace(`/video/${courseId}/${lessonData.nextLesson.id}`);
						}
					},
				},
			],
		);
	}, [t, courseId, lessonId, lessonData.nextLesson, router, updateLessonProgress]);

	const handleNextLesson = () => {
		if (lessonData.nextLesson) {
			router.replace(`/video/${courseId}/${lessonData.nextLesson.id}`);
		}
	};

	const handleBack = () => {
		if (isWeb) {
			router.back();
		} else {
			router.replace(`/learning/courses/${courseId}`);
		}
	};

	const headerBackground = isWeb ? colors.background.tertiary : "#000";

	if (!hasValidParams || isLessonNotFound) {
		return (
			<View style={styles.errorContainer}>
				<StatusBar barStyle="light-content" />
				<Text style={styles.errorTitle}>
					{!hasValidParams
						? t("common.error")
						: t("video.lessonNotFound")}
				</Text>
				<Text style={styles.errorMessage}>
					{!hasValidParams
						? t("video.invalidParams")
						: t("video.lessonNotFoundMessage")}
				</Text>
				<TouchableOpacity
					style={styles.errorBackButton}
					onPress={() => router.back()}
					accessibilityLabel={t("common.back")}
					accessibilityRole="button"
				>
					<ArrowLeft size={20} color={colors.text.inverse} />
					<Text style={styles.errorBackText}>{t("common.goBack")}</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: headerBackground }]}>
			<StatusBar barStyle="light-content" />
			<View style={[styles.header, { backgroundColor: headerBackground }]}>
				<TouchableOpacity
					onPress={handleBack}
					style={styles.backButton}
					accessibilityLabel={t("common.back")}
					accessibilityRole="button"
				>
					<ArrowLeft size={24} color="#FFFFFF" />
				</TouchableOpacity>
			</View>
			{/* Video — native controls handle play/pause/seek/speed */}
			<View style={[styles.videoSection, {
				backgroundColor: headerBackground,
			}]}>
				{lessonData.videoUrl ? (
					<VideoPlayer
						ref={playerRef}
						source={lessonData.videoUrl}
						localSource={lessonData.isDownloaded ? lessonData.videoUrl : undefined}
						initialPosition={lessonData.lastPosition > 0 ? lessonData.lastPosition : undefined}
						onPlayingChange={setIsPlaying}
						onComplete={handleComplete}
						onReady={() => setIsLoaded(true)}
						onError={(err) => console.warn("Video error:", err.message)}
						style={styles.video}
					/>
				) : (
					<View style={styles.videoPlaceholder}>
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				)}
			</View>

			{/* Info below */}
			<ScrollView
				style={styles.infoScroll}
				bounces={false}
				showsVerticalScrollIndicator={false}
			>
				<LessonInfoPanel
					title={lessonData.title}
					courseTitle={lessonData.courseTitle}
					instructor={lessonData.instructor}
					lessonNumber={lessonData.lessonNumber}
					totalLessons={lessonData.totalLessons}
					isDownloaded={lessonData.isDownloaded}
					nextLesson={lessonData.nextLesson}
					onDownload={() => { }}
					onPrevious={handleBack}
					onNext={handleNextLesson}
					onComplete={handleComplete}
					onNextLessonPress={handleNextLesson}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		paddingTop: 44,
		paddingHorizontal: 8,
		paddingBottom: 4,
	},
	backButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	videoSection: {
		width: SCREEN_WIDTH,
		height: VIDEO_HEIGHT,
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
	},
	infoScroll: {
		flex: 1,
		backgroundColor: colors.background.secondary,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.primary,
		padding: 32,
	},
	errorTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.text.primary,
		marginBottom: 8,
	},
	errorMessage: {
		fontSize: 15,
		color: colors.text.secondary,
		textAlign: "center",
		marginBottom: 24,
		lineHeight: 22,
	},
	errorBackButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.main,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 12,
		gap: 8,
	},
	errorBackText: {
		fontSize: 15,
		fontWeight: "600",
		color: colors.text.inverse,
	},
});
