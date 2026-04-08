import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors, spacing } from "@/design-system";

export default function HomeScreen() {
	const { t } = useLanguage();
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
			<Text variant="headlineMedium" style={styles.title}>
				{t("home.welcomeMessage")}
			</Text>
			<View style={styles.placeholder}>
				<Text variant="bodyLarge" style={styles.placeholderText}>
					Home screen — will be rebuilt with course list
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
		paddingHorizontal: spacing.lg,
	},
	title: {
		color: colors.text.primary,
		marginBottom: spacing.lg,
	},
	placeholder: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		color: colors.text.secondary,
		textAlign: "center",
	},
});
