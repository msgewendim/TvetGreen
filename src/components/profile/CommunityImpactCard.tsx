/**
 * CommunityImpactCard Component
 *
 * Displays user's community impact statistics
 */

import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

export interface CommunityImpactStats {
	peopleHelped: number;
	skillsShared: number;
	questionsAnswered: number;
}

export interface CommunityImpactCardProps {
	stats: CommunityImpactStats;
}

export function CommunityImpactCard({ stats }: CommunityImpactCardProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>🌍 Your Community Impact</Text>
			<View style={styles.stats}>
				<View style={styles.statItem}>
					<Text style={styles.statNumber}>{stats.peopleHelped}</Text>
					<Text style={styles.statLabel}>People Helped</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statNumber}>{stats.skillsShared}</Text>
					<Text style={styles.statLabel}>Skills Shared</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statNumber}>{stats.questionsAnswered}</Text>
					<Text style={styles.statLabel}>Questions Answered</Text>
				</View>
			</View>
			<Text style={styles.description}>
				Your knowledge is making a difference in your community!
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primary.surface,
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
		padding: spacing.lg,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.feedback.success,
	},
	title: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
		textAlign: "center",
	},
	stats: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: spacing.md,
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.feedback.success,
		marginBottom: spacing.xs / 2,
	},
	statLabel: {
		fontSize: typography.fontSize.xs,
		color: colors.text.primary,
		fontWeight: typography.fontWeight.medium,
		textAlign: "center",
	},
	description: {
		fontSize: typography.fontSize.sm,
		color: colors.text.primary,
		textAlign: "center",
		lineHeight: 20,
	},
});
