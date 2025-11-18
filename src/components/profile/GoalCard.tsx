/**
 * GoalCard Component
 *
 * Displays individual learning goal with progress
 */

import { Target } from 'lucide-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'

export interface LearningGoal {
	id: number
	title: string
	progress: number
	target: number
	current: number
	deadline: string
}

interface GoalCardProps {
	goal: LearningGoal
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Target size={20} color={colors.primary.main} strokeWidth={2} />
				<Text style={styles.title}>{goal.title}</Text>
			</View>
			<Text style={styles.deadline}>Target: {goal.deadline}</Text>
			<View style={styles.progress}>
				<View style={styles.progressBar}>
					<View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
				</View>
				<Text style={styles.progressText}>
					{goal.current} of {goal.target} • {goal.progress}%
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.neutral.white,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.sm,
		borderLeftWidth: 4,
		borderLeftColor: colors.primary.main,
		...spacing.shadow.sm,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginLeft: spacing.sm,
		flex: 1,
	},
	deadline: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		marginBottom: spacing.sm,
	},
	progress: {
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
		backgroundColor: colors.primary.main,
		borderRadius: spacing.radius.sm,
	},
	progressText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		minWidth: 80,
	},
})
