import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ViewStyle,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { Course } from "@/src/types/learning";

interface CourseCardProps {
	course: Course;
	onPress: () => void;
	variant?: "default" | "compact" | "detailed";
	showProgress?: boolean;
	progress?: number;
	isEnrolled?: boolean;
	showChevron?: boolean;
}

export function CourseCard({
	course,
	onPress,
	variant = "default",
	showProgress = false,
	progress = 0,
	isEnrolled = false,
	showChevron = true,
}: CourseCardProps) {
	if (variant === "compact") {
		return (
			<TouchableOpacity
				style={styles.compactCard}
				onPress={onPress}
				activeOpacity={0.8}
			>
				<Image
					source={{ uri: course.thumbnail }}
					style={styles.compactThumbnail}
					resizeMode="cover"
				/>
				<View style={styles.compactInfo}>
					<Text style={styles.compactTitle} numberOfLines={2}>
						{course.title}
					</Text>
					<Text style={styles.compactInstructor} numberOfLines={1}>
						{course.instructor.name}
					</Text>
					{showProgress && (
						<View style={styles.progressContainer}>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: `${progress}%` }]} />
							</View>
							<Text style={styles.progressText}>{progress}%</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
		);
	}

	if (variant === "detailed") {
		return (
			<TouchableOpacity
				style={styles.detailedCard}
				onPress={onPress}
				activeOpacity={0.8}
			>
				<Image
					source={{ uri: course.thumbnail }}
					style={styles.detailedThumbnail}
					resizeMode="cover"
				/>
				<View style={styles.detailedInfo}>
					<View style={styles.badges}>
						<View style={styles.levelBadge}>
							<Text style={styles.levelText}>{course.level.toUpperCase()}</Text>
						</View>
						{isEnrolled && (
							<View style={styles.enrolledBadge}>
								<Text style={styles.enrolledText}>ENROLLED</Text>
							</View>
						)}
					</View>
					<Text style={styles.detailedTitle} numberOfLines={2}>
						{course.title}
					</Text>
					<Text style={styles.detailedInstructor} numberOfLines={1}>
						{course.instructor.name}
					</Text>
					<View style={styles.metaContainer}>
						<Text style={styles.metaText}>
							{course.lessonCount} lessons • {course.duration}
						</Text>
						{course.rating && (
							<Text style={styles.ratingText}>⭐ {course.rating}</Text>
						)}
					</View>
					{showProgress && progress > 0 && (
						<View style={styles.progressContainer}>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: `${progress}%` }]} />
							</View>
							<Text style={styles.progressText}>{progress}%</Text>
						</View>
					)}
				</View>
				{showChevron && <ChevronRight size={24} color="#2E8B57" />}
			</TouchableOpacity>
		);
	}

	// Default variant
	return (
		<TouchableOpacity
			style={styles.defaultCard}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Image
				source={{ uri: course.thumbnail }}
				style={styles.defaultThumbnail}
				resizeMode="cover"
			/>
			<View style={styles.defaultInfo}>
				<Text style={styles.defaultTitle} numberOfLines={2}>
					{course.title}
				</Text>
				<Text style={styles.defaultInstructor} numberOfLines={1}>
					{course.instructor.name}
				</Text>
				<Text style={styles.defaultMeta} numberOfLines={1}>
					{course.lessonCount} lessons • {course.duration}
				</Text>
				{showProgress && (
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View style={[styles.progressFill, { width: `${progress}%` }]} />
						</View>
						<Text style={styles.progressText}>{progress}%</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	// Compact variant (horizontal, used in My Learning)
	compactCard: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	compactThumbnail: {
		width: 120,
		height: 140,
		backgroundColor: "#E5E5E5",
	},
	compactInfo: {
		flex: 1,
		padding: 12,
		justifyContent: "space-between",
	},
	compactTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 22,
	},
	compactInstructor: {
		fontSize: 13,
		color: "#8B4513",
		marginTop: 4,
	},

	// Detailed variant (horizontal with badges, used in Courses List)
	detailedCard: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		padding: 12,
		gap: 12,
		alignItems: "center",
	},
	detailedThumbnail: {
		width: 100,
		height: 120,
		borderRadius: 8,
		backgroundColor: "#E5E5E5",
	},
	detailedInfo: {
		flex: 1,
	},
	badges: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 8,
	},
	levelBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		backgroundColor: "#87CEEB20",
	},
	levelText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#87CEEB",
	},
	enrolledBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		backgroundColor: "#32CD3220",
	},
	enrolledText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#32CD32",
	},
	detailedTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 22,
		marginBottom: 4,
	},
	detailedInstructor: {
		fontSize: 13,
		color: "#8B4513",
		marginBottom: 6,
	},
	metaContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	metaText: {
		fontSize: 12,
		color: "#8B4513",
	},
	ratingText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#DAA520",
	},

	// Default variant (vertical card)
	defaultCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	defaultThumbnail: {
		width: "100%",
		height: 160,
		backgroundColor: "#E5E5E5",
	},
	defaultInfo: {
		padding: 12,
	},
	defaultTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 22,
		marginBottom: 4,
	},
	defaultInstructor: {
		fontSize: 13,
		color: "#8B4513",
		marginBottom: 4,
	},
	defaultMeta: {
		fontSize: 12,
		color: "#8B4513",
	},

	// Shared styles
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 8,
	},
	progressBar: {
		flex: 1,
		height: 6,
		backgroundColor: "#E5E5E5",
		borderRadius: 3,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 3,
	},
	progressText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		width: 40,
		textAlign: "right",
	},
});
