import { useMemo } from "react";
import { useRouter } from "expo-router";
import { colors, Header, ScreenLayout } from "@/design-system";
import {
	ActivityList,
	AchievementBanner,
	CurrentCourseCard,
	NextLessonCard,
	QuickActionsGrid,
	type Activity,
	type QuickAction,
} from "@/src/components/home";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useLearningStore } from "@/src/store/learningStore";

export default function HomeScreen() {
	const { t } = useLanguage();
	const router = useRouter();

	const enrollments = useLearningStore((s) => s.enrollments);
	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const lessonProgress = useLearningStore((s) => s.lessonProgress);
	const getEnrolledCourses = useLearningStore((s) => s.getEnrolledCourses);
	const getCourseProgress = useLearningStore((s) => s.getCourseProgress);
	const getNextLesson = useLearningStore((s) => s.getNextLesson);
	const getLessonsByCourse = useLearningStore((s) => s.getLessonsByCourse);

	// Get enrolled courses sorted by last accessed
	const enrolledCourses = getEnrolledCourses();

	// Find the most recently accessed course for "Continue Learning"
	const continueCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

	const continueLesson = useMemo(() => {
		if (!continueCourse) return null;
		const courseLessons = getLessonsByCourse(continueCourse.id);
		return courseLessons.find((l) => !l.isCompleted) ?? null;
	}, [continueCourse, getLessonsByCourse]);

	const nextLessonForCard = useMemo(() => {
		if (!continueLesson) return null;
		const next = getNextLesson(continueLesson.id);
		if (!next) return null;
		return {
			title: next.title,
			duration: next.duration,
			isDownloaded: false,
		};
	}, [continueLesson, getNextLesson]);

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

	// Build recent activities from real lesson progress
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
			if (p.isCompleted) {
				return {
					title: `Completed: ${title}`,
					type: "completed" as const,
					time: formatRelativeTime(p.updatedAt),
				};
			}
			return {
				title: `In progress: ${title}`,
				type: "started" as const,
				time: formatRelativeTime(p.updatedAt),
			};
		});

	const completedCount = enrollments.filter(
		(e) => e.status === "completed",
	).length;

	const handleContinueLearning = () => {
		if (continueCourse && continueLesson) {
			router.push(
				`/video/${continueCourse.id}/${continueLesson.id}`,
			);
		} else if (continueCourse) {
			router.push(`/learning/courses/${continueCourse.id}`);
		} else {
			router.push("/(tabs)/courses");
		}
	};

	const handleNextLessonPress = () => {
		if (continueCourse && continueLesson) {
			const next = getNextLesson(continueLesson.id);
			if (next) {
				router.push(`/video/${continueCourse.id}/${next.id}`);
			}
		}
	};

	return (
		<ScreenLayout headerExtendsToStatusBar>
			<Header
				title={t("navigation.home")}
				subtitle={t("home.welcomeMessage")}
			/>

			{continueCourse ? (
				<CurrentCourseCard
					course={{
						title: continueCourse.title,
						category:
							continueCourse.categoryId
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

			{nextLessonForCard && (
				<NextLessonCard
					lesson={nextLessonForCard}
					onPress={handleNextLessonPress}
				/>
			)}

			<QuickActionsGrid
				actions={quickActions}
				onActionPress={(actionId) => {
					router.push("/(tabs)/courses");
				}}
			/>

			{recentActivities.length > 0 && (
				<ActivityList activities={recentActivities} />
			)}

			{completedCount > 0 && (
				<AchievementBanner
					title={`🎉 ${t("home.congratulations")}`}
					subtitle={`You've completed ${completedCount} course${completedCount > 1 ? "s" : ""}`}
				/>
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
