/**
 * CurrentCourseCard Component
 *
 * Displays the current course progress with banner image and continue button
 */

import { Play } from 'lucide-react-native'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, ProgressBar, spacing, typography } from '@/design-system'

export interface CurrentCourse {
	title: string
	category: string
	progress: number
	imageUrl: string
}

interface CurrentCourseCardProps {
	course: CurrentCourse
	onContinue?: () => void
}

export const CurrentCourseCard: React.FC<CurrentCourseCardProps> = ({
	course,
	onContinue,
}) => {
	return (
		<View style={styles.container}>
			<ImageBackground
				source={{ uri: course.imageUrl }}
				style={styles.banner}
				imageStyle={styles.bannerImage}
			>
				<View style={styles.overlay}>
					<View style={styles.courseInfo}>
						<Text style={styles.category}>{course.category}</Text>
						<Text style={styles.title}>{course.title}</Text>
						<ProgressBar
							progress={course.progress}
							size="medium"
							showLabel
							color={colors.feedback.success}
							style={styles.progressBar}
						/>
					</View>
					<TouchableOpacity
						style={styles.continueButton}
						onPress={onContinue}
						accessibilityLabel="Continue course"
					>
						<Play size={20} color={colors.text.inverse} strokeWidth={2} />
						<Text style={styles.continueButtonText}>Continue</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: spacing.lg,
		marginVertical: spacing.lg,
		borderRadius: spacing.radius.md,
		overflow: 'hidden',
	},
	banner: {
		height: 200,
		justifyContent: 'flex-end',
	},
	bannerImage: {
		borderRadius: spacing.radius.md,
	},
	overlay: {
		backgroundColor: 'rgba(22, 163, 74, 0.85)',
		padding: spacing.lg,
		borderRadius: spacing.radius.md,
	},
	courseInfo: {
		marginBottom: spacing.md,
	},
	category: {
		fontSize: typography.fontSize.sm,
		color: colors.secondary.main,
		fontWeight: typography.fontWeight.semibold,
		marginBottom: spacing.xs,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.sm,
	},
	progressBar: {
		marginBottom: 0,
	},
	continueButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.secondary.main,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		borderRadius: spacing.radius.sm,
		alignSelf: 'flex-start',
	},
	continueButtonText: {
		color: colors.text.inverse,
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		marginLeft: spacing.sm,
	},
})
