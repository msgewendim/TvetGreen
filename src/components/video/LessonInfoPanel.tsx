import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	CircleCheck as CheckCircle,
	Download,
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
	const progress = (lessonNumber / totalLessons) * 100;

	return (
		<View style={styles.container}>
			{/* Title Section */}
			<View style={styles.titleSection}>
				<View style={styles.titleLeft}>
					<Text style={styles.lessonTitle} numberOfLines={2}>
						{title}
					</Text>
					<Text style={styles.courseLabel}>{courseTitle}</Text>
					<Text style={styles.instructorLabel}>by {instructor}</Text>
				</View>
				{isDownloaded ? (
					<View style={styles.downloadedTag}>
						<Download size={14} color={colors.feedback.success} strokeWidth={2} />
					</View>
				) : (
					<TouchableOpacity style={styles.downloadBtn} onPress={onDownload}>
						<Download size={18} color={colors.primary.main} strokeWidth={2} />
					</TouchableOpacity>
				)}
			</View>

			{/* Progress */}
			<View style={styles.progressSection}>
				<View style={styles.progressTrack}>
					<View style={[styles.progressFill, { width: `${progress}%` }]} />
				</View>
				<Text style={styles.progressText}>
					{lessonNumber}/{totalLessons}
				</Text>
			</View>

			{/* Actions Row */}
			<View style={styles.actionsRow}>
				<TouchableOpacity
					style={[styles.navBtn, lessonNumber <= 1 && styles.navBtnDisabled]}
					disabled={lessonNumber <= 1}
					onPress={onPrevious}
				>
					<ChevronLeft
						size={18}
						color={lessonNumber <= 1 ? colors.text.disabled : colors.text.primary}
						strokeWidth={2}
					/>
				</TouchableOpacity>

				<TouchableOpacity style={styles.completeBtn} onPress={onComplete}>
					<CheckCircle size={18} color="#fff" strokeWidth={2} />
					<Text style={styles.completeBtnText}>Complete</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.navBtn} onPress={onNext}>
					<ChevronRight
						size={18}
						color={colors.text.primary}
						strokeWidth={2}
					/>
				</TouchableOpacity>
			</View>

			{/* Up Next */}
			{nextLesson && (
				<TouchableOpacity style={styles.nextCard} onPress={onNextLessonPress}>
					<View style={styles.nextInfo}>
						<Text style={styles.nextLabel}>Up Next</Text>
						<Text style={styles.nextTitle} numberOfLines={1}>
							{nextLesson.title}
						</Text>
						<Text style={styles.nextDuration}>{nextLesson.duration}</Text>
					</View>
					<ArrowRight size={18} color={colors.primary.main} strokeWidth={2} />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.md,
		borderTopLeftRadius: spacing.radius.xl,
		borderTopRightRadius: spacing.radius.xl,
		marginTop: -spacing.md,
	},
	titleSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: spacing.md,
	},
	titleLeft: {
		flex: 1,
		marginRight: spacing.sm,
	},
	lessonTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		lineHeight: 24,
		marginBottom: 4,
	},
	courseLabel: {
		fontSize: typography.fontSize.sm,
		color: colors.primary.main,
		fontWeight: typography.fontWeight.medium,
		marginBottom: 2,
	},
	instructorLabel: {
		fontSize: typography.fontSize.xs,
		color: colors.text.tertiary,
	},
	downloadBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.primary.surface,
		justifyContent: "center",
		alignItems: "center",
	},
	downloadedTag: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.feedback.successLight,
		justifyContent: "center",
		alignItems: "center",
	},
	progressSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.md,
	},
	progressTrack: {
		flex: 1,
		height: 4,
		backgroundColor: colors.neutral[200],
		borderRadius: 2,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary.main,
		borderRadius: 2,
	},
	progressText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.secondary,
	},
	actionsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.md,
	},
	navBtn: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.neutral[100],
		justifyContent: "center",
		alignItems: "center",
	},
	navBtnDisabled: {
		opacity: 0.4,
	},
	completeBtn: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.main,
		height: 44,
		borderRadius: 22,
		gap: spacing.sm,
	},
	completeBtnText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: "#fff",
	},
	nextCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.surface,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
	},
	nextInfo: {
		flex: 1,
	},
	nextLabel: {
		fontSize: 11,
		fontWeight: typography.fontWeight.semibold,
		color: colors.primary.main,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginBottom: 2,
	},
	nextTitle: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.medium,
		color: colors.text.primary,
		marginBottom: 2,
	},
	nextDuration: {
		fontSize: typography.fontSize.xs,
		color: colors.text.tertiary,
	},
});
