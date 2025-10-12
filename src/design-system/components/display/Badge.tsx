/**
 * Badge Component
 *
 * Small badge for displaying counts or status indicators
 */

import type React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { BadgeProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const Badge: React.FC<BadgeProps> = ({
	content,
	variant = "default",
	size = "medium",
	max = 99,
	testID,
	accessibilityLabel,
	style,
}) => {
	const getVariantColor = () => {
		switch (variant) {
			case "primary":
				return colors.primary.main;
			case "secondary":
				return colors.secondary.main;
			case "success":
				return colors.feedback.success;
			case "warning":
				return colors.feedback.warning;
			case "error":
				return colors.feedback.error;
			default:
				return colors.neutral[600];
		}
	};

	const getSizeStyles = () => {
		switch (size) {
			case "small":
				return {
					minWidth: 16,
					height: 16,
					borderRadius: 8,
					fontSize: typography.fontSize.xs - 2,
					paddingHorizontal: spacing.xs / 2,
				};
			case "large":
				return {
					minWidth: 28,
					height: 28,
					borderRadius: 14,
					fontSize: typography.fontSize.sm,
					paddingHorizontal: spacing.sm,
				};
			default:
				return {
					minWidth: 20,
					height: 20,
					borderRadius: 10,
					fontSize: typography.fontSize.xs,
					paddingHorizontal: spacing.xs,
				};
		}
	};

	const sizeStyles = getSizeStyles();
	const backgroundColor = getVariantColor();

	// Format content with max limit
	const displayContent =
		typeof content === "number" && content > max ? `${max}+` : String(content);

	return (
		<View
			style={[
				styles.badge,
				{
					backgroundColor,
					minWidth: sizeStyles.minWidth,
					height: sizeStyles.height,
					borderRadius: sizeStyles.borderRadius,
					paddingHorizontal: sizeStyles.paddingHorizontal,
				},
				style,
			]}
			testID={testID}
			accessible
			accessibilityLabel={accessibilityLabel || `Badge: ${displayContent}`}
			accessibilityRole="text"
		>
			<Text
				style={[styles.text, { fontSize: sizeStyles.fontSize }]}
				numberOfLines={1}
			>
				{displayContent}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	badge: {
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: colors.text.inverse,
		fontWeight: typography.fontWeight.bold,
		textAlign: "center",
	},
});
