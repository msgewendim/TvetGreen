import React from "react";
import { View, Text, StyleSheet, type ViewStyle } from "react-native";

interface ProgressBarProps {
	progress: number; // 0-100
	height?: number;
	showLabel?: boolean;
	labelPosition?: "right" | "top" | "none";
	color?: string;
	backgroundColor?: string;
	style?: ViewStyle;
}

export function ProgressBar({
	progress,
	height = 6,
	showLabel = true,
	labelPosition = "right",
	color = "#32CD32",
	backgroundColor = "#E5E5E5",
	style,
}: ProgressBarProps) {
	// Clamp progress between 0 and 100
	const clampedProgress = Math.min(Math.max(progress, 0), 100);

	if (labelPosition === "top") {
		return (
			<View style={[styles.container, style]}>
				{showLabel && (
					<View style={styles.topLabelContainer}>
						<Text style={styles.label}>Progress</Text>
						<Text style={styles.percentage}>
							{Math.round(clampedProgress)}%
						</Text>
					</View>
				)}
				<View style={[styles.bar, { height, backgroundColor }]}>
					<View
						style={[
							styles.fill,
							{
								width: `${clampedProgress}%`,
								backgroundColor: color,
								height,
							},
						]}
					/>
				</View>
			</View>
		);
	}

	if (labelPosition === "right") {
		return (
			<View style={[styles.horizontalContainer, style]}>
				<View style={[styles.bar, { height, backgroundColor }]}>
					<View
						style={[
							styles.fill,
							{
								width: `${clampedProgress}%`,
								backgroundColor: color,
								height,
							},
						]}
					/>
				</View>
				{showLabel && (
					<Text style={styles.rightLabel}>{Math.round(clampedProgress)}%</Text>
				)}
			</View>
		);
	}

	// No label
	return (
		<View style={[styles.container, style]}>
			<View style={[styles.bar, { height, backgroundColor }]}>
				<View
					style={[
						styles.fill,
						{
							width: `${clampedProgress}%`,
							backgroundColor: color,
							height,
						},
					]}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	horizontalContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		width: "100%",
	},
	topLabelContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	percentage: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2E8B57",
	},
	bar: {
		flex: 1,
		borderRadius: 3,
		overflow: "hidden",
	},
	fill: {
		borderRadius: 3,
	},
	rightLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		width: 40,
		textAlign: "right",
	},
});
