import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Download, Globe, CircleHelp as HelpCircle, LogOut, Smartphone, Volume2 } from 'lucide-react-native'
import { ScreenLayout, Header, colors, spacing, typography } from '@/design-system'
import {
	ProfileHeader,
	StatsGrid,
	GoalCard,
	SettingItem,
	type UserProfile,
	type UserStats,
	type LearningGoal,
} from '@/src/components/profile'

export default function ProfileScreen() {
	const userProfile: UserProfile = {
		name: 'Fatima Okonkwo',
		location: 'Addis Ababa, Ethiopia',
		joinDate: 'March 2024',
		skillLevel: 'Intermediate',
		profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
	}

	const userStats: UserStats = {
		completedCourses: 3,
		totalHours: 24,
		certificates: 3,
		currentStreak: 7,
	}

	const learningGoals: LearningGoal[] = [
		{
			id: 1,
			title: 'Complete 5 Agriculture Courses',
			progress: 60,
			target: 5,
			current: 3,
			deadline: 'End of June',
		},
		{
			id: 2,
			title: 'Earn Green Energy Certificate',
			progress: 25,
			target: 1,
			current: 0,
			deadline: 'End of July',
		},
	]

	const handleLogout = () => {
		Alert.alert(
			'Sign Out',
			'Are you sure you want to sign out? Your progress will be saved.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Sign Out',
					style: 'destructive',
					onPress: () => console.log('Logout'),
				},
			],
		)
	}

	return (
		<ScreenLayout>
			<Header title="Profile" subtitle="Manage your account" />

			<ProfileHeader profile={userProfile} onEditPress={() => {}} />

			<StatsGrid stats={userStats} />

			{/* Learning Goals */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Learning Goals</Text>
					<TouchableOpacity style={styles.addButton}>
						<Text style={styles.addButtonText}>+ Add Goal</Text>
					</TouchableOpacity>
				</View>

				{learningGoals.map((goal) => (
					<GoalCard key={goal.id} goal={goal} />
				))}
			</View>

			{/* Settings Menu */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Settings & Support</Text>

				<SettingItem
					icon={<Globe size={20} color={colors.primary.main} strokeWidth={2} />}
					title="Language & Region"
					subtitle="English, Amharic available"
					onPress={() => {}}
				/>

				<SettingItem
					icon={<Volume2 size={20} color={colors.secondary.main} strokeWidth={2} />}
					title="Voice & Audio"
					subtitle="Voice commands, audio quality"
					onPress={() => {}}
				/>

				<SettingItem
					icon={<Download size={20} color={colors.feedback.info} strokeWidth={2} />}
					title="Download Preferences"
					subtitle="WiFi only, quality settings"
					onPress={() => {}}
				/>

				<SettingItem
					icon={<Smartphone size={20} color={colors.categories.construction} strokeWidth={2} />}
					title="Data & Storage"
					subtitle="Manage offline content"
					onPress={() => {}}
				/>

				<SettingItem
					icon={<HelpCircle size={20} color={colors.text.secondary} strokeWidth={2} />}
					title="Help & Support"
					subtitle="FAQs, contact support"
					onPress={() => {}}
				/>
			</View>

			{/* Community Impact */}
			<View style={styles.impactContainer}>
				<Text style={styles.impactTitle}>🌍 Your Community Impact</Text>
				<View style={styles.impactStats}>
					<View style={styles.impactItem}>
						<Text style={styles.impactNumber}>12</Text>
						<Text style={styles.impactLabel}>People Helped</Text>
					</View>
					<View style={styles.impactItem}>
						<Text style={styles.impactNumber}>3</Text>
						<Text style={styles.impactLabel}>Skills Shared</Text>
					</View>
					<View style={styles.impactItem}>
						<Text style={styles.impactNumber}>45</Text>
						<Text style={styles.impactLabel}>Questions Answered</Text>
					</View>
				</View>
				<Text style={styles.impactDescription}>
					Your knowledge is making a difference in your community!
				</Text>
			</View>

			{/* Account Actions */}
			<View style={styles.accountActions}>
				<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
					<LogOut size={20} color={colors.feedback.error} strokeWidth={2} />
					<Text style={styles.logoutText}>Sign Out</Text>
				</TouchableOpacity>
			</View>
		</ScreenLayout>
	)
}

const styles = StyleSheet.create({
	section: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	sectionTitle: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
	},
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
	impactContainer: {
		backgroundColor: colors.primary.surface,
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
		padding: spacing.lg,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.feedback.success,
	},
	impactTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
		textAlign: 'center',
	},
	impactStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: spacing.md,
	},
	impactItem: {
		alignItems: 'center',
	},
	impactNumber: {
		fontSize: typography.fontSize['2xl'],
		fontWeight: typography.fontWeight.bold,
		color: colors.feedback.success,
		marginBottom: spacing.xs / 2,
	},
	impactLabel: {
		fontSize: typography.fontSize.xs,
		color: colors.text.primary,
		fontWeight: typography.fontWeight.medium,
		textAlign: 'center',
	},
	impactDescription: {
		fontSize: typography.fontSize.sm,
		color: colors.text.primary,
		textAlign: 'center',
		lineHeight: 20,
	},
	accountActions: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	logoutButton: {
		backgroundColor: colors.neutral[100],
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
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
})
