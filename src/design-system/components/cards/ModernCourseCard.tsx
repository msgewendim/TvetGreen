/**
 * ModernCourseCard Component
 *
 * Alison-style horizontal card with thumbnail, metadata row, and optional progress bar.
 * Unified card used across Courses, Learn, and Downloads screens.
 */

import type React from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { BookOpen, Clock, Star, Download, Trash2 } from "lucide-react-native";
import type { ModernCourseCardProps } from "../../../types/design-system";
import { colors, spacing, typography } from "../../tokens";

export const ModernCourseCard: React.FC<ModernCourseCardProps> = ({
	title,
	instructor,
	category,
	categoryColor,
	lessonsCount,
	duration,
	rating,
	progress,
	thumbnailUrl,
	size,
	downloadDate,
	isOffline,
	onPress,
	onDelete,
	testID,
	accessibilityLabel,
	style,
}) => {
	return (
		<TouchableOpacity
			style={[styles.card, style]}
			onPress={onPress}
			activeOpacity={0.85}
			testID={testID}
			accessibilityLabel={accessibilityLabel || `Course: ${title}`}
			accessibilityRole="button"
		>
			{/* Thumbnail */}
			<View style={styles.thumbnailContainer}>
				{thumbnailUrl ? (
					<Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
				) : (
					<View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
						<BookOpen size={24} color={colors.text.tertiary} />
					</View>
				)}
				{category && (
					<View
						style={[
							styles.levelBadge,
							{ backgroundColor: categoryColor || colors.primary.main },
						]}
					>
						<Text style={styles.levelBadgeText} numberOfLines={1}>
							{category}
						</Text>
					</View>
				)}
				{isOffline && (
					<View style={styles.offlineBadge}>
						<Download size={10} color={colors.text.inverse} />
					</View>
				)}
			</View>

			{/* Content */}
			<View style={styles.content}>
				<Text style={styles.title} numberOfLines={2}>
					{title}
				</Text>

				{instructor && (
					<Text style={styles.instructor} numberOfLines={1}>
						{instructor}
					</Text>
				)}

				{/* Metadata row */}
				<View style={styles.metaRow}>
					{lessonsCount != null && (
						<View style={styles.metaItem}>
							<BookOpen size={12} color={colors.text.tertiary} />
							<Text style={styles.metaText}>{lessonsCount} lessons</Text>
						</View>
					)}
					{duration && (
						<View style={styles.metaItem}>
							<Clock size={12} color={colors.text.tertiary} />
							<Text style={styles.metaText}>{duration}</Text>
						</View>
					)}
					{rating != null && rating > 0 && (
						<View style={styles.metaItem}>
							<Star size={12} color={colors.feedback.warning} />
							<Text style={styles.metaText}>{rating}</Text>
						</View>
					)}
					{size && (
						<Text style={styles.metaText}>{size}</Text>
					)}
				</View>

				{/* Download info */}
				{downloadDate && (
					<Text style={styles.downloadDate}>Downloaded {downloadDate}</Text>
				)}

				{/* Progress bar */}
				{progress != null && progress > 0 && (
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View
								style={[
									styles.progressFill,
									{
										width: `${Math.min(progress, 100)}%`,
										backgroundColor:
											progress >= 100
												? colors.feedback.success
												: colors.primary.main,
									},
								]}
							/>
						</View>
						<Text style={styles.progressText}>{Math.round(progress)}%</Text>
					</View>
				)}
			</View>

			{/* Delete action for downloads */}
			{onDelete && (
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={(e) => {
						e.stopPropagation?.();
						onDelete();
					}}
					accessibilityLabel={`Delete ${title}`}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<Trash2 size={16} color={colors.feedback.error} />
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		backgroundColor: colors.neutral.white,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.sm,
		overflow: "hidden",
		...spacing.shadow.sm,
	},
	thumbnailContainer: {
		width: 100,
		position: "relative",
	},
	thumbnail: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.neutral[100],
	},
	thumbnailPlaceholder: {
		justifyContent: "center",
		alignItems: "center",
	},
	levelBadge: {
		position: "absolute",
		bottom: spacing.xs,
		left: spacing.xs,
		paddingHorizontal: spacing.xs + 2,
		paddingVertical: 2,
		borderRadius: spacing.xs,
		maxWidth: 90,
	},
	levelBadgeText: {
		fontSize: 10,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
	},
	offlineBadge: {
		position: "absolute",
		top: spacing.xs,
		right: spacing.xs,
		backgroundColor: colors.primary.main,
		width: 20,
		height: 20,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
		padding: spacing.sm + 2,
		justifyContent: "center",
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: 2,
		lineHeight: 20,
	},
	instructor: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
		marginBottom: spacing.xs,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		flexWrap: "wrap",
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
	},
	metaText: {
		fontSize: 11,
		color: colors.text.tertiary,
		fontWeight: typography.fontWeight.medium,
	},
	downloadDate: {
		fontSize: 11,
		color: colors.text.tertiary,
		marginTop: 2,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	progressBar: {
		flex: 1,
		height: 4,
		backgroundColor: colors.neutral[200],
		borderRadius: 2,
	},
	progressFill: {
		height: "100%",
		borderRadius: 2,
	},
	progressText: {
		fontSize: 11,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		minWidth: 28,
	},
	deleteButton: {
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
	},
});
