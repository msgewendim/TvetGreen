import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import {
	Play,
	Clock,
	BookOpen,
	BarChart3,
	CheckCircle2,
	Lock,
	PlayCircle,
} from "lucide-react-native";

type TabType = "overview" | "curriculum" | "about";

export function CourseDetailScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const courseId = params.id as string;

	const [activeTab, setActiveTab] = useState<TabType>("overview");

	const getCourseById = useLearningStore((state) => state.getCourseById);
	const getLessonsByModule = useLearningStore((state) => state.getLessonsByModule);
	const isEnrolled = useLearningStore((state) => state.isEnrolled);
	const enrollInCourse = useLearningStore((state) => state.enrollInCourse);
	const getCourseProgress = useLearningStore((state) => state.getCourseProgress);

	const course = getCourseById(courseId);
	const modules = getLessonsByModule(courseId);
	const enrolled = isEnrolled(courseId);
	const progress = enrolled ? getCourseProgress(courseId) : 0;

	if (!course) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Course not found</Text>
			</View>
		);
	}

	const handleEnroll = async () => {
		if (course.isPaid) {
			Alert.alert(
				"Paid Course",
				"Payment functionality will be available soon. For now, this course is free to enroll.",
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Enroll",
						onPress: async () => {
							await enrollInCourse(courseId);
							Alert.alert("Success", "You've been enrolled in this course!");
						},
					},
				]
			);
		} else {
			await enrollInCourse(courseId);
			Alert.alert("Success", "You've been enrolled in this course!");
		}
	};

	const handleStartLearning = () => {
		// Navigate to first lesson
		if (modules.length > 0 && modules[0].lessons.length > 0) {
			router.push(`/learning/lesson/${modules[0].lessons[0].id}`);
		}
	};

	const handleLessonPress = (lessonId: string, isLocked: boolean) => {
		if (isLocked) {
			Alert.alert("Locked", "Please enroll in this course to access this lesson.");
			return;
		}
		router.push(`/learning/lesson/${lessonId}`);
	};

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Course Header */}
				<View style={styles.headerContainer}>
					<Image
						source={{ uri: course.thumbnail }}
						style={styles.thumbnail}
						resizeMode="cover"
					/>
					<View style={styles.overlay}>
						<View style={styles.badges}>
							<View style={styles.levelBadge}>
								<Text style={styles.badgeText}>
									{course.level.toUpperCase()}
								</Text>
							</View>
							{course.isPaid && (
								<View style={styles.priceBadge}>
									<Text style={styles.badgeText}>
										{course.currency} {course.price}
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>

				{/* Course Info */}
				<View style={styles.infoContainer}>
					<Text style={styles.courseTitle}>{course.title}</Text>
					<Text style={styles.instructor}>by {course.instructor.name}</Text>

					<View style={styles.metaContainer}>
						<View style={styles.metaItem}>
							<BookOpen size={16} color="#8B4513" />
							<Text style={styles.metaText}>{course.lessonCount} lessons</Text>
						</View>
						<View style={styles.metaItem}>
							<Clock size={16} color="#8B4513" />
							<Text style={styles.metaText}>{course.duration}</Text>
						</View>
						{course.rating && (
							<View style={styles.metaItem}>
								<Text style={styles.metaText}>⭐ {course.rating}</Text>
							</View>
						)}
					</View>

					{enrolled && (
						<View style={styles.progressSection}>
							<View style={styles.progressHeader}>
								<Text style={styles.progressLabel}>Your Progress</Text>
								<Text style={styles.progressPercentage}>{progress}%</Text>
							</View>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: `${progress}%` }]} />
							</View>
						</View>
					)}
				</View>

				{/* Tabs */}
				<View style={styles.tabsContainer}>
					<TouchableOpacity
						style={[styles.tab, activeTab === "overview" && styles.activeTab]}
						onPress={() => setActiveTab("overview")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "overview" && styles.activeTabText,
							]}
						>
							Overview
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, activeTab === "curriculum" && styles.activeTab]}
						onPress={() => setActiveTab("curriculum")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "curriculum" && styles.activeTabText,
							]}
						>
							Curriculum
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, activeTab === "about" && styles.activeTab]}
						onPress={() => setActiveTab("about")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "about" && styles.activeTabText,
							]}
						>
							About
						</Text>
					</TouchableOpacity>
				</View>

				{/* Tab Content */}
				<View style={styles.tabContent}>
					{activeTab === "overview" && (
						<View>
							<Text style={styles.sectionTitle}>Description</Text>
							<Text style={styles.description}>{course.description}</Text>

							<Text style={styles.sectionTitle}>What You'll Learn</Text>
							{course.learningOutcomes.map((outcome, index) => (
								<View key={index} style={styles.listItem}>
									<CheckCircle2 size={18} color="#32CD32" />
									<Text style={styles.listItemText}>{outcome}</Text>
								</View>
							))}
						</View>
					)}

					{activeTab === "curriculum" && (
						<View>
							{modules.map((module, moduleIndex) => (
								<View key={module.id} style={styles.module}>
									<Text style={styles.moduleName}>
										Module {moduleIndex + 1}: {module.name}
									</Text>
									{module.lessons.map((lesson) => {
										const isLocked = !enrolled && !lesson.isPreview;
										return (
											<TouchableOpacity
												key={lesson.id}
												style={styles.lessonItem}
												onPress={() => handleLessonPress(lesson.id, isLocked)}
												disabled={isLocked}
											>
												<View style={styles.lessonLeft}>
													{lesson.isCompleted ? (
														<CheckCircle2 size={20} color="#32CD32" />
													) : isLocked ? (
														<Lock size={20} color="#8B4513" />
													) : (
														<PlayCircle size={20} color="#2E8B57" />
													)}
													<View style={styles.lessonInfo}>
														<Text
															style={[
																styles.lessonTitle,
																isLocked && styles.lockedText,
															]}
															numberOfLines={2}
														>
															{lesson.title}
														</Text>
														<View style={styles.lessonMeta}>
															<Text style={styles.lessonDuration}>
																{lesson.duration}
															</Text>
															{lesson.isPreview && (
																<View style={styles.previewBadge}>
																	<Text style={styles.previewText}>PREVIEW</Text>
																</View>
															)}
														</View>
													</View>
												</View>
												{lesson.isCompleted && (
													<Text style={styles.completedText}>Completed</Text>
												)}
											</TouchableOpacity>
										);
									})}
								</View>
							))}
						</View>
					)}

					{activeTab === "about" && (
						<View>
							<Text style={styles.sectionTitle}>Instructor</Text>
							<View style={styles.instructorCard}>
								{course.instructor.avatar && (
									<Image
										source={{ uri: course.instructor.avatar }}
										style={styles.instructorAvatar}
									/>
								)}
								<View style={styles.instructorInfo}>
									<Text style={styles.instructorName}>
										{course.instructor.name}
									</Text>
									{course.instructor.bio && (
										<Text style={styles.instructorBio}>
											{course.instructor.bio}
										</Text>
									)}
								</View>
							</View>

							{course.requirements.length > 0 && (
								<>
									<Text style={styles.sectionTitle}>Requirements</Text>
									{course.requirements.map((req, index) => (
										<View key={index} style={styles.listItem}>
											<Text style={styles.bullet}>•</Text>
											<Text style={styles.listItemText}>{req}</Text>
										</View>
									))}
								</>
							)}

							<Text style={styles.sectionTitle}>Languages</Text>
							<Text style={styles.description}>
								Available in: {course.language.join(", ").toUpperCase()}
							</Text>
						</View>
					)}
				</View>
			</ScrollView>

			{/* Bottom CTA */}
			<View style={styles.bottomBar}>
				{enrolled ? (
					<TouchableOpacity
						style={styles.ctaButton}
						onPress={handleStartLearning}
					>
						<Play size={20} color="#FDF5E6" />
						<Text style={styles.ctaButtonText}>
							{progress > 0 ? "Continue Learning" : "Start Learning"}
						</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={styles.ctaButton} onPress={handleEnroll}>
						<Text style={styles.ctaButtonText}>
							{course.isPaid ? `Enroll for ${course.currency} ${course.price}` : "Enroll Now - Free"}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDF5E6",
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
	headerContainer: {
		position: "relative",
		height: 220,
	},
	thumbnail: {
		width: "100%",
		height: "100%",
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.2)",
		padding: 16,
	},
	badges: {
		flexDirection: "row",
		gap: 8,
	},
	levelBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: "rgba(255, 255, 255, 0.9)",
	},
	priceBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: "#DAA520",
	},
	badgeText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#2F4F4F",
	},
	infoContainer: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
	},
	courseTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 32,
		marginBottom: 8,
	},
	instructor: {
		fontSize: 16,
		color: "#8B4513",
		marginBottom: 16,
	},
	metaContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	metaText: {
		fontSize: 14,
		color: "#8B4513",
	},
	progressSection: {
		marginTop: 20,
		padding: 16,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	progressLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	progressPercentage: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2E8B57",
	},
	progressBar: {
		height: 8,
		backgroundColor: "#E5E5E5",
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 4,
	},
	tabsContainer: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderBottomColor: "#E5E5E5",
		backgroundColor: "#FFFFFF",
	},
	tab: {
		flex: 1,
		paddingVertical: 16,
		alignItems: "center",
	},
	activeTab: {
		borderBottomWidth: 3,
		borderBottomColor: "#2E8B57",
	},
	tabText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#8B4513",
	},
	activeTabText: {
		color: "#2E8B57",
		fontWeight: "600",
	},
	tabContent: {
		padding: 20,
		paddingBottom: 100,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginTop: 16,
		marginBottom: 12,
	},
	description: {
		fontSize: 15,
		color: "#2F4F4F",
		lineHeight: 24,
	},
	listItem: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 12,
		alignItems: "flex-start",
	},
	listItemText: {
		flex: 1,
		fontSize: 15,
		color: "#2F4F4F",
		lineHeight: 22,
	},
	bullet: {
		fontSize: 18,
		color: "#2E8B57",
		fontWeight: "bold",
	},
	module: {
		marginBottom: 24,
	},
	moduleName: {
		fontSize: 17,
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
	lessonLeft: {
		flexDirection: "row",
		gap: 12,
		flex: 1,
		alignItems: "center",
	},
	lessonInfo: {
		flex: 1,
	},
	lessonTitle: {
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
	lessonMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	lessonDuration: {
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
	completedText: {
		fontSize: 12,
		color: "#32CD32",
		fontWeight: "600",
	},
	instructorCard: {
		flexDirection: "row",
		gap: 16,
		backgroundColor: "#FFFFFF",
		padding: 16,
		borderRadius: 12,
	},
	instructorAvatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#E5E5E5",
	},
	instructorInfo: {
		flex: 1,
	},
	instructorName: {
		fontSize: 17,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 6,
	},
	instructorBio: {
		fontSize: 14,
		color: "#8B4513",
		lineHeight: 20,
	},
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	ctaButton: {
		flexDirection: "row",
		backgroundColor: "#2E8B57",
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		elevation: 2,
	},
	ctaButtonText: {
		color: "#FDF5E6",
		fontSize: 16,
		fontWeight: "600",
	},
});
