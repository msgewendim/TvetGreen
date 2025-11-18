/**
 * NextLessonCard Component
 *
 * Displays the next lesson preview with duration and download status
 */

import { ChevronRight, Clock, Download } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";
import { useLanguage } from "@/hooks/useLanguage";

export interface NextLesson {
	title: string;
	duration: string;
	isDownloaded: boolean;
}

interface NextLessonCardProps {
	lesson: NextLesson;
	onPress?: () => void;
}

export const NextLessonCard: React.FC<NextLessonCardProps> = ({
	lesson,
	onPress,
}) => {
	const { t } = useLanguage();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Clock size={20} color={colors.primary.main} strokeWidth={2} />
				<Text style={styles.headerTitle}>{t("video.upNext")}</Text>
			</View>
			<TouchableOpacity
				style={styles.card}
				onPress={onPress}
				accessibilityLabel={`${t("video.nextLesson")}: ${lesson.title}`}
			>
				<View style={styles.info}>
					<Text style={styles.title}>{lesson.title}</Text>
					<Text style={styles.duration}>{lesson.duration}</Text>
				</View>
				<View style={styles.actions}>
					{lesson.isDownloaded && (
						<View style={styles.downloadedBadge}>
							<Download
								size={16}
								color={colors.feedback.success}
								strokeWidth={2}
							/>
						</View>
					)}
					<ChevronRight size={24} color={colors.primary.main} strokeWidth={2} />
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	headerTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginLeft: spacing.sm,
	},
	card: {
		flexDirection: "row",
		backgroundColor: colors.neutral.white,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		borderLeftWidth: 4,
		borderLeftColor: colors.primary.main,
		...spacing.shadow.md,
	},
	info: {
		flex: 1,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	duration: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	downloadedBadge: {
		padding: spacing.xs,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.feedback.successLight,
	},
});
