/**
 * BottomNav Component
 *
 * Bottom navigation bar (simplified version)
 * Note: For Expo Router apps, prefer using the built-in tabs layout
 */

import { BookOpen, Download, Home, User } from "lucide-react-native";
import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { BottomNavProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const BottomNav: React.FC<BottomNavProps> = ({
	currentRoute,
	onNavigate,
	testID,
	style,
}) => {
	const routes = [
		{ name: "home", label: "Home", icon: Home },
		{ name: "courses", label: "Courses", icon: BookOpen },
		{ name: "downloads", label: "Downloads", icon: Download },
		{ name: "profile", label: "Profile", icon: User },
	];

	return (
		<View style={[styles.container, style]} testID={testID} accessible={false}>
			{routes.map((route) => {
				const isActive = currentRoute === route.name;
				const Icon = route.icon;

				return (
					<TouchableOpacity
						key={route.name}
						onPress={() => onNavigate(route.name)}
						style={styles.tab}
						accessibilityLabel={`${route.label} tab`}
						accessibilityRole="tab"
						accessibilityState={{ selected: isActive }}
					>
						<Icon
							size={spacing.iconSize.md}
							color={isActive ? colors.primary.main : colors.text.tertiary}
							strokeWidth={2}
						/>
						<Text style={[styles.label, isActive && styles.labelActive]}>
							{route.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: colors.neutral[50],
		borderTopWidth: 2,
		borderTopColor: colors.primary.main,
		paddingBottom: spacing.sm,
		paddingTop: spacing.sm,
		...spacing.shadow.md,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.sm,
		minHeight: 60,
	},
	label: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.tertiary,
		marginTop: spacing.xs,
	},
	labelActive: {
		color: colors.primary.main,
	},
});
