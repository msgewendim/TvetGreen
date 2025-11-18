import { Tabs } from "expo-router";
import { PlayerProvider } from "@/src/providers/player/PlayerProvider";
import { BookOpen, Download, Home, User, GraduationCap } from "lucide-react-native";
// import { Header } from "@/src/design-system/components/navigation/Header";

export default function TabLayout() {
    return (
        <PlayerProvider>
        <Tabs
			screenOptions={{
				headerShown: false,
				// header: () => <Header title="Home" subtitle="Welcome to the home screen" />,
				tabBarStyle: {
					backgroundColor: "#FDF5E6",
					borderTopColor: "#2E8B57",
					borderTopWidth: 2,
					height: 70,
					paddingBottom: 10,
					paddingTop: 10,
				},
				tabBarActiveTintColor: "#2E8B57",
				tabBarInactiveTintColor: "#8B4513",
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "600",
				},
			}}
        >
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ size, color }) => (
						<Home size={size} color={color} strokeWidth={2} />
					),
				}}
			/>
			<Tabs.Screen
				name="courses"
				options={{
					title: "Courses",
					tabBarIcon: ({ size, color }) => (
						<BookOpen size={size} color={color} strokeWidth={2} />
					),
				}}
			/>
			<Tabs.Screen
				name="learn"
				options={{
					title: "Learn",
					tabBarIcon: ({ size, color }) => (
						<GraduationCap size={size} color={color} strokeWidth={2} />
					),
				}}
			/>
			<Tabs.Screen
				name="downloads"
				options={{
					title: "Downloads",
					tabBarIcon: ({ size, color }) => (
						<Download size={size} color={color} strokeWidth={2} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ size, color }) => (
						<User size={size} color={color} strokeWidth={2} />
					),
				}}
			/>
        </Tabs>
        </PlayerProvider>
	);
}
