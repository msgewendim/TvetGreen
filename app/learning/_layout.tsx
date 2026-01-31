import { Stack } from "expo-router";
import { colors } from "@/design-system";

export default function LearningLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.background.tertiary,
				},
				headerTintColor: colors.primary.main,
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 18,
				},
				headerShadowVisible: true,
				contentStyle: {
					backgroundColor: colors.background.tertiary,
				},
			}}
		>
			<Stack.Screen
				name="categories"
				options={{
					title: "Browse Categories",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="courses/index"
				options={{
					title: "All Courses",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="courses/[id]"
				options={{
					title: "Course Details",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="lesson/[id]"
				options={{
					title: "Lesson",
					headerShown: false, // Full screen video player
					presentation: "fullScreenModal",
				}}
			/>
		</Stack>
	);
}
