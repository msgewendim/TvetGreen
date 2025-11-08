/**
 * SettingItem Component
 *
 * Individual settings menu item with icon and description
 */

import { ChevronRight } from 'lucide-react-native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'

interface SettingItemProps {
	icon: React.ReactNode
	title: string
	subtitle: string
	iconColor?: string
	onPress?: () => void
}

export const SettingItem: React.FC<SettingItemProps> = ({
	icon,
	title,
	subtitle,
	iconColor = colors.primary.main,
	onPress,
}) => {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			accessibilityLabel={title}
		>
			<View style={[styles.iconContainer, { backgroundColor: colors.neutral[100] }]}>
				{icon}
			</View>
			<View style={styles.content}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.subtitle}>{subtitle}</Text>
			</View>
			<ChevronRight size={20} color={colors.text.secondary} strokeWidth={2} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.neutral.white,
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.sm,
		...spacing.shadow.sm,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: spacing.radius.full,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: spacing.md,
	},
	content: {
		flex: 1,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	subtitle: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
})
