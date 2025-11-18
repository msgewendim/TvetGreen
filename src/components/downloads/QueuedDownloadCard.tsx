/**
 * QueuedDownloadCard Component
 *
 * Displays information about a queued download
 */

import { Clock } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";

export interface QueuedDownload {
	id: number;
	title: string;
	category: string;
	size: string;
	progress: number;
	estimatedTime: string;
}

interface QueuedDownloadCardProps {
	download: QueuedDownload;
}

export const QueuedDownloadCard: React.FC<QueuedDownloadCardProps> = ({
	download,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.info}>
				<Text style={styles.title} numberOfLines={1}>
					{download.title}
				</Text>
				<Text style={styles.category}>{download.category}</Text>
				<Text style={styles.size}>{download.size}</Text>
			</View>

			<View style={styles.progress}>
				{download.progress > 0 ? (
					<>
						<View style={styles.progressBar}>
							<View
								style={[
									styles.progressFill,
									{ width: `${download.progress}%` },
								]}
							/>
						</View>
						<Text style={styles.progressText}>
							{download.progress}% • {download.estimatedTime}
						</Text>
					</>
				) : (
					<View style={styles.waitingStatus}>
						<Clock size={16} color={colors.text.secondary} strokeWidth={2} />
						<Text style={styles.waitingText}>{download.estimatedTime}</Text>
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.md,
		padding: spacing.md,
		marginBottom: spacing.sm,
		borderLeftWidth: 4,
		borderLeftColor: colors.secondary.main,
		...spacing.shadow.sm,
	},
	info: {
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs / 2,
	},
	category: {
		fontSize: typography.fontSize.sm,
		color: colors.secondary.main,
		fontWeight: typography.fontWeight.semibold,
		marginBottom: spacing.xs / 2,
	},
	size: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
	},
	progress: {
		marginTop: spacing.sm,
	},
	progressBar: {
		height: 4,
		backgroundColor: colors.neutral[200],
		borderRadius: spacing.radius.sm,
		marginBottom: spacing.xs,
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.secondary.main,
		borderRadius: spacing.radius.sm,
	},
	progressText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		fontWeight: typography.fontWeight.medium,
	},
	waitingStatus: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	waitingText: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		fontWeight: typography.fontWeight.medium,
	},
});
