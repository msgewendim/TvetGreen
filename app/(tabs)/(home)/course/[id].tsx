import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	Button,
	Divider,
	List,
	Text,
} from "react-native-paper";
import { colors, spacing } from "@/design-system";
import { useLearningStore } from "@/src/store/learningStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import type { MultiLangText } from "@/src/types/learning";

export default function CourseDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { t, currentLanguage } = useLanguage();

	const localized = (text: string | MultiLangText): string =>
		typeof text === "string" ? text : text[currentLanguage] || text.en;

	const courses = useLearningStore((s) => s.courses);
	const getLessonsForCourse = useLearningStore((s) => s.getLessonsForCourse);

	const course = id ? courses.find((c) => c.id === id) : undefined;
	const courseLessons = id ? getLessonsForCourse(id) : [];

	if (!course) {
		return (
			<View style={styles.container}>
				<View style={styles.emptyContainer}>
					<Text variant="bodyLarge" style={styles.emptyText}>
						{t("learning.errors.courseNotFound")}
					</Text>
				</View>
			</View>
		);
	}

	const totalMinutes = Math.round(
		courseLessons.reduce((sum, lesson) => sum + lesson.duration, 0) / 60,
	);

	const firstLesson = courseLessons[0];

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Course thumbnail */}
			<Image
				source={{ uri: course.thumbnail }}
				style={styles.thumbnail}
				resizeMode="cover"
			/>

			{/* Course info */}
			<View style={styles.courseInfo}>
				<Text variant="bodyLarge" style={styles.courseDescription}>
					{localized(course.description)}
				</Text>
				<Text variant="bodyMedium" style={styles.courseStats}>
					{t("learning.lessons", { count: courseLessons.length })} {"\u00B7"} {totalMinutes} min
				</Text>
			</View>

			{/* Start Learning button */}
			{firstLesson && (
				<View style={styles.buttonContainer}>
					<Button
						mode="contained"
						onPress={() =>
							router.push(`/video/${course.id}/${firstLesson.id}`)
						}
						buttonColor={colors.primary.main}
						textColor={colors.text.inverse}
						style={styles.startButton}
						contentStyle={styles.startButtonContent}
					>
						{t("learning.startLearning")}
					</Button>
				</View>
			)}

			<Divider style={styles.divider} />

			{/* Lesson list */}
			<View style={styles.lessonSection}>
				<Text variant="titleMedium" style={styles.sectionTitle}>
					{t("learning.curriculum")}
				</Text>
				{courseLessons.map((lesson, index) => (
					<View key={lesson.id}>
						{index > 0 && <Divider />}
						<List.Item
							title={localized(lesson.title)}
							description={`${Math.round(lesson.duration / 60)} min`}
							left={() => (
								<View style={styles.lessonNumber}>
									<Text variant="labelMedium" style={styles.lessonNumberText}>
										{index + 1}
									</Text>
								</View>
							)}
							onPress={() =>
								router.push(`/video/${course.id}/${lesson.id}`)
							}
							style={styles.lessonItem}
							titleStyle={styles.lessonTitle}
							descriptionStyle={styles.lessonDescription}
						/>
					</View>
				))}
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
	thumbnail: {
		width: "100%",
		height: 200,
		backgroundColor: colors.neutral[200],
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
	},
	emptyText: {
		color: colors.text.secondary,
	},
	courseInfo: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.sm,
	},
	courseDescription: {
		color: colors.text.secondary,
		marginBottom: spacing.md,
		lineHeight: 24,
	},
	courseStats: {
		color: colors.text.tertiary,
		marginBottom: spacing.sm,
	},
	buttonContainer: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
	},
	startButton: {
		borderRadius: spacing.radius.sm,
	},
	startButtonContent: {
		paddingVertical: spacing.xs,
	},
	divider: {
		marginHorizontal: spacing.lg,
		marginVertical: spacing.sm,
	},
	lessonSection: {
		paddingHorizontal: spacing.lg,
	},
	sectionTitle: {
		color: colors.text.primary,
		fontWeight: "600",
		marginBottom: spacing.sm,
	},
	lessonNumber: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: colors.primary.surface,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
	},
	lessonNumberText: {
		color: colors.primary.main,
		fontWeight: "600",
	},
	lessonItem: {
		paddingVertical: spacing.xs,
	},
	lessonTitle: {
		color: colors.text.primary,
		fontSize: 15,
	},
	lessonDescription: {
		color: colors.text.tertiary,
		fontSize: 13,
	},
});
