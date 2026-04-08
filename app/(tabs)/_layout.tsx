import { View } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import { PlayerProvider } from "@/src/providers/player/PlayerProvider";
import { TourProvider } from "@/src/providers/tour/TourProvider";
import {
	Download,
	Home,
	User,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/src/hooks/useLanguage";
import { colors, Header } from "@/design-system";
import { useLearningStore } from "@/src/store/learningStore";
import type { MultiLangText } from "@/src/types/learning";

const TAB_TITLES: Record<string, string> = {
	"/": "navigation.home",
	"/downloads": "navigation.downloads",
	"/profile": "navigation.profile",
};

export default function TabLayout() {
	const { t, currentLanguage } = useLanguage();
	const insets = useSafeAreaInsets();
	const pathname = usePathname();
	const router = useRouter();
	const courses = useLearningStore((s) => s.courses);

	const localized = (text: string | MultiLangText): string =>
		typeof text === "string" ? text : text[currentLanguage] || text.en;

	const isCourseDetail = pathname.startsWith("/course/");
	const titleKey = TAB_TITLES[pathname];

	let headerTitle: string | undefined;
	if (titleKey) {
		headerTitle = t(titleKey);
	} else if (isCourseDetail) {
		const courseId = pathname.replace("/course/", "");
		const course = courses.find((c) => c.id === courseId);
		headerTitle = course ? localized(course.title) : undefined;
	}

	const subtitle = pathname === "/" ? t("home.welcomeMessage") : undefined;

	return (
		<TourProvider>
			<PlayerProvider>
				<View style={{ flex: 1, backgroundColor: colors.background.primary }}>
					<Header
						title={headerTitle}
						subtitle={subtitle}
						showBack={isCourseDetail}
						onBack={isCourseDetail ? () => router.back() : undefined}
					/>
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
							name="(home)"
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
				</View>
			</PlayerProvider>
		</TourProvider>
	);
}
