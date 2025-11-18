import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	Modal,
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
	ChevronDown,
	ChevronUp,
	Users,
	Star,
	X,
	Award,
} from "lucide-react-native";
import {
	EnrollButton,
	LessonListItem,
	ProgressBar,
} from "@/src/components/learning";

type TabType = "overview" | "curriculum" | "about";

export function CourseDetailScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const courseId = params.id as string;

	const [activeTab, setActiveTab] = useState<TabType>("overview");
	const [showEnrollModal, setShowEnrollModal] = useState(false);
	const [expandedModules, setExpandedModules] = useState<Set<string>>(
		new Set()
	);
	const [enrolling, setEnrolling] = useState(false);

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

	const handleEnrollClick = () => {
		setShowEnrollModal(true);
	};

	const handleConfirmEnroll = async () => {
		setEnrolling(true);
		try {
			await enrollInCourse(courseId);
			setShowEnrollModal(false);
			Alert.alert("Success!", "You've been enrolled in this course!");
			// Auto-switch to curriculum tab after enrollment
			setTimeout(() => setActiveTab("curriculum"), 300);
		} catch (error) {
			Alert.alert("Error", "Failed to enroll. Please try again.");
		} finally {
			setEnrolling(false);
		}
	};

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(moduleId)) {
				newSet.delete(moduleId);
			} else {
				newSet.add(moduleId);
			}
			return newSet;
		});
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

					{/* Rating and Enrollment Stats */}
					<View style={styles.statsRow}>
						{course.rating && (
							<View style={styles.statItem}>
								<Star size={18} color="#DAA520" fill="#DAA520" />
								<Text style={styles.statText}>
									{course.rating} ({course.enrollmentCount || 0} ratings)
								</Text>
							</View>
						)}
						{course.enrollmentCount && (
							<View style={styles.statItem}>
								<Users size={18} color="#2E8B57" />
								<Text style={styles.statText}>
									{course.enrollmentCount.toLocaleString()} students
								</Text>
							</View>
						)}
					</View>

					<View style={styles.metaContainer}>
						<View style={styles.metaItem}>
							<BookOpen size={16} color="#8B4513" />
							<Text style={styles.metaText}>{course.lessonCount} lessons</Text>
						</View>
						<View style={styles.metaItem}>
							<Clock size={16} color="#8B4513" />
							<Text style={styles.metaText}>{course.duration}</Text>
						</View>
						<View style={styles.metaItem}>
							<BarChart3 size={16} color="#8B4513" />
							<Text style={styles.metaText}>
								{course.level.charAt(0).toUpperCase() + course.level.slice(1)}
							</Text>
						</View>
					</View>

					{enrolled && (
						<View style={styles.progressSection}>
							<View style={styles.progressHeader}>
								<Text style={styles.progressLabel}>Your Progress</Text>
								<Text style={styles.progressPercentage}>{progress}%</Text>
							</View>
							<ProgressBar progress={progress} height={10} showLabel={false} />
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

							{course.tags && course.tags.length > 0 && (
								<>
									<Text style={styles.sectionTitle}>Topics Covered</Text>
									<View style={styles.tagsContainer}>
										{course.tags.map((tag, index) => (
											<View key={index} style={styles.tag}>
												<Text style={styles.tagText}>{tag}</Text>
											</View>
										))}
									</View>
								</>
							)}

							{course.prerequisites && course.prerequisites.length > 0 && (
								<>
									<Text style={styles.sectionTitle}>Prerequisites</Text>
									{course.prerequisites.map((prereq, index) => (
										<View key={index} style={styles.listItem}>
											<Award size={18} color="#FF8C42" />
											<Text style={styles.listItemText}>{prereq}</Text>
										</View>
									))}
								</>
							)}
						</View>
					)}

					{activeTab === "curriculum" && (
						<View>
							{modules.map((module, moduleIndex) => {
								const isExpanded = expandedModules.has(module.id);
								const completedLessons = module.lessons.filter(
									(l) => l.isCompleted
								).length;
								const totalLessons = module.lessons.length;

								return (
									<View key={module.id} style={styles.module}>
										<TouchableOpacity
											style={styles.moduleHeader}
											onPress={() => toggleModule(module.id)}
										>
											<View style={styles.moduleHeaderLeft}>
												<Text style={styles.moduleName}>
													Module {moduleIndex + 1}: {module.name}
												</Text>
												<Text style={styles.moduleProgress}>
													{completedLessons}/{totalLessons} lessons
												</Text>
											</View>
											{isExpanded ? (
												<ChevronUp size={20} color="#2E8B57" />
											) : (
												<ChevronDown size={20} color="#2E8B57" />
											)}
										</TouchableOpacity>

										{isExpanded && (
											<View style={styles.moduleLessons}>
												{module.lessons.map((lesson) => {
													const isLocked = !enrolled && !lesson.isPreview;
													return (
														<LessonListItem
															key={lesson.id}
															lesson={lesson}
															onPress={() => handleLessonPress(lesson.id, isLocked)}
															isLocked={isLocked}
															disabled={isLocked}
														/>
													);
												})}
											</View>
										)}
									</View>
								);
							})}
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
				<EnrollButton
					state={
						!enrolled
							? "enroll"
							: progress === 0
								? "start"
								: progress === 100
									? "completed"
									: "continue"
					}
					onPress={enrolled ? handleStartLearning : handleEnrollClick}
					progress={progress}
					fullWidth
					loading={enrolling}
				/>
			</View>

			{/* Enrollment Modal */}
			<Modal
				visible={showEnrollModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowEnrollModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<TouchableOpacity
							style={styles.modalClose}
							onPress={() => setShowEnrollModal(false)}
						>
							<X size={24} color="#2F4F4F" />
						</TouchableOpacity>

						<View style={styles.modalHeader}>
							<View style={styles.modalIconContainer}>
								<BookOpen size={40} color="#2E8B57" />
							</View>
							<Text style={styles.modalTitle}>Enroll in Course</Text>
						</View>

						<Image
							source={{ uri: course.thumbnail }}
							style={styles.modalThumbnail}
							resizeMode="cover"
						/>

						<Text style={styles.modalCourseTitle}>{course.title}</Text>
						<Text style={styles.modalInstructor}>
							by {course.instructor.name}
						</Text>

						<View style={styles.modalInfo}>
							<View style={styles.modalInfoItem}>
								<BookOpen size={16} color="#8B4513" />
								<Text style={styles.modalInfoText}>
									{course.lessonCount} lessons
								</Text>
							</View>
							<View style={styles.modalInfoItem}>
								<Clock size={16} color="#8B4513" />
								<Text style={styles.modalInfoText}>{course.duration}</Text>
							</View>
							<View style={styles.modalInfoItem}>
								<BarChart3 size={16} color="#8B4513" />
								<Text style={styles.modalInfoText}>
									{course.level.charAt(0).toUpperCase() + course.level.slice(1)}
								</Text>
							</View>
						</View>

						{course.isPaid ? (
							<>
								<View style={styles.modalPriceContainer}>
									<Text style={styles.modalPrice}>
										{course.currency} {course.price}
									</Text>
									<Text style={styles.modalPriceNote}>
										Payment coming soon - Free for now
									</Text>
								</View>
								<TouchableOpacity
									style={[
										styles.modalButton,
										enrolling && styles.modalButtonDisabled,
									]}
									onPress={handleConfirmEnroll}
									disabled={enrolling}
								>
									<Text style={styles.modalButtonText}>
										{enrolling ? "Enrolling..." : "Enroll Now"}
									</Text>
								</TouchableOpacity>
							</>
						) : (
							<>
								<View style={styles.modalFreeTag}>
									<Text style={styles.modalFreeText}>FREE COURSE</Text>
								</View>
								<TouchableOpacity
									style={[
										styles.modalButton,
										enrolling && styles.modalButtonDisabled,
									]}
									onPress={handleConfirmEnroll}
									disabled={enrolling}
								>
									<Text style={styles.modalButtonText}>
										{enrolling ? "Enrolling..." : "Enroll for Free"}
									</Text>
								</TouchableOpacity>
							</>
						)}

						<Text style={styles.modalNote}>
							Get lifetime access to all course content and updates
						</Text>
					</View>
				</View>
			</Modal>
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
	statsRow: {
		flexDirection: "row",
		gap: 20,
		marginVertical: 12,
	},
	statItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	statText: {
		fontSize: 14,
		color: "#2F4F4F",
		fontWeight: "500",
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
	tagsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	tag: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: "#2E8B5720",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#2E8B5740",
	},
	tagText: {
		fontSize: 13,
		color: "#2E8B57",
		fontWeight: "500",
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
		marginBottom: 16,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	moduleHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#F8F8F8",
	},
	moduleHeaderLeft: {
		flex: 1,
	},
	moduleName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	moduleProgress: {
		fontSize: 13,
		color: "#8B4513",
	},
	moduleLessons: {
		padding: 8,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: "#FDF5E6",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		maxHeight: "90%",
	},
	modalClose: {
		position: "absolute",
		top: 16,
		right: 16,
		zIndex: 10,
		padding: 8,
	},
	modalHeader: {
		alignItems: "center",
		marginBottom: 20,
	},
	modalIconContainer: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "#2E8B5720",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	modalThumbnail: {
		width: "100%",
		height: 160,
		borderRadius: 12,
		marginBottom: 16,
	},
	modalCourseTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		textAlign: "center",
		marginBottom: 8,
	},
	modalInstructor: {
		fontSize: 15,
		color: "#8B4513",
		textAlign: "center",
		marginBottom: 16,
	},
	modalInfo: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
		marginBottom: 24,
	},
	modalInfoItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	modalInfoText: {
		fontSize: 13,
		color: "#8B4513",
	},
	modalPriceContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	modalPrice: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#2E8B57",
		marginBottom: 4,
	},
	modalPriceNote: {
		fontSize: 13,
		color: "#FF8C42",
		fontStyle: "italic",
	},
	modalFreeTag: {
		alignSelf: "center",
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#32CD3220",
		borderRadius: 20,
		marginBottom: 20,
	},
	modalFreeText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#32CD32",
	},
	modalButton: {
		backgroundColor: "#2E8B57",
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		marginBottom: 12,
		elevation: 2,
	},
	modalButtonDisabled: {
		backgroundColor: "#8B8B8B",
		opacity: 0.6,
	},
	modalButtonText: {
		color: "#FDF5E6",
		fontSize: 16,
		fontWeight: "600",
	},
	modalNote: {
		fontSize: 13,
		color: "#8B4513",
		textAlign: "center",
		fontStyle: "italic",
	},
});
