import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/design-system";
import { CourseCard } from "./CourseCard";
import type { Course } from "./CourseCard";

interface CoursesListProps {
	courses: Course[];
	onCoursePress: (course: Course) => void;
}

export function CoursesList({ courses, onCoursePress }: CoursesListProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>All Courses</Text>
			<Text style={styles.subtitle}>{courses.length} courses available</Text>

			<View style={styles.coursesContainer}>
				{courses.map((course) => (
					<CourseCard
						key={course.id.toString()}
						course={course}
						onPress={() => onCoursePress(course)}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xl + 8,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	subtitle: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
		marginBottom: spacing.md,
	},
	coursesContainer: {
		gap: 0,
	},
});
