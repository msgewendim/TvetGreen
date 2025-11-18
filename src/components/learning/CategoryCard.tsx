import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Icons from "lucide-react-native";
import type { Category } from "@/src/types/learning";

interface CategoryCardProps {
	category: Category;
	onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
	// Dynamically get the icon component from Lucide
	const IconComponent = (Icons as any)[category.icon] || Icons.BookOpen;

	return (
		<TouchableOpacity
			style={[styles.card, { borderColor: category.color }]}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.iconContainer,
					{ backgroundColor: `${category.color}20` },
				]}
			>
				<IconComponent size={32} color={category.color} strokeWidth={2} />
			</View>
			<Text style={styles.name} numberOfLines={2}>
				{category.name}
			</Text>
			<Text style={styles.courseCount}>
				{category.courseCount}{" "}
				{category.courseCount === 1 ? "course" : "courses"}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "47%",
		margin: "1.5%",
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		borderWidth: 2,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	iconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	name: {
		fontSize: 15,
		fontWeight: "600",
		color: "#2F4F4F",
		textAlign: "center",
		marginBottom: 6,
		lineHeight: 20,
		minHeight: 40,
	},
	courseCount: {
		fontSize: 13,
		color: "#8B4513",
		textAlign: "center",
	},
});
