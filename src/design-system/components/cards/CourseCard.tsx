/**
 * CourseCard Component
 *
 * Displays course information with progress, duration, and download status
 * Optimized for course catalog and dashboard views
 */

import { Clock, Download } from "lucide-react-native";
import type React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import type { CourseCardProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";
import { Card } from "./Card";

export const CourseCard: React.FC<CourseCardProps> = ({
	title,
	category,
	categoryColor = colors.primary.main,
	duration,
	progress = 0,
	isDownloaded = false,
	thumbnailUrl,
	onPress,
	testID,
	accessibilityLabel,
	accessibilityHint,
}) => {
	return (
		<Card
			variant="elevated"
			onPress={onPress}
			testID={testID}
			accessibilityLabel={accessibilityLabel || `${title} course card`}
			accessibilityHint={accessibilityHint || `Open ${title} course details`}
			style={[styles.container]}
		>
			{/* Thumbnail */}
			<View style={styles.thumbnail}>
				{thumbnailUrl ? (
					<ImageBackground
						source={{ uri: thumbnailUrl }}
						style={styles.thumbnailImage}
						imageStyle={styles.thumbnailImageStyle}
					>
						<View style={styles.thumbnailOverlay} />
					</ImageBackground>
				) : (
					<View
						style={[
							styles.thumbnailPlaceholder,
							{ backgroundColor: `${categoryColor}20` },
						]}
					>
						<Text style={styles.thumbnailIcon}>📚</Text>
					</View>
				)}

				{/* Download indicator */}
				{isDownloaded && (
					<View style={styles.downloadBadge}>
						<Download
							size={16}
							color={colors.feedback.success}
							strokeWidth={2}
						/>
					</View>
				)}
			</View>

			{/* Content */}
			<View style={styles.content}>
				{/* Category badge */}
				<View
					style={[
						styles.categoryBadge,
						{ backgroundColor: `${categoryColor}20` },
					]}
				>
					<Text
						style={[styles.categoryText, { color: categoryColor }]}
						numberOfLines={1}
					>
						{category}
					</Text>
				</View>

				{/* Title */}
				<Text style={styles.title} numberOfLines={2}>
					{title}
				</Text>

				{/* Duration */}
				<View style={styles.metaRow}>
					<Clock size={16} color={colors.text.secondary} strokeWidth={2} />
					<Text style={styles.durationText}>{duration}</Text>
				</View>

				{/* Progress bar */}
				{progress > 0 && (
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View style={[styles.progressFill, { width: `${progress}%` }]} />
						</View>
						<Text style={styles.progressText}>{progress}%</Text>
					</View>
				)}
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 0,
		overflow: "hidden",
	},
	thumbnail: {
		height: 140,
		position: "relative",
	},
	thumbnailImage: {
		width: "100%",
		height: "100%",
	},
	thumbnailImageStyle: {
		borderTopLeftRadius: spacing.radius.md,
		borderTopRightRadius: spacing.radius.md,
	},
	thumbnailOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	thumbnailPlaceholder: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	thumbnailIcon: {
		fontSize: 48,
	},
	downloadBadge: {
		position: "absolute",
		top: spacing.sm,
		right: spacing.sm,
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.sm,
		padding: spacing.xs,
		// ...spacing.shadow.sm,
	},
	content: {
		padding: spacing.md,
	},
	categoryBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.sm,
		marginBottom: spacing.sm,
	},
	categoryText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.semibold,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: spacing.sm,
		lineHeight: typography.fontSize.base * typography.lineHeight.tight,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginBottom: spacing.sm,
	},
	durationText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	progressBar: {
		flex: 1,
		height: 6,
		backgroundColor: colors.neutral[200],
		borderRadius: spacing.radius.full,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary.main,
		borderRadius: spacing.radius.full,
	},
	progressText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.medium,
		color: colors.text.secondary,
		minWidth: 32,
		textAlign: "right",
	},
});
