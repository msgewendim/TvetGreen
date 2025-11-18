import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

interface SubtitlesOverlayProps {
	showSubtitles: boolean;
	subtitleText: string;
}

export function SubtitlesOverlay({
	showSubtitles,
	subtitleText,
}: SubtitlesOverlayProps) {
	if (!showSubtitles) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{subtitleText}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 100,
		left: spacing.lg,
		right: spacing.lg,
		alignItems: "center",
	},
	text: {
		fontSize: typography.fontSize.lg,
		color: colors.text.inverse,
		textAlign: "center",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: spacing.radius.sm,
		lineHeight: 24,
	},
});
