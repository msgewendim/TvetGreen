/**
 * AchievementBanner Component
 *
 * Displays achievement information in a banner
 */

import { Trophy } from 'lucide-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'

interface AchievementBannerProps {
	title: string
	subtitle: string
}

export const AchievementBanner: React.FC<AchievementBannerProps> = ({
	title,
	subtitle,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Trophy size={32} color={colors.categories.construction} strokeWidth={2} />
				<View style={styles.text}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{subtitle}</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing['2xl'],
		backgroundColor: colors.secondary.surface,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.secondary.main,
		overflow: 'hidden',
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.lg,
	},
	text: {
		marginLeft: spacing.md,
		flex: 1,
	},
	title: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
})
