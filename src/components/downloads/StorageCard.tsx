/**
 * StorageCard Component
 *
 * Displays storage usage information
 */

import { HardDrive, Settings } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

interface StorageCardProps {
	storageUsed: number;
	storageTotal: number;
	coursesCount: number;
	onSettingsPress?: () => void;
}

export const StorageCard: React.FC<StorageCardProps> = ({
	storageUsed,
	storageTotal,
	coursesCount,
	onSettingsPress,
}) => {
	const storagePercentage = (storageUsed / storageTotal) * 100;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<HardDrive size={24} color={colors.primary.main} strokeWidth={2} />
				<Text style={styles.title}>Storage Usage</Text>
				<TouchableOpacity
					style={styles.settingsButton}
					onPress={onSettingsPress}
					accessibilityLabel="Storage settings"
				>
					<Settings size={20} color={colors.text.secondary} strokeWidth={2} />
				</TouchableOpacity>
			</View>

			<View style={styles.bar}>
				<View style={[styles.used, { width: `${storagePercentage}%` }]} />
			</View>

			<View style={styles.info}>
				<Text style={styles.text}>
					{storageUsed} GB used of {storageTotal} GB
				</Text>
				<Text style={styles.subtext}>{coursesCount} courses downloaded</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.neutral.white,
		marginHorizontal: spacing.lg,
		marginTop: spacing.lg,
		marginBottom: spacing.md,
		padding: spacing.lg,
		borderRadius: spacing.radius.md,
		...spacing.shadow.md,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.md,
	},
	title: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginLeft: spacing.sm,
		flex: 1,
	},
	settingsButton: {
		padding: spacing.sm,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.neutral[100],
	},
	bar: {
		height: 8,
		backgroundColor: colors.neutral[200],
		borderRadius: spacing.radius.sm,
		marginBottom: spacing.sm,
	},
	used: {
		height: "100%",
		backgroundColor: colors.primary.main,
		borderRadius: spacing.radius.sm,
	},
	info: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	text: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	subtext: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
	},
});
