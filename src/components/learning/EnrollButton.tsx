import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	type ViewStyle,
} from "react-native";
import { Play, CheckCircle2, Lock } from "lucide-react-native";

type EnrollButtonState = "enroll" | "continue" | "start" | "completed";

interface EnrollButtonProps {
	state: EnrollButtonState;
	onPress: () => void;
	isPaid?: boolean;
	price?: number;
	currency?: string;
	progress?: number;
	style?: ViewStyle;
	disabled?: boolean;
}

export function EnrollButton({
	state,
	onPress,
	isPaid = false,
	price = 0,
	currency = "USD",
	progress = 0,
	style,
	disabled = false,
}: EnrollButtonProps) {
	const getButtonConfig = () => {
		switch (state) {
			case "completed":
				return {
					text: "Completed",
					icon: <CheckCircle2 size={20} color="#32CD32" />,
					backgroundColor: "#32CD3220",
					textColor: "#32CD32",
					borderColor: "#32CD32",
				};
			case "continue":
				return {
					text: `Continue Learning (${progress}%)`,
					icon: <Play size={20} color="#FDF5E6" />,
					backgroundColor: "#2E8B57",
					textColor: "#FDF5E6",
					borderColor: "#2E8B57",
				};
			case "start":
				return {
					text: "Start Learning",
					icon: <Play size={20} color="#FDF5E6" />,
					backgroundColor: "#2E8B57",
					textColor: "#FDF5E6",
					borderColor: "#2E8B57",
				};
			case "enroll":
			default:
				return {
					text: isPaid
						? `Enroll for ${currency} ${price}`
						: "Enroll Now - Free",
					icon: null,
					backgroundColor: "#2E8B57",
					textColor: "#FDF5E6",
					borderColor: "#2E8B57",
				};
		}
	};

	const config = getButtonConfig();

	return (
		<TouchableOpacity
			style={[
				styles.button,
				{
					backgroundColor: config.backgroundColor,
					borderColor: config.borderColor,
				},
				state === "completed" && styles.completedButton,
				style,
			]}
			onPress={onPress}
			disabled={disabled || state === "completed"}
			activeOpacity={0.7}
		>
			{config.icon}
			<Text style={[styles.text, { color: config.textColor }]}>
				{config.text}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		borderWidth: 2,
	},
	completedButton: {
		borderWidth: 2,
	},
	text: {
		fontSize: 16,
		fontWeight: "600",
	},
});
