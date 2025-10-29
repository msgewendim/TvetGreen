/**
 * Toast Component
 *
 * Toast notification with auto-dismiss and slide-up animation
 */

import {
	AlertCircle,
	CheckCircle,
	Info,
	X,
	XCircle,
} from "lucide-react-native";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { ToastProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

const { width } = Dimensions.get("window");

export const Toast: React.FC<ToastProps> = ({
	type,
	message,
	duration = 3000,
	onDismiss,
	visible,
}) => {
	const translateY = useRef(new Animated.Value(100)).current;
	const opacity = useRef(new Animated.Value(0)).current;

	const handleDismiss = useCallback(() => {
		Animated.parallel([
			Animated.timing(translateY, {
				toValue: 100,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(opacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			onDismiss?.();
		});
	}, [onDismiss, opacity, translateY]);

	useEffect(() => {
		if (visible) {
			// Slide up and fade in
			Animated.parallel([
				Animated.spring(translateY, {
					toValue: 0,
					tension: 50,
					friction: 7,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
			]).start();

			// Auto dismiss
			if (duration > 0) {
				const timer = setTimeout(() => {
					handleDismiss();
				}, duration);

				return () => clearTimeout(timer);
			}
		} else {
			handleDismiss();
		}
	}, [visible, duration, handleDismiss, opacity, translateY]);

	const getToastColor = () => {
		switch (type) {
			case "success":
				return colors.feedback.success;
			case "error":
				return colors.feedback.error;
			case "warning":
				return colors.feedback.warning;
			case "info":
				return colors.feedback.info;
			default:
				return colors.neutral[800];
		}
	};

	const getIcon = () => {
		const iconColor = colors.text.inverse;
		const iconSize = 20;

		switch (type) {
			case "success":
				return (
					<CheckCircle size={iconSize} color={iconColor} strokeWidth={2} />
				);
			case "error":
				return <XCircle size={iconSize} color={iconColor} strokeWidth={2} />;
			case "warning":
				return (
					<AlertCircle size={iconSize} color={iconColor} strokeWidth={2} />
				);
			case "info":
				return <Info size={iconSize} color={iconColor} strokeWidth={2} />;
			default:
				return null;
		}
	};

	if (!visible) return null;

	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [{ translateY }],
					opacity,
				},
			]}
		>
			<View
				style={[
					styles.toast,
					{ backgroundColor: getToastColor() },
					// ...(spacing.shadow.lg as any),
				]}
			>
				<View style={styles.iconContainer}>{getIcon()}</View>

				<Text style={styles.message} numberOfLines={3}>
					{message}
				</Text>

				<TouchableOpacity
					onPress={handleDismiss}
					style={styles.closeButton}
					accessibilityLabel="Dismiss toast"
					accessibilityRole="button"
				>
					<X size={16} color={colors.text.inverse} strokeWidth={2} />
				</TouchableOpacity>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: spacing.xl,
		left: spacing.md,
		right: spacing.md,
		zIndex: 9999,
	},
	toast: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		borderRadius: spacing.radius.md,
		minHeight: 56,
		maxWidth: width - spacing.md * 2,
	},
	iconContainer: {
		marginRight: spacing.sm,
	},
	message: {
		flex: 1,
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.medium,
		color: colors.text.inverse,
		lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
	},
	closeButton: {
		padding: spacing.xs,
		marginLeft: spacing.sm,
	},
});
