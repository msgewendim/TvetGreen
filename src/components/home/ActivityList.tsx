/**
 * ActivityList Component
 *
 * Displays a list of recent user activities
 */

import { Download, Play, Trophy } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

export interface Activity {
	title: string;
	type: "completed" | "download" | "started";
	time: string;
}

interface ActivityListProps {
	activities: Activity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Recent Activity</Text>
			{activities.map((activity, index) => (
				<View key={`${activity.title}-${index}`} style={styles.item}>
					<View
						style={[
							styles.icon,
							activity.type === "completed" && styles.completedIcon,
							activity.type === "download" && styles.downloadIcon,
							activity.type === "started" && styles.startedIcon,
						]}
					>
						{activity.type === "completed" && (
							<Trophy size={16} color={colors.text.inverse} strokeWidth={2} />
						)}
						{activity.type === "download" && (
							<Download size={16} color={colors.text.inverse} strokeWidth={2} />
						)}
						{activity.type === "started" && (
							<Play size={16} color={colors.text.inverse} strokeWidth={2} />
						)}
					</View>
					<View style={styles.content}>
						<Text style={styles.activityTitle}>{activity.title}</Text>
						<Text style={styles.activityTime}>{activity.time}</Text>
					</View>
				</View>
			))}
		</View>
	);
};

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
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.neutral.white,
		padding: spacing.md,
		borderRadius: spacing.radius.sm,
		marginBottom: spacing.sm,
		...spacing.shadow.sm,
	},
	icon: {
		width: 40,
		height: 40,
		borderRadius: spacing.radius.full,
		justifyContent: "center",
		alignItems: "center",
		marginRight: spacing.sm,
	},
	completedIcon: {
		backgroundColor: colors.feedback.success,
	},
	downloadIcon: {
		backgroundColor: colors.feedback.info,
	},
	startedIcon: {
		backgroundColor: colors.secondary.main,
	},
	content: {
		flex: 1,
	},
	activityTitle: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	activityTime: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
	},
});
