import { Mic } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

interface VoiceGuideOverlayProps {
	isListening: boolean;
}

export function VoiceGuideOverlay({ isListening }: VoiceGuideOverlayProps) {
	if (!isListening) return null;

	return (
		<View style={styles.overlay}>
			<View style={styles.instructions}>
				<View style={styles.listeningIndicator}>
					<View style={styles.pulseRing} />
					<Mic size={32} color={colors.text.inverse} strokeWidth={2} />
				</View>
				<Text style={styles.instructionText}>🎤 Listening for commands...</Text>
				<Text style={styles.commands}>
					Say: "Play", "Pause", "Next", "Previous", "Repeat", "Bookmark"
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "center",
		alignItems: "center",
	},
	instructions: {
		backgroundColor: "rgba(46, 139, 87, 0.95)",
		padding: spacing.xl,
		borderRadius: spacing.radius.md,
		alignItems: "center",
		marginHorizontal: spacing.xl + 8,
	},
	listeningIndicator: {
		position: "relative",
		marginBottom: spacing.md,
	},
	pulseRing: {
		position: "absolute",
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: colors.text.inverse,
		opacity: 0.5,
		top: -24,
		left: -24,
	},
	instructionText: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	commands: {
		fontSize: typography.fontSize.sm,
		color: colors.text.inverse,
		textAlign: "center",
		opacity: 0.9,
		lineHeight: 20,
	},
});
