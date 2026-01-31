import {
	ArrowLeft,
	Mic,
	MicOff,
	Pause,
	Play,
	RotateCcw,
	Volume2,
	VolumeX,
	Settings,
	Maximize,
	Minimize,
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
	isFullscreen?: boolean;
	onTogglePlayPause: () => void;
	onToggleMute: () => void;
	onToggleVoiceGuide: () => void;
	onSeek: (seconds: number) => void;
	onShowSettings: () => void;
	onToggleFullscreen?: () => void;
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
	isFullscreen = false,
	onTogglePlayPause,
	onToggleMute,
	onToggleVoiceGuide,
	onSeek,
	onShowSettings,
	onToggleFullscreen,
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
			{/* Top Bar */}
			<View style={styles.topBar}>
				<TouchableOpacity style={styles.iconBtn} onPress={onBack}>
					<ArrowLeft size={22} color="#fff" strokeWidth={2.5} />
				</TouchableOpacity>

				<View style={styles.titleArea}>
					<Text style={styles.title} numberOfLines={1}>
						{lessonTitle}
					</Text>
					<Text style={styles.subtitle}>
						{lessonNumber}/{totalLessons}
					</Text>
				</View>

				<TouchableOpacity
					style={[styles.iconBtn, isListening && styles.iconBtnActive]}
					onPress={onToggleVoiceGuide}
				>
					{isListening ? (
						<MicOff size={20} color="#fff" strokeWidth={2} />
					) : (
						<Mic size={20} color="#fff" strokeWidth={2} />
					)}
				</TouchableOpacity>
			</View>

			{/* Center Controls */}
			<View style={styles.centerRow}>
				<TouchableOpacity
					style={styles.seekBtn}
					onPress={() => onSeek(-10)}
				>
					<RotateCcw size={28} color="#fff" strokeWidth={2} />
					<Text style={styles.seekLabel}>10</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.playBtn}
					onPress={onTogglePlayPause}
				>
					{isPlaying ? (
						<Pause size={32} color="#fff" strokeWidth={2.5} fill="#fff" />
					) : (
						<Play size={32} color="#fff" strokeWidth={2.5} fill="#fff" />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.seekBtn}
					onPress={() => onSeek(10)}
				>
					<RotateCcw
						size={28}
						color="#fff"
						strokeWidth={2}
						style={{ transform: [{ scaleX: -1 }] }}
					/>
					<Text style={styles.seekLabel}>10</Text>
				</TouchableOpacity>
			</View>

			{/* Bottom Bar */}
			<View style={styles.bottomBar}>
				{/* Progress */}
				<View style={styles.progressRow}>
					<Text style={styles.time}>{formatTime(currentTime)}</Text>
					<View style={styles.progressTrack}>
						<View
							style={[
								styles.progressFill,
								{ width: `${progressPercentage}%` },
							]}
						/>
					</View>
					<Text style={styles.time}>{formatTime(duration)}</Text>
				</View>

				{/* Bottom Icons */}
				<View style={styles.bottomIcons}>
					<TouchableOpacity style={styles.smallBtn} onPress={onToggleMute}>
						{isMuted ? (
							<VolumeX size={20} color="#fff" strokeWidth={2} />
						) : (
							<Volume2 size={20} color="#fff" strokeWidth={2} />
						)}
					</TouchableOpacity>

					<TouchableOpacity style={styles.smallBtn} onPress={onShowSettings}>
						<Settings size={20} color="#fff" strokeWidth={2} />
					</TouchableOpacity>

					{onToggleFullscreen && (
						<TouchableOpacity
							style={styles.smallBtn}
							onPress={onToggleFullscreen}
						>
							{isFullscreen ? (
								<Minimize size={20} color="#fff" strokeWidth={2} />
							) : (
								<Maximize size={20} color="#fff" strokeWidth={2} />
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.35)",
		justifyContent: "space-between",
	},
	topBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingTop: spacing.xl,
		gap: spacing.sm,
	},
	iconBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	iconBtnActive: {
		backgroundColor: "#DC143C",
	},
	titleArea: {
		flex: 1,
		alignItems: "center",
	},
	title: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: "#fff",
	},
	subtitle: {
		fontSize: typography.fontSize.xs,
		color: "rgba(255,255,255,0.7)",
		marginTop: 2,
	},
	centerRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 40,
	},
	seekBtn: {
		alignItems: "center",
		justifyContent: "center",
		width: 52,
		height: 52,
	},
	seekLabel: {
		position: "absolute",
		fontSize: 10,
		fontWeight: typography.fontWeight.bold,
		color: "#fff",
		top: 17,
	},
	playBtn: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "rgba(22,163,74,0.85)",
		justifyContent: "center",
		alignItems: "center",
	},
	bottomBar: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
	},
	progressRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.sm,
	},
	time: {
		fontSize: 11,
		color: "rgba(255,255,255,0.8)",
		fontWeight: typography.fontWeight.medium,
		fontVariant: ["tabular-nums"],
		minWidth: 36,
		textAlign: "center",
	},
	progressTrack: {
		flex: 1,
		height: 3,
		backgroundColor: "rgba(255,255,255,0.25)",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary.light,
		borderRadius: 2,
	},
	bottomIcons: {
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.lg,
	},
	smallBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
	},
});
