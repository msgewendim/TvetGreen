/**
 * ProgressBar Component
 *
 * Animated progress bar for displaying completion status
 */

import type React from "react";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import type { ProgressBarProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	size = "medium",
	color = colors.primary.main,
	showLabel = false,
	animated = true,
	testID,
	accessibilityLabel,
	style,
}) => {
	const animatedWidth = useRef(new Animated.Value(0)).current;

	// Clamp progress between 0 and 100
	const clampedProgress = Math.max(0, Math.min(100, progress));

	useEffect(() => {
		if (animated) {
			Animated.timing(animatedWidth, {
				toValue: clampedProgress,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			animatedWidth.setValue(clampedProgress);
		}
	}, [clampedProgress, animated, animatedWidth]);

	const getHeightForSize = () => {
		switch (size) {
			case "small":
				return 4;
			case "large":
				return 12;
			default:
				return 8;
		}
	};

	const height = getHeightForSize();

	const widthInterpolation = animatedWidth.interpolate({
		inputRange: [0, 100],
		outputRange: ["0%", "100%"],
	});

	return (
		<View style={[styles.container, style]}>
			<View
				style={[styles.track, { height }]}
				testID={testID}
				accessible
				accessibilityLabel={
					accessibilityLabel || `Progress ${clampedProgress}%`
				}
				accessibilityRole="progressbar"
				accessibilityValue={{
					min: 0,
					max: 100,
					now: clampedProgress,
				}}
			>
				<Animated.View
					style={[
						styles.fill,
						{
							width: widthInterpolation,
							backgroundColor: color,
							height,
						},
					]}
				/>
			</View>
			{showLabel && (
				<Text style={styles.label}>{Math.round(clampedProgress)}%</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	track: {
		flex: 1,
		backgroundColor: colors.neutral[200],
		borderRadius: spacing.radius.full,
		overflow: "hidden",
	},
	fill: {
		borderRadius: spacing.radius.full,
	},
	label: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.medium,
		color: colors.text.secondary,
		minWidth: 40,
		textAlign: "right",
	},
});
