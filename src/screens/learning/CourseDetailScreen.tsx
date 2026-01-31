import { useState } from "react";
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
import { useLanguage } from "@/src/hooks/useLanguage";
import {
	colors,
	spacing,
	typography,
} from "@/design-system";
import {
	Clock,
	BookOpen,
	BarChart3,
	CheckCircle2,
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
	const { t } = useLanguage();
	const router = useRouter();
	const params = useLocalSearchParams();
	const courseId = params.id as string;

	const [activeTab, setActiveTab] = useState<TabType>("overview");
	const [showEnrollModal, setShowEnrollModal] = useState(false);
	const [expandedModules, setExpandedModules] = useState<Set<string>>(
		new Set(),
	);
	const [enrolling, setEnrolling] = useState(false);

	const getCourseById = useLearningStore((state) => state.getCourseById);
	const getLessonsByModule = useLearningStore(
		(state) => state.getLessonsByModule,
	);
	const isEnrolled = useLearningStore((state) => state.isEnrolled);
	const enrollInCourse = useLearningStore((state) => state.enrollInCourse);
	const getCourseProgress = useLearningStore(
		(state) => state.getCourseProgress,
	);

	const course = getCourseById(courseId);
	const modules = getLessonsByModule(courseId);
	const enrolled = isEnrolled(courseId);
	const progress = enrolled ? getCourseProgress(courseId) : 0;

	if (!course) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>
					{t("learning.errors.courseNotFound")}
				</Text>
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
			Alert.alert(t("common.success"), t("learning.success.enrolled"));
			setTimeout(() => setActiveTab("curriculum"), 300);
		} catch {
			Alert.alert(t("common.error"), t("learning.errors.enrollFailed"));
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
		if (modules.length > 0 && modules[0].lessons.length > 0) {
			router.push(`/video/${courseId}/${modules[0].lessons[0].id}`);
		}
	};

	const handleLessonPress = (lessonId: string, isLocked: boolean) => {
		if (isLocked) {
			Alert.alert(t("learning.locked"), t("learning.errors.lessonLocked"));
			return;
		}
		router.push(`/video/${courseId}/${lessonId}`);
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
					<Text style={styles.instructor}>
						{t("learning.by")} {course.instructor.name}
					</Text>

					{/* Rating and Enrollment Stats */}
					<View style={styles.statsRow}>
						{course.rating && (
							<View style={styles.statItem}>
								<Star size={18} color={colors.feedback.warning} fill={colors.feedback.warning} />
								<Text style={styles.statText}>
									{course.rating} (
									{t("learning.ratings", {
										count: course.enrollmentCount || 0,
									})}
									)
								</Text>
							</View>
						)}
						{course.enrollmentCount && (
							<View style={styles.statItem}>
								<Users size={18} color={colors.primary.main} />
								<Text style={styles.statText}>
									{t("learning.students", { count: course.enrollmentCount })}
								</Text>
							</View>
						)}
					</View>

					<View style={styles.metaContainer}>
						<View style={styles.metaItem}>
							<BookOpen size={spacing.iconSize.xs} color={colors.text.secondary} />
							<Text style={styles.metaText}>
								{t("learning.lessons", { count: course.lessonCount })}
							</Text>
						</View>
						<View style={styles.metaItem}>
							<Clock size={spacing.iconSize.xs} color={colors.text.secondary} />
							<Text style={styles.metaText}>{course.duration}</Text>
						</View>
						<View style={styles.metaItem}>
							<BarChart3 size={spacing.iconSize.xs} color={colors.text.secondary} />
							<Text style={styles.metaText}>
								{t(`learning.${course.level}`)}
							</Text>
						</View>
					</View>

					{enrolled && (
						<View style={styles.progressSection}>
							<View style={styles.progressHeader}>
								<Text style={styles.progressLabel}>
									{t("learning.yourProgress")}
								</Text>
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
							{t("learning.overview")}
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
							{t("learning.curriculum")}
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
							{t("learning.about")}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Tab Content */}
				<View style={styles.tabContent}>
					{activeTab === "overview" && (
						<View>
							<Text style={styles.sectionTitle}>
								{t("learning.description")}
							</Text>
							<Text style={styles.description}>{course.description}</Text>

							<Text style={styles.sectionTitle}>
								{t("learning.whatYouLearn")}
							</Text>
							{course.learningOutcomes.map((outcome) => (
								<View key={outcome} style={styles.listItem}>
									<CheckCircle2 size={18} color={colors.feedback.success} />
									<Text style={styles.listItemText}>{outcome}</Text>
								</View>
							))}

							{course.tags && course.tags.length > 0 && (
								<>
									<Text style={styles.sectionTitle}>
										{t("learning.topicsCovered")}
									</Text>
									<View style={styles.tagsContainer}>
										{course.tags.map((tag) => (
											<View key={tag} style={styles.tag}>
												<Text style={styles.tagText}>{tag}</Text>
											</View>
										))}
									</View>
								</>
							)}

							{course.requirements && course.requirements.length > 0 && (
								<>
									<Text style={styles.sectionTitle}>
										{t("learning.prerequisites")}
									</Text>
									{course.requirements.map((prereq) => (
										<View key={prereq} style={styles.listItem}>
											<Award size={18} color={colors.secondary.main} />
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
								const totalLessons = module.lessons.length;

								return (
									<View key={module.id} style={styles.module}>
										<TouchableOpacity
											style={styles.moduleHeader}
											onPress={() => toggleModule(module.id)}
										>
											<View style={styles.moduleHeaderLeft}>
												<Text style={styles.moduleName}>
													{t("learning.module", { number: moduleIndex + 1 })}:{" "}
													{module.name}
												</Text>
												<Text style={styles.moduleProgress}>
													{t("learning.lessons", { count: totalLessons })}
												</Text>
											</View>
											{isExpanded ? (
												<ChevronUp size={spacing.iconSize.sm} color={colors.primary.main} />
											) : (
												<ChevronDown size={spacing.iconSize.sm} color={colors.primary.main} />
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
															onPress={() =>
																handleLessonPress(lesson.id, isLocked)
															}
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
							<Text style={styles.sectionTitle}>
								{t("learning.instructor")}
							</Text>
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
									<Text style={styles.sectionTitle}>
										{t("learning.requirements")}
									</Text>
									{course.requirements.map((req) => (
										<View key={req} style={styles.listItem}>
											<Text style={styles.bullet}>•</Text>
											<Text style={styles.listItemText}>{req}</Text>
										</View>
									))}
								</>
							)}

							<Text style={styles.sectionTitle}>{t("learning.languages")}</Text>
							<Text style={styles.description}>
								{t("learning.availableIn", {
									languages: course.language.join(", ").toUpperCase(),
								})}
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
							<X size={spacing.iconSize.md} color={colors.text.primary} />
						</TouchableOpacity>

						<View style={styles.modalHeader}>
							<View style={styles.modalIconContainer}>
								<BookOpen size={40} color={colors.primary.main} />
							</View>
							<Text style={styles.modalTitle}>
								{t("learning.enrollmentModal.title")}
							</Text>
						</View>

						<Image
							source={{ uri: course.thumbnail }}
							style={styles.modalThumbnail}
							resizeMode="cover"
						/>

						<Text style={styles.modalCourseTitle}>{course.title}</Text>
						<Text style={styles.modalInstructor}>
							{t("learning.by")} {course.instructor.name}
						</Text>

						<View style={styles.modalInfo}>
							<View style={styles.modalInfoItem}>
								<BookOpen size={spacing.iconSize.xs} color={colors.text.secondary} />
								<Text style={styles.modalInfoText}>
									{t("learning.lessons", { count: course.lessonCount })}
								</Text>
							</View>
							<View style={styles.modalInfoItem}>
								<Clock size={spacing.iconSize.xs} color={colors.text.secondary} />
								<Text style={styles.modalInfoText}>{course.duration}</Text>
							</View>
							<View style={styles.modalInfoItem}>
								<BarChart3 size={spacing.iconSize.xs} color={colors.text.secondary} />
								<Text style={styles.modalInfoText}>
									{t(`learning.${course.level}`)}
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
										{t("learning.enrollmentModal.paymentComingSoon")}
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
										{enrolling
											? t("learning.enrolling")
											: t("learning.enrollmentModal.enrollNow")}
									</Text>
								</TouchableOpacity>
							</>
						) : (
							<>
								<View style={styles.modalFreeTag}>
									<Text style={styles.modalFreeText}>
										{t("learning.enrollmentModal.freeCourse")}
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
										{enrolling
											? t("learning.enrolling")
											: t("learning.enrollmentModal.enrollForFree")}
									</Text>
								</TouchableOpacity>
							</>
						)}

						<Text style={styles.modalNote}>
							{t("learning.enrollmentModal.lifetimeAccess")}
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
		backgroundColor: colors.background.tertiary,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.tertiary,
	},
	errorText: {
		fontSize: typography.fontSize.lg,
		color: colors.feedback.error,
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
		padding: spacing.md,
	},
	badges: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	levelBadge: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs + 2,
		borderRadius: spacing.radius.sm,
		backgroundColor: "rgba(255, 255, 255, 0.9)",
	},
	priceBadge: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs + 2,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.feedback.warning,
	},
	badgeText: {
		fontSize: typography.fontSize.xs,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
	},
	infoContainer: {
		padding: spacing.lg - 4,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.light,
	},
	courseTitle: {
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		lineHeight: 32,
		marginBottom: spacing.sm,
	},
	instructor: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
		marginBottom: spacing.md,
	},
	metaContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs + 2,
	},
	metaText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
	statsRow: {
		flexDirection: "row",
		gap: spacing.lg - 4,
		marginVertical: spacing.md - 4,
	},
	statItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs + 2,
	},
	statText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.primary,
		fontWeight: typography.fontWeight.medium,
	},
	progressSection: {
		marginTop: spacing.lg - 4,
		padding: spacing.md,
		backgroundColor: colors.background.secondary,
		borderRadius: spacing.radius.md,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: spacing.sm,
	},
	progressLabel: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	progressPercentage: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.primary.main,
	},
	tagsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
	},
	tag: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs + 2,
		backgroundColor: colors.primary.surface,
		borderRadius: spacing.radius.lg,
		borderWidth: 1,
		borderColor: `${colors.primary.main}40`,
	},
	tagText: {
		fontSize: typography.fontSize.xs + 1,
		color: colors.primary.main,
		fontWeight: typography.fontWeight.medium,
	},
	tabsContainer: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderBottomColor: colors.border.light,
		backgroundColor: colors.background.secondary,
	},
	tab: {
		flex: 1,
		paddingVertical: spacing.md,
		alignItems: "center",
	},
	activeTab: {
		borderBottomWidth: 3,
		borderBottomColor: colors.primary.main,
	},
	tabText: {
		fontSize: typography.fontSize.sm + 1,
		fontWeight: typography.fontWeight.medium,
		color: colors.text.secondary,
	},
	activeTabText: {
		color: colors.primary.main,
		fontWeight: typography.fontWeight.semibold,
	},
	tabContent: {
		padding: spacing.lg - 4,
		paddingBottom: 100,
	},
	sectionTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginTop: spacing.md,
		marginBottom: spacing.md - 4,
	},
	description: {
		fontSize: typography.fontSize.sm + 1,
		color: colors.text.primary,
		lineHeight: 24,
	},
	listItem: {
		flexDirection: "row",
		gap: spacing.md - 4,
		marginBottom: spacing.md - 4,
		alignItems: "flex-start",
	},
	listItemText: {
		flex: 1,
		fontSize: typography.fontSize.sm + 1,
		color: colors.text.primary,
		lineHeight: 22,
	},
	bullet: {
		fontSize: typography.fontSize.lg,
		color: colors.primary.main,
		fontWeight: typography.fontWeight.bold,
	},
	module: {
		marginBottom: spacing.md,
		backgroundColor: colors.background.secondary,
		borderRadius: spacing.radius.md,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: colors.border.light,
	},
	moduleHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: spacing.md,
		backgroundColor: colors.neutral[100],
	},
	moduleHeaderLeft: {
		flex: 1,
	},
	moduleName: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	moduleProgress: {
		fontSize: typography.fontSize.xs + 1,
		color: colors.text.secondary,
	},
	moduleLessons: {
		padding: spacing.sm,
	},
	instructorCard: {
		flexDirection: "row",
		gap: spacing.md,
		backgroundColor: colors.background.secondary,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
	},
	instructorAvatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: colors.border.light,
	},
	instructorInfo: {
		flex: 1,
	},
	instructorName: {
		fontSize: typography.fontSize.base + 1,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs + 2,
	},
	instructorBio: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		lineHeight: 20,
	},
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: colors.background.secondary,
		paddingHorizontal: spacing.lg - 4,
		paddingVertical: spacing.md,
		borderTopWidth: 1,
		borderTopColor: colors.border.light,
		...spacing.shadow.lg,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: colors.background.overlay,
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: colors.background.tertiary,
		borderTopLeftRadius: spacing.radius.xl,
		borderTopRightRadius: spacing.radius.xl,
		padding: spacing.lg,
		maxHeight: "90%",
	},
	modalClose: {
		position: "absolute",
		top: spacing.md,
		right: spacing.md,
		zIndex: 10,
		padding: spacing.sm,
	},
	modalHeader: {
		alignItems: "center",
		marginBottom: spacing.lg - 4,
	},
	modalIconContainer: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: colors.primary.surface,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.md - 4,
	},
	modalTitle: {
		fontSize: typography.fontSize.xl + 2,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
	},
	modalThumbnail: {
		width: "100%",
		height: 160,
		borderRadius: spacing.radius.md,
		marginBottom: spacing.md,
	},
	modalCourseTitle: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	modalInstructor: {
		fontSize: typography.fontSize.sm + 1,
		color: colors.text.secondary,
		textAlign: "center",
		marginBottom: spacing.md,
	},
	modalInfo: {
		flexDirection: "row",
		justifyContent: "center",
		gap: spacing.lg - 4,
		marginBottom: spacing.lg,
	},
	modalInfoItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs + 2,
	},
	modalInfoText: {
		fontSize: typography.fontSize.xs + 1,
		color: colors.text.secondary,
	},
	modalPriceContainer: {
		alignItems: "center",
		marginBottom: spacing.lg - 4,
	},
	modalPrice: {
		fontSize: typography.fontSize["4xl"] - 4,
		fontWeight: typography.fontWeight.bold,
		color: colors.primary.main,
		marginBottom: spacing.xs,
	},
	modalPriceNote: {
		fontSize: typography.fontSize.xs + 1,
		color: colors.secondary.main,
		fontStyle: "italic",
	},
	modalFreeTag: {
		alignSelf: "center",
		paddingHorizontal: spacing.lg - 4,
		paddingVertical: spacing.sm + 2,
		backgroundColor: colors.feedback.successLight,
		borderRadius: spacing.radius.xl - 4,
		marginBottom: spacing.lg - 4,
	},
	modalFreeText: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.feedback.success,
	},
	modalButton: {
		backgroundColor: colors.primary.main,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		alignItems: "center",
		marginBottom: spacing.md - 4,
		...spacing.shadow.sm,
	},
	modalButtonDisabled: {
		backgroundColor: colors.neutral[400],
		opacity: 0.6,
	},
	modalButtonText: {
		color: colors.text.inverse,
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
	},
	modalNote: {
		fontSize: typography.fontSize.xs + 1,
		color: colors.text.secondary,
		textAlign: "center",
		fontStyle: "italic",
	},
});
