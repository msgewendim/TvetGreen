import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import { useLesson } from '@/hooks/useLesson'
import {
	VideoControls,
	VideoSettingsPanel,
	LessonInfoPanel,
	VoiceGuideOverlay,
	SubtitlesOverlay,
} from '@/src/components/video'
import { colors } from '@/design-system'

const subtitleLanguages = [
	{ code: 'english', name: 'English', flag: '🇺🇸' },
	{ code: 'amharic', name: 'አማርኛ', flag: '🇪🇹' },
	{ code: 'swahili', name: 'Kiswahili', flag: '🇰🇪' },
]

const playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

export default function VideoPlayerScreen() {
	const { courseId, lessonId } = useLocalSearchParams()
	const router = useRouter()
	const lessonData = useLesson()

	const player = useVideoPlayer({
		initialShowSubtitles: true,
		initialLanguage: 'english',
	})

	const handleCompleteLesson = () => {
		Alert.alert(
			'Lesson Complete! 🎉',
			"Great job! You've completed this lesson. Ready for the next one?",
			[
				{ text: 'Review Again', style: 'cancel' },
				{
					text: 'Next Lesson',
					onPress: () => {
						router.push(`/video/${courseId}/${Number.parseInt(lessonId as string, 10) + 1}`)
					},
				},
			],
		)
	}

	const handlePrevious = () => {
		const prevLessonId = Number.parseInt(lessonId as string, 10) - 1
		if (prevLessonId > 0) {
			router.push(`/video/${courseId}/${prevLessonId}`)
		}
	}

	const handleNext = () => {
		router.push(`/video/${courseId}/${Number.parseInt(lessonId as string, 10) + 1}`)
	}

	const handleNextLessonPress = () => {
		if (lessonData.nextLesson) {
			router.push(`/video/${courseId}/${lessonData.nextLesson.id}`)
		}
	}

	return (
		<View style={styles.container}>
			<StatusBar hidden />

			{/* Video Container */}
			<TouchableOpacity
				style={styles.videoContainer}
				onPress={() => player.setShowControls(!player.showControls)}
				activeOpacity={1}
			>
				{/* Mock Video Background */}
				<View style={styles.videoBackground}>
					<Text style={styles.videoPlaceholder}>🎥 {lessonData.title}</Text>

					<SubtitlesOverlay
						showSubtitles={player.showSubtitles}
						subtitleText='"First, we prepare the soil by removing weeds and rocks..."'
					/>
				</View>

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
					onToggleSubtitles={() => player.setShowSubtitles(!player.showSubtitles)}
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
				onNext={handleNext}
				onComplete={handleCompleteLesson}
				onNextLessonPress={handleNextLessonPress}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	videoContainer: {
		flex: 1,
		position: 'relative',
	},
	videoBackground: {
		flex: 1,
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center',
	},
	videoPlaceholder: {
		fontSize: 24,
		color: colors.text.inverse,
		textAlign: 'center',
		fontWeight: '600',
	},
})
