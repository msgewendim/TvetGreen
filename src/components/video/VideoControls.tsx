import {
	ArrowLeft,
	Mic,
	MicOff,
	Pause,
	Play,
	RotateCcw,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
	Bookmark,
	MessageSquare,
	Settings,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

interface VideoControlsProps {
	isPlaying: boolean;
	isMuted: boolean;
	isListening: boolean;
	showControls: boolean;
	currentTime: number;
	duration: number;
	progressPercentage: number;
	onTogglePlayPause: () => void;
	onToggleMute: () => void;
	onToggleVoiceGuide: () => void;
	onSeek: (seconds: number) => void;
	onShowSettings: () => void;
	onBack: () => void;
	lessonTitle: string;
	lessonNumber: number;
	totalLessons: number;
}

export function VideoControls({
	isPlaying,
	isMuted,
	isListening,
	showControls,
	currentTime,
	duration,
	progressPercentage,
	onTogglePlayPause,
	onToggleMute,
	onToggleVoiceGuide,
	onSeek,
	onShowSettings,
	onBack,
	lessonTitle,
	lessonNumber,
	totalLessons,
}: VideoControlsProps) {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (!showControls) return null;

	return (
		<View style={styles.overlay}>
			{/* Top Controls */}
			<View style={styles.topControls}>
				<TouchableOpacity style={styles.backButton} onPress={onBack}>
					<ArrowLeft size={24} color={colors.text.inverse} strokeWidth={2} />
				</TouchableOpacity>

				<View style={styles.lessonInfo}>
					<Text style={styles.lessonTitle} numberOfLines={1}>
						{lessonTitle}
					</Text>
					<Text style={styles.lessonMeta}>
						Lesson {lessonNumber} of {totalLessons}
					</Text>
				</View>

				<TouchableOpacity
					style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
					onPress={onToggleVoiceGuide}
				>
					{isListening ? (
						<MicOff size={20} color={colors.text.inverse} strokeWidth={2} />
					) : (
						<Mic size={20} color={colors.text.inverse} strokeWidth={2} />
					)}
				</TouchableOpacity>
			</View>

			{/* Center Play Button */}
			<TouchableOpacity
				style={styles.centerPlayButton}
				onPress={onTogglePlayPause}
			>
				{isPlaying ? (
					<Pause size={32} color={colors.text.inverse} strokeWidth={2} />
				) : (
					<Play size={32} color={colors.text.inverse} strokeWidth={2} />
				)}
			</TouchableOpacity>

			{/* Bottom Controls */}
			<View style={styles.bottomControls}>
				{/* Progress Bar */}
				<View style={styles.progressContainer}>
					<Text style={styles.timeText}>{formatTime(currentTime)}</Text>
					<View style={styles.progressBar}>
						<View
							style={[styles.progressFill, { width: `${progressPercentage}%` }]}
						/>
						<View style={styles.progressThumb} />
					</View>
					<Text style={styles.timeText}>{formatTime(duration)}</Text>
				</View>

				{/* Control Buttons */}
				<View style={styles.controlButtons}>
					<TouchableOpacity
						style={styles.controlButton}
						onPress={() => onSeek(-10)}
					>
						<RotateCcw size={24} color={colors.text.inverse} strokeWidth={2} />
						<Text style={styles.controlButtonText}>-10s</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.controlButton}
						onPress={() => onSeek(-30)}
					>
						<SkipBack size={24} color={colors.text.inverse} strokeWidth={2} />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.mainPlayButton}
						onPress={onTogglePlayPause}
					>
						{isPlaying ? (
							<Pause size={28} color={colors.text.inverse} strokeWidth={2} />
						) : (
							<Play size={28} color={colors.text.inverse} strokeWidth={2} />
						)}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.controlButton}
						onPress={() => onSeek(30)}
					>
						<SkipForward
							size={24}
							color={colors.text.inverse}
							strokeWidth={2}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.controlButton}
						onPress={() => onSeek(10)}
					>
						<RotateCcw
							size={24}
							color={colors.text.inverse}
							strokeWidth={2}
							style={{ transform: [{ scaleX: -1 }] }}
						/>
						<Text style={styles.controlButtonText}>+10s</Text>
					</TouchableOpacity>
				</View>

				{/* Additional Controls */}
				<View style={styles.additionalControls}>
					<TouchableOpacity
						style={styles.additionalButton}
						onPress={onToggleMute}
					>
						{isMuted ? (
							<VolumeX size={20} color={colors.text.inverse} strokeWidth={2} />
						) : (
							<Volume2 size={20} color={colors.text.inverse} strokeWidth={2} />
						)}
					</TouchableOpacity>

					<TouchableOpacity style={styles.additionalButton}>
						<Bookmark size={20} color={colors.text.inverse} strokeWidth={2} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.additionalButton}>
						<MessageSquare
							size={20}
							color={colors.text.inverse}
							strokeWidth={2}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.additionalButton}
						onPress={onShowSettings}
					>
						<Settings size={20} color={colors.text.inverse} strokeWidth={2} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		justifyContent: "space-between",
	},
	topControls: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingTop: 50,
		paddingBottom: spacing.lg,
	},
	backButton: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	lessonInfo: {
		flex: 1,
		marginHorizontal: spacing.md,
	},
	lessonTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.xs,
	},
	lessonMeta: {
		fontSize: typography.fontSize.sm,
		color: colors.text.inverse,
		opacity: 0.8,
	},
	voiceButton: {
		backgroundColor: colors.secondary.main,
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	voiceButtonActive: {
		backgroundColor: "#DC143C",
	},
	centerPlayButton: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -35 }, { translateY: -35 }],
		backgroundColor: "rgba(46, 139, 87, 0.9)",
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: "center",
		alignItems: "center",
	},
	bottomControls: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.lg,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.lg,
	},
	timeText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.inverse,
		fontWeight: typography.fontWeight.medium,
		minWidth: 45,
		textAlign: "center",
	},
	progressBar: {
		flex: 1,
		height: 4,
		backgroundColor: "rgba(253, 245, 230, 0.3)",
		borderRadius: 2,
		marginHorizontal: spacing.sm,
		position: "relative",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.secondary.main,
		borderRadius: 2,
	},
	progressThumb: {
		position: "absolute",
		right: 0,
		top: -4,
		width: 12,
		height: 12,
		backgroundColor: colors.secondary.main,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: colors.text.inverse,
	},
	controlButtons: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.lg,
		marginBottom: spacing.md,
	},
	controlButton: {
		alignItems: "center",
		gap: spacing.xs,
	},
	controlButtonText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.inverse,
		fontWeight: typography.fontWeight.medium,
	},
	mainPlayButton: {
		backgroundColor: "rgba(46, 139, 87, 0.9)",
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
	},
	additionalControls: {
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.lg,
	},
	additionalButton: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
});
