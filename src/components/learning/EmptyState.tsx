import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Icons from "lucide-react-native";

interface EmptyStateProps {
	icon?: keyof typeof Icons;
	iconSize?: number;
	iconColor?: string;
	title: string;
	subtitle?: string;
	actionLabel?: string;
	onAction?: () => void;
	children?: ReactNode;
}

export function EmptyState({
	icon = "BookOpen",
	iconSize = 60,
	iconColor = "#8B4513",
	title,
	subtitle,
	actionLabel,
	onAction,
	children,
}: EmptyStateProps) {
	const IconComponent = (Icons as any)[icon] || Icons.BookOpen;

	return (
		<View style={styles.container}>
			<IconComponent size={iconSize} color={iconColor} strokeWidth={1.5} />
			<Text style={styles.title}>{title}</Text>
			{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
			{actionLabel && onAction && (
				<TouchableOpacity style={styles.button} onPress={onAction}>
					<Text style={styles.buttonText}>{actionLabel}</Text>
				</TouchableOpacity>
			)}
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
		paddingVertical: 60,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginTop: 16,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: "#8B4513",
		marginTop: 8,
		textAlign: "center",
		lineHeight: 20,
	},
	button: {
		marginTop: 24,
		backgroundColor: "#2E8B57",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 10,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	buttonText: {
		color: "#FDF5E6",
		fontSize: 15,
		fontWeight: "600",
	},
});
