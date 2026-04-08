import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Award, BookOpen, Clock, TrendingUp } from "lucide-react-native";
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";
import {
	colors,
	commonStyles,
	Header,
	ModernCourseCard,
	ScreenLayout,
	spacing,
	typography,
} from "@/design-system";
import {
	CurrentCourseCard,
	QuickActionsGrid,
	ActivityList,
	type Activity,
	type QuickAction,
} from "@/src/components/home";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useLearningStore, getLearningStats } from "@/src/store/learningStore";
import { useOnboardingStore } from "@/src/store/onboardingStore";

const WalkthroughableView = walkthroughable(View);

export default function HomeScreen() {
	const { t } = useLanguage();
	const router = useRouter();
	const { start: startCopilot } = useCopilot();
	const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
	const tourComplete = useOnboardingStore((s) => s.tourComplete);
	const completeTour = useOnboardingStore((s) => s.completeTour);

	// Auto-trigger tour when onboarding is done but tour hasn't run
	useEffect(() => {
		if (onboardingComplete && !tourComplete) {
			const timer = setTimeout(() => {
				startCopilot();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [onboardingComplete, tourComplete, startCopilot]);

	const enrollments = useLearningStore((s) => s.enrollments);
	const lessons = useLearningStore((s) => s.lessons);
	const lessonProgress = useLearningStore((s) => s.lessonProgress);
	const getEnrolledCourses = useLearningStore((s) => s.getEnrolledCourses);
	const getLessonsByCourse = useLearningStore((s) => s.getLessonsByCourse);
	const getLessonById = useLearningStore((s) => s.getLessonById);
	const getCourseById = useLearningStore((s) => s.getCourseById);

	const enrolledCourses = getEnrolledCourses();
	const continueCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;
	const stats = getLearningStats();

	const watchHours = Math.floor(stats.totalWatchTime / 3600);
	const watchMinutes = Math.floor((stats.totalWatchTime % 3600) / 60);

	const continueLesson = useMemo(() => {
		if (!continueCourse) return null;
		const courseLessons = getLessonsByCourse(continueCourse.id);
		return courseLessons.find((l) => !l.isCompleted) ?? null;
	}, [continueCourse, getLessonsByCourse]);

	// Continue watching lessons (recent incomplete)
	const continueWatchingLessons = useMemo(() => {
		return [...lessonProgress]
			.filter((p) => !p.isCompleted && p.lastPosition > 0)
			.sort(
				(a, b) =>
					new Date(b.updatedAt || 0).getTime() -
					new Date(a.updatedAt || 0).getTime(),
			)
			.slice(0, 5)
			.map((progress) => {
				const lesson = getLessonById(progress.lessonId);
				const course = getCourseById(progress.courseId);
				if (!lesson || !course) return null;
				return {
					lesson,
					course,
					progress: Math.round(
						(progress.watchedSeconds / progress.totalSeconds) * 100,
					),
				};
			})
			.filter((l) => l !== null);
	}, [lessonProgress, getLessonById, getCourseById]);

	const quickActions: QuickAction[] = [
		{
			id: "agriculture",
			label: t("courses.agriculture"),
			emoji: "🌾",
			color: colors.categories.agriculture,
		},
		{
			id: "energy",
			label: t("courses.greenEnergy"),
			emoji: "🔆",
			color: colors.categories.greenEnergy,
		},
		{
			id: "construction",
			label: t("courses.construction"),
			emoji: "🔨",
			color: colors.categories.construction,
		},
		{
			id: "business",
			label: t("courses.business"),
			emoji: "💼",
			color: colors.categories.business,
		},
	];

	const recentActivities: Activity[] = lessonProgress
		.filter((p) => p.updatedAt)
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		)
		.slice(0, 3)
		.map((p) => {
			const lesson = lessons.find((l) => l.id === p.lessonId);
			const title = lesson?.title ?? "Unknown lesson";
			return {
				title: p.isCompleted ? `Completed: ${title}` : `In progress: ${title}`,
				type: p.isCompleted ? ("completed" as const) : ("started" as const),
				time: formatRelativeTime(p.updatedAt),
			};
		});

	const handleContinueLearning = () => {
		if (continueCourse && continueLesson) {
			router.push(`/video/${continueCourse.id}/${continueLesson.id}`);
		} else if (continueCourse) {
			router.push(`/learning/courses/${continueCourse.id}`);
		} else {
			router.push("/(tabs)/courses");
		}
	};

	const statsData = [
		{
			icon: <BookOpen size={16} color={colors.primary.main} />,
			value: stats.totalEnrolled,
			label: "Enrolled",
		},
		{
			icon: <TrendingUp size={16} color={colors.accent.main} />,
			value: stats.inProgress,
			label: "In Progress",
		},
		{
			icon: <Award size={16} color={colors.feedback.success} />,
			value: stats.completed,
			label: "Completed",
		},
		{
			icon: <Clock size={16} color={colors.feedback.info} />,
			value: `${watchHours}h ${watchMinutes}m`,
			label: "Watch Time",
		},
	];

	return (
		<ScreenLayout>
			<CopilotStep text={t("tour.home.welcome")} order={1} name="home-welcome">
				<WalkthroughableView>
					<Header
						variant="minimal"
						title="Hi, Learner"
						subtitle={t("home.welcomeMessage")}
					/>
				</WalkthroughableView>
			</CopilotStep>

			{/* Stats Row */}
			{enrollments.length > 0 && (
				<View style={styles.statsRow}>
					{statsData.map((stat) => (
						<View key={stat.label} style={styles.statChip}>
							{stat.icon}
							<Text style={styles.statValue}>{stat.value}</Text>
							<Text style={styles.statLabel}>{stat.label}</Text>
						</View>
					))}
				</View>
			)}

			{/* Continue Learning */}
			<CopilotStep
				text={t("tour.home.continueLearning")}
				order={2}
				name="home-continue"
			>
				<WalkthroughableView>
					{continueCourse ? (
						<CurrentCourseCard
							course={{
								title: continueCourse.title,
								category: continueCourse.categoryId
									.replace("category_", "")
									.replace(/_/g, " "),
								progress: continueCourse.progress ?? 0,
								imageUrl: continueCourse.thumbnail,
							}}
							onContinue={handleContinueLearning}
						/>
					) : (
						<CurrentCourseCard
							course={{
								title: "Start Your Learning Journey",
								category: "Browse courses to get started",
								progress: 0,
								imageUrl:
									"https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
							}}
							onContinue={() => router.push("/(tabs)/courses")}
						/>
					)}
				</WalkthroughableView>
			</CopilotStep>

			{/* Continue Watching */}
			{continueWatchingLessons.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Continue Watching</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.continueRow}
					>
						{continueWatchingLessons.map((item) => (
							<View key={item.lesson.id} style={styles.continueCard}>
								<ModernCourseCard
									title={item.lesson.title}
									instructor={item.course.title}
									progress={item.progress}
									thumbnailUrl={item.course.thumbnail}
									onPress={() =>
										router.push(`/video/${item.course.id}/${item.lesson.id}`)
									}
									style={{ width: 260, marginBottom: 0 }}
								/>
							</View>
						))}
					</ScrollView>
				</View>
			)}

			{/* Quick Actions */}
			<CopilotStep
				text={t("tour.home.categories")}
				order={3}
				name="home-categories"
			>
				<WalkthroughableView>
					<QuickActionsGrid
						actions={quickActions}
						onActionPress={() => router.push("/(tabs)/courses")}
					/>
				</WalkthroughableView>
			</CopilotStep>

			<CopilotStep
				text={t("tour.home.browseMore")}
				order={4}
				name="home-browse"
			>
				<WalkthroughableView>
					<View style={styles.tourBrowseHint}>
						<Text style={styles.tourBrowseText}>
							{t("tour.home.tapCoursesTab")}
						</Text>
					</View>
				</WalkthroughableView>
			</CopilotStep>

			<CopilotStep text={t("tour.home.profile")} order={5} name="home-profile">
				<WalkthroughableView>
					<View style={styles.tourProfileHint}>
						<Text style={styles.tourProfileText}>
							{t("tour.home.settingsHint")}
						</Text>
					</View>
				</WalkthroughableView>
			</CopilotStep>

			{/* Recent Activity */}
			{recentActivities.length > 0 && (
				<ActivityList activities={recentActivities} />
			)}
		</ScreenLayout>
	);
}

function formatRelativeTime(isoDate: string): string {
	const diff = Date.now() - new Date(isoDate).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

const styles = StyleSheet.create({
	statsRow: {
		flexDirection: "row",
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.md,
		gap: spacing.sm,
	},
	statChip: {
		flex: 1,
		backgroundColor: colors.neutral.white,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xs,
		borderRadius: spacing.radius.sm,
		alignItems: "center",
		...spacing.shadow.sm,
	},
	statValue: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginTop: 2,
	},
	statLabel: {
		fontSize: 10,
		color: colors.text.secondary,
		textAlign: "center",
		fontWeight: typography.fontWeight.medium,
	},
	section: {
		marginBottom: spacing.lg,
	},
	sectionTitle: {
		...commonStyles.sectionTitle,
		paddingHorizontal: spacing.lg,
	},
	continueRow: {
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
	},
	continueCard: {
		width: 260,
	},
	tourBrowseHint: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
	},
	tourBrowseText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.tertiary,
		textAlign: "center",
	},
	tourProfileHint: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
	},
	tourProfileText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.tertiary,
		textAlign: "center",
	},
});
