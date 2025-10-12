/**
 * CategoryButton Component
 *
 * Button for displaying course categories with icon and label
 * Optimized for touch targets and visual feedback
 */

import React from "react";
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { CategoryButtonProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const CategoryButton: React.FC<CategoryButtonProps> = ({
	icon,
	label,
	color = colors.primary.main,
	onPress,
	disabled = false,
	testID,
	accessibilityLabel,
	accessibilityHint,
	style,
}) => {
	const scaleAnim = React.useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			friction: 3,
			tension: 40,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View
			style={[styles.container, { transform: [{ scale: scaleAnim }] }, style]}
		>
			<TouchableOpacity
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={disabled}
				testID={testID}
				accessibilityLabel={accessibilityLabel || `${label} category`}
				accessibilityHint={accessibilityHint || `Navigate to ${label} courses`}
				accessibilityRole="button"
				accessibilityState={{ disabled }}
				activeOpacity={0.8}
				style={[styles.touchable, disabled && styles.disabled]}
			>
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: color },
						// ...spacing.shadow.md,
					]}
				>
					{icon}
				</View>
				<Text
					style={[styles.label, disabled && styles.labelDisabled]}
					numberOfLines={2}
				>
					{label}
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	touchable: {
		alignItems: "center",
		padding: spacing.sm,
		minWidth: 80,
		minHeight: spacing.minTouchTarget,
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: spacing.radius.full,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	label: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		textAlign: "center",
		lineHeight: typography.fontSize.sm * typography.lineHeight.tight,
	},
	disabled: {
		opacity: 0.5,
	},
	labelDisabled: {
		color: colors.text.disabled,
	},
});
