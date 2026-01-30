/**
 * Header Component
 *
 * App header with title, subtitle, and optional left/right actions.
 * Uses safe area top inset so the green bar can extend behind the status bar
 * without blocking it; title and subtitle are laid out below the status bar.
 * Matches the My Learning screen header style (large title, subtitle, left-aligned).
 */

import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { HeaderProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

const HEADER_PADDING_H = 20;
const HEADER_PADDING_BOTTOM = 24;
const TITLE_FONT_SIZE = 28;
const SUBTITLE_FONT_SIZE = 14;

export const Header: React.FC<HeaderProps> = ({
	title,
	subtitle,
	leftAction,
	rightAction,
	backgroundColor = colors.primary.main,
	testID,
	style,
}) => {
	const insets = useSafeAreaInsets();
	const paddingTop = Math.max(insets.top, spacing.md);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor, paddingTop, paddingBottom: HEADER_PADDING_BOTTOM },
				style,
			]}
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
		paddingHorizontal: HEADER_PADDING_H,
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
		fontSize: TITLE_FONT_SIZE,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.xs / 2,
	},
	subtitle: {
		fontSize: SUBTITLE_FONT_SIZE,
		color: colors.text.inverse,
		opacity: 0.9,
	},
});
