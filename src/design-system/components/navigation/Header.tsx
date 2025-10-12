/**
 * Header Component
 *
 * App header with title, subtitle, and optional left/right actions
 */

import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { HeaderProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const Header: React.FC<HeaderProps> = ({
	title,
	subtitle,
	leftAction,
	rightAction,
	backgroundColor = colors.primary.main,
	testID,
	style,
}) => {
	return (
		<View
			style={[styles.container, { backgroundColor }, style]}
			testID={testID}
			accessible={false}
		>
			{/* Left Action */}
			{leftAction && (
				<TouchableOpacity
					onPress={leftAction.onPress}
					style={styles.actionButton}
					accessibilityLabel={leftAction.accessibilityLabel || "Back"}
					accessibilityRole="button"
				>
					{leftAction.icon}
				</TouchableOpacity>
			)}

			{/* Title & Subtitle */}
			<View
				style={[
					styles.titleContainer,
					!leftAction && styles.titleContainerNoLeft,
				]}
			>
				<Text style={styles.title} numberOfLines={1}>
					{title}
				</Text>
				{subtitle && (
					<Text style={styles.subtitle} numberOfLines={1}>
						{subtitle}
					</Text>
				)}
			</View>

			{/* Right Action */}
			{rightAction && (
				<TouchableOpacity
					onPress={rightAction.onPress}
					style={styles.actionButton}
					accessibilityLabel={rightAction.accessibilityLabel || "Menu"}
					accessibilityRole="button"
				>
					{rightAction.icon}
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingTop: spacing["2xl"] + spacing.md, // Account for status bar
		paddingBottom: spacing.md,
		// ...spacing.shadow.sm,
	},
	actionButton: {
		width: spacing.minTouchTarget,
		height: spacing.minTouchTarget,
		justifyContent: "center",
		alignItems: "center",
	},
	titleContainer: {
		flex: 1,
		marginHorizontal: spacing.sm,
	},
	titleContainerNoLeft: {
		marginLeft: 0,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.xs / 2,
	},
	subtitle: {
		fontSize: typography.fontSize.sm,
		color: colors.text.inverse,
		opacity: 0.9,
	},
});
