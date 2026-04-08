import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	Button,
	Divider,
	IconButton,
	List,
	Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/design-system";
import { useLearningStore } from "@/src/store/learningStore";

/**
 * Helper to handle course/lesson titles that might be strings or multi-lang objects.
 */
const getTitle = (t: string | { en: string }): string =>
	typeof t === "string" ? t : t.en;

export default function CourseDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const getCourseById = useLearningStore((s) => s.getCourseById);
	const getLessonsByCourse = useLearningStore((s) => s.getLessonsByCourse);

	const course = id ? getCourseById(id) : undefined;
	const courseLessons = id ? getLessonsByCourse(id) : [];

	if (!course) {
		return (
			<View style={[styles.container, { paddingTop: insets.top }]}>
				<IconButton
					icon="arrow-left"
					onPress={() => router.back()}
					style={styles.backButton}
				/>
				<View style={styles.emptyContainer}>
					<Text variant="bodyLarge" style={styles.emptyText}>
						Course not found
					</Text>
				</View>
			</View>
		);
	}

	// Calculate total duration from lessons
	const totalMinutes = courseLessons.reduce((sum, lesson) => {
		const parts = lesson.duration.split(":").map(Number);
		if (parts.length === 2) return sum + parts[0]; // mm:ss -> just minutes
		if (parts.length === 3) return sum + parts[0] * 60 + parts[1]; // hh:mm:ss
		return sum;
	}, 0);

	const firstLesson = courseLessons[0];

	return (
		<ScrollView
			style={[styles.container, { paddingTop: insets.top }]}
			contentContainerStyle={styles.content}
		>
			{/* Back button */}
			<IconButton
				icon="arrow-left"
				onPress={() => router.back()}
				style={styles.backButton}
			/>

			{/* Course info */}
			<View style={styles.courseInfo}>
				<Text variant="headlineMedium" style={styles.courseTitle}>
					{getTitle(course.title)}
				</Text>
				<Text variant="bodyLarge" style={styles.courseDescription}>
					{course.description}
				</Text>
				<Text variant="bodyMedium" style={styles.courseStats}>
					{courseLessons.length} lessons {"\u00B7"} {totalMinutes} min
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
						Start Learning
					</Button>
				</View>
			)}

			<Divider style={styles.divider} />

			{/* Lesson list */}
			<View style={styles.lessonSection}>
				<Text variant="titleMedium" style={styles.sectionTitle}>
					Lessons
				</Text>
				{courseLessons.map((lesson, index) => (
					<View key={lesson.id}>
						{index > 0 && <Divider />}
						<List.Item
							title={getTitle(lesson.title)}
							description={lesson.duration}
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
	backButton: {
		alignSelf: "flex-start",
		marginLeft: spacing.sm,
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
		paddingBottom: spacing.md,
	},
	courseTitle: {
		color: colors.text.primary,
		fontWeight: "700",
		marginBottom: spacing.sm,
	},
	courseDescription: {
		color: colors.text.secondary,
		marginBottom: spacing.sm,
		lineHeight: 24,
	},
	courseStats: {
		color: colors.text.tertiary,
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
