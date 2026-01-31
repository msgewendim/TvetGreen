/**
 * Header Component
 *
 * App header with title, subtitle, and optional left/right actions.
 * Supports "default" (green bg, white text) and "minimal" (cream bg, dark text) variants.
 */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { HeaderProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export function Header({
	title,
	subtitle,
	variant = "default",
	leftAction,
	rightAction,
	backgroundColor,
	testID,
	style,
}: HeaderProps) {
	const insets = useSafeAreaInsets();
	const isMinimal = variant === "minimal";

	const resolvedBg =
		backgroundColor ?? (isMinimal ? colors.background.tertiary : colors.primary.light);
	const paddingTop = spacing.md;
	const paddingBottom = isMinimal ? spacing.md : spacing.lg;
	const titleSize = isMinimal ? 22 : 28;
	const titleColor = isMinimal ? colors.text.primary : colors.text.inverse;
	const subtitleColor = isMinimal ? colors.text.secondary : colors.text.inverse;

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: resolvedBg, paddingTop, paddingBottom },
				style,
			]}
			testID={testID}
			accessible={false}
		>
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

			<View
				style={[
					styles.titleContainer,
					!leftAction && styles.titleContainerNoLeft,
				]}
			>
				<Text
					style={[styles.title, { fontSize: titleSize, color: titleColor }]}
					numberOfLines={1}
				>
					{title}
				</Text>
				{subtitle && (
					<Text
						style={[styles.subtitle, { color: subtitleColor, opacity: isMinimal ? 1 : 0.9 }]}
						numberOfLines={1}
					>
						{subtitle}
					</Text>
				)}
			</View>

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
		paddingHorizontal: spacing.lg,
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
		fontWeight: typography.fontWeight.bold,
		marginBottom: spacing.xs / 2,
	},
	subtitle: {
		fontSize: typography.fontSize.sm,
	},
});
