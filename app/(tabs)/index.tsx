import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Card, Divider, List, ProgressBar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/design-system";
import { useLearningStore } from "@/src/store/learningStore";

/**
 * Helper to handle course titles that might be strings or multi-lang objects.
 */
const getTitle = (t: string | { en: string }): string =>
	typeof t === "string" ? t : t.en;

export default function HomeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const lessonProgress = useLearningStore((s) => s.lessonProgress);
	const loadData = useLearningStore((s) => s.loadData);

	// Ensure data is loaded
	useEffect(() => {
		if (courses.length === 0) {
			loadData();
		}
	}, [courses.length, loadData]);

	// Find the most recent in-progress lesson for "Continue Learning"
	const continueItem = (() => {
		const recentProgress = [...lessonProgress]
			.filter((p) => !p.completed && p.lastPosition > 0)
			.sort(
				(a, b) =>
					new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime(),
			)[0];

		if (!recentProgress) return null;

		const lesson = lessons.find((l) => l.id === recentProgress.lessonId);
		const course = courses.find((c) => c.id === recentProgress.courseId);
		if (!lesson || !course) return null;

		const totalDuration = lesson.duration || 1;
		const progress = recentProgress.lastPosition / totalDuration;

		return { course, lesson, progress: Math.min(progress, 1) };
	})();

	return (
		<ScrollView
			style={[styles.container, { paddingTop: insets.top }]}
			contentContainerStyle={styles.content}
		>
			{/* Header */}
			<View style={styles.header}>
				<Text variant="headlineMedium" style={styles.headerTitle}>
					GreenSkills
				</Text>
				<Text variant="bodyMedium" style={styles.headerSubtitle}>
					Learn skills for a greener future
				</Text>
			</View>

			{/* Continue Learning - conditional */}
			{continueItem && (
				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						Continue Learning
					</Text>
					<Card
						style={styles.continueCard}
						onPress={() =>
							router.push(
								`/video/${continueItem.course.id}/${continueItem.lesson.id}`,
							)
						}
					>
						<Card.Content>
							<Text variant="titleSmall" style={styles.continueCourseTitle}>
								{getTitle(continueItem.course.title)}
							</Text>
							<Text variant="bodySmall" style={styles.continueLessonTitle}>
								{getTitle(continueItem.lesson.title)}
							</Text>
							<View style={styles.progressRow}>
								<ProgressBar
									progress={continueItem.progress}
									color={colors.primary.main}
									style={styles.progressBar}
								/>
								<Text variant="labelSmall" style={styles.progressText}>
									{Math.round(continueItem.progress * 100)}%
								</Text>
							</View>
						</Card.Content>
					</Card>
				</View>
			)}

			{/* Courses */}
			<View style={styles.section}>
				<Text variant="titleMedium" style={styles.sectionTitle}>
					Courses
				</Text>
				{courses.map((course, index) => {
					const courseLessons = lessons.filter(
						(l) => l.courseId === course.id,
					);
					return (
						<View key={course.id}>
							{index > 0 && <Divider />}
							<List.Item
								title={getTitle(course.title)}
								description={`${getTitle(course.description).slice(0, 60)}... \u00B7 ${courseLessons.length} lessons`}
								left={() => (
									<Image
										source={{ uri: course.thumbnail }}
										style={styles.thumbnail}
									/>
								)}
								onPress={() => router.push(`/course/${course.id}`)}
								style={styles.listItem}
								titleStyle={styles.listItemTitle}
								descriptionStyle={styles.listItemDescription}
								descriptionNumberOfLines={2}
							/>
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
	header: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.md,
	},
	headerTitle: {
		color: colors.text.primary,
		fontWeight: "700",
	},
	headerSubtitle: {
		color: colors.text.secondary,
		marginTop: spacing.xs,
	},
	section: {
		marginTop: spacing.md,
		paddingHorizontal: spacing.lg,
	},
	sectionTitle: {
		color: colors.text.primary,
		fontWeight: "600",
		marginBottom: spacing.sm,
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
	progressRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: spacing.sm,
		gap: spacing.sm,
	},
	progressBar: {
		flex: 1,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.neutral[200],
	},
	progressText: {
		color: colors.text.secondary,
		minWidth: 32,
		textAlign: "right",
	},
	thumbnail: {
		width: 48,
		height: 48,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.neutral[200],
	},
	listItem: {
		paddingVertical: spacing.xs,
	},
	listItemTitle: {
		color: colors.text.primary,
		fontWeight: "600",
		fontSize: 15,
	},
	listItemDescription: {
		color: colors.text.secondary,
		fontSize: 13,
	},
});
