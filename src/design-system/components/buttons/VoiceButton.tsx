/**
 * VoiceButton Component
 *
 * Floating action button for voice input with animated states
 * Provides visual feedback for listening and processing states
 */

import { Mic, MicOff } from "lucide-react-native";
import type React from "react";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import type { VoiceButtonProps } from "../../../types/design-system";
import { colors, spacing } from "../../tokens";

export const VoiceButton: React.FC<VoiceButtonProps> = ({
	size = "medium",
	state = "idle",
	onPress,
	onLongPress,
	disabled = false,
	testID,
	accessibilityLabel = "Voice input button",
	accessibilityHint = "Activate voice input for hands-free interaction",
	style,
}) => {
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const pulseAnim = useRef(new Animated.Value(1)).current;

	// Get size dimensions
	const getSizeDimensions = () => {
		switch (size) {
			case "small":
				return { diameter: 40, iconSize: 20 };
			case "large":
				return { diameter: 72, iconSize: 32 };
			default:
				return { diameter: 56, iconSize: 24 };
		}
	};

	const { diameter, iconSize } = getSizeDimensions();

	// Get button color based on state
	const getButtonColor = () => {
		if (disabled) return colors.neutral[300];
		switch (state) {
			case "listening":
				return colors.feedback.error; // Red for active listening
			case "processing":
				return colors.feedback.warning; // Orange/yellow for processing
			default:
				return colors.secondary.main; // Orange for idle
		}
	};

	// Animate press feedback
	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.9,
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

	// Pulse animation for listening state
	useEffect(() => {
		if (state === "listening") {
			Animated.loop(
				Animated.sequence([
					Animated.timing(pulseAnim, {
						toValue: 1.2,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(pulseAnim, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				]),
			).start();
		} else {
			pulseAnim.setValue(1);
		}
	}, [state, pulseAnim]);

	const renderIcon = () => {
		const iconColor = colors.text.inverse;

		if (state === "listening") {
			return <MicOff size={iconSize} color={iconColor} strokeWidth={2} />;
		}
		return <Mic size={iconSize} color={iconColor} strokeWidth={2} />;
	};

	return (
		<Animated.View
			style={[
				{
					transform: [{ scale: scaleAnim }],
				},
				style,
			]}
		>
			<TouchableOpacity
				onPress={onPress}
				onLongPress={onLongPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={disabled}
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				accessibilityHint={accessibilityHint}
				accessibilityRole="button"
				accessibilityState={{
					disabled,
					selected: state === "listening",
				}}
				activeOpacity={0.8}
				style={[
					styles.button,
					{
						width: diameter,
						height: diameter,
						borderRadius: diameter / 2,
						backgroundColor: getButtonColor(),
					},
					disabled && styles.disabled,
					// ...(spacing.shadow.lg as any),
				]}
			>
				{renderIcon()}

				{/* Pulse ring for listening state */}
				{state === "listening" && (
					<Animated.View
						style={[
							styles.pulseRing,
							{
								width: diameter + 20,
								height: diameter + 20,
								borderRadius: (diameter + 20) / 2,
								transform: [{ scale: pulseAnim }],
							},
						]}
					/>
				)}

				{/* Processing indicator */}
				{state === "processing" && <View style={styles.processingDot} />}
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	disabled: {
		opacity: 0.5,
	},
	pulseRing: {
		position: "absolute",
		borderWidth: 2,
		borderColor: colors.text.inverse,
		opacity: 0.3,
	},
	processingDot: {
		position: "absolute",
		top: 8,
		right: 8,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.feedback.success,
	},
});
