import { Tabs } from "expo-router";
import { PlayerProvider } from "@/src/providers/player/PlayerProvider";
import {
	BookOpen,
	Download,
	Home,
	User,
	GraduationCap,
} from "lucide-react-native";
import { useLanguage } from "@/src/hooks/useLanguage";

export default function TabLayout() {
	const { t } = useLanguage();

	return (
		<PlayerProvider>
			<Tabs
				screenOptions={{
					headerShown: false,
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
						title: t("navigation.home"),
						tabBarIcon: ({ size, color }) => (
							<Home size={size} color={color} strokeWidth={2} />
						),
					}}
				/>
				<Tabs.Screen
					name="courses"
					options={{
						title: t("navigation.courses"),
						tabBarIcon: ({ size, color }) => (
							<BookOpen size={size} color={color} strokeWidth={2} />
						),
					}}
				/>
				<Tabs.Screen
					name="learn"
					options={{
						title: t("navigation.learn"),
						tabBarIcon: ({ size, color }) => (
							<GraduationCap size={size} color={color} strokeWidth={2} />
						),
					}}
				/>
				<Tabs.Screen
					name="downloads"
					options={{
						title: t("navigation.downloads"),
						tabBarIcon: ({ size, color }) => (
							<Download size={size} color={color} strokeWidth={2} />
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: t("navigation.profile"),
						tabBarIcon: ({ size, color }) => (
							<User size={size} color={color} strokeWidth={2} />
						),
					}}
				/>
			</Tabs>
		</PlayerProvider>
	);
}
