/**
 * QuickActionsGrid Component
 *
 * Compact single-row grid of quick action category buttons
 */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, commonStyles, spacing, typography } from "@/design-system";

export interface QuickAction {
	id: string;
	label: string;
	emoji: string;
	color: string;
}

interface QuickActionsGridProps {
	actions: QuickAction[];
	onActionPress?: (actionId: string) => void;
}

export function QuickActionsGrid({
	actions,
	onActionPress,
}: QuickActionsGridProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Quick Actions</Text>
			<View style={styles.row}>
				{actions.map((action) => (
					<TouchableOpacity
						key={action.id}
						style={styles.action}
						onPress={() => onActionPress?.(action.id)}
						accessibilityLabel={action.label}
						accessibilityRole="button"
					>
						<View
							style={[
								styles.iconCircle,
								{ backgroundColor: `${action.color}15` },
							]}
						>
							<Text style={styles.emoji}>{action.emoji}</Text>
						</View>
						<Text style={styles.label} numberOfLines={1}>
							{action.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: commonStyles.section,
	title: commonStyles.sectionTitle,
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	action: {
		alignItems: "center",
		flex: 1,
	},
	iconCircle: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	emoji: {
		fontSize: 22,
	},
	label: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.medium,
		color: colors.text.secondary,
		textAlign: "center",
	},
});
