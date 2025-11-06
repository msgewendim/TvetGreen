/**
 * Input Component
 *
 * Custom text input extending React Native Paper's TextInput
 * Supports labels, errors, icons, and accessibility features
 */

import type React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import type { InputProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const Input: React.FC<InputProps> = ({
	label,
	placeholder,
	value,
	onChangeText,
	error,
	helperText,
	variant = "outlined",
	size = "medium",
	disabled = false,
	secureTextEntry = false,
	leftIcon,
	rightIcon,
	multiline = false,
	numberOfLines = 1,
	onFocus,
	onBlur,
	testID,
	accessibilityLabel,
	accessibilityHint,
	style,
}) => {
	const _theme = useTheme();

	const getSizeStyles = () => {
		switch (size) {
			case "small":
				return { height: 40, fontSize: typography.fontSize.sm };
			case "large":
				return { height: 56, fontSize: typography.fontSize.lg };
			default:
				return {
					height: spacing.minTouchTarget,
					fontSize: typography.fontSize.base,
				};
		}
	};

	const sizeStyles = getSizeStyles();

	return (
		<View style={[styles.container, style]}>
			<TextInput
				label={label}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				mode={variant === "filled" ? "flat" : "outlined"}
				error={!!error}
				disabled={disabled}
				secureTextEntry={secureTextEntry}
				multiline={multiline}
				numberOfLines={numberOfLines}
				onFocus={onFocus}
				onBlur={onBlur}
				testID={testID}
				accessibilityLabel={accessibilityLabel || label}
				accessibilityHint={accessibilityHint}
				left={leftIcon ? <TextInput.Icon icon={() => leftIcon} /> : undefined}
				right={
					rightIcon ? <TextInput.Icon icon={() => rightIcon} /> : undefined
				}
				style={[
					styles.input,
					{ height: multiline ? undefined : sizeStyles.height },
				]}
				contentStyle={{
					fontSize: sizeStyles.fontSize,
				}}
				outlineColor={colors.border.medium}
				activeOutlineColor={colors.primary.main}
				textColor={colors.text.primary}
				placeholderTextColor={colors.text.tertiary}
			/>

			{/* Error or helper text */}
			{(error || helperText) && (
				<Text
					style={[styles.helperText, error && styles.errorText]}
					accessibilityLiveRegion="polite"
				>
					{error || helperText}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	input: {
		backgroundColor: colors.neutral.white,
	},
	helperText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		marginTop: spacing.xs,
		marginLeft: spacing.sm,
	},
	errorText: {
		color: colors.feedback.error,
	},
});
