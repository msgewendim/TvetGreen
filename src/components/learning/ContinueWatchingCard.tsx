import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Dimensions,
} from "react-native";
import { Play, Clock } from "lucide-react-native";
import type { LessonWithProgress } from "@/src/types/learning";
import { useLanguage } from "@/hooks/useLanguage";

const CARD_WIDTH = Dimensions.get("window").width * 0.6;

interface ContinueWatchingCardProps {
	lesson: LessonWithProgress;
	courseTitle: string;
	courseThumbnail: string;
	onPress: () => void;
}

export function ContinueWatchingCard({
	lesson,
	courseTitle,
	courseThumbnail,
	onPress,
}: ContinueWatchingCardProps) {
	const { t } = useLanguage();

	const progressPercent = lesson.progress || 0;

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.8}
		>
			{/* Thumbnail with Play Overlay */}
			<View style={styles.thumbnailContainer}>
				<Image
					source={{ uri: courseThumbnail }}
					style={styles.thumbnail}
					resizeMode="cover"
				/>

				{/* Play Icon Overlay */}
				<View style={styles.playOverlay}>
					<View style={styles.playButton}>
						<Play size={32} color="#FDF5E6" fill="#FDF5E6" />
					</View>
				</View>

				{/* Progress Bar Overlay */}
				<View style={styles.progressOverlay}>
					<View style={styles.progressBarTrack}>
						<View
							style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
						/>
					</View>
				</View>

				{/* Duration Badge */}
				<View style={styles.durationBadge}>
					<Clock size={12} color="#FDF5E6" />
					<Text style={styles.durationText}>{lesson.duration}</Text>
				</View>
			</View>

			{/* Lesson Info */}
			<View style={styles.info}>
				<Text style={styles.courseTitle} numberOfLines={1}>
					{courseTitle}
				</Text>
				<Text style={styles.lessonTitle} numberOfLines={2}>
					{lesson.title}
				</Text>

				{/* Progress Percentage */}
				{progressPercent > 0 && progressPercent < 100 && (
					<View style={styles.progressInfo}>
						<Text style={styles.progressText}>
							{t("learning.progress")}: {progressPercent}%
						</Text>
					</View>
				)}

				{lesson.isCompleted && (
					<View style={styles.completedBadge}>
						<Text style={styles.completedText}>{t("learning.completed")}</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: CARD_WIDTH,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginRight: 16,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	thumbnailContainer: {
		position: "relative",
		width: "100%",
		height: CARD_WIDTH * 0.56, // 16:9 aspect ratio
		backgroundColor: "#E5E5E5",
	},
	thumbnail: {
		width: "100%",
		height: "100%",
	},
	playOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	playButton: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "rgba(46, 139, 87, 0.9)",
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	progressOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	progressBarTrack: {
		height: 4,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 2,
	},
	durationBadge: {
		position: "absolute",
		top: 8,
		right: 8,
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	durationText: {
		fontSize: 11,
		fontWeight: "600",
		color: "#FDF5E6",
	},
	info: {
		padding: 12,
	},
	courseTitle: {
		fontSize: 12,
		color: "#8B4513",
		marginBottom: 4,
		fontWeight: "500",
	},
	lessonTitle: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 20,
		marginBottom: 6,
	},
	progressInfo: {
		marginTop: 4,
	},
	progressText: {
		fontSize: 11,
		color: "#2E8B57",
		fontWeight: "600",
	},
	completedBadge: {
		alignSelf: "flex-start",
		backgroundColor: "#32CD3220",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		marginTop: 6,
	},
	completedText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#32CD32",
	},
});
