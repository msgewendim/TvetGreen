/**
 * Card Component
 *
 * Base card component extending React Native Paper
 * Provides consistent card styling across the app
 */

import type React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card as PaperCard } from "react-native-paper";
import type { CardProps } from "../../../types/design-system";
import { colors, spacing } from "../../tokens";

export const Card: React.FC<CardProps> = ({
	children,
	variant = "default",
	onPress,
	testID,
	accessibilityLabel,
	accessibilityHint,
	style,
}) => {
	const getCardStyle = () => {
		switch (variant) {
			case "elevated":
				return [styles.card, styles.elevated];
			case "outlined":
				return [styles.card, styles.outlined];
			default:
				return [styles.card];
		}
	};

	if (onPress) {
		return (
			<TouchableOpacity
				onPress={onPress}
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				accessibilityHint={accessibilityHint}
				accessibilityRole="button"
				activeOpacity={0.8}
				style={[getCardStyle(), style]}
			>
				{children}
			</TouchableOpacity>
		);
	}

	return (
		<PaperCard
			mode={
				variant === "elevated"
					? "elevated"
					: variant === "outlined"
						? "outlined"
						: "contained"
			}
			testID={testID}
			style={[getCardStyle(), style]}
		>
			{children}
		</PaperCard>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.md,
		padding: spacing.md,
	},
	elevated: {
		// ...spacing.shadow.md,
	},
	outlined: {
		borderWidth: 1,
		borderColor: colors.border.light,
	},
});
