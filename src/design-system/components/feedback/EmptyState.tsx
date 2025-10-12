/**
 * EmptyState Component
 *
 * Display for empty states with icon, title, description, and optional action
 */

import type React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { EmptyStateProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";
import { Button } from "../buttons/Button";

export const EmptyState: React.FC<EmptyStateProps> = ({
	icon,
	title,
	description,
	action,
	testID,
	style,
}) => {
	return (
		<View style={[styles.container, style]} testID={testID}>
			{icon && <View style={styles.iconContainer}>{icon}</View>}

			<Text style={styles.title}>{title}</Text>

			{description && <Text style={styles.description}>{description}</Text>}

			{action && (
				<View style={styles.actionContainer}>
					<Button onPress={action.onPress} variant="primary" size="medium">
						{action.label}
					</Button>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing["2xl"],
	},
	iconContainer: {
		marginBottom: spacing.lg,
		opacity: 0.5,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	description: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
		textAlign: "center",
		lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
		marginBottom: spacing.lg,
	},
	actionContainer: {
		marginTop: spacing.md,
		minWidth: 200,
	},
});
