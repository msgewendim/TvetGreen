/**
 * Common Reusable Styles
 *
 * Shared style patterns used across multiple screens
 * Import and spread these into your StyleSheet.create()
 */

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";

export const commonStyles = StyleSheet.create({
	// Section container
	section: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},

	// Section title
	sectionTitle: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
	},

	// Section header (with action button)
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.md,
	},
});
