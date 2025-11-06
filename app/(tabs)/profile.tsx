import {
	Award,
	BookOpen,
	ChevronRight,
	Clock,
	Download,
	CreditCard as Edit3,
	Globe,
	CircleHelp as HelpCircle,
	LogOut,
	Smartphone,
	Star,
	Target,
	TrendingUp,
	Volume2,
} from "lucide-react-native";
import {
	Alert,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
	const userStats = {
		name: "Fatima Okonkwo",
		location: "Addis Ababa, Ethiopia",
		joinDate: "March 2024",
		totalCourses: 8,
		completedCourses: 3,
		totalHours: 24,
		currentStreak: 7,
		certificates: 3,
		skillLevel: "Intermediate",
		profileImage:
			"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
	};

	const achievements = [
		{
			id: 1,
			title: "First Course Complete",
			description: "Completed your first course",
			icon: "🎓",
			earned: true,
			date: "April 15, 2024",
		},
		{
			id: 2,
			title: "Agriculture Expert",
			description: "Completed 3 agriculture courses",
			icon: "🌾",
			earned: true,
			date: "May 2, 2024",
		},
		{
			id: 3,
			title: "Week Warrior",
			description: "7-day learning streak",
			icon: "🔥",
			earned: true,
			date: "Today",
		},
		{
			id: 4,
			title: "Community Helper",
			description: "Help 5 other learners",
			icon: "🤝",
			earned: false,
			progress: 60,
		},
	];

	const recentCertificates = [
		{
			id: 1,
			title: "Sustainable Agriculture Basics",
			issueDate: "May 1, 2024",
			instructor: "Dr. Amara Ketema",
			credentialId: "SA-2024-001",
		},
		{
			id: 2,
			title: "Water Conservation Methods",
			issueDate: "April 20, 2024",
			instructor: "Dr. Aisha Mohamed",
			credentialId: "WC-2024-045",
		},
	];

	const learningGoals = [
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

	const handleLogout = () => {
		Alert.alert(
			"Sign Out",
			"Are you sure you want to sign out? Your progress will be saved.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Sign Out",
					style: "destructive",
					onPress: () => console.log("Logout"),
				},
			],
		);
	};

	return (
		<View style={styles.container}>
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Profile Header */}
				<View style={styles.profileHeader}>
					<View style={styles.profileImageContainer}>
						<Image
							source={{ uri: userStats.profileImage }}
							style={styles.profileImage}
						/>
						<TouchableOpacity style={styles.editProfileButton}>
							<Edit3 size={16} color="#FDF5E6" strokeWidth={2} />
						</TouchableOpacity>
					</View>

					<View style={styles.profileInfo}>
						<Text style={styles.userName}>{userStats.name}</Text>
						<Text style={styles.userLocation}>{userStats.location}</Text>
						<Text style={styles.userJoinDate}>
							Learning since {userStats.joinDate}
						</Text>

						<View style={styles.skillLevelBadge}>
							<Star size={16} color="#DAA520" strokeWidth={2} />
							<Text style={styles.skillLevelText}>
								{userStats.skillLevel} Learner
							</Text>
						</View>
					</View>
				</View>

				{/* Learning Statistics */}
				<View style={styles.statsContainer}>
					<Text style={styles.sectionTitle}>Learning Statistics</Text>
					<View style={styles.statsGrid}>
						<View style={styles.statCard}>
							<BookOpen size={24} color="#2E8B57" strokeWidth={2} />
							<Text style={styles.statNumber}>
								{userStats.completedCourses}
							</Text>
							<Text style={styles.statLabel}>Courses Completed</Text>
						</View>
						<View style={styles.statCard}>
							<Clock size={24} color="#FF8C42" strokeWidth={2} />
							<Text style={styles.statNumber}>{userStats.totalHours}h</Text>
							<Text style={styles.statLabel}>Hours Learned</Text>
						</View>
						<View style={styles.statCard}>
							<Award size={24} color="#DAA520" strokeWidth={2} />
							<Text style={styles.statNumber}>{userStats.certificates}</Text>
							<Text style={styles.statLabel}>Certificates</Text>
						</View>
						<View style={styles.statCard}>
							<TrendingUp size={24} color="#32CD32" strokeWidth={2} />
							<Text style={styles.statNumber}>{userStats.currentStreak}</Text>
							<Text style={styles.statLabel}>Day Streak</Text>
						</View>
					</View>
				</View>

				{/* Learning Goals */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Learning Goals</Text>
						<TouchableOpacity style={styles.addButton}>
							<Text style={styles.addButtonText}>+ Add Goal</Text>
						</TouchableOpacity>
					</View>

					{learningGoals.map((goal) => (
						<View key={goal.id} style={styles.goalCard}>
							<View style={styles.goalHeader}>
								<Target size={20} color="#2E8B57" strokeWidth={2} />
								<Text style={styles.goalTitle}>{goal.title}</Text>
							</View>
							<Text style={styles.goalDeadline}>Target: {goal.deadline}</Text>
							<View style={styles.goalProgress}>
								<View style={styles.goalProgressBar}>
									<View
										style={[
											styles.goalProgressFill,
											{ width: `${goal.progress}%` },
										]}
									/>
								</View>
								<Text style={styles.goalProgressText}>
									{goal.current} of {goal.target} • {goal.progress}%
								</Text>
							</View>
						</View>
					))}
				</View>

				{/* Recent Achievements */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Achievements</Text>
					<View style={styles.achievementsGrid}>
						{achievements.map((achievement) => (
							<TouchableOpacity
								key={achievement.id}
								style={[
									styles.achievementCard,
									!achievement.earned && styles.achievementCardLocked,
								]}
							>
								<View style={styles.achievementIcon}>
									<Text style={styles.achievementEmoji}>
										{achievement.icon}
									</Text>
									{achievement.earned && (
										<View style={styles.achievementBadge}>
											<Award size={12} color="#DAA520" strokeWidth={2} />
										</View>
									)}
								</View>
								<Text
									style={[
										styles.achievementTitle,
										!achievement.earned && styles.achievementTitleLocked,
									]}
								>
									{achievement.title}
								</Text>
								<Text
									style={[
										styles.achievementDescription,
										!achievement.earned && styles.achievementDescriptionLocked,
									]}
								>
									{achievement.description}
								</Text>
								{achievement.earned ? (
									<Text style={styles.achievementDate}>{achievement.date}</Text>
								) : (
									<View style={styles.achievementProgressContainer}>
										<View style={styles.achievementProgressBar}>
											<View
												style={[
													styles.achievementProgressFill,
													{ width: `${achievement.progress ?? 0}%` },
												]}
											/>
										</View>
										<Text style={styles.achievementProgressText}>
											{achievement.progress}%
										</Text>
									</View>
								)}
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Certificates */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>My Certificates</Text>
						<TouchableOpacity>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>

					{recentCertificates.map((cert) => (
						<TouchableOpacity key={cert.id} style={styles.certificateCard}>
							<View style={styles.certificateIcon}>
								<Award size={24} color="#DAA520" strokeWidth={2} />
							</View>
							<View style={styles.certificateInfo}>
								<Text style={styles.certificateTitle}>{cert.title}</Text>
								<Text style={styles.certificateInstructor}>
									by {cert.instructor}
								</Text>
								<Text style={styles.certificateDate}>
									Issued: {cert.issueDate}
								</Text>
								<Text style={styles.certificateId}>
									ID: {cert.credentialId}
								</Text>
							</View>
							<ChevronRight size={20} color="#8B4513" strokeWidth={2} />
						</TouchableOpacity>
					))}
				</View>

				{/* Settings Menu */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Settings & Support</Text>

					<TouchableOpacity style={styles.settingItem}>
						<View style={styles.settingIcon}>
							<Globe size={20} color="#2E8B57" strokeWidth={2} />
						</View>
						<View style={styles.settingContent}>
							<Text style={styles.settingTitle}>Language & Region</Text>
							<Text style={styles.settingSubtitle}>
								English, Amharic available
							</Text>
						</View>
						<ChevronRight size={20} color="#8B4513" strokeWidth={2} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.settingItem}>
						<View style={styles.settingIcon}>
							<Volume2 size={20} color="#FF8C42" strokeWidth={2} />
						</View>
						<View style={styles.settingContent}>
							<Text style={styles.settingTitle}>Voice & Audio</Text>
							<Text style={styles.settingSubtitle}>
								Voice commands, audio quality
							</Text>
						</View>
						<ChevronRight size={20} color="#8B4513" strokeWidth={2} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.settingItem}>
						<View style={styles.settingIcon}>
							<Download size={20} color="#87CEEB" strokeWidth={2} />
						</View>
						<View style={styles.settingContent}>
							<Text style={styles.settingTitle}>Download Preferences</Text>
							<Text style={styles.settingSubtitle}>
								WiFi only, quality settings
							</Text>
						</View>
						<ChevronRight size={20} color="#8B4513" strokeWidth={2} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.settingItem}>
						<View style={styles.settingIcon}>
							<Smartphone size={20} color="#DAA520" strokeWidth={2} />
						</View>
						<View style={styles.settingContent}>
							<Text style={styles.settingTitle}>Data & Storage</Text>
							<Text style={styles.settingSubtitle}>Manage offline content</Text>
						</View>
						<ChevronRight size={20} color="#8B4513" strokeWidth={2} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.settingItem}>
						<View style={styles.settingIcon}>
							<HelpCircle size={20} color="#8B4513" strokeWidth={2} />
						</View>
						<View style={styles.settingContent}>
							<Text style={styles.settingTitle}>Help & Support</Text>
							<Text style={styles.settingSubtitle}>FAQs, contact support</Text>
						</View>
						<ChevronRight size={20} color="#8B4513" strokeWidth={2} />
					</TouchableOpacity>
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
						<LogOut size={20} color="#DC143C" strokeWidth={2} />
						<Text style={styles.logoutText}>Sign Out</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.bottomPadding} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDF5E6",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 20,
		backgroundColor: "#2E8B57",
	},
	headerContent: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#FDF5E6",
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#FDF5E6",
		opacity: 0.9,
	},
	voiceButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#FF8C42",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	voiceButtonActive: {
		backgroundColor: "#DC143C",
	},
	listeningIndicator: {
		position: "relative",
		justifyContent: "center",
		alignItems: "center",
	},
	pulseRing: {
		position: "absolute",
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 2,
		borderColor: "#FDF5E6",
		opacity: 0.3,
	},
	voiceInstructions: {
		backgroundColor: "#87CEEB",
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	voiceText: {
		fontSize: 14,
		color: "#2F4F4F",
		textAlign: "center",
		fontWeight: "500",
	},
	content: {
		flex: 1,
	},
	profileHeader: {
		backgroundColor: "#FFF",
		marginHorizontal: 20,
		marginTop: 20,
		marginBottom: 16,
		padding: 20,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		alignItems: "center",
	},
	profileImageContainer: {
		position: "relative",
		marginBottom: 16,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 4,
		borderColor: "#2E8B57",
	},
	editProfileButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "#FF8C42",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: "#FFF",
	},
	profileInfo: {
		alignItems: "center",
	},
	userName: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	userLocation: {
		fontSize: 16,
		color: "#8B4513",
		marginBottom: 4,
	},
	userJoinDate: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 12,
	},
	skillLevelBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF9E6",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#DAA520",
	},
	skillLevelText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
		marginLeft: 6,
	},
	statsContainer: {
		marginHorizontal: 20,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 16,
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 12,
	},
	statCard: {
		backgroundColor: "#FFF",
		width: (width - 64) / 2,
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginTop: 8,
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: "#8B4513",
		textAlign: "center",
		fontWeight: "500",
	},
	section: {
		marginHorizontal: 20,
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	addButton: {
		backgroundColor: "#E8F5E8",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	addButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2E8B57",
	},
	viewAllText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2E8B57",
	},
	goalCard: {
		backgroundColor: "#FFF",
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#2E8B57",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	goalHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	goalTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2F4F4F",
		marginLeft: 8,
		flex: 1,
	},
	goalDeadline: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 12,
	},
	goalProgress: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	goalProgressBar: {
		flex: 1,
		height: 6,
		backgroundColor: "#F0F0F0",
		borderRadius: 3,
	},
	goalProgressFill: {
		height: "100%",
		backgroundColor: "#2E8B57",
		borderRadius: 3,
	},
	goalProgressText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		minWidth: 80,
	},
	achievementsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 12,
	},
	achievementCard: {
		backgroundColor: "#FFF",
		width: (width - 64) / 2,
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	achievementCardLocked: {
		backgroundColor: "#F8F8F8",
		opacity: 0.7,
	},
	achievementIcon: {
		position: "relative",
		marginBottom: 12,
	},
	achievementEmoji: {
		fontSize: 32,
	},
	achievementBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#DAA520",
		width: 20,
		height: 20,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	achievementTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#2F4F4F",
		textAlign: "center",
		marginBottom: 4,
	},
	achievementTitleLocked: {
		color: "#8B4513",
	},
	achievementDescription: {
		fontSize: 12,
		color: "#8B4513",
		textAlign: "center",
		marginBottom: 8,
	},
	achievementDescriptionLocked: {
		color: "#A0A0A0",
	},
	achievementDate: {
		fontSize: 11,
		color: "#32CD32",
		fontWeight: "500",
	},
	achievementProgressContainer: {
		width: "100%",
		alignItems: "center",
	},
	achievementProgressBar: {
		width: "100%",
		height: 4,
		backgroundColor: "#F0F0F0",
		borderRadius: 2,
		marginBottom: 4,
	},
	achievementProgressFill: {
		height: "100%",
		backgroundColor: "#FF8C42",
		borderRadius: 2,
	},
	achievementProgressText: {
		fontSize: 11,
		color: "#8B4513",
		fontWeight: "500",
	},
	certificateCard: {
		backgroundColor: "#FFF",
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	certificateIcon: {
		backgroundColor: "#FFF9E6",
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	certificateInfo: {
		flex: 1,
	},
	certificateTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	certificateInstructor: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 2,
	},
	certificateDate: {
		fontSize: 12,
		color: "#8B4513",
		marginBottom: 2,
	},
	certificateId: {
		fontSize: 11,
		color: "#A0A0A0",
		fontFamily: "monospace",
	},
	settingItem: {
		backgroundColor: "#FFF",
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 12,
		marginBottom: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	settingIcon: {
		backgroundColor: "#F5F5F5",
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	settingContent: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2F4F4F",
		marginBottom: 2,
	},
	settingSubtitle: {
		fontSize: 14,
		color: "#8B4513",
	},
	impactContainer: {
		backgroundColor: "#E8F5E8",
		marginHorizontal: 20,
		marginBottom: 24,
		padding: 20,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#32CD32",
	},
	impactTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 16,
		textAlign: "center",
	},
	impactStats: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 16,
	},
	impactItem: {
		alignItems: "center",
	},
	impactNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#32CD32",
		marginBottom: 4,
	},
	impactLabel: {
		fontSize: 12,
		color: "#2F4F4F",
		fontWeight: "500",
		textAlign: "center",
	},
	impactDescription: {
		fontSize: 14,
		color: "#2F4F4F",
		textAlign: "center",
		lineHeight: 20,
	},
	accountActions: {
		marginHorizontal: 20,
		marginBottom: 24,
	},
	logoutButton: {
		backgroundColor: "#FFE4E1",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#DC143C",
	},
	logoutText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#DC143C",
		marginLeft: 8,
	},
	bottomPadding: {
		height: 40,
	},
});
