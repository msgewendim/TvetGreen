import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { List, Text as PaperText } from "react-native-paper";
import { Text } from "react-native";
import {
	Download,
	Globe,
	CircleHelp as HelpCircle,
	LogOut,
	Smartphone,
	Volume2,
} from "lucide-react-native";
import {
	ScreenLayout,
	Header,
	commonStyles,
	colors,
	spacing,
	typography,
} from "@/design-system";
import {
	ProfileHeader,
	StatsGrid,
	GoalCard,
	SettingItem,
	CommunityImpactCard,
	type UserProfile,
	type UserStats,
	type LearningGoal,
	type CommunityImpactStats,
} from "@/src/components/profile";
import { useLanguage } from "@/src/hooks/useLanguage";
import { LanguageSelector } from "@/src/components/settings";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ProfileScreen() {
	const { t, languageInfo } = useLanguage();
	const router = useRouter();
	const resetTour = useOnboardingStore((s) => s.resetTour);
	const [showLanguageSelector, setShowLanguageSelector] = useState(false);

	const handleReplayTour = async () => {
		await resetTour();
		router.replace("/(tabs)" as never);
	};

	const userProfile: UserProfile = {
		name: "Fatima Okonkwo",
		location: "Addis Ababa, Ethiopia",
		joinDate: "March 2024",
		skillLevel: "Intermediate",
		profileImage:
			"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
	};

	const userStats: UserStats = {
		completedCourses: 3,
		totalHours: 24,
		certificates: 3,
		currentStreak: 7,
	};

	const learningGoals: LearningGoal[] = [
		{
			id: 1,
			title: "Complete 5 Agriculture Courses",
			progress: 60,
			target: 5,
			current: 3,
			deadline: "End of June",
		},
		{
			id: 2,
			title: "Earn Green Energy Certificate",
			progress: 25,
			target: 1,
			current: 0,
			deadline: "End of July",
		},
	];

	const communityImpact: CommunityImpactStats = {
		peopleHelped: 12,
		skillsShared: 3,
		questionsAnswered: 45,
	};

	const handleLogout = () => {
		Alert.alert(
			t("profile.signOut"),
			"Are you sure you want to sign out? Your progress will be saved.",
			[
				{ text: t("common.cancel"), style: "cancel" },
				{
					text: t("profile.signOut"),
					style: "destructive",
					onPress: () => console.log("Logout"),
				},
			],
		);
	};

	return (
		<ScreenLayout>
			<Header variant="minimal" title="Profile" />

			<ProfileHeader profile={userProfile} onEditPress={() => {}} />

			<StatsGrid stats={userStats} />

			{/* Learning Goals */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>{t("profile.learningGoals")}</Text>
					<TouchableOpacity style={styles.addButton}>
						<Text style={styles.addButtonText}>+ {t("profile.addGoal")}</Text>
					</TouchableOpacity>
				</View>
				{learningGoals.map((goal) => (
					<GoalCard key={goal.id} goal={goal} />
				))}
			</View>

			{/* Settings */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t("profile.settings")}</Text>

				<SettingItem
					icon={<Globe size={20} color={colors.primary.main} strokeWidth={2} />}
					title={t("profile.language")}
					subtitle={languageInfo.nativeName}
					onPress={() => setShowLanguageSelector(!showLanguageSelector)}
				/>
				{showLanguageSelector && (
					<View style={styles.languageSelectorContainer}>
						<LanguageSelector />
					</View>
				)}
				<SettingItem
					icon={
						<Volume2 size={20} color={colors.accent.main} strokeWidth={2} />
					}
					title={t("profile.voiceGuide")}
					subtitle="Voice commands, audio quality"
					onPress={() => {}}
				/>
				<SettingItem
					icon={
						<Download size={20} color={colors.feedback.info} strokeWidth={2} />
					}
					title={t("downloads.title")}
					subtitle={t("profile.wifiOnly")}
					onPress={() => {}}
				/>
				<SettingItem
					icon={
						<Smartphone
							size={20}
							color={colors.categories.construction}
							strokeWidth={2}
						/>
					}
					title={t("profile.dataUsage")}
					subtitle={t("downloads.manage")}
					onPress={() => {}}
				/>
				<SettingItem
					icon={
						<HelpCircle
							size={20}
							color={colors.text.secondary}
							strokeWidth={2}
						/>
					}
					title={t("profile.help")}
					subtitle="FAQs, contact support"
					onPress={() => {}}
				/>
			</View>

			<CommunityImpactCard stats={communityImpact} />

			{/* Help & Guides */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t("profile.helpGuides")}</Text>
				<List.Item
					title={t("profile.replayTour")}
					description={t("profile.replayTourSubtitle")}
					left={(props) => (
						<List.Icon
							{...props}
							icon="play-circle-outline"
							color={colors.primary.main}
						/>
					)}
					right={(props) => <List.Icon {...props} icon="chevron-right" />}
					onPress={handleReplayTour}
					accessibilityLabel={t("profile.replayTour")}
				/>
				<List.Item
					title={t("profile.helpVideos")}
					description={t("profile.helpVideosSubtitle")}
					left={(props) => (
						<List.Icon
							{...props}
							icon="video-outline"
							color={colors.accent.main}
						/>
					)}
					right={(props) => <List.Icon {...props} icon="chevron-right" />}
					onPress={() =>
						Alert.alert(
							t("profile.helpVideos"),
							t("profile.helpVideosComingSoon"),
						)
					}
					accessibilityLabel={t("profile.helpVideos")}
				/>
			</View>

			{/* Sign Out */}
			<View style={styles.accountActions}>
				<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
					<LogOut size={20} color={colors.feedback.error} strokeWidth={2} />
					<Text style={styles.logoutText}>{t("profile.signOut")}</Text>
				</TouchableOpacity>
			</View>
		</ScreenLayout>
	);
}

const styles = StyleSheet.create({
	section: commonStyles.section,
	sectionHeader: commonStyles.sectionHeader,
	sectionTitle: commonStyles.sectionTitle,
	addButton: {
		backgroundColor: colors.primary.surface,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: spacing.radius.lg,
	},
	addButtonText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.primary.main,
	},
	accountActions: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	logoutButton: {
		backgroundColor: colors.neutral[100],
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		borderWidth: 1,
		borderColor: colors.feedback.error,
	},
	logoutText: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.feedback.error,
		marginLeft: spacing.sm,
	},
	languageSelectorContainer: {
		marginTop: spacing.md,
		marginBottom: spacing.md,
		paddingHorizontal: spacing.sm,
	},
});
