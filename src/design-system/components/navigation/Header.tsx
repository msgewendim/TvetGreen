/**
 * Header Component
 *
 * App-wide header with GreenSkills branding in warm amber/gold.
 * Uses React Native Paper components for consistency.
 * Supports back navigation and optional right actions.
 */

import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../tokens";

export interface HeaderProps {
	title?: string;
	subtitle?: string;
	showBack?: boolean;
	onBack?: () => void;
	rightAction?: {
		icon: string;
		onPress: () => void;
		accessibilityLabel?: string;
	};
}

export function Header({
	title = "GreenSkills",
	subtitle,
	showBack = false,
	onBack,
	rightAction,
}: HeaderProps) {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.inner}>
				{/* Left: back button or logo */}
				{showBack && onBack ? (
					<Appbar.BackAction
						onPress={onBack}
						color={colors.accent.text}
						size={24}
					/>
				) : (
					<View style={styles.logoContainer}>
						<View style={styles.logoCircle}>
							<Text style={styles.logoText}>G</Text>
						</View>
					</View>
				)}

				{/* Center: title + subtitle */}
				<View style={styles.titleContainer}>
					<Text variant="titleLarge" style={styles.title}>
						{title}
					</Text>
					{subtitle && (
						<Text variant="bodySmall" style={styles.subtitle}>
							{subtitle}
						</Text>
					)}
				</View>

				{/* Right: optional action */}
				{rightAction ? (
					<Appbar.Action
						icon={rightAction.icon}
						onPress={rightAction.onPress}
						color={colors.accent.text}
						accessibilityLabel={rightAction.accessibilityLabel}
					/>
				) : (
					<View style={styles.spacer} />
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.accent.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.accent.light,
	},
	inner: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.sm,
		minHeight: 56,
	},
	logoContainer: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	logoCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.accent.main,
		justifyContent: "center",
		alignItems: "center",
	},
	logoText: {
		fontSize: 18,
		fontWeight: typography.fontWeight.bold,
		color: colors.neutral.white,
	},
	titleContainer: {
		flex: 1,
		marginHorizontal: spacing.sm,
	},
	title: {
		color: colors.accent.text,
		fontWeight: typography.fontWeight.bold,
	},
	subtitle: {
		color: colors.neutral[600],
		marginTop: 1,
	},
	spacer: {
		width: 44,
	},
});
