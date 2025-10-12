/**
 * Chip Component
 *
 * Small pill-shaped component for displaying tags, categories, or selections
 */

import { X } from "lucide-react-native";
import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ChipProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const Chip: React.FC<ChipProps> = ({
	label,
	variant = "default",
	size = "medium",
	icon,
	onPress,
	onClose,
	testID,
	accessibilityLabel,
	style,
}) => {
	const getVariantColors = () => {
		switch (variant) {
			case "primary":
				return {
					backgroundColor: colors.primary.main,
					textColor: colors.text.inverse,
				};
			case "secondary":
				return {
					backgroundColor: colors.secondary.main,
					textColor: colors.text.inverse,
				};
			case "success":
				return {
					backgroundColor: colors.feedback.success,
					textColor: colors.text.inverse,
				};
			case "warning":
				return {
					backgroundColor: colors.feedback.warning,
					textColor: colors.text.inverse,
				};
			case "error":
				return {
					backgroundColor: colors.feedback.error,
					textColor: colors.text.inverse,
				};
			default:
				return {
					backgroundColor: colors.neutral[200],
					textColor: colors.text.primary,
				};
		}
	};

	const getSizePadding = () => {
		switch (size) {
			case "small":
				return {
					paddingHorizontal: spacing.sm,
					paddingVertical: spacing.xs / 2,
					fontSize: typography.fontSize.xs,
				};
			default:
				return {
					paddingHorizontal: spacing.md,
					paddingVertical: spacing.xs,
					fontSize: typography.fontSize.sm,
				};
		}
	};

	const { backgroundColor, textColor } = getVariantColors();
	const sizePadding = getSizePadding();

	const content = (
		<View
			style={[
				styles.chip,
				{
					backgroundColor,
					paddingHorizontal: sizePadding.paddingHorizontal,
					paddingVertical: sizePadding.paddingVertical,
				},
				style,
			]}
		>
			{icon && <View style={styles.icon}>{icon}</View>}

			<Text
				style={[
					styles.label,
					{ color: textColor, fontSize: sizePadding.fontSize },
				]}
				numberOfLines={1}
			>
				{label}
			</Text>

			{onClose && (
				<TouchableOpacity
					onPress={onClose}
					style={styles.closeButton}
					accessibilityLabel="Remove"
					accessibilityRole="button"
				>
					<X size={14} color={textColor} strokeWidth={2} />
				</TouchableOpacity>
			)}
		</View>
	);

	if (onPress) {
		return (
			<TouchableOpacity
				onPress={onPress}
				testID={testID}
				accessibilityLabel={accessibilityLabel || label}
				accessibilityRole="button"
				activeOpacity={0.7}
			>
				{content}
			</TouchableOpacity>
		);
	}

	return content;
};

const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: spacing.radius.full,
		alignSelf: "flex-start",
	},
	icon: {
		marginRight: spacing.xs,
	},
	label: {
		fontWeight: typography.fontWeight.medium,
	},
	closeButton: {
		marginLeft: spacing.xs,
		padding: spacing.xs / 2,
	},
});
