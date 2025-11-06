import {
	ChevronRight,
	Clock,
	Download,
	Play,
	Trophy,
} from "lucide-react-native";
import {
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	CategoryButton,
	colors,
	Header,
	ProgressBar,
	spacing,
	typography,
} from "@/design-system";

export default function HomeScreen() {
	const currentCourse = {
		title: "Sustainable Agriculture Basics",
		category: "Agriculture",
		progress: 75,
		nextLesson: "Lesson 8: Composting Techniques",
		duration: "12 min",
		isDownloaded: true,
	};

	const recentActivities = [
		{
			title: "Completed: Soil Preparation",
			type: "completed",
			time: "2 hours ago",
		},
		{
			title: "Downloaded: Green Energy Course",
			type: "download",
			time: "1 day ago",
		},
		{
			title: "Started: Community Leadership",
			type: "started",
			time: "3 days ago",
		},
	];

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			<Header title="Home" subtitle="Welcome to the home screen" />
			{/* Current Course Progress */}
			<View style={styles.currentCourseContainer}>
				<ImageBackground
					source={{
						uri: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
					}}
					style={styles.courseBanner}
					imageStyle={styles.courseBannerImage}
				>
					<View style={styles.courseBannerOverlay}>
						<View style={styles.courseInfo}>
							<Text style={styles.courseCategory}>
								{currentCourse.category}
							</Text>
							<Text style={styles.courseTitle}>{currentCourse.title}</Text>
							<ProgressBar
								progress={currentCourse.progress}
								size="medium"
								showLabel
								color={colors.feedback.success}
								style={styles.progressBarComponent}
							/>
						</View>
						<TouchableOpacity style={styles.continueButton}>
							<Play size={20} color="#FDF5E6" strokeWidth={2} />
							<Text style={styles.continueButtonText}>Continue</Text>
						</TouchableOpacity>
					</View>
				</ImageBackground>
			</View>

			{/* Next Lesson Preview */}
			<View style={styles.nextLessonContainer}>
				<View style={styles.nextLessonHeader}>
					<Clock size={20} color="#2E8B57" strokeWidth={2} />
					<Text style={styles.nextLessonTitle}>Up Next</Text>
				</View>
				<TouchableOpacity style={styles.nextLessonCard}>
					<View style={styles.nextLessonInfo}>
						<Text style={styles.nextLessonName}>
							{currentCourse.nextLesson}
						</Text>
						<Text style={styles.nextLessonDuration}>
							Duration: {currentCourse.duration}
						</Text>
					</View>
					<View style={styles.nextLessonActions}>
						{currentCourse.isDownloaded && (
							<View style={styles.downloadedBadge}>
								<Download size={16} color="#32CD32" strokeWidth={2} />
							</View>
						)}
						<ChevronRight size={24} color="#2E8B57" strokeWidth={2} />
					</View>
				</TouchableOpacity>
			</View>

			{/* Quick Actions Grid */}
			<View style={styles.quickActionsContainer}>
				<Text style={styles.sectionTitle}>Quick Actions</Text>
				<View style={styles.quickActionsGrid}>
					<CategoryButton
						label="Agriculture"
						icon={<Text style={styles.quickActionEmoji}>🌾</Text>}
						color={colors.categories.agriculture}
						onPress={() => {}}
					/>
					<CategoryButton
						label="Green Energy"
						icon={<Text style={styles.quickActionEmoji}>🔆</Text>}
						color={colors.categories.greenEnergy}
						onPress={() => {}}
					/>
					<CategoryButton
						label="Construction"
						icon={<Text style={styles.quickActionEmoji}>🔨</Text>}
						color={colors.categories.construction}
						onPress={() => {}}
					/>
					<CategoryButton
						label="Business"
						icon={<Text style={styles.quickActionEmoji}>💼</Text>}
						color={colors.categories.business}
						onPress={() => {}}
					/>
				</View>
			</View>

			{/* Recent Activity */}
			<View style={styles.recentActivityContainer}>
				<Text style={styles.sectionTitle}>Recent Activity</Text>
				{recentActivities.map((activity) => (
					<View key={activity.title} style={styles.activityItem}>
						<View
							style={[
								styles.activityIcon,
								activity.type === "completed" && styles.completedIcon,
								activity.type === "download" && styles.downloadIcon,
								activity.type === "started" && styles.startedIcon,
							]}
						>
							{activity.type === "completed" && (
								<Trophy size={16} color="#FDF5E6" strokeWidth={2} />
							)}
							{activity.type === "download" && (
								<Download size={16} color="#FDF5E6" strokeWidth={2} />
							)}
							{activity.type === "started" && (
								<Play size={16} color="#FDF5E6" strokeWidth={2} />
							)}
						</View>
						<View style={styles.activityContent}>
							<Text style={styles.activityTitle}>{activity.title}</Text>
							<Text style={styles.activityTime}>{activity.time}</Text>
						</View>
					</View>
				))}
			</View>

			{/* Achievement Banner */}
			<View style={styles.achievementBanner}>
				<View style={styles.achievementContent}>
					<Trophy size={32} color="#DAA520" strokeWidth={2} />
					<View style={styles.achievementText}>
						<Text style={styles.achievementTitle}>🎉 Well Done!</Text>
						<Text style={styles.achievementSubtitle}>
							You've completed 3 courses this month
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingTop: spacing["2xl"] + spacing.md,
		paddingBottom: spacing.md,
		backgroundColor: colors.primary.main,
	},
	headerContent: {
		flex: 1,
	},
	greeting: {
		fontSize: typography.fontSize["2xl"],
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: typography.fontSize.base,
		color: colors.text.inverse,
		opacity: 0.9,
	},
	voiceInstructions: {
		backgroundColor: colors.feedback.info,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.medium,
	},
	voiceText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.primary,
		textAlign: "center",
		fontWeight: typography.fontWeight.medium,
	},
	currentCourseContainer: {
		marginHorizontal: spacing.lg,
		marginVertical: spacing.lg,
		borderRadius: spacing.radius.md,
		overflow: "hidden",
		// ...(spacing.shadow.lg as any),
	},
	courseBanner: {
		height: 200,
		justifyContent: "flex-end",
	},
	courseBannerImage: {
		borderRadius: spacing.radius.md,
	},
	courseBannerOverlay: {
		backgroundColor: "rgba(46, 139, 87, 0.85)",
		padding: spacing.lg,
		borderRadius: spacing.radius.md,
	},
	courseInfo: {
		marginBottom: spacing.md,
	},
	courseCategory: {
		fontSize: typography.fontSize.sm,
		color: colors.secondary.main,
		fontWeight: typography.fontWeight.semibold,
		marginBottom: spacing.xs,
	},
	courseTitle: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.sm,
	},
	progressBarComponent: {
		marginBottom: 0,
	},
	continueButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.secondary.main,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		borderRadius: spacing.radius.sm,
		alignSelf: "flex-start",
	},
	continueButtonText: {
		color: colors.text.inverse,
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		marginLeft: spacing.sm,
	},
	nextLessonContainer: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	nextLessonHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	nextLessonTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginLeft: spacing.sm,
	},
	nextLessonCard: {
		flexDirection: "row",
		backgroundColor: colors.neutral.white,
		padding: spacing.md,
		borderRadius: spacing.radius.md,
		borderLeftWidth: 4,
		borderLeftColor: colors.primary.main,
		// ...(spacing.shadow.md as any),
	},
	nextLessonInfo: {
		flex: 1,
	},
	nextLessonName: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	nextLessonDuration: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
	nextLessonActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	downloadedBadge: {
		padding: spacing.xs,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.feedback.success,
	},
	quickActionsContainer: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	sectionTitle: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.md,
	},
	quickActionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	quickActionEmoji: {
		fontSize: typography.fontSize["2xl"],
	},
	recentActivityContainer: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	activityItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.neutral.white,
		padding: spacing.md,
		borderRadius: spacing.radius.sm,
		marginBottom: spacing.sm,
		// ...(spacing.shadow.sm as any),
	},
	activityIcon: {
		width: 40,
		height: 40,
		borderRadius: spacing.radius.full,
		justifyContent: "center",
		alignItems: "center",
		marginRight: spacing.sm,
	},
	completedIcon: {
		backgroundColor: colors.feedback.success,
	},
	downloadIcon: {
		backgroundColor: colors.feedback.info,
	},
	startedIcon: {
		backgroundColor: colors.secondary.main,
	},
	activityContent: {
		flex: 1,
	},
	activityTitle: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: 2,
	},
	activityTime: {
		fontSize: typography.fontSize.xs,
		color: colors.text.secondary,
	},
	achievementBanner: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing["2xl"],
		backgroundColor: colors.secondary.surface,
		borderRadius: spacing.radius.md,
		borderWidth: 2,
		borderColor: colors.secondary.main,
		overflow: "hidden",
	},
	achievementContent: {
		flexDirection: "row",
		alignItems: "center",
		padding: spacing.lg,
	},
	achievementText: {
		marginLeft: spacing.md,
		flex: 1,
	},
	achievementTitle: {
		fontSize: typography.fontSize.lg,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	achievementSubtitle: {
		fontSize: typography.fontSize.sm,
		color: colors.text.secondary,
	},
});
