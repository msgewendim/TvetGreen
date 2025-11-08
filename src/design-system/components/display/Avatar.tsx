/**
 * Avatar Component
 *
 * User avatar with image or initials fallback
 */

import type React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { AvatarProps } from "../../../types/design-system";
import { colors, typography } from "../../tokens";

export const Avatar: React.FC<AvatarProps> = ({
	source,
	name,
	size = "medium",
	backgroundColor = colors.primary.main,
	onPress,
	testID,
	accessibilityLabel,
	style,
}) => {
	const getSizeDimensions = () => {
		switch (size) {
			case "small":
				return { diameter: 32, fontSize: typography.fontSize.sm };
			case "large":
				return { diameter: 64, fontSize: typography.fontSize.xl };
			case "xlarge":
				return { diameter: 96, fontSize: typography.fontSize["2xl"] };
			default:
				return { diameter: 48, fontSize: typography.fontSize.lg };
		}
	};

	const { diameter, fontSize } = getSizeDimensions();

	// Generate initials from name
	const getInitials = () => {
		if (!name) return "?";
		const parts = name.trim().split(" ");
		if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
		return (
			parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
		).toUpperCase();
	};

	const avatarStyle = [
		styles.avatar,
		{
			width: diameter,
			height: diameter,
			borderRadius: diameter / 2,
			backgroundColor,
		},
		style,
	];

	const content = (
		<View
			style={avatarStyle}
			testID={testID}
			accessible
			accessibilityLabel={accessibilityLabel || `Avatar for ${name || "user"}`}
			accessibilityRole="image"
		>
			{source ? (
				<Image
					source={typeof source === "string" ? { uri: source } : source}
					style={styles.image}
				/>
			) : (
				<Text style={[styles.initials, { fontSize }]}>{getInitials()}</Text>
			)}
		</View>
	);

	if (onPress) {
		return (
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.7}
				accessibilityRole="button"
			>
				{content}
			</TouchableOpacity>
		);
	}

	return content;
};

const styles = StyleSheet.create({
	avatar: {
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		// ...spacing.shadow.sm,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	initials: {
		color: colors.text.inverse,
		fontWeight: typography.fontWeight.bold,
		textAlign: "center",
	},
});
