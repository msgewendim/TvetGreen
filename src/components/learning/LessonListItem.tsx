import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PlayCircle, Lock } from "lucide-react-native";
import type { Lesson } from "@/src/types/learning";

interface LessonListItemProps {
	lesson: Lesson;
	onPress: () => void;
	isLocked?: boolean;
	isCurrent?: boolean;
	disabled?: boolean;
}

export function LessonListItem({
	lesson,
	onPress,
	isLocked = false,
	isCurrent = false,
	disabled = false,
}: LessonListItemProps) {
	return (
		<TouchableOpacity
			style={[styles.container, isCurrent && styles.currentLesson]}
			onPress={onPress}
			disabled={disabled || isLocked}
			activeOpacity={0.7}
		>
			<View style={styles.left}>
				{isLocked ? (
					<Lock size={20} color="#8B4513" />
				) : (
					<PlayCircle size={20} color="#2E8B57" />
				)}
				<View style={styles.info}>
					<Text
						style={[
							styles.title,
							isLocked && styles.lockedText,
							isCurrent && styles.currentText,
						]}
						numberOfLines={2}
					>
						{lesson.title}
					</Text>
					<View style={styles.meta}>
						<Text style={styles.duration}>{lesson.duration}</Text>
						{lesson.isPreview && (
							<View style={styles.previewBadge}>
								<Text style={styles.previewText}>PREVIEW</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	currentLesson: {
		backgroundColor: "#2E8B5720",
		borderWidth: 2,
		borderColor: "#2E8B57",
	},
	left: {
		flexDirection: "row",
		gap: 12,
		flex: 1,
		alignItems: "center",
	},
	info: {
		flex: 1,
	},
	title: {
		fontSize: 14,
		fontWeight: "500",
		color: "#2F4F4F",
		lineHeight: 20,
		marginBottom: 4,
	},
	lockedText: {
		color: "#8B4513",
		opacity: 0.6,
	},
	currentText: {
		fontWeight: "600",
		color: "#2E8B57",
	},
	meta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	duration: {
		fontSize: 12,
		color: "#8B4513",
	},
	previewBadge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
		backgroundColor: "#FF8C4220",
	},
	previewText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#FF8C42",
	},
});
