/**
 * CategoryCard Component
 *
 * Displays category information with icon, title, and course count
 * Used in category grids and lists
 */

import type React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { CategoryCardProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";
import { Card } from "./Card";

export const CategoryCard: React.FC<CategoryCardProps> = ({
	icon,
	title,
	color,
	courseCount,
	onPress,
	testID,
	accessibilityLabel,
	accessibilityHint,
}) => {
	return (
		<Card
			variant="elevated"
			onPress={onPress}
			testID={testID}
			accessibilityLabel={accessibilityLabel || `${title} category card`}
			accessibilityHint={accessibilityHint || `View ${title} courses`}
			style={[styles.container]}
		>
			{/* Icon container with category color */}
			<View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
				<View style={[styles.iconCircle, { backgroundColor: color }]}>
					{icon}
				</View>
			</View>

			{/* Content */}
			<View style={styles.content}>
				<Text style={styles.title} numberOfLines={2}>
					{title}
				</Text>
				{courseCount !== undefined && (
					<Text style={styles.courseCount}>
						{courseCount} {courseCount === 1 ? "course" : "courses"}
					</Text>
				)}
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.md,
		minHeight: 140,
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.md,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
	},
	iconCircle: {
		width: 56,
		height: 56,
		borderRadius: spacing.radius.full,
		alignItems: "center",
		justifyContent: "center",
		// ...spacing.shadow.sm,
	},
	content: {
		alignItems: "center",
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		textAlign: "center",
		marginBottom: spacing.xs,
		lineHeight: typography.fontSize.base * typography.lineHeight.tight,
	},
	courseCount: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		textAlign: "center",
	},
});
