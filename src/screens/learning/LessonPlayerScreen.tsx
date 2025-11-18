import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import YoutubePlayer from "react-native-youtube-iframe";
import { useLearningStore } from "@/src/store/learningStore";
import { useLanguage } from "@/hooks/useLanguage";
import {
	X,
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	List,
	Play,
	Pause,
	SkipForward,
	SkipBack,
	Settings,
	Subtitles,
} from "lucide-react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export function LessonPlayerScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const lessonId = params.id as string;
	const { t } = useLanguage();

	const playerRef = useRef<any>(null);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showLessonList, setShowLessonList] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [showSettings, setShowSettings] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [isReady, setIsReady] = useState(false);
	const [isBuffering, setIsBuffering] = useState(false);

	const getLessonById = useLearningStore((state) => state.getLessonById);
	const getCourseById = useLearningStore((state) => state.getCourseById);
	const getLessonsByModule = useLearningStore(
		(state) => state.getLessonsByModule
	);
	const getNextLesson = useLearningStore((state) => state.getNextLesson);
	const getPreviousLesson = useLearningStore((state) => state.getPreviousLesson);
	const updateLessonProgress = useLearningStore(
		(state) => state.updateLessonProgress
	);
	const markLessonComplete = useLearningStore(
		(state) => state.markLessonComplete
	);
	const getLessonProgress = useLearningStore((state) => state.getLessonProgress);

	const lesson = getLessonById(lessonId);
	const course = lesson ? getCourseById(lesson.courseId) : null;
	const modules = lesson ? getLessonsByModule(lesson.courseId) : [];
	const nextLesson = lesson ? getNextLesson(lesson.id) : null;
	const previousLesson = lesson ? getPreviousLesson(lesson.id) : null;
	const progress = getLessonProgress(lessonId);

	// Auto-hide controls after 3s of inactivity
	const resetControlsTimer = useCallback(() => {
		if (controlsTimeoutRef.current) {
			clearTimeout(controlsTimeoutRef.current);
		}
		setShowControls(true);
		controlsTimeoutRef.current = setTimeout(() => {
			if (isPlaying) {
				setShowControls(false);
			}
		}, 3000);
	}, [isPlaying]);

	// Handle player state change
	const onStateChange = useCallback(
		(state: string) => {
			if (state === "playing") {
				setIsPlaying(true);
				setIsBuffering(false);
			} else if (state === "paused") {
				setIsPlaying(false);
				setIsBuffering(false);
			} else if (state === "buffering") {
				setIsBuffering(true);
			} else if (state === "ended") {
				setIsPlaying(false);
				// Auto-suggest next lesson
				handleLessonComplete();
			}
		},
		[]
	);

	// Track progress every 5 seconds
	useEffect(() => {
		if (!isPlaying || !lesson) return;

		progressIntervalRef.current = setInterval(async () => {
			const currentTimeSeconds = await playerRef.current?.getCurrentTime();
			if (currentTimeSeconds !== undefined) {
				setCurrentTime(currentTimeSeconds);

				// Update progress in store
				await updateLessonProgress(
					lesson.id,
					lesson.courseId,
					currentTimeSeconds,
					duration,
					currentTimeSeconds
				);

				// Auto-complete at 90%
				if (
					duration > 0 &&
					currentTimeSeconds / duration >= 0.9 &&
					!progress?.isCompleted
				) {
					await markLessonComplete(lesson.id, lesson.courseId);
				}
			}
		}, 5000);

		return () => {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, [isPlaying, lesson, duration, progress]);

	// Load saved progress and resume
	useEffect(() => {
		if (progress?.lastPosition && playerRef.current && isReady) {
			playerRef.current.seekTo(progress.lastPosition, true);
		}
	}, [progress, isReady]);

	// Cleanup
	useEffect(() => {
		return () => {
			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, []);

	if (!lesson || !course) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{t("learning.errors.lessonNotFound")}</Text>
			</View>
		);
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleClose = () => {
		router.back();
	};

	const togglePlayPause = () => {
		resetControlsTimer();
		if (isPlaying) {
			playerRef.current?.pauseVideo();
		} else {
			playerRef.current?.playVideo();
		}
	};

	const handleSkipForward = async () => {
		resetControlsTimer();
		const current = await playerRef.current?.getCurrentTime();
		if (current !== undefined) {
			playerRef.current?.seekTo(Math.min(current + 10, duration), true);
		}
	};

	const handleSkipBackward = async () => {
		resetControlsTimer();
		const current = await playerRef.current?.getCurrentTime();
		if (current !== undefined) {
			playerRef.current?.seekTo(Math.max(current - 10, 0), true);
		}
	};

	const handlePlaybackRateChange = (rate: number) => {
		setPlaybackRate(rate);
		setShowSettings(false);
		resetControlsTimer();
	};

	const handleLessonComplete = async () => {
		if (!progress?.isCompleted) {
			await markLessonComplete(lesson.id, lesson.courseId);
		}

		Alert.alert(
			t("video.completed"),
			nextLesson
				? t("video.upNext")
				: t("learning.success.courseComplete"),
			nextLesson
				? [
						{
							text: t("video.nextLesson"),
							onPress: () => {
								router.replace(`/learning/lesson/${nextLesson.id}`);
							},
						},
						{ text: t("common.cancel"), style: "cancel" },
				  ]
				: [
						{
							text: t("common.done"),
							onPress: () => router.push(`/learning/courses/${course.id}`),
						},
				  ]
		);
	};

	const handleMarkComplete = async () => {
		await handleLessonComplete();
	};

	const handleNextLesson = () => {
		if (nextLesson) {
			router.replace(`/learning/lesson/${nextLesson.id}`);
		} else {
			Alert.alert(t("common.success"), t("learning.success.courseComplete"));
		}
	};

	const handlePreviousLesson = () => {
		if (previousLesson) {
			router.replace(`/learning/lesson/${previousLesson.id}`);
		}
	};

	const handleLessonSelect = (selectedLessonId: string) => {
		router.replace(`/learning/lesson/${selectedLessonId}`);
		setShowLessonList(false);
	};

	const handleScreenPress = () => {
		resetControlsTimer();
	};

	const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

	return (
		<View style={styles.container}>
			{/* YouTube Player */}
			<TouchableOpacity
				activeOpacity={1}
				onPress={handleScreenPress}
				style={styles.videoContainer}
			>
				<YoutubePlayer
					ref={playerRef}
					height={SCREEN_WIDTH * (9 / 16)}
					width={SCREEN_WIDTH}
					videoId={lesson.videoId}
					play={isPlaying}
					onChangeState={onStateChange}
					onReady={async () => {
						setIsReady(true);
						// Get duration when player is ready
						const videoDuration = await playerRef.current?.getDuration();
						if (videoDuration) {
							setDuration(videoDuration);
						}
					}}
					playbackRate={playbackRate}
					onPlaybackRateChange={(rate) => setPlaybackRate(rate)}
					initialPlayerParams={{
						preventFullScreen: false,
						modestbranding: true,
					}}
				/>

				{/* Buffering Indicator */}
				{isBuffering && (
					<View style={styles.bufferingContainer}>
						<ActivityIndicator size="large" color="#2E8B57" />
					</View>
				)}

				{/* Custom Controls Overlay */}
				{showControls && (
					<View style={styles.controlsOverlay}>
						{/* Top Controls */}
						<View style={styles.topControls}>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={handleClose}
							>
								<X size={28} color="#FDF5E6" />
							</TouchableOpacity>

							<View style={styles.topRightControls}>
								<TouchableOpacity
									style={styles.iconButton}
									onPress={() => setShowLessonList(true)}
								>
									<List size={24} color="#FDF5E6" />
								</TouchableOpacity>
							</View>
						</View>

						{/* Center Play/Pause */}
						<View style={styles.centerControls}>
							<TouchableOpacity
								style={styles.skipButton}
								onPress={handleSkipBackward}
							>
								<SkipBack size={32} color="#FDF5E6" fill="#FDF5E6" />
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.playPauseButton}
								onPress={togglePlayPause}
							>
								{isPlaying ? (
									<Pause size={48} color="#FDF5E6" fill="#FDF5E6" />
								) : (
									<Play size={48} color="#FDF5E6" fill="#FDF5E6" />
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.skipButton}
								onPress={handleSkipForward}
							>
								<SkipForward size={32} color="#FDF5E6" fill="#FDF5E6" />
							</TouchableOpacity>
						</View>

						{/* Bottom Controls */}
						<View style={styles.bottomControls}>
							<View style={styles.progressBarContainer}>
								<View style={styles.progressBarTrack}>
									<View
										style={[
											styles.progressBarFill,
											{
												width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
											},
										]}
									/>
								</View>
							</View>

							<View style={styles.bottomControlsRow}>
								<Text style={styles.timeText}>
									{formatTime(currentTime)} / {formatTime(duration)}
								</Text>

								<View style={styles.bottomRightControls}>
									<TouchableOpacity
										style={styles.iconButton}
										onPress={() => setShowSettings(!showSettings)}
									>
										<Settings size={20} color="#FDF5E6" />
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				)}

				{/* Settings Menu */}
				{showSettings && (
					<View style={styles.settingsMenu}>
						<Text style={styles.settingsTitle}>{t("video.speed")}</Text>
						{playbackRates.map((rate) => (
							<TouchableOpacity
								key={rate}
								style={[
									styles.settingsOption,
									rate === playbackRate && styles.settingsOptionActive,
								]}
								onPress={() => handlePlaybackRateChange(rate)}
							>
								<Text
									style={[
										styles.settingsOptionText,
										rate === playbackRate && styles.settingsOptionTextActive,
									]}
								>
									{rate}x
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}
			</TouchableOpacity>

			{/* Lesson Info */}
			<View style={styles.infoContainer}>
				<Text style={styles.courseTitle}>{course.title}</Text>
				<Text style={styles.lessonTitle}>{lesson.title}</Text>

				{/* Progress Indicator */}
				{duration > 0 && (
					<View style={styles.progressIndicator}>
						<Text style={styles.progressText}>
							{t("learning.progress")}: {Math.round((currentTime / duration) * 100)}%
						</Text>
					</View>
				)}

				{/* Navigation Actions */}
				<View style={styles.navigationContainer}>
					{previousLesson && (
						<TouchableOpacity
							style={styles.navButton}
							onPress={handlePreviousLesson}
						>
							<ChevronLeft size={20} color="#2E8B57" />
							<Text style={styles.navButtonText}>
								{t("video.previousLesson")}
							</Text>
						</TouchableOpacity>
					)}

					<View style={{ flex: 1 }} />

					{nextLesson && (
						<TouchableOpacity
							style={styles.navButton}
							onPress={handleNextLesson}
						>
							<Text style={styles.navButtonText}>
								{t("video.nextLesson")}
							</Text>
							<ChevronRight size={20} color="#2E8B57" />
						</TouchableOpacity>
					)}
				</View>

				{/* Action Buttons */}
				<View style={styles.actionsContainer}>
					{progress?.isCompleted ? (
						<View style={styles.completedBadge}>
							<CheckCircle2 size={20} color="#32CD32" />
							<Text style={styles.completedText}>{t("learning.completed")}</Text>
						</View>
					) : (
						<TouchableOpacity
							style={styles.completeButton}
							onPress={handleMarkComplete}
						>
							<CheckCircle2 size={20} color="#FDF5E6" />
							<Text style={styles.completeButtonText}>
								{t("video.markComplete")}
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Lesson List Overlay */}
			{showLessonList && (
				<View style={styles.lessonListOverlay}>
					<View style={styles.lessonListContainer}>
						<View style={styles.lessonListHeader}>
							<Text style={styles.lessonListTitle}>
								{t("learning.curriculum")}
							</Text>
							<TouchableOpacity onPress={() => setShowLessonList(false)}>
								<X size={24} color="#2F4F4F" />
							</TouchableOpacity>
						</View>
						<ScrollView>
							{modules.map((module, moduleIndex) => (
								<View key={module.id} style={styles.module}>
									<Text style={styles.moduleName}>
										{t("learning.module", { number: moduleIndex + 1 })}: {module.name}
									</Text>
									{module.lessons.map((moduleLesson) => (
										<TouchableOpacity
											key={moduleLesson.id}
											style={[
												styles.lessonItem,
												moduleLesson.id === lessonId && styles.currentLesson,
											]}
											onPress={() => handleLessonSelect(moduleLesson.id)}
										>
											<View style={styles.lessonItemLeft}>
												{moduleLesson.isCompleted ? (
													<CheckCircle2 size={18} color="#32CD32" />
												) : (
													<Play size={18} color="#2E8B57" />
												)}
												<Text
													style={[
														styles.lessonItemTitle,
														moduleLesson.id === lessonId &&
															styles.currentLessonText,
													]}
													numberOfLines={2}
												>
													{moduleLesson.title}
												</Text>
											</View>
											<Text style={styles.lessonItemDuration}>
												{moduleLesson.duration}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							))}
						</ScrollView>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FDF5E6",
	},
	errorText: {
		fontSize: 18,
		color: "#DC143C",
	},
	videoContainer: {
		position: "relative",
		width: "100%",
		aspectRatio: 16 / 9,
		backgroundColor: "#000000",
	},
	bufferingContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
	},
	controlsOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		justifyContent: "space-between",
	},
	topControls: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 40,
		paddingBottom: 16,
	},
	topRightControls: {
		flexDirection: "row",
		gap: 12,
	},
	centerControls: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 40,
	},
	bottomControls: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	progressBarContainer: {
		marginBottom: 12,
	},
	progressBarTrack: {
		height: 4,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		backgroundColor: "#2E8B57",
	},
	bottomControlsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	bottomRightControls: {
		flexDirection: "row",
		gap: 12,
	},
	iconButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	skipButton: {
		padding: 12,
	},
	playPauseButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(46, 139, 87, 0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	timeText: {
		fontSize: 14,
		color: "#FFFFFF",
		fontWeight: "600",
	},
	settingsMenu: {
		position: "absolute",
		right: 16,
		bottom: 60,
		backgroundColor: "rgba(0, 0, 0, 0.9)",
		borderRadius: 8,
		padding: 12,
		minWidth: 120,
	},
	settingsTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
		marginBottom: 8,
		paddingHorizontal: 8,
	},
	settingsOption: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 6,
	},
	settingsOptionActive: {
		backgroundColor: "#2E8B57",
	},
	settingsOptionText: {
		fontSize: 14,
		color: "#FFFFFF",
		textAlign: "center",
	},
	settingsOptionTextActive: {
		fontWeight: "600",
	},
	infoContainer: {
		flex: 1,
		backgroundColor: "#FDF5E6",
		padding: 20,
	},
	courseTitle: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 4,
	},
	lessonTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 16,
		lineHeight: 28,
	},
	progressIndicator: {
		marginBottom: 16,
	},
	progressText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2E8B57",
	},
	navigationContainer: {
		flexDirection: "row",
		marginBottom: 16,
	},
	navButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#2E8B57",
	},
	navButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2E8B57",
	},
	actionsContainer: {
		marginTop: 8,
	},
	completeButton: {
		flexDirection: "row",
		backgroundColor: "#2E8B57",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	completeButtonText: {
		color: "#FDF5E6",
		fontSize: 15,
		fontWeight: "600",
	},
	completedBadge: {
		flexDirection: "row",
		backgroundColor: "#32CD3220",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		borderWidth: 2,
		borderColor: "#32CD32",
	},
	completedText: {
		color: "#32CD32",
		fontSize: 15,
		fontWeight: "600",
	},
	lessonListOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "flex-end",
	},
	lessonListContainer: {
		backgroundColor: "#FDF5E6",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: "70%",
		paddingBottom: 20,
	},
	lessonListHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
	},
	lessonListTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	module: {
		padding: 16,
	},
	moduleName: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 12,
	},
	lessonItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	currentLesson: {
		backgroundColor: "#2E8B5720",
		borderWidth: 2,
		borderColor: "#2E8B57",
	},
	lessonItemLeft: {
		flexDirection: "row",
		gap: 10,
		flex: 1,
		alignItems: "center",
	},
	lessonItemTitle: {
		flex: 1,
		fontSize: 14,
		color: "#2F4F4F",
		lineHeight: 20,
	},
	currentLessonText: {
		fontWeight: "600",
		color: "#2E8B57",
	},
	lessonItemDuration: {
		fontSize: 12,
		color: "#8B4513",
		marginLeft: 8,
	},
});
