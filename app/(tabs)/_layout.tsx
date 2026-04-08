import { Tabs } from "expo-router";
import { PlayerProvider } from "@/src/providers/player/PlayerProvider";
import {
	Download,
	Home,
	User,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors } from "@/design-system";

export default function TabLayout() {
	const { t } = useLanguage();
	const insets = useSafeAreaInsets();

	return (
		<PlayerProvider>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarStyle: {
						backgroundColor: colors.background.tertiary,
						borderTopColor: colors.border.light,
						borderTopWidth: 1,
						height: 72 + insets.bottom,
						paddingBottom: 10 + insets.bottom,
						paddingTop: 6,
					},
					tabBarActiveTintColor: colors.primary.main,
					tabBarInactiveTintColor: colors.text.secondary,
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
