/**
 * CategoryChip Component
 *
 * Small pill chip with emoji + label for horizontal filter rows.
 * Active/inactive states with category color support.
 */

import type React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import type { CategoryChipProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const CategoryChip: React.FC<CategoryChipProps> = ({
	label,
	emoji,
	color = colors.primary.main,
	isActive = false,
	onPress,
	testID,
	accessibilityLabel,
	style,
}) => {
	return (
		<TouchableOpacity
			style={[
				styles.chip,
				isActive
					? { backgroundColor: color, borderColor: color }
					: styles.chipInactive,
				style,
			]}
			onPress={onPress}
			activeOpacity={0.7}
			testID={testID}
			accessibilityLabel={accessibilityLabel || label}
			accessibilityRole="button"
			accessibilityState={{ selected: isActive }}
		>
			{emoji && <Text style={styles.emoji}>{emoji}</Text>}
			<Text
				style={[
					styles.label,
					isActive ? styles.labelActive : styles.labelInactive,
				]}
				numberOfLines={1}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm + 4,
		paddingVertical: spacing.xs + 2,
		borderRadius: spacing.radius.full,
		borderWidth: 1,
		gap: spacing.xs,
	},
	chipInactive: {
		backgroundColor: colors.neutral.white,
		borderColor: colors.border.light,
	},
	emoji: {
		fontSize: 14,
	},
	label: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.medium,
	},
	labelActive: {
		color: colors.text.inverse,
		fontWeight: typography.fontWeight.semibold,
	},
	labelInactive: {
		color: colors.text.primary,
	},
});
