/**
 * QuickActionsGrid Component
 *
 * Displays a grid of quick action category buttons
 */

import { StyleSheet, Text, View } from 'react-native'
import { CategoryButton, colors, spacing, typography } from '@/design-system'

export interface QuickAction {
	id: string
	label: string
	emoji: string
	color: string
}

interface QuickActionsGridProps {
	actions: QuickAction[]
	onActionPress?: (actionId: string) => void
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
	actions,
	onActionPress,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Quick Actions</Text>
			<View style={styles.grid}>
				{actions.map((action) => (
					<CategoryButton
						key={action.id}
						label={action.label}
						icon={<Text style={styles.emoji}>{action.emoji}</Text>}
						color={action.color}
						onPress={() => onActionPress?.(action.id)}
					/>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: spacing.sm,
	},
	emoji: {
		fontSize: typography.fontSize['2xl'],
	},
})
