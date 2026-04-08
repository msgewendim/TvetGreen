/**
 * Button Component
 *
 * Custom button extending React Native Paper with design system variants
 * Supports multiple sizes, variants, icons, and accessibility features
 */

import type React from "react";
import { StyleSheet, View } from "react-native";
import {
	ActivityIndicator,
	Button as PaperButton,
	useTheme,
} from "react-native-paper";
import type { ButtonProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "medium",
	onPress,
	disabled = false,
	loading = false,
	fullWidth = false,
	icon,
	iconPosition = "left",
	testID,
	accessibilityLabel,
	accessibilityHint,
	style,
}) => {
	const _theme = useTheme();

	// Determine button mode based on variant
	const getMode = (): "contained" | "outlined" | "text" => {
		switch (variant) {
			case "primary":
			case "secondary":
				return "contained";
			case "outline":
				return "outlined";
			case "ghost":
				return "text";
			default:
				return "contained";
		}
	};

	// Get button colors based on variant
	const getButtonColor = (): string => {
		if (disabled) return colors.neutral[300];
		switch (variant) {
			case "primary":
				return colors.primary.main;
			case "secondary":
				return colors.accent.main;
			case "outline":
			case "ghost":
				return "transparent";
			default:
				return colors.primary.main;
		}
	};

	const getTextColor = (): string => {
		if (disabled) return colors.text.disabled;
		switch (variant) {
			case "primary":
			case "secondary":
				return colors.text.inverse;
			case "outline":
			case "ghost":
				return colors.primary.main;
			default:
				return colors.text.inverse;
		}
	};

	// Get size-based styles
	const getSizeStyles = () => {
		switch (size) {
			case "small":
				return {
					height: 36,
					paddingHorizontal: spacing.md,
					fontSize: typography.fontSize.sm,
				};
			case "large":
				return {
					height: 56,
					paddingHorizontal: spacing.xl,
					fontSize: typography.fontSize.lg,
				};
			default:
				return {
					height: spacing.minTouchTarget,
					paddingHorizontal: spacing.lg,
					fontSize: typography.fontSize.base,
				};
		}
	};

	const sizeStyles = getSizeStyles();

	const renderIcon = () => {
		if (loading) {
			return <ActivityIndicator size="small" color={getTextColor()} />;
		}
		return icon;
	};

	return (
		<View style={[fullWidth && styles.fullWidth, style]}>
			<PaperButton
				mode={getMode()}
				onPress={onPress}
				disabled={disabled || loading}
				buttonColor={getButtonColor()}
				textColor={getTextColor()}
				contentStyle={[
					styles.content,
					{
						height: sizeStyles.height,
						paddingHorizontal: sizeStyles.paddingHorizontal,
					},
					fullWidth && styles.fullWidthContent,
				]}
				labelStyle={[
					styles.label,
					{
						fontSize: sizeStyles.fontSize,
						fontWeight: typography.fontWeight.semibold,
					},
				]}
				icon={iconPosition === "left" && icon ? () => renderIcon() : undefined}
				testID={testID}
				accessibilityLabel={
					accessibilityLabel ||
					(typeof children === "string" ? children : undefined)
				}
				accessibilityHint={accessibilityHint}
				accessibilityRole="button"
				accessibilityState={{ disabled: disabled || loading }}
				style={[
					variant === "outline" && styles.outlined,
					disabled && styles.disabled,
				]}
			>
				{children}
			</PaperButton>
			{iconPosition === "right" && icon && !loading && (
				<View style={styles.rightIcon}>{icon}</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	fullWidth: {
		width: "100%",
	},
	fullWidthContent: {
		width: "100%",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		marginVertical: 0,
		marginHorizontal: spacing.sm,
	},
	outlined: {
		borderWidth: 2,
		borderColor: colors.primary.main,
	},
	disabled: {
		opacity: 0.6,
	},
	rightIcon: {
		position: "absolute",
		right: spacing.md,
		top: "50%",
		transform: [{ translateY: -12 }],
	},
});
