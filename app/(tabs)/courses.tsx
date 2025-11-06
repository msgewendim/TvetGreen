import {
	CircleCheck as CheckCircle,
	ChevronRight,
	Clock,
	Download,
	Play,
	Star,
	Users,
} from "lucide-react-native";
import { useState } from "react";
import {
	Dimensions,
	FlatList,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { usePlayer } from "@/src/providers/player/PlayerProvider";
import type { Video } from "@/api/videos";
import {
	colors,
	EmptyState,
	Header,
	LoadingSpinner,
	spacing,
	typography,
	VoiceButton,
} from "@/design-system";
import { useVideos } from "@/hooks/useVideos";

const { width } = Dimensions.get("window");

export default function CoursesScreen() {
	const [isListening, setIsListening] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const { data: videosData, isLoading, error } = useVideos();
  const player = usePlayer()

	const toggleVoiceGuide = () => {
		setIsListening(!isListening);
		// Voice recognition would be implemented here
	};

	const categories = [
		{
			id: "agriculture",
			title: "Agriculture",
			emoji: "🌾",
			color: "#2E8B57",
			courseCount: 5,
			description: "Sustainable farming & crop management",
			image:
				"https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
		},
		{
			id: "energy",
			title: "Green Energy",
			emoji: "🔆",
			color: "#FF8C42",
			courseCount: 3,
			description: "Solar power & renewable energy",
			image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg",
		},
		{
			id: "construction",
			title: "Construction",
			emoji: "🔨",
			color: "#DAA520",
			courseCount: 4,
			description: "Building skills & techniques",
			image: "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg",
		},
		{
			id: "business",
			title: "Business",
			emoji: "💼",
			color: "#87CEEB",
			courseCount: 6,
			description: "Entrepreneurship & market skills",
			image:
				"https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg",
		},
	];

	// Map video API data to course format
	const courses =
		videosData?.map((video: Video, index: number) => ({
			id: video.id || index.toString(),
			title: video.title,
			category: "all", // API doesn't have category, default to "all"
			instructor: video.author || "Unknown Instructor",
			duration: video.duration,
			lessons: 1,
			difficulty: "All Levels",
			rating: 4.5,
			enrolled: Number.parseInt(video.views.replace(/[^0-9]/g, "")) || 0,
			progress: 0,
			isDownloaded: false,
			isFree: true,
			image: video.thumbnailUrl,
			description: video.description || video.title,
			videoUrl: video.videoUrl,
		})) || [];

	const filteredCourses =
		selectedCategory === "all"
			? courses
			: courses.filter((course) => course.category === selectedCategory);

	const renderCategoryCard = ({
		item: category,
	}: {
		item: (typeof categories)[0];
	}) => (
		<TouchableOpacity
			style={styles.categoryCard}
			delayPressIn={80}
			activeOpacity={0.85}
			pressRetentionOffset={{ top: 8, left: 8, right: 8, bottom: 8 }}
			onPress={() => setSelectedCategory(category.id)}
			accessibilityLabel={`${category.title} category with ${category.courseCount} courses`}
		>
			<ImageBackground
				source={{ uri: category.image }}
				style={styles.categoryBackground}
				imageStyle={styles.categoryBackgroundImage}
			>
				<View
					style={[
						styles.categoryOverlay,
						{ backgroundColor: `${category.color}95` },
					]}
				>
					<Text style={styles.categoryEmoji}>{category.emoji}</Text>
					<Text style={styles.categoryTitle}>{category.title}</Text>
					<Text style={styles.categoryDescription}>{category.description}</Text>
					<Text style={styles.categoryCount}>
						{category.courseCount} courses • Free
					</Text>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);

	const renderCourseCard = ({
		item: course,
	}: {
		item: (typeof courses)[0];
	}) => (
		<TouchableOpacity
			style={styles.courseCard}
			delayPressIn={80}
			activeOpacity={0.9}
			pressRetentionOffset={{ top: 8, left: 8, right: 8, bottom: 8 }}
			onPress={() => player.open({
				id: String(course.id),
				title: course.title,
				thumbnailUrl: course.image,
				duration: course.duration,
				uploadTime: '',
				views: String(course.enrolled),
				author: course.instructor,
				videoUrl: course.videoUrl || '',
				description: course.description,
				subscriber: '',
				isLive: false,
			})}
			accessibilityLabel={`Course: ${course.title}`}
		>
			<ImageBackground
				source={{ uri: course.image }}
				style={styles.courseImage}
				imageStyle={styles.courseImageStyle}
			>
				<View style={styles.courseImageOverlay}>
					{course.progress > 0 ? (
						<View style={styles.progressIndicator}>
							<CheckCircle size={20} color="#32CD32" strokeWidth={2} />
							<Text style={styles.progressText}>{course.progress}%</Text>
						</View>
					) : (
						<View style={styles.playButton}>
							<Play size={16} color="#FDF5E6" strokeWidth={2} />
						</View>
					)}
				</View>
			</ImageBackground>

			<View style={styles.courseInfo}>
				<View style={styles.courseHeader}>
					<Text style={styles.courseTitle} numberOfLines={2}>
						{course.title}
					</Text>
					<View style={styles.courseActions}>
						{course.isDownloaded ? (
							<View style={styles.downloadedBadge}>
								<Download size={16} color="#32CD32" strokeWidth={2} />
							</View>
						) : (
							<TouchableOpacity style={styles.downloadButton}>
								<Download size={16} color="#8B4513" strokeWidth={2} />
							</TouchableOpacity>
						)}
					</View>
				</View>

				<Text style={styles.instructorName}>by {course.instructor}</Text>

				<View style={styles.courseMetrics}>
					<View style={styles.metricItem}>
						<Clock size={14} color="#8B4513" strokeWidth={2} />
						<Text style={styles.metricText}>{course.duration}</Text>
					</View>
					<View style={styles.metricItem}>
						<Users size={14} color="#8B4513" strokeWidth={2} />
						<Text style={styles.metricText}>
							{course.enrolled.toLocaleString()}
						</Text>
					</View>
					<View style={styles.metricItem}>
						<Star size={14} color="#DAA520" strokeWidth={2} />
						<Text style={styles.metricText}>{course.rating}</Text>
					</View>
				</View>

				<Text style={styles.courseDescription} numberOfLines={2}>
					{course.description}
				</Text>

				<View style={styles.courseFooter}>
					<View style={styles.difficultyBadge}>
						<Text style={styles.difficultyText}>{course.difficulty}</Text>
					</View>
					<Text style={styles.lessonCount}>{course.lessons} lessons</Text>
				</View>

				{course.progress > 0 && (
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View
								style={[styles.progressFill, { width: `${course.progress}%` }]}
							/>
						</View>
						<TouchableOpacity style={styles.continueButton}>
							<Text style={styles.continueButtonText}>Continue Learning</Text>
							<ChevronRight size={16} color="#FDF5E6" strokeWidth={2} />
						</TouchableOpacity>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{/* <Header title="Course Library" subtitle="Learn practical skills for life" /> */}
			{/* Voice Instructions */}
			{isListening && (
				<View style={styles.voiceInstructions}>
					<Text style={styles.voiceText}>
						🎤 Say "Browse Agriculture" or "Show all courses"
					</Text>
				</View>
			)}

			{isLoading ? (
				<View style={styles.centerContainer}>
					<LoadingSpinner size="large" />
					<Text style={styles.loadingText}>Loading courses...</Text>
				</View>
			) : error ? (
				<View style={styles.centerContainer}>
					<EmptyState
						icon={<Star size={48} color={colors.text.tertiary} />}
						title="Unable to Load Courses"
						description="Please check your connection and try again"
					/>
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.content}
					keyboardShouldPersistTaps="handled"
					nestedScrollEnabled
					scrollEventThrottle={16}
				>
					{/* Category Filter Buttons */}
					<View style={styles.categoryFilters}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={styles.filterScroll}
						>
							<TouchableOpacity
								style={[
									styles.filterButton,
									selectedCategory === "all" && styles.filterButtonActive,
								]}
								onPress={() => setSelectedCategory("all")}
							>
								<Text
									style={[
										styles.filterButtonText,
										selectedCategory === "all" && styles.filterButtonTextActive,
									]}
								>
									All Courses
								</Text>
							</TouchableOpacity>
							{categories.map((category) => (
								<TouchableOpacity
									key={category.id}
									style={[
										styles.filterButton,
										selectedCategory === category.id &&
											styles.filterButtonActive,
									]}
									onPress={() => setSelectedCategory(category.id)}
								>
									<Text style={styles.filterEmoji}>{category.emoji}</Text>
									<Text
										style={[
											styles.filterButtonText,
											selectedCategory === category.id &&
												styles.filterButtonTextActive,
										]}
									>
										{category.title}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Category Cards (shown when all selected) */}
					{selectedCategory === "all" && (
						<View style={styles.categoriesSection}>
							<Text style={styles.sectionTitle}>Browse by Category</Text>
							<FlatList
								data={categories}
								renderItem={renderCategoryCard}
								keyExtractor={(item) => item.id}
								numColumns={2}
								columnWrapperStyle={styles.categoryRow}
								scrollEnabled={false}
							/>
						</View>
					)}

					{/* Courses Section */}
					<View style={styles.coursesSection}>
						<Text style={styles.sectionTitle}>
							{selectedCategory === "all"
								? "All Courses"
								: `${
										categories.find((c) => c.id === selectedCategory)?.title
									} Courses`}
						</Text>
						<Text style={styles.sectionSubtitle}>
							{filteredCourses.length} courses available
						</Text>

						<FlatList
							data={filteredCourses}
							renderItem={renderCourseCard}
							keyExtractor={(item) => item.id.toString()}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
	},
	loadingText: {
		marginTop: spacing.md,
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
		paddingTop: 60,
		paddingBottom: spacing.lg,
		backgroundColor: colors.primary.main,
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
	categoryFilters: {
		paddingVertical: 16,
	},
	filterScroll: {
		paddingHorizontal: 20,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		marginRight: 12,
		borderWidth: 2,
		borderColor: "transparent",
		minHeight: 44,
	},
	filterButtonActive: {
		backgroundColor: "#2E8B57",
		borderColor: "#2E8B57",
	},
	filterEmoji: {
		fontSize: 16,
		marginRight: 6,
	},
	filterButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
	},
	filterButtonTextActive: {
		color: "#FDF5E6",
	},
	categoriesSection: {
		paddingHorizontal: 20,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginBottom: 8,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 16,
	},
	categoryRow: {
		justifyContent: "space-between",
		marginBottom: 12,
	},
	categoryCard: {
		width: (width - 52) / 2,
		height: 140,
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	categoryBackground: {
		flex: 1,
		justifyContent: "flex-end",
	},
	categoryBackgroundImage: {
		borderRadius: 12,
	},
	categoryOverlay: {
		padding: 16,
		borderRadius: 12,
	},
	categoryEmoji: {
		fontSize: 24,
		marginBottom: 8,
	},
	categoryTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#FDF5E6",
		marginBottom: 4,
	},
	categoryDescription: {
		fontSize: 12,
		color: "#FDF5E6",
		opacity: 0.9,
		marginBottom: 4,
	},
	categoryCount: {
		fontSize: 12,
		color: "#FDF5E6",
		fontWeight: "500",
	},
	coursesSection: {
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	courseCard: {
		backgroundColor: "#FFF",
		borderRadius: 12,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		overflow: "hidden",
	},
	courseImage: {
		height: 120,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		padding: 12,
	},
	courseImageStyle: {
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	courseImageOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(46, 139, 87, 0.3)",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	progressIndicator: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		position: "absolute",
		top: 12,
		right: 12,
	},
	progressText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#2F4F4F",
		marginLeft: 4,
	},
	playButton: {
		backgroundColor: "rgba(255, 140, 66, 0.9)",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 12,
		right: 12,
	},
	courseInfo: {
		padding: 16,
	},
	courseHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	courseTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2F4F4F",
		flex: 1,
		marginRight: 8,
	},
	courseActions: {
		flexDirection: "row",
		gap: 8,
	},
	downloadedBadge: {
		padding: 6,
		borderRadius: 6,
		backgroundColor: "#E8F5E8",
	},
	downloadButton: {
		padding: 6,
		borderRadius: 6,
		backgroundColor: "#F5F5F5",
	},
	instructorName: {
		fontSize: 14,
		color: "#8B4513",
		marginBottom: 8,
	},
	courseMetrics: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
		marginBottom: 8,
	},
	metricItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	metricText: {
		fontSize: 12,
		color: "#8B4513",
		fontWeight: "500",
	},
	courseDescription: {
		fontSize: 14,
		color: "#2F4F4F",
		lineHeight: 20,
		marginBottom: 12,
	},
	courseFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	difficultyBadge: {
		backgroundColor: "#F0F8FF",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#87CEEB",
	},
	difficultyText: {
		fontSize: 12,
		color: "#2F4F4F",
		fontWeight: "500",
	},
	lessonCount: {
		fontSize: 12,
		color: "#8B4513",
		fontWeight: "500",
	},
	progressContainer: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
	},
	progressBar: {
		height: 4,
		backgroundColor: "#F0F0F0",
		borderRadius: 2,
		marginBottom: 8,
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 2,
	},
	continueButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#2E8B57",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		alignSelf: "flex-start",
	},
	continueButtonText: {
		color: "#FDF5E6",
		fontSize: 14,
		fontWeight: "600",
		marginRight: 4,
	},
});
