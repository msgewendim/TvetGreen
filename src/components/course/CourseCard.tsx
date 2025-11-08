import {
	CircleCheck as CheckCircle,
	ChevronRight,
	Clock,
	Download,
	Play,
	Star,
	Users,
} from 'lucide-react-native'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'

export interface Course {
	id: string | number
	title: string
	category: string
	instructor: string
	duration: string
	lessons: number
	difficulty: string
	rating: number
	enrolled: number
	progress: number
	isDownloaded: boolean
	isFree: boolean
	image: string
	description: string
	videoUrl: string
}

interface CourseCardProps {
	course: Course
	onPress: () => void
}

export function CourseCard({ course, onPress }: CourseCardProps) {
	return (
		<TouchableOpacity
			style={styles.card}
			delayPressIn={80}
			activeOpacity={0.9}
			pressRetentionOffset={{ top: 8, left: 8, right: 8, bottom: 8 }}
			onPress={onPress}
			accessibilityLabel={`Course: ${course.title}`}
		>
			<ImageBackground
				source={{ uri: course.image }}
				style={styles.image}
				imageStyle={styles.imageStyle}
			>
				<View style={styles.imageOverlay}>
					{course.progress > 0 ? (
						<View style={styles.progressIndicator}>
							<CheckCircle size={20} color={colors.feedback.success} strokeWidth={2} />
							<Text style={styles.progressText}>{course.progress}%</Text>
						</View>
					) : (
						<View style={styles.playButton}>
							<Play size={16} color={colors.text.inverse} strokeWidth={2} />
						</View>
					)}
				</View>
			</ImageBackground>

			<View style={styles.info}>
				<View style={styles.header}>
					<Text style={styles.title} numberOfLines={2}>
						{course.title}
					</Text>
					<View style={styles.actions}>
						{course.isDownloaded ? (
							<View style={styles.downloadedBadge}>
								<Download size={16} color={colors.feedback.success} strokeWidth={2} />
							</View>
						) : (
							<TouchableOpacity style={styles.downloadButton}>
								<Download size={16} color={colors.text.secondary} strokeWidth={2} />
							</TouchableOpacity>
						)}
					</View>
				</View>

				<Text style={styles.instructorName}>by {course.instructor}</Text>

				<View style={styles.metrics}>
					<View style={styles.metricItem}>
						<Clock size={14} color={colors.text.secondary} strokeWidth={2} />
						<Text style={styles.metricText}>{course.duration}</Text>
					</View>
					<View style={styles.metricItem}>
						<Users size={14} color={colors.text.secondary} strokeWidth={2} />
						<Text style={styles.metricText}>
							{course.enrolled.toLocaleString()}
						</Text>
					</View>
					<View style={styles.metricItem}>
						<Star size={14} color={colors.feedback.warning} strokeWidth={2} />
						<Text style={styles.metricText}>{course.rating}</Text>
					</View>
				</View>

				<Text style={styles.description} numberOfLines={2}>
					{course.description}
				</Text>

				<View style={styles.footer}>
					<View style={styles.difficultyBadge}>
						<Text style={styles.difficultyText}>{course.difficulty}</Text>
					</View>
					<Text style={styles.lessonCount}>{course.lessons} lessons</Text>
				</View>

				{course.progress > 0 && (
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View
								style={[styles.progressFill, { width: `${course.progress}%` }]}
							/>
						</View>
						<TouchableOpacity style={styles.continueButton}>
							<Text style={styles.continueButtonText}>Continue Learning</Text>
							<ChevronRight size={16} color={colors.text.inverse} strokeWidth={2} />
						</TouchableOpacity>
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.background.secondary,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.md,
		...spacing.shadow.sm,
		overflow: 'hidden',
	},
	image: {
		height: 120,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		padding: spacing.sm,
	},
	imageStyle: {
		borderTopLeftRadius: spacing.radius.md,
		borderTopRightRadius: spacing.radius.md,
	},
	imageOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(46, 139, 87, 0.3)',
		borderTopLeftRadius: spacing.radius.md,
		borderTopRightRadius: spacing.radius.md,
	},
	progressIndicator: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.sm,
		position: 'absolute',
		top: spacing.sm,
		right: spacing.sm,
	},
	progressText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginLeft: spacing.xs,
	},
	playButton: {
		backgroundColor: 'rgba(255, 140, 66, 0.9)',
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: spacing.sm,
		right: spacing.sm,
	},
	info: {
		padding: spacing.md,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		flex: 1,
		marginRight: spacing.sm,
	},
	actions: {
		flexDirection: 'row',
		gap: spacing.sm,
	},
	downloadedBadge: {
		padding: spacing.xs + 2,
		borderRadius: spacing.xs + 2,
		backgroundColor: colors.feedback.successLight,
	},
	downloadButton: {
		padding: spacing.xs + 2,
		borderRadius: spacing.xs + 2,
		backgroundColor: colors.neutral[100],
	},
	instructorName: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		marginBottom: spacing.sm,
	},
	metrics: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
		marginBottom: spacing.sm,
	},
	metricItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	metricText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		fontWeight: typography.fontWeight.medium,
	},
	description: {
		fontSize: typography.fontSize.sm,
		color: colors.text.primary,
		lineHeight: 20,
		marginBottom: spacing.sm,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	difficultyBadge: {
		backgroundColor: colors.neutral[50],
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.xs + 2,
		borderWidth: 1,
		borderColor: colors.border.light,
	},
	difficultyText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.primary,
		fontWeight: typography.fontWeight.medium,
	},
	lessonCount: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		fontWeight: typography.fontWeight.medium,
	},
	progressContainer: {
		marginTop: spacing.sm,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border.light,
	},
	progressBar: {
		height: 4,
		backgroundColor: colors.neutral[100],
		borderRadius: 2,
		marginBottom: spacing.sm,
	},
	progressFill: {
		height: '100%',
		backgroundColor: colors.feedback.success,
		borderRadius: 2,
	},
	continueButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.primary.main,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.sm,
		borderRadius: spacing.xs + 2,
		alignSelf: 'flex-start',
	},
	continueButtonText: {
		color: colors.text.inverse,
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		marginRight: spacing.xs,
	},
})

