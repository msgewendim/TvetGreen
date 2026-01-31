import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLearningStore } from "@/src/store/learningStore";
import { colors } from "@/design-system";

/**
 * Redirects to the video player at /video/[courseId]/[lessonId].
 * Kept as a route to avoid breaking any deep links.
 */
export default function LessonPlayerRedirect() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const getLessonById = useLearningStore((s) => s.getLessonById);

	useEffect(() => {
		const lesson = id ? getLessonById(id) : undefined;
		if (lesson) {
			router.replace(`/video/${lesson.courseId}/${lesson.id}`);
		} else {
			router.back();
		}
	}, [id, getLessonById, router]);

	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={colors.primary.main} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
});
