import React, { useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useLearningStore, getLearningStats } from "@/src/store/learningStore";
import { GraduationCap, Clock, Award, TrendingUp, BookOpen } from "lucide-react-native";

export function MyLearningScreen() {
	const router = useRouter();
	const getEnrolledCourses = useLearningStore((state) => state.getEnrolledCourses);
	const isLoading = useLearningStore((state) => state.isLoading);

	const enrolledCourses = getEnrolledCourses();
	const stats = getLearningStats();

	// Calculate watch time in hours and minutes
	const watchHours = Math.floor(stats.totalWatchTime / 3600);
	const watchMinutes = Math.floor((stats.totalWatchTime % 3600) / 60);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Loading your learning journey...</Text>
			</View>
		);
	}

	// Empty state for new users
	if (enrolledCourses.length === 0) {
		return (
			<ScrollView style={styles.container} contentContainerStyle={styles.emptyContainer}>
				<GraduationCap size={80} color="#2E8B57" strokeWidth={1.5} />
				<Text style={styles.emptyTitle}>Start Your Learning Journey</Text>
				<Text style={styles.emptySubtitle}>
					Explore our courses and enroll to begin building your skills
				</Text>
				<TouchableOpacity
					style={styles.exploreButton}
					onPress={() => router.push("/learning/categories")}
				>
					<Text style={styles.exploreButtonText}>Browse Courses</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Learning</Text>
				<Text style={styles.headerSubtitle}>Track your progress and continue learning</Text>
			</View>

			{/* Statistics Cards */}
			<View style={styles.statsContainer}>
				<View style={styles.statCard}>
					<BookOpen size={24} color="#2E8B57" />
					<Text style={styles.statNumber}>{stats.totalEnrolled}</Text>
					<Text style={styles.statLabel}>Enrolled</Text>
				</View>
				<View style={styles.statCard}>
					<TrendingUp size={24} color="#FF8C42" />
					<Text style={styles.statNumber}>{stats.inProgress}</Text>
					<Text style={styles.statLabel}>In Progress</Text>
				</View>
				<View style={styles.statCard}>
					<Award size={24} color="#32CD32" />
					<Text style={styles.statNumber}>{stats.completed}</Text>
					<Text style={styles.statLabel}>Completed</Text>
				</View>
				<View style={styles.statCard}>
					<Clock size={24} color="#87CEEB" />
					<Text style={styles.statNumber}>
						{watchHours}h {watchMinutes}m
					</Text>
					<Text style={styles.statLabel}>Watch Time</Text>
				</View>
			</View>

			{/* Quick Actions */}
			<View style={styles.section}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => router.push("/learning/categories")}
				>
					<BookOpen size={20} color="#2E8B57" />
					<Text style={styles.actionButtonText}>Browse More Courses</Text>
				</TouchableOpacity>
			</View>

			{/* Enrolled Courses */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>My Courses</Text>
					<Text style={styles.sectionCount}>{enrolledCourses.length}</Text>
				</View>

				<FlatList
					data={enrolledCourses}
					keyExtractor={(item) => item.id}
					horizontal={false}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.courseCard}
							onPress={() => router.push(`/learning/courses/${item.id}`)}
						>
							<Image
								source={{ uri: item.thumbnail }}
								style={styles.courseThumbnail}
								resizeMode="cover"
							/>
							<View style={styles.courseInfo}>
								<Text style={styles.courseTitle} numberOfLines={2}>
									{item.title}
								</Text>
								<Text style={styles.courseInstructor} numberOfLines={1}>
									{item.instructor.name}
								</Text>
								<View style={styles.progressContainer}>
									<View style={styles.progressBar}>
										<View
											style={[
												styles.progressFill,
												{ width: `${item.progress || 0}%` },
											]}
										/>
									</View>
									<Text style={styles.progressText}>{item.progress || 0}%</Text>
								</View>
								<TouchableOpacity
									style={styles.continueButton}
									onPress={() => router.push(`/learning/courses/${item.id}`)}
								>
									<Text style={styles.continueButtonText}>
										{item.progress === 100 ? "Review" : "Continue Learning"}
									</Text>
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDF5E6",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FDF5E6",
	},
	loadingText: {
		fontSize: 16,
		color: "#2F4F4F",
		marginTop: 16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginTop: 24,
		textAlign: "center",
	},
	emptySubtitle: {
		fontSize: 16,
		color: "#8B4513",
		marginTop: 12,
		textAlign: "center",
		lineHeight: 24,
	},
	exploreButton: {
		marginTop: 32,
		backgroundColor: "#2E8B57",
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	exploreButtonText: {
		color: "#FDF5E6",
		fontSize: 16,
		fontWeight: "600",
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 24,
		backgroundColor: "#2E8B57",
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#FDF5E6",
	},
	headerSubtitle: {
		fontSize: 14,
		color: "#FDF5E6",
		marginTop: 4,
		opacity: 0.9,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 24,
		gap: 12,
	},
	statCard: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		paddingVertical: 16,
		paddingHorizontal: 8,
		borderRadius: 12,
		alignItems: "center",
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	statNumber: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginTop: 8,
	},
	statLabel: {
		fontSize: 11,
		color: "#8B4513",
		marginTop: 4,
		textAlign: "center",
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	sectionCount: {
		fontSize: 16,
		color: "#8B4513",
		fontWeight: "600",
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#2E8B57",
		gap: 12,
	},
	actionButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2E8B57",
	},
	courseCard: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	courseThumbnail: {
		width: 120,
		height: 140,
		backgroundColor: "#E5E5E5",
	},
	courseInfo: {
		flex: 1,
		padding: 12,
		justifyContent: "space-between",
	},
	courseTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 22,
	},
	courseInstructor: {
		fontSize: 13,
		color: "#8B4513",
		marginTop: 4,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 8,
	},
	progressBar: {
		flex: 1,
		height: 6,
		backgroundColor: "#E5E5E5",
		borderRadius: 3,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 3,
	},
	progressText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		width: 40,
		textAlign: "right",
	},
	continueButton: {
		marginTop: 8,
		backgroundColor: "#2E8B57",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignSelf: "flex-start",
	},
	continueButtonText: {
		color: "#FDF5E6",
		fontSize: 13,
		fontWeight: "600",
	},
});
