/**
 * StatsGrid Component
 *
 * Displays user learning statistics in a grid layout
 */

import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react-native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'

const { width } = Dimensions.get('window')

export interface UserStats {
	completedCourses: number
	totalHours: number
	certificates: number
	currentStreak: number
}

interface StatsGridProps {
	stats: UserStats
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
	const statsData = [
		{
			icon: <BookOpen size={24} color={colors.primary.main} strokeWidth={2} />,
			value: stats.completedCourses,
			label: 'Courses Completed',
		},
		{
			icon: <Clock size={24} color={colors.secondary.main} strokeWidth={2} />,
			value: `${stats.totalHours}h`,
			label: 'Hours Learned',
		},
		{
			icon: <Award size={24} color={colors.categories.construction} strokeWidth={2} />,
			value: stats.certificates,
			label: 'Certificates',
		},
		{
			icon: <TrendingUp size={24} color={colors.feedback.success} strokeWidth={2} />,
			value: stats.currentStreak,
			label: 'Day Streak',
		},
	]

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Learning Statistics</Text>
			<View style={styles.grid}>
				{statsData.map((stat, index) => (
					<View key={index} style={styles.card}>
						{stat.icon}
						<Text style={styles.value}>{stat.value}</Text>
						<Text style={styles.label}>{stat.label}</Text>
					</View>
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
	card: {
		backgroundColor: colors.neutral.white,
		width: (width - 64) / 2,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		alignItems: 'center',
		...spacing.shadow.md,
	},
	value: {
		fontSize: typography.fontSize['2xl'],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginTop: spacing.sm,
		marginBottom: spacing.xs / 2,
	},
	label: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		textAlign: 'center',
		fontWeight: typography.fontWeight.medium,
	},
})
