import {
	ActivityIndicator,
	Alert,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { useVideoPlayer } from "@/src/hooks/useVideoPlayer";
import { useLesson } from "@/src/hooks/useLesson";
import {
	VideoControls,
	VideoSettingsPanel,
	LessonInfoPanel,
	VoiceGuideOverlay,
	SubtitlesOverlay,
} from "@/src/components/video";
import { colors } from "@/design-system";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useEffect } from "react";
import { useLearningStore } from "@/src/store/learningStore";

const playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function VideoPlayerScreen() {
	const { courseId, lessonId } = useLocalSearchParams<{
		courseId: string;
		lessonId: string;
	}>();
	const router = useRouter();
	const { t } = useLanguage();
	const lessonData = useLesson();
	const updateLastAccessed = useLearningStore((s) => s.updateLastAccessed);

	const subtitleLanguages = [
		{ code: "en", name: "English", flag: "🇺🇸" },
		{ code: "am", name: "አማርኛ", flag: "🇪🇹" },
		{ code: "sw", name: "Kiswahili", flag: "🇰🇪" },
	];

	const player = useVideoPlayer({
		initialShowSubtitles: true,
		initialLanguage: "en",
		lessonId: lessonId as string,
		courseId: courseId as string,
	});

	// Update last accessed when entering
	useEffect(() => {
		if (courseId) {
			updateLastAccessed(courseId as string);
		}
	}, [courseId, updateLastAccessed]);

	const handleCompleteLesson = () => {
		Alert.alert(
			t("video.completed"),
			"Great job! You've completed this lesson. Ready for the next one?",
			[
				{ text: t("video.replay"), style: "cancel" },
				{
					text: t("video.nextLesson"),
					onPress: () => {
						if (lessonData.nextLesson) {
							router.replace(
								`/video/${courseId}/${lessonData.nextLesson.id}`,
							);
						}
					},
				},
			],
		);
	};

	const handlePrevious = () => {
		router.back();
	};

	const handleNextLesson = () => {
		if (lessonData.nextLesson) {
			router.replace(`/video/${courseId}/${lessonData.nextLesson.id}`);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar hidden />

			<TouchableOpacity
				style={styles.videoContainer}
				onPress={() => player.setShowControls(!player.showControls)}
				activeOpacity={1}
			>
				{lessonData.videoUrl ? (
					<Video
						ref={player.videoRef}
						source={{ uri: lessonData.videoUrl }}
						style={styles.video}
						resizeMode={ResizeMode.CONTAIN}
						shouldPlay={false}
						isMuted={player.isMuted}
						rate={player.playbackSpeed}
						positionMillis={
							lessonData.lastPosition > 0
								? lessonData.lastPosition * 1000
								: undefined
						}
						onPlaybackStatusUpdate={player.onPlaybackStatusUpdate}
						progressUpdateIntervalMillis={500}
					/>
				) : (
					<View style={styles.videoPlaceholder}>
						<ActivityIndicator
							size="large"
							color={colors.primary.main}
						/>
					</View>
				)}

				{player.isBuffering && (
					<View style={styles.bufferingOverlay}>
						<ActivityIndicator
							size="large"
							color={colors.text.inverse}
						/>
					</View>
				)}

				<SubtitlesOverlay
					showSubtitles={player.showSubtitles}
					subtitleText=""
				/>

				<VideoControls
					isPlaying={player.isPlaying}
					isMuted={player.isMuted}
					isListening={player.isListening}
					showControls={player.showControls}
					currentTime={player.currentTime}
					duration={player.duration}
					progressPercentage={player.progressPercentage}
					onTogglePlayPause={player.togglePlayPause}
					onToggleMute={() => player.setIsMuted(!player.isMuted)}
					onToggleVoiceGuide={player.toggleVoiceGuide}
					onSeek={player.handleSeek}
					onShowSettings={() => player.setShowSettings(true)}
					onBack={() => router.back()}
					lessonTitle={lessonData.title}
					lessonNumber={lessonData.lessonNumber}
					totalLessons={lessonData.totalLessons}
				/>

				<VoiceGuideOverlay isListening={player.isListening} />

				<VideoSettingsPanel
					showSettings={player.showSettings}
					playbackSpeed={player.playbackSpeed}
					selectedLanguage={player.selectedLanguage}
					showSubtitles={player.showSubtitles}
					playbackSpeeds={playbackSpeeds}
					subtitleLanguages={subtitleLanguages}
					onClose={() => player.setShowSettings(false)}
					onSpeedChange={player.handleSpeedChange}
					onLanguageChange={player.handleLanguageChange}
					onToggleSubtitles={() =>
						player.setShowSubtitles(!player.showSubtitles)
					}
				/>
			</TouchableOpacity>

			<LessonInfoPanel
				title={lessonData.title}
				courseTitle={lessonData.courseTitle}
				instructor={lessonData.instructor}
				lessonNumber={lessonData.lessonNumber}
				totalLessons={lessonData.totalLessons}
				isDownloaded={lessonData.isDownloaded}
				nextLesson={lessonData.nextLesson}
				onDownload={() => {}}
				onPrevious={handlePrevious}
				onNext={handleNextLesson}
				onComplete={handleCompleteLesson}
				onNextLessonPress={handleNextLesson}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	videoContainer: {
		flex: 1,
		position: "relative",
	},
	video: {
		flex: 1,
		backgroundColor: "#000",
	},
	videoPlaceholder: {
		flex: 1,
		backgroundColor: "#1a1a1a",
		justifyContent: "center",
		alignItems: "center",
	},
	bufferingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},
});
