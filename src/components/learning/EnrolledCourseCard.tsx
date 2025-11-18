import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
} from "react-native";
import { ChevronRight, Clock, Award, Play } from "lucide-react-native";
import type { CourseWithStatus } from "@/src/types/learning";
import { useLanguage } from "@/hooks/useLanguage";

interface EnrolledCourseCardProps {
	course: CourseWithStatus;
	onPress: () => void;
	onContinue?: () => void;
	nextLessonTitle?: string;
	showNextLesson?: boolean;
}

export function EnrolledCourseCard({
	course,
	onPress,
	onContinue,
	nextLessonTitle,
	showNextLesson = true,
}: EnrolledCourseCardProps) {
	const { t } = useLanguage();

	const isCompleted = course.progress === 100;
	const lastAccessed = course.lastAccessed
		? formatTimestamp(course.lastAccessed, t)
		: null;

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Image
				source={{ uri: course.thumbnail }}
				style={styles.thumbnail}
				resizeMode="cover"
			/>

			{/* Certificate Badge for Completed Courses */}
			{isCompleted && (
				<View style={styles.certificateBadge}>
					<Award size={16} color="#DAA520" fill="#DAA520" />
				</View>
			)}

			<View style={styles.info}>
				{/* Course Title & Category */}
				<View style={styles.header}>
					<Text style={styles.title} numberOfLines={2}>
						{course.title}
					</Text>
					<Text style={styles.instructor} numberOfLines={1}>
						{course.instructor.name}
					</Text>
				</View>

				{/* Progress Bar with Percentage */}
				<View style={styles.progressContainer}>
					<View style={styles.progressBarTrack}>
						<View
							style={[
								styles.progressBarFill,
								{ width: `${course.progress || 0}%` },
							]}
						/>
					</View>
					<Text style={styles.progressText}>{course.progress || 0}%</Text>
				</View>

				{/* Last Accessed & Next Lesson */}
				<View style={styles.metaContainer}>
					{lastAccessed && (
						<View style={styles.metaRow}>
							<Clock size={14} color="#8B4513" />
							<Text style={styles.metaText}>{lastAccessed}</Text>
						</View>
					)}

					{!isCompleted && showNextLesson && nextLessonTitle && (
						<View style={styles.metaRow}>
							<Play size={14} color="#2E8B57" />
							<Text style={styles.nextLessonText} numberOfLines={1}>
								{t("learning.nextUp")}: {nextLessonTitle}
							</Text>
						</View>
					)}
				</View>

				{/* Continue Button */}
				<TouchableOpacity
					style={[
						styles.continueButton,
						isCompleted && styles.continueButtonCompleted,
					]}
					onPress={onContinue || onPress}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.continueButtonText,
							isCompleted && styles.continueButtonTextCompleted,
						]}
					>
						{isCompleted
							? t("learning.review")
							: t("learning.continueLearning")}
					</Text>
					<ChevronRight
						size={18}
						color={isCompleted ? "#2E8B57" : "#FDF5E6"}
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago", "Yesterday")
 */
function formatTimestamp(timestamp: string, t: any): string {
	const now = new Date();
	const then = new Date(timestamp);
	const diffMs = now.getTime() - then.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) {
		return t("time.justNow");
	} else if (diffMins < 60) {
		return t("time.minutesAgo", { count: diffMins });
	} else if (diffHours < 24) {
		return t("time.hoursAgo", { count: diffHours });
	} else if (diffDays === 1) {
		return t("time.yesterday");
	} else if (diffDays < 7) {
		return t("time.daysAgo", { count: diffDays });
	} else {
		return then.toLocaleDateString();
	}
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	thumbnail: {
		width: 120,
		height: 160,
		backgroundColor: "#E5E5E5",
	},
	certificateBadge: {
		position: "absolute",
		top: 12,
		left: 12,
		backgroundColor: "#FDF5E6",
		borderRadius: 20,
		padding: 8,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
	},
	info: {
		flex: 1,
		padding: 12,
		justifyContent: "space-between",
	},
	header: {
		marginBottom: 8,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 22,
		marginBottom: 4,
	},
	instructor: {
		fontSize: 13,
		color: "#8B4513",
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
	progressBarTrack: {
		flex: 1,
		height: 6,
		backgroundColor: "#E5E5E5",
		borderRadius: 3,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 3,
	},
	progressText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		width: 40,
		textAlign: "right",
	},
	metaContainer: {
		gap: 6,
		marginBottom: 8,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	metaText: {
		fontSize: 11,
		color: "#8B4513",
	},
	nextLessonText: {
		fontSize: 11,
		color: "#2E8B57",
		fontWeight: "500",
		flex: 1,
	},
	continueButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#2E8B57",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		gap: 6,
	},
	continueButtonCompleted: {
		backgroundColor: "#FDF5E6",
		borderWidth: 2,
		borderColor: "#2E8B57",
	},
	continueButtonText: {
		color: "#FDF5E6",
		fontSize: 14,
		fontWeight: "600",
	},
	continueButtonTextCompleted: {
		color: "#2E8B57",
	},
});
