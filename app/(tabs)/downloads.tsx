import {
	CheckCircle,
	Clock,
	HardDrive,
	Play,
	RefreshCw,
	Settings,
	Trash2,
	WifiOff,
} from "lucide-react-native";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function DownloadsScreen() {
	const [storageUsed, _setStorageUsed] = useState(2.4); // GB
	const [storageTotal] = useState(8.0); // GB

	const downloadedCourses = [
		{
			id: 1,
			title: "Sustainable Agriculture Basics",
			category: "Agriculture",
			size: "850 MB",
			downloadDate: "2 days ago",
			progress: 75,
			totalLessons: 12,
			completedLessons: 9,
			lastWatched: "Lesson 9: Composting Techniques",
			image:
				"https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
		},
		{
			id: 2,
			title: "Home Building Fundamentals",
			category: "Construction",
			size: "1.2 GB",
			downloadDate: "5 days ago",
			progress: 25,
			totalLessons: 24,
			completedLessons: 6,
			lastWatched: "Lesson 6: Foundation Basics",
			image: "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg",
		},
		{
			id: 3,
			title: "Water Conservation Methods",
			category: "Agriculture",
			size: "620 MB",
			downloadDate: "1 week ago",
			progress: 100,
			totalLessons: 10,
			completedLessons: 10,
			lastWatched: "Course Completed",
			image:
				"https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
		},
	];

	const queuedDownloads = [
		{
			id: 4,
			title: "Solar Panel Installation",
			category: "Green Energy",
			size: "1.5 GB",
			progress: 45,
			estimatedTime: "12 min remaining",
			image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg",
		},
		{
			id: 5,
			title: "Small Business Success",
			category: "Business",
			size: "980 MB",
			progress: 0,
			estimatedTime: "Waiting for WiFi",
			image:
				"https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg",
		},
	];

	const handleDeleteCourse = (courseId: number, courseTitle: string) => {
		Alert.alert(
			"Delete Course",
			`Remove "${courseTitle}" from your device? You can re-download it later.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => console.log("Delete course", courseId),
				},
			],
		);
	};

	const storagePercentage = (storageUsed / storageTotal) * 100;

	return (
		<View style={styles.container}>
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Storage Overview */}
				<View style={styles.storageContainer}>
					<View style={styles.storageHeader}>
						<HardDrive size={24} color="#2E8B57" strokeWidth={2} />
						<Text style={styles.storageTitle}>Storage Usage</Text>
						<TouchableOpacity style={styles.settingsButton}>
							<Settings size={20} color="#8B4513" strokeWidth={2} />
						</TouchableOpacity>
					</View>

					<View style={styles.storageBar}>
						<View
							style={[styles.storageUsed, { width: `${storagePercentage}%` }]}
						/>
					</View>

					<View style={styles.storageInfo}>
						<Text style={styles.storageText}>
							{storageUsed} GB used of {storageTotal} GB
						</Text>
						<Text style={styles.storageSubtext}>
							{downloadedCourses.length} courses downloaded
						</Text>
					</View>
				</View>

				{/* Connection Status */}
				<View style={styles.connectionStatus}>
					<View style={styles.connectionIndicator}>
						<WifiOff size={20} color="#DC143C" strokeWidth={2} />
						<Text style={styles.connectionText}>
							Offline Mode - Downloaded content available
						</Text>
					</View>
				</View>

				{/* Downloaded Courses */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Downloaded Courses</Text>
					{downloadedCourses.map((course) => (
						<View key={course.id} style={styles.courseCard}>
							<View style={styles.courseHeader}>
								<View style={styles.courseInfo}>
									<Text style={styles.courseTitle} numberOfLines={2}>
										{course.title}
									</Text>
									<Text style={styles.courseCategory}>{course.category}</Text>
									<Text style={styles.courseSize}>
										{course.size} • Downloaded {course.downloadDate}
									</Text>
								</View>

								<View style={styles.courseActions}>
									<TouchableOpacity
										style={styles.playButton}
										accessibilityLabel={`Play ${course.title}`}
									>
										<Play size={20} color="#FDF5E6" strokeWidth={2} />
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.deleteButton}
										onPress={() => handleDeleteCourse(course.id, course.title)}
										accessibilityLabel={`Delete ${course.title}`}
									>
										<Trash2 size={18} color="#DC143C" strokeWidth={2} />
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.progressSection}>
								<View style={styles.progressInfo}>
									<Text style={styles.progressText}>
										{course.completedLessons} of {course.totalLessons} lessons
										completed
									</Text>
									<Text style={styles.lastWatchedText}>
										Last: {course.lastWatched}
									</Text>
								</View>

								<View style={styles.progressBarContainer}>
									<View style={styles.progressBar}>
										<View
											style={[
												styles.progressFill,
												{ width: `${course.progress}%` },
											]}
										/>
									</View>
									<Text style={styles.progressPercentage}>
										{course.progress}%
									</Text>
								</View>
							</View>

							{course.progress === 100 && (
								<View style={styles.completedBadge}>
									<CheckCircle size={16} color="#32CD32" strokeWidth={2} />
									<Text style={styles.completedText}>Course Completed!</Text>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Download Queue */}
				<View style={styles.section}>
					<View style={styles.queueHeader}>
						<Text style={styles.sectionTitle}>Download Queue</Text>
						<TouchableOpacity style={styles.refreshButton}>
							<RefreshCw size={20} color="#2E8B57" strokeWidth={2} />
						</TouchableOpacity>
					</View>

					{queuedDownloads.map((download) => (
						<View key={download.id} style={styles.queueCard}>
							<View style={styles.queueInfo}>
								<Text style={styles.queueTitle} numberOfLines={1}>
									{download.title}
								</Text>
								<Text style={styles.queueCategory}>{download.category}</Text>
								<Text style={styles.queueSize}>{download.size}</Text>
							</View>

							<View style={styles.queueProgress}>
								{download.progress > 0 ? (
									<>
										<View style={styles.downloadProgressBar}>
											<View
												style={[
													styles.downloadProgressFill,
													{ width: `${download.progress}%` },
												]}
											/>
										</View>
										<Text style={styles.downloadProgressText}>
											{download.progress}% • {download.estimatedTime}
										</Text>
									</>
								) : (
									<View style={styles.waitingStatus}>
										<Clock size={16} color="#8B4513" strokeWidth={2} />
										<Text style={styles.waitingText}>
											{download.estimatedTime}
										</Text>
									</View>
								)}
							</View>
						</View>
					))}
				</View>

				{/* Download Settings */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Download Settings</Text>

					<View style={styles.settingCard}>
						<View style={styles.settingInfo}>
							<Text style={styles.settingTitle}>Auto-Download New Lessons</Text>
							<Text style={styles.settingDescription}>
								Automatically download new lessons when on WiFi
							</Text>
						</View>
						<View style={styles.settingToggle}>
							<View style={styles.toggleActive} />
						</View>
					</View>

					<View style={styles.settingCard}>
						<View style={styles.settingInfo}>
							<Text style={styles.settingTitle}>Download Quality</Text>
							<Text style={styles.settingDescription}>
								Standard quality (saves data and storage)
							</Text>
						</View>
						<TouchableOpacity style={styles.settingAction}>
							<Text style={styles.settingActionText}>Change</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.settingCard}>
						<View style={styles.settingInfo}>
							<Text style={styles.settingTitle}>WiFi Only Downloads</Text>
							<Text style={styles.settingDescription}>
								Only download when connected to WiFi
							</Text>
						</View>
						<View style={styles.settingToggle}>
							<View style={styles.toggleActive} />
						</View>
					</View>
				</View>

				{/* Storage Tips */}
				<View style={styles.tipsContainer}>
					<Text style={styles.tipsTitle}>💡 Storage Tips</Text>
					<View style={styles.tipItem}>
						<Text style={styles.tipText}>
							• Delete completed courses to free up space
						</Text>
					</View>
					<View style={styles.tipItem}>
						<Text style={styles.tipText}>
							• Download during WiFi hours to save mobile data
						</Text>
					</View>
					<View style={styles.tipItem}>
						<Text style={styles.tipText}>
							• Use standard quality for longer battery life
						</Text>
					</View>
				</View>
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
	storageContainer: {
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
	},
	storageHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	storageTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginLeft: 8,
		flex: 1,
	},
	settingsButton: {
		padding: 8,
		borderRadius: 6,
		backgroundColor: "#F5F5F5",
	},
	storageBar: {
		height: 8,
		backgroundColor: "#F0F0F0",
		borderRadius: 4,
		marginBottom: 12,
	},
	storageUsed: {
		height: "100%",
		backgroundColor: "#2E8B57",
		borderRadius: 4,
	},
	storageInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	storageText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	storageSubtext: {
		fontSize: 12,
		color: "#8B4513",
	},
	connectionStatus: {
		marginHorizontal: 20,
		marginBottom: 16,
	},
	connectionIndicator: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFE4E1",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderLeftWidth: 4,
		borderLeftColor: "#DC143C",
	},
	connectionText: {
		fontSize: 14,
		color: "#2F4F4F",
		fontWeight: "500",
		marginLeft: 8,
	},
	section: {
		marginHorizontal: 20,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 16,
	},
	queueHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	refreshButton: {
		padding: 8,
		borderRadius: 6,
		backgroundColor: "#E8F5E8",
	},
	courseCard: {
		backgroundColor: "#FFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	courseHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	courseInfo: {
		flex: 1,
		marginRight: 12,
	},
	courseTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	courseCategory: {
		fontSize: 14,
		color: "#2E8B57",
		fontWeight: "600",
		marginBottom: 4,
	},
	courseSize: {
		fontSize: 12,
		color: "#8B4513",
	},
	courseActions: {
		flexDirection: "row",
		gap: 8,
	},
	playButton: {
		backgroundColor: "#2E8B57",
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	deleteButton: {
		backgroundColor: "#FFE4E1",
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	progressSection: {
		marginBottom: 8,
	},
	progressInfo: {
		marginBottom: 8,
	},
	progressText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
		marginBottom: 2,
	},
	lastWatchedText: {
		fontSize: 12,
		color: "#8B4513",
	},
	progressBarContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	progressBar: {
		flex: 1,
		height: 6,
		backgroundColor: "#F0F0F0",
		borderRadius: 3,
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 3,
	},
	progressPercentage: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		minWidth: 35,
	},
	completedBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E8F5E8",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		alignSelf: "flex-start",
	},
	completedText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#32CD32",
		marginLeft: 4,
	},
	queueCard: {
		backgroundColor: "#FFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#FF8C42",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	queueInfo: {
		marginBottom: 12,
	},
	queueTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	queueCategory: {
		fontSize: 14,
		color: "#FF8C42",
		fontWeight: "600",
		marginBottom: 4,
	},
	queueSize: {
		fontSize: 12,
		color: "#8B4513",
	},
	queueProgress: {
		marginTop: 8,
	},
	downloadProgressBar: {
		height: 4,
		backgroundColor: "#F0F0F0",
		borderRadius: 2,
		marginBottom: 6,
	},
	downloadProgressFill: {
		height: "100%",
		backgroundColor: "#FF8C42",
		borderRadius: 2,
	},
	downloadProgressText: {
		fontSize: 12,
		color: "#8B4513",
		fontWeight: "500",
	},
	waitingStatus: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	waitingText: {
		fontSize: 12,
		color: "#8B4513",
		fontWeight: "500",
	},
	settingCard: {
		backgroundColor: "#FFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	settingInfo: {
		flex: 1,
		marginRight: 12,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2F4F4F",
		marginBottom: 4,
	},
	settingDescription: {
		fontSize: 14,
		color: "#8B4513",
		lineHeight: 20,
	},
	settingToggle: {
		width: 50,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#2E8B57",
		justifyContent: "center",
		alignItems: "flex-end",
		paddingHorizontal: 2,
	},
	toggleActive: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: "#FDF5E6",
	},
	settingAction: {
		backgroundColor: "#F0F8FF",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#87CEEB",
	},
	settingActionText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	tipsContainer: {
		backgroundColor: "#FFF9E6",
		marginHorizontal: 20,
		marginBottom: 40,
		padding: 20,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#DAA520",
	},
	tipsTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 12,
	},
	tipItem: {
		marginBottom: 8,
	},
	tipText: {
		fontSize: 14,
		color: "#8B4513",
		lineHeight: 20,
	},
});
