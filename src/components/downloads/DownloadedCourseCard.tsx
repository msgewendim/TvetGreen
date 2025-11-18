/**
 * DownloadedCourseCard Component
 *
 * Displays information about a downloaded course
 */

import { CheckCircle, Play, Trash2 } from 'lucide-react-native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'

export interface DownloadedCourse {
	id: number
	title: string
	category: string
	size: string
	downloadDate: string
	progress: number
	totalLessons: number
	completedLessons: number
	lastWatched: string
}

interface DownloadedCourseCardProps {
	course: DownloadedCourse
	onPlay?: (courseId: number) => void
	onDelete?: (courseId: number, courseTitle: string) => void
}

export const DownloadedCourseCard: React.FC<DownloadedCourseCardProps> = ({
	course,
	onPlay,
	onDelete,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.info}>
					<Text style={styles.title} numberOfLines={2}>
						{course.title}
					</Text>
					<Text style={styles.category}>{course.category}</Text>
					<Text style={styles.size}>
						{course.size} • Downloaded {course.downloadDate}
					</Text>
				</View>

				<View style={styles.actions}>
					<TouchableOpacity
						style={styles.playButton}
						onPress={() => onPlay?.(course.id)}
						accessibilityLabel={`Play ${course.title}`}
					>
						<Play size={20} color={colors.text.inverse} strokeWidth={2} />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.deleteButton}
						onPress={() => onDelete?.(course.id, course.title)}
						accessibilityLabel={`Delete ${course.title}`}
					>
						<Trash2 size={18} color={colors.feedback.error} strokeWidth={2} />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.progressSection}>
				<View style={styles.progressInfo}>
					<Text style={styles.progressText}>
						{course.completedLessons} of {course.totalLessons} lessons completed
					</Text>
					<Text style={styles.lastWatchedText}>Last: {course.lastWatched}</Text>
				</View>

				<View style={styles.progressBarContainer}>
					<View style={styles.progressBar}>
						<View
							style={[styles.progressFill, { width: `${course.progress}%` }]}
						/>
					</View>
					<Text style={styles.progressPercentage}>{course.progress}%</Text>
				</View>
			</View>

			{course.progress === 100 && (
				<View style={styles.completedBadge}>
					<CheckCircle size={16} color={colors.feedback.success} strokeWidth={2} />
					<Text style={styles.completedText}>Course Completed!</Text>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.md,
		padding: spacing.md,
		marginBottom: spacing.sm,
		...spacing.shadow.md,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: spacing.sm,
	},
	info: {
		flex: 1,
		marginRight: spacing.sm,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs / 2,
	},
	category: {
		fontSize: typography.fontSize.sm,
		color: colors.primary.main,
		fontWeight: typography.fontWeight.semibold,
		marginBottom: spacing.xs / 2,
	},
	size: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
	},
	actions: {
		flexDirection: 'row',
		gap: spacing.sm,
	},
	playButton: {
		backgroundColor: colors.primary.main,
		width: 44,
		height: 44,
		borderRadius: spacing.radius.full,
		justifyContent: 'center',
		alignItems: 'center',
	},
	deleteButton: {
		backgroundColor: colors.neutral[100],
		width: 44,
		height: 44,
		borderRadius: spacing.radius.full,
		justifyContent: 'center',
		alignItems: 'center',
	},
	progressSection: {
		marginBottom: spacing.sm,
	},
	progressInfo: {
		marginBottom: spacing.sm,
	},
	progressText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	lastWatchedText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
	},
	progressBarContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	progressBar: {
		flex: 1,
		height: 6,
		backgroundColor: colors.neutral[200],
		borderRadius: spacing.radius.sm,
	},
	progressFill: {
		height: '100%',
		backgroundColor: colors.feedback.success,
		borderRadius: spacing.radius.sm,
	},
	progressPercentage: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		minWidth: 35,
	},
	completedBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.feedback.successLight,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.lg,
		alignSelf: 'flex-start',
	},
	completedText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.feedback.success,
		marginLeft: spacing.xs / 2,
	},
})
