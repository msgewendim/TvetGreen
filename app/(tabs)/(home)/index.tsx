import { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Card, Divider, ProgressBar, Text } from "react-native-paper";
import { colors, spacing } from "@/design-system";
import { ROUTES } from "@/src/utils/appRoutes";
import { useLearningStore } from "@/src/store/learningStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import type { MultiLangText } from "@/src/types/learning";

export default function HomeScreen() {
	const router = useRouter();
	const { t, currentLanguage } = useLanguage();

	const localized = (text: string | MultiLangText): string =>
		typeof text === "string" ? text : text[currentLanguage] || text.en;

	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const lessonProgress = useLearningStore((s) => s.lessonProgress);
	const loadData = useLearningStore((s) => s.loadData);

	useEffect(() => {
		if (courses.length === 0) {
			loadData();
		}
	}, [courses.length, loadData]);

	const getCompletedCount = (courseId: string) =>
		lessonProgress.filter((p) => p.courseId === courseId && p.completed).length;

	const continueItem = (() => {
		const recentProgress = [...lessonProgress]
			.filter((p) => !p.completed && p.lastPosition > 0)
			.sort(
				(a, b) =>
					new Date(b.lastWatchedAt).getTime() -
					new Date(a.lastWatchedAt).getTime(),
			)[0];

		if (!recentProgress) return null;

		const lesson = lessons.find((l) => l.id === recentProgress.lessonId);
		const course = courses.find((c) => c.id === recentProgress.courseId);
		if (!lesson || !course) return null;

		const courseLessons = lessons.filter((l) => l.courseId === course.id);
		const completedCount = getCompletedCount(course.id);

		return {
			course,
			lesson,
			completedCount,
			totalLessons: courseLessons.length,
		};
	})();

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Continue Learning */}
			{continueItem && (
				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						{t("learning.continueLearning")}
					</Text>
					<Card
						style={styles.continueCard}
						onPress={() =>
							router.push(
								ROUTES.VIDEO_PLAYER(
									continueItem.course.id,
									continueItem.lesson.id,
								) as never,
							)
						}
					>
						<Card.Content>
							<Text variant="titleSmall" style={styles.continueCourseTitle}>
								{localized(continueItem.course.title)}
							</Text>
							<Text variant="bodySmall" style={styles.continueLessonTitle}>
								{localized(continueItem.lesson.title)}
							</Text>
							<Text variant="labelSmall" style={styles.continueLessonProgress}>
								{t("learning.lessons_progress", {
									completed: continueItem.completedCount,
									total: continueItem.totalLessons,
								})}
							</Text>
						</Card.Content>
					</Card>
				</View>
			)}

			{/* Courses */}
			<View style={styles.section}>
				<Text variant="titleMedium" style={styles.sectionTitle}>
					{t("courses.title")}
				</Text>
				{courses.map((course, index) => {
					const courseLessons = lessons.filter((l) => l.courseId === course.id);
					const completedCount = getCompletedCount(course.id);
					const hasStarted = lessonProgress.some(
						(p) => p.courseId === course.id,
					);
					return (
						<View key={course.id}>
							{index > 0 && <Divider />}
							<Pressable
								onPress={() =>
									router.push(ROUTES.COURSE_DETAIL(course.id) as never)
								}
								style={styles.courseRow}
							>
								<Image
									source={{ uri: course.thumbnail }}
									style={styles.thumbnail}
								/>
								<View style={styles.courseText}>
									<Text variant="titleMedium" style={styles.courseTitle}>
										{localized(course.title)}
									</Text>
									<Text
										variant="bodyMedium"
										style={styles.courseDescription}
										numberOfLines={2}
									>
										{localized(course.description).slice(0, 100)}...
									</Text>
									<Text variant="bodySmall" style={styles.lessonCount}>
										{hasStarted
											? t("learning.lessons_progress", {
													completed: completedCount,
													total: courseLessons.length,
												})
											: t("learning.lessons", { count: courseLessons.length })}
									</Text>
									{hasStarted && (
										<ProgressBar
											progress={completedCount / courseLessons.length}
											color={colors.primary.main}
											style={styles.courseProgressBar}
										/>
									)}
								</View>
							</Pressable>
						</View>
					);
				})}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	content: {
		paddingBottom: spacing.xl,
	},
	section: {
		marginTop: spacing.lg,
		paddingHorizontal: spacing.lg,
	},
	sectionTitle: {
		color: colors.text.primary,
		fontWeight: "600",
		marginBottom: spacing.md,
	},
	continueCard: {
		backgroundColor: colors.background.secondary,
		borderRadius: spacing.radius.md,
		elevation: 0,
	},
	continueCourseTitle: {
		color: colors.text.primary,
		fontWeight: "600",
	},
	continueLessonTitle: {
		color: colors.text.secondary,
		marginTop: spacing.xs,
	},
	continueLessonProgress: {
		color: colors.text.tertiary,
		marginTop: spacing.sm,
	},
	courseRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: spacing.md,
		gap: spacing.md,
	},
	thumbnail: {
		width: 64,
		height: 64,
		borderRadius: spacing.radius.md,
		backgroundColor: colors.neutral[200],
		marginTop: spacing.xs,
	},
	courseText: {
		flex: 1,
	},
	courseTitle: {
		color: colors.text.primary,
		fontWeight: "600",
	},
	courseDescription: {
		color: colors.text.secondary,
		marginTop: spacing.xs,
		lineHeight: 20,
	},
	lessonCount: {
		color: colors.text.tertiary,
		marginTop: spacing.sm,
	},
	courseProgressBar: {
		height: 4,
		borderRadius: 2,
		marginTop: spacing.sm,
		backgroundColor: colors.neutral[200],
	},
});
