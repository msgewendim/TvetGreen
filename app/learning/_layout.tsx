import { Stack } from "expo-router";

export default function LearningLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "#FDF5E6",
				},
				headerTintColor: "#2E8B57",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 18,
				},
				headerShadowVisible: true,
				contentStyle: {
					backgroundColor: "#FDF5E6",
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
