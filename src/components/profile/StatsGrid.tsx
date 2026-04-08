/**
 * StatsGrid Component
 *
 * Compact horizontal row of learning statistics
 */

import { Award, BookOpen, Clock, TrendingUp } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

export interface UserStats {
	completedCourses: number;
	totalHours: number;
	certificates: number;
	currentStreak: number;
}

interface StatsGridProps {
	stats: UserStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
	const statsData = [
		{
			icon: <BookOpen size={18} color={colors.primary.main} strokeWidth={2} />,
			value: stats.completedCourses,
			label: "Completed",
		},
		{
			icon: <Clock size={18} color={colors.accent.main} strokeWidth={2} />,
			value: `${stats.totalHours}h`,
			label: "Hours",
		},
		{
			icon: <Award size={18} color={colors.categories.construction} strokeWidth={2} />,
			value: stats.certificates,
			label: "Certificates",
		},
		{
			icon: <TrendingUp size={18} color={colors.feedback.success} strokeWidth={2} />,
			value: stats.currentStreak,
			label: "Day Streak",
		},
	];

	return (
		<View style={styles.container}>
			{statsData.map((stat) => (
				<View key={stat.label} style={styles.chip}>
					{stat.icon}
					<Text style={styles.value}>{stat.value}</Text>
					<Text style={styles.label}>{stat.label}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
		gap: spacing.sm,
	},
	chip: {
		flex: 1,
		backgroundColor: colors.neutral.white,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xs,
		borderRadius: spacing.radius.sm,
		alignItems: "center",
		...spacing.shadow.sm,
	},
	value: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginTop: 2,
	},
	label: {
		fontSize: 10,
		color: colors.text.secondary,
		textAlign: "center",
		fontWeight: typography.fontWeight.medium,
	},
});
