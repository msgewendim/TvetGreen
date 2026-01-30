import {
	ArrowRight,
	CircleCheck as CheckCircle,
	Download,
	Play,
	SkipBack,
	SkipForward,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

interface NextLesson {
	id: number | string;
	title: string;
	duration: string;
}

interface LessonInfoPanelProps {
	title: string;
	courseTitle: string;
	instructor: string;
	lessonNumber: number;
	totalLessons: number;
	isDownloaded: boolean;
	nextLesson?: NextLesson;
	onDownload: () => void;
	onPrevious: () => void;
	onNext: () => void;
	onComplete: () => void;
	onNextLessonPress: () => void;
}

export function LessonInfoPanel({
	title,
	courseTitle,
	instructor,
	lessonNumber,
	totalLessons,
	isDownloaded,
	nextLesson,
	onDownload,
	onPrevious,
	onNext,
	onComplete,
	onNextLessonPress,
}: LessonInfoPanelProps) {
	const lessonProgress = (lessonNumber / totalLessons) * 100;

	return (
		<View style={styles.panel}>
			<View style={styles.header}>
				<View style={styles.titleContainer}>
					<Text style={styles.panelTitle} numberOfLines={2}>
						{title}
					</Text>
					<Text style={styles.courseTitleText}>{courseTitle}</Text>
					<Text style={styles.instructorText}>by {instructor}</Text>
				</View>

				<View style={styles.actions}>
					{isDownloaded ? (
						<View style={styles.downloadedBadge}>
							<Download
								size={16}
								color={colors.feedback.success}
								strokeWidth={2}
							/>
							<Text style={styles.downloadedText}>Downloaded</Text>
						</View>
					) : (
						<TouchableOpacity
							style={styles.downloadButton}
							onPress={onDownload}
						>
							<Download size={16} color={colors.primary.main} strokeWidth={2} />
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Course Progress */}
			<View style={styles.courseProgress}>
				<Text style={styles.progressLabel}>Course Progress</Text>
				<View style={styles.progressBarContainer}>
					<View style={styles.courseProgressBar}>
						<View
							style={[
								styles.courseProgressFill,
								{ width: `${lessonProgress}%` },
							]}
						/>
					</View>
					<Text style={styles.progressPercentage}>
						{lessonNumber}/{totalLessons} lessons
					</Text>
				</View>
			</View>

			{/* Navigation Buttons */}
			<View style={styles.navigationButtons}>
				<TouchableOpacity
					style={[styles.navButton, styles.previousButton]}
					disabled={lessonNumber === 1}
					onPress={onPrevious}
				>
					<SkipBack
						size={20}
						color={
							lessonNumber === 1 ? colors.text.disabled : colors.text.primary
						}
						strokeWidth={2}
					/>
					<Text
						style={[
							styles.navButtonText,
							lessonNumber === 1 && styles.navButtonTextDisabled,
						]}
					>
						Previous
					</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.completeButton} onPress={onComplete}>
					<CheckCircle size={20} color={colors.text.inverse} strokeWidth={2} />
					<Text style={styles.completeButtonText}>Mark Complete</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.navButton, styles.nextButton]}
					onPress={onNext}
				>
					<Text style={styles.navButtonText}>Next</Text>
					<SkipForward size={20} color={colors.text.primary} strokeWidth={2} />
				</TouchableOpacity>
			</View>

			{/* Next Lesson Preview */}
			{nextLesson && (
				<View style={styles.nextLessonPreview}>
					<Text style={styles.nextLessonLabel}>Up Next:</Text>
					<TouchableOpacity
						style={styles.nextLessonCard}
						onPress={onNextLessonPress}
					>
						<Play size={16} color={colors.primary.main} strokeWidth={2} />
						<View style={styles.nextLessonInfo}>
							<Text style={styles.nextLessonTitle}>{nextLesson.title}</Text>
							<Text style={styles.nextLessonDuration}>
								{nextLesson.duration}
							</Text>
						</View>
						<ArrowRight size={20} color={colors.primary.main} strokeWidth={2} />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	panel: {
		backgroundColor: colors.background.cream,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: spacing.md,
	},
	titleContainer: {
		flex: 1,
		marginRight: spacing.sm,
	},
	panelTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	courseTitleText: {
		fontSize: typography.fontSize.sm,
		color: colors.primary.main,
		fontWeight: typography.fontWeight.semibold,
		marginBottom: 2,
	},
	instructorText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
	actions: {
		alignItems: "center",
	},
	downloadedBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.surface,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.sm,
	},
	downloadedText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.feedback.success,
		marginLeft: spacing.xs,
	},
	downloadButton: {
		backgroundColor: colors.primary.surface,
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	courseProgress: {
		marginBottom: spacing.lg,
	},
	progressLabel: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	progressBarContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	courseProgressBar: {
		flex: 1,
		height: 6,
		backgroundColor: colors.neutral[300],
		borderRadius: 3,
	},
	courseProgressFill: {
		height: "100%",
		backgroundColor: colors.primary.main,
		borderRadius: 3,
	},
	progressPercentage: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		minWidth: 80,
	},
	navigationButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.md,
		gap: spacing.sm,
	},
	navButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.secondary,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: spacing.radius.sm,
		borderWidth: 2,
		borderColor: colors.border.light,
		flex: 1,
		justifyContent: "center",
		gap: spacing.xs + 2,
	},
	previousButton: {
		maxWidth: 100,
	},
	nextButton: {
		maxWidth: 100,
	},
	navButtonText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	navButtonTextDisabled: {
		color: colors.text.disabled,
	},
	completeButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.main,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
		borderRadius: spacing.radius.sm,
		gap: spacing.sm,
		flex: 2,
		justifyContent: "center",
	},
	completeButtonText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.inverse,
	},
	nextLessonPreview: {
		backgroundColor: colors.background.secondary,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.primary.surface,
	},
	nextLessonLabel: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.primary.main,
		marginBottom: spacing.sm,
	},
	nextLessonCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	nextLessonInfo: {
		flex: 1,
	},
	nextLessonTitle: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	nextLessonDuration: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
});
