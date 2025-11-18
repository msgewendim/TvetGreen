import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import {
	X,
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	List,
	Play,
	Pause,
} from "lucide-react-native";

export function LessonPlayerScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const lessonId = params.id as string;

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [showLessonList, setShowLessonList] = useState(false);

	const getLessonById = useLearningStore((state) => state.getLessonById);
	const getCourseById = useLearningStore((state) => state.getCourseById);
	const getLessonsByModule = useLearningStore((state) => state.getLessonsByModule);
	const getNextLesson = useLearningStore((state) => state.getNextLesson);
	const updateLessonProgress = useLearningStore(
		(state) => state.updateLessonProgress
	);
	const markLessonComplete = useLearningStore(
		(state) => state.markLessonComplete
	);
	const getLessonProgress = useLearningStore((state) => state.getLessonProgress);

	const lesson = getLessonById(lessonId);
	const course = lesson ? getCourseById(lesson.courseId) : null;
	const modules = lesson ? getLessonsByModule(lesson.courseId) : [];
	const nextLesson = lesson ? getNextLesson(lesson.id) : null;
	const progress = getLessonProgress(lessonId);

	// Parse duration to seconds
	const getTotalSeconds = (duration: string) => {
		const parts = duration.split(":").map(Number);
		if (parts.length === 2) {
			return parts[0] * 60 + parts[1];
		}
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	};

	const totalSeconds = lesson ? getTotalSeconds(lesson.duration) : 0;

	// Simulate video progress (in production, this would come from the actual video player)
	useEffect(() => {
		if (!lesson) return;

		let interval: NodeJS.Timeout;
		if (isPlaying) {
			interval = setInterval(() => {
				setCurrentTime((prev) => {
					const next = Math.min(prev + 1, totalSeconds);

					// Update progress every 5 seconds
					if (Math.floor(next) % 5 === 0) {
						updateLessonProgress(
							lesson.id,
							lesson.courseId,
							next,
							totalSeconds,
							next
						);
					}

					// Auto-complete at 90%
					if (next / totalSeconds >= 0.9 && !progress?.isCompleted) {
						markLessonComplete(lesson.id, lesson.courseId);
					}

					return next;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isPlaying, lesson, totalSeconds]);

	// Load saved progress on mount
	useEffect(() => {
		if (progress?.lastPosition) {
			setCurrentTime(progress.lastPosition);
		}
	}, [progress]);

	if (!lesson || !course) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Lesson not found</Text>
			</View>
		);
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleClose = () => {
		router.back();
	};

	const handleMarkComplete = async () => {
		await markLessonComplete(lesson.id, lesson.courseId);
		Alert.alert("Success", "Lesson marked as complete!", [
			{
				text: "Next Lesson",
				onPress: () => {
					if (nextLesson) {
						router.replace(`/learning/lesson/${nextLesson.id}`);
					} else {
						Alert.alert(
							"Congratulations!",
							"You've completed all lessons in this course!",
							[
								{
									text: "Back to Course",
									onPress: () => router.push(`/learning/courses/${course.id}`),
								},
							]
						);
					}
				},
			},
			{ text: "Stay Here", style: "cancel" },
		]);
	};

	const handleNextLesson = () => {
		if (nextLesson) {
			router.replace(`/learning/lesson/${nextLesson.id}`);
		} else {
			Alert.alert(
				"Last Lesson",
				"This is the last lesson in the course. Great job!"
			);
		}
	};

	const handleLessonSelect = (selectedLessonId: string) => {
		router.replace(`/learning/lesson/${selectedLessonId}`);
		setShowLessonList(false);
	};

	return (
		<View style={styles.container}>
			{/* Video Player Placeholder */}
			<View style={styles.videoContainer}>
				{/* In production, replace with actual YouTube player */}
				<View style={styles.videoPlaceholder}>
					<Text style={styles.videoId}>Video: {lesson.videoId}</Text>
					<TouchableOpacity
						style={styles.playButton}
						onPress={() => setIsPlaying(!isPlaying)}
					>
						{isPlaying ? (
							<Pause size={48} color="#FDF5E6" />
						) : (
							<Play size={48} color="#FDF5E6" />
						)}
					</TouchableOpacity>
					<Text style={styles.timeText}>
						{formatTime(currentTime)} / {formatTime(totalSeconds)}
					</Text>
				</View>

				{/* Close Button */}
				<TouchableOpacity style={styles.closeButton} onPress={handleClose}>
					<X size={28} color="#FDF5E6" />
				</TouchableOpacity>

				{/* Lesson List Toggle */}
				<TouchableOpacity
					style={styles.listButton}
					onPress={() => setShowLessonList(!showLessonList)}
				>
					<List size={24} color="#FDF5E6" />
				</TouchableOpacity>
			</View>

			{/* Lesson Info */}
			<View style={styles.infoContainer}>
				<Text style={styles.courseTitle}>{course.title}</Text>
				<Text style={styles.lessonTitle}>{lesson.title}</Text>

				{/* Progress Bar */}
				<View style={styles.progressContainer}>
					<View style={styles.progressBar}>
						<View
							style={[
								styles.progressFill,
								{ width: `${(currentTime / totalSeconds) * 100}%` },
							]}
						/>
					</View>
					<Text style={styles.progressText}>
						{Math.round((currentTime / totalSeconds) * 100)}%
					</Text>
				</View>

				{/* Actions */}
				<View style={styles.actionsContainer}>
					{progress?.isCompleted ? (
						<View style={styles.completedBadge}>
							<CheckCircle2 size={20} color="#32CD32" />
							<Text style={styles.completedText}>Completed</Text>
						</View>
					) : (
						<TouchableOpacity
							style={styles.completeButton}
							onPress={handleMarkComplete}
						>
							<CheckCircle2 size={20} color="#FDF5E6" />
							<Text style={styles.completeButtonText}>Mark Complete</Text>
						</TouchableOpacity>
					)}

					{nextLesson && (
						<TouchableOpacity
							style={styles.nextButton}
							onPress={handleNextLesson}
						>
							<Text style={styles.nextButtonText}>Next Lesson</Text>
							<ChevronRight size={20} color="#2E8B57" />
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Lesson List Overlay */}
			{showLessonList && (
				<View style={styles.lessonListOverlay}>
					<View style={styles.lessonListContainer}>
						<View style={styles.lessonListHeader}>
							<Text style={styles.lessonListTitle}>Course Lessons</Text>
							<TouchableOpacity
								onPress={() => setShowLessonList(false)}
							>
								<X size={24} color="#2F4F4F" />
							</TouchableOpacity>
						</View>
						<ScrollView>
							{modules.map((module, moduleIndex) => (
								<View key={module.id} style={styles.module}>
									<Text style={styles.moduleName}>
										Module {moduleIndex + 1}: {module.name}
									</Text>
									{module.lessons.map((moduleLesson) => (
										<TouchableOpacity
											key={moduleLesson.id}
											style={[
												styles.lessonItem,
												moduleLesson.id === lessonId && styles.currentLesson,
											]}
											onPress={() => handleLessonSelect(moduleLesson.id)}
										>
											<View style={styles.lessonItemLeft}>
												{moduleLesson.isCompleted ? (
													<CheckCircle2 size={18} color="#32CD32" />
												) : (
													<Play size={18} color="#2E8B57" />
												)}
												<Text
													style={[
														styles.lessonItemTitle,
														moduleLesson.id === lessonId &&
															styles.currentLessonText,
													]}
													numberOfLines={2}
												>
													{moduleLesson.title}
												</Text>
											</View>
											<Text style={styles.lessonItemDuration}>
												{moduleLesson.duration}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							))}
						</ScrollView>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FDF5E6",
	},
	errorText: {
		fontSize: 18,
		color: "#DC143C",
	},
	videoContainer: {
		position: "relative",
		width: "100%",
		aspectRatio: 16 / 9,
		backgroundColor: "#000000",
	},
	videoPlaceholder: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1a1a1a",
	},
	videoId: {
		position: "absolute",
		top: 20,
		fontSize: 12,
		color: "#FFFFFF",
		opacity: 0.7,
	},
	playButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(46, 139, 87, 0.8)",
		justifyContent: "center",
		alignItems: "center",
	},
	timeText: {
		position: "absolute",
		bottom: 20,
		fontSize: 14,
		color: "#FFFFFF",
		fontWeight: "600",
	},
	closeButton: {
		position: "absolute",
		top: 40,
		left: 20,
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	listButton: {
		position: "absolute",
		top: 40,
		right: 20,
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	infoContainer: {
		flex: 1,
		backgroundColor: "#FDF5E6",
		padding: 20,
	},
	courseTitle: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 4,
	},
	lessonTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 16,
		lineHeight: 28,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 20,
	},
	progressBar: {
		flex: 1,
		height: 8,
		backgroundColor: "#E5E5E5",
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#2E8B57",
		borderRadius: 4,
	},
	progressText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
		width: 45,
		textAlign: "right",
	},
	actionsContainer: {
		flexDirection: "row",
		gap: 12,
	},
	completeButton: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#2E8B57",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	completeButtonText: {
		color: "#FDF5E6",
		fontSize: 15,
		fontWeight: "600",
	},
	completedBadge: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#32CD3220",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		borderWidth: 2,
		borderColor: "#32CD32",
	},
	completedText: {
		color: "#32CD32",
		fontSize: 15,
		fontWeight: "600",
	},
	nextButton: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		gap: 8,
		borderWidth: 2,
		borderColor: "#2E8B57",
	},
	nextButtonText: {
		color: "#2E8B57",
		fontSize: 15,
		fontWeight: "600",
	},
	lessonListOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "flex-end",
	},
	lessonListContainer: {
		backgroundColor: "#FDF5E6",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: "70%",
		paddingBottom: 20,
	},
	lessonListHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
	},
	lessonListTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	module: {
		padding: 16,
	},
	moduleName: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 12,
	},
	lessonItem: {
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
	lessonItemLeft: {
		flexDirection: "row",
		gap: 10,
		flex: 1,
		alignItems: "center",
	},
	lessonItemTitle: {
		flex: 1,
		fontSize: 14,
		color: "#2F4F4F",
		lineHeight: 20,
	},
	currentLessonText: {
		fontWeight: "600",
		color: "#2E8B57",
	},
	lessonItemDuration: {
		fontSize: 12,
		color: "#8B4513",
		marginLeft: 8,
	},
});
