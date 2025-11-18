import React, { useState, useMemo } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	TextInput,
	RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
	useLearningStore,
	getLearningStats,
} from "@/src/store/learningStore";
import { useLanguage } from "@/hooks/useLanguage";
import {
	GraduationCap,
	Clock,
	Award,
	TrendingUp,
	BookOpen,
	Search,
	SlidersHorizontal,
	ChevronRight,
} from "lucide-react-native";
import { EnrolledCourseCard } from "@/src/components/learning/EnrolledCourseCard";
import { ContinueWatchingCard } from "@/src/components/learning/ContinueWatchingCard";
import {
	AchievementBadge,
	generateAchievements,
} from "@/src/components/learning/AchievementBadge";
import type { CourseWithStatus } from "@/src/types/learning";

type Tab = "all" | "in_progress" | "completed";
type SortOption = "recent" | "progress" | "alphabetical";

export function MyLearningScreen() {
	const { t } = useLanguage();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<Tab>("all");
	const [sortBy, setSortBy] = useState<SortOption>("recent");
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const getEnrolledCourses = useLearningStore(
		(state) => state.getEnrolledCourses
	);
	const getLessonsByCourse = useLearningStore(
		(state) => state.getLessonsByCourse
	);
	const getCourseById = useLearningStore((state) => state.getCourseById);
	const getLessonById = useLearningStore((state) => state.getLessonById);
	const lessonProgress = useLearningStore((state) => state.lessonProgress);
	const loadData = useLearningStore((state) => state.loadData);
	const isLoading = useLearningStore((state) => state.isLoading);

	const enrolledCourses = getEnrolledCourses();
	const stats = getLearningStats();

	// Calculate watch time in hours and minutes
	const watchHours = Math.floor(stats.totalWatchTime / 3600);
	const watchMinutes = Math.floor((stats.totalWatchTime % 3600) / 60);

	// Generate achievements
	const achievements = useMemo(
		() => generateAchievements(stats),
		[stats.completed, stats.totalWatchTime]
	);

	// Get continue watching lessons (recent incomplete lessons)
	const continueWatchingLessons = useMemo(() => {
		const recentProgress = [...lessonProgress]
			.filter((p) => !p.isCompleted && p.lastPosition > 0)
			.sort(
				(a, b) =>
					new Date(b.updatedAt || 0).getTime() -
					new Date(a.updatedAt || 0).getTime()
			)
			.slice(0, 10);

		return recentProgress
			.map((progress) => {
				const lesson = getLessonById(progress.lessonId);
				const course = getCourseById(progress.courseId);
				if (!lesson || !course) return null;

				return {
					...lesson,
					isCompleted: false,
					watchedSeconds: progress.watchedSeconds,
					totalSeconds: progress.totalSeconds,
					progress: Math.round(
						(progress.watchedSeconds / progress.totalSeconds) * 100
					),
					course,
				};
			})
			.filter((l) => l !== null);
	}, [lessonProgress]);

	// Filter and sort courses
	const filteredCourses = useMemo(() => {
		let filtered = enrolledCourses;

		// Filter by tab
		if (activeTab === "in_progress") {
			filtered = filtered.filter((c) => c.progress > 0 && c.progress < 100);
		} else if (activeTab === "completed") {
			filtered = filtered.filter((c) => c.progress === 100);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(query) ||
					c.instructor.name.toLowerCase().includes(query)
			);
		}

		// Sort
		const sorted = [...filtered].sort((a, b) => {
			if (sortBy === "recent") {
				const aTime = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 0;
				const bTime = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 0;
				return bTime - aTime;
			} else if (sortBy === "progress") {
				return (b.progress || 0) - (a.progress || 0);
			} else {
				// alphabetical
				return a.title.localeCompare(b.title);
			}
		});

		return sorted;
	}, [enrolledCourses, activeTab, searchQuery, sortBy]);

	// Pull to refresh
	const onRefresh = async () => {
		setRefreshing(true);
		await loadData();
		setRefreshing(false);
	};

	// Get next lesson for a course
	const getNextLessonForCourse = (courseId: string) => {
		const lessons = getLessonsByCourse(courseId);
		const nextLesson = lessons.find((l) => !l.isCompleted);
		return nextLesson;
	};

	if (isLoading && !refreshing) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>
					{t("learning.loadingJourney")}
				</Text>
			</View>
		);
	}

	// Empty state for new users
	if (enrolledCourses.length === 0) {
		return (
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.emptyContainer}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<GraduationCap size={80} color="#2E8B57" strokeWidth={1.5} />
				<Text style={styles.emptyTitle}>
					{t("learning.startYourJourney")}
				</Text>
				<Text style={styles.emptySubtitle}>
					{t("learning.emptySubtitle")}
				</Text>
				<TouchableOpacity
					style={styles.exploreButton}
					onPress={() => router.push("/learning/categories")}
				>
					<Text style={styles.exploreButtonText}>
						{t("learning.browseCourses")}
					</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}

	return (
		<ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					tintColor="#2E8B57"
				/>
			}
		>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{t("learning.myLearning")}</Text>
				<Text style={styles.headerSubtitle}>
					{t("learning.trackProgress")}
				</Text>
			</View>

			{/* Statistics Cards */}
			<View style={styles.statsContainer}>
				<View style={styles.statCard}>
					<BookOpen size={24} color="#2E8B57" />
					<Text style={styles.statNumber}>{stats.totalEnrolled}</Text>
					<Text style={styles.statLabel}>{t("learning.enrolled")}</Text>
				</View>
				<View style={styles.statCard}>
					<TrendingUp size={24} color="#FF8C42" />
					<Text style={styles.statNumber}>{stats.inProgress}</Text>
					<Text style={styles.statLabel}>{t("learning.inProgress")}</Text>
				</View>
				<View style={styles.statCard}>
					<Award size={24} color="#32CD32" />
					<Text style={styles.statNumber}>{stats.completed}</Text>
					<Text style={styles.statLabel}>{t("learning.completed")}</Text>
				</View>
				<View style={styles.statCard}>
					<Clock size={24} color="#87CEEB" />
					<Text style={styles.statNumber}>
						{watchHours}h {watchMinutes}m
					</Text>
					<Text style={styles.statLabel}>{t("learning.watchTime")}</Text>
				</View>
			</View>

			{/* Achievements Section */}
			{achievements.some((a) => a.isUnlocked) && (
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							{t("learning.achievements")}
						</Text>
						<TouchableOpacity>
							<ChevronRight size={20} color="#2E8B57" />
						</TouchableOpacity>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.achievementsContainer}
					>
						{achievements.map((achievement) => (
							<AchievementBadge
								key={achievement.id}
								achievement={achievement}
								size="medium"
							/>
						))}
					</ScrollView>
				</View>
			)}

			{/* Continue Watching Section */}
			{continueWatchingLessons.length > 0 && (
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							{t("learning.continueWatching")}
						</Text>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.continueWatchingContainer}
					>
						{continueWatchingLessons.map((lesson) => (
							<ContinueWatchingCard
								key={lesson.id}
								lesson={lesson}
								courseTitle={lesson.course.title}
								courseThumbnail={lesson.course.thumbnail}
								onPress={() => router.push(`/learning/lesson/${lesson.id}`)}
							/>
						))}
					</ScrollView>
				</View>
			)}

			{/* Search and Filters */}
			<View style={styles.searchSection}>
				<View style={styles.searchBar}>
					<Search size={20} color="#8B4513" />
					<TextInput
						style={styles.searchInput}
						placeholder={t("learning.searchCourses")}
						placeholderTextColor="#8B4513"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
				<TouchableOpacity
					style={styles.filterButton}
					onPress={() => setShowFilters(!showFilters)}
				>
					<SlidersHorizontal size={20} color="#2E8B57" />
				</TouchableOpacity>
			</View>

			{/* Filters Panel */}
			{showFilters && (
				<View style={styles.filtersPanel}>
					<Text style={styles.filterLabel}>{t("learning.sortBy")}</Text>
					<View style={styles.sortOptions}>
						<TouchableOpacity
							style={[
								styles.sortOption,
								sortBy === "recent" && styles.sortOptionActive,
							]}
							onPress={() => setSortBy("recent")}
						>
							<Text
								style={[
									styles.sortOptionText,
									sortBy === "recent" && styles.sortOptionTextActive,
								]}
							>
								{t("learning.recentlyAccessed")}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.sortOption,
								sortBy === "progress" && styles.sortOptionActive,
							]}
							onPress={() => setSortBy("progress")}
						>
							<Text
								style={[
									styles.sortOptionText,
									sortBy === "progress" && styles.sortOptionTextActive,
								]}
							>
								{t("learning.byProgress")}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.sortOption,
								sortBy === "alphabetical" && styles.sortOptionActive,
							]}
							onPress={() => setSortBy("alphabetical")}
						>
							<Text
								style={[
									styles.sortOptionText,
									sortBy === "alphabetical" && styles.sortOptionTextActive,
								]}
							>
								{t("learning.alphabetical")}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Tab Navigation */}
			<View style={styles.tabsContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === "all" && styles.tabActive]}
					onPress={() => setActiveTab("all")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "all" && styles.tabTextActive,
						]}
					>
						{t("learning.all")} ({enrolledCourses.length})
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						activeTab === "in_progress" && styles.tabActive,
					]}
					onPress={() => setActiveTab("in_progress")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "in_progress" && styles.tabTextActive,
						]}
					>
						{t("learning.inProgress")} ({stats.inProgress})
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === "completed" && styles.tabActive]}
					onPress={() => setActiveTab("completed")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "completed" && styles.tabTextActive,
						]}
					>
						{t("learning.completed")} ({stats.completed})
					</Text>
				</TouchableOpacity>
			</View>

			{/* Courses List */}
			<View style={styles.coursesSection}>
				{filteredCourses.length === 0 ? (
					<View style={styles.emptySearchContainer}>
						<Text style={styles.emptySearchText}>
							{searchQuery
								? t("learning.noSearchResults")
								: t("learning.noCoursesInTab")}
						</Text>
					</View>
				) : (
					<FlatList
						data={filteredCourses}
						keyExtractor={(item) => item.id}
						scrollEnabled={false}
						renderItem={({ item }) => {
							const nextLesson = getNextLessonForCourse(item.id);
							return (
								<EnrolledCourseCard
									course={item}
									onPress={() => router.push(`/learning/courses/${item.id}`)}
									onContinue={() => {
										if (nextLesson) {
											router.push(`/learning/lesson/${nextLesson.id}`);
										} else {
											router.push(`/learning/courses/${item.id}`);
										}
									}}
									nextLessonTitle={nextLesson?.title}
									showNextLesson={true}
								/>
							);
						}}
					/>
				)}
			</View>

			{/* Browse More Courses Button */}
			<View style={styles.browseSection}>
				<TouchableOpacity
					style={styles.browseButton}
					onPress={() => router.push("/learning/categories")}
				>
					<BookOpen size={20} color="#2E8B57" />
					<Text style={styles.browseButtonText}>
						{t("learning.browseMoreCourses")}
					</Text>
				</TouchableOpacity>
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
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	achievementsContainer: {
		paddingHorizontal: 20,
	},
	continueWatchingContainer: {
		paddingHorizontal: 20,
	},
	searchSection: {
		flexDirection: "row",
		paddingHorizontal: 20,
		marginBottom: 16,
		gap: 12,
	},
	searchBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 12,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	searchInput: {
		flex: 1,
		fontSize: 15,
		color: "#2F4F4F",
	},
	filterButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 12,
		justifyContent: "center",
		alignItems: "center",
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	filtersPanel: {
		backgroundColor: "#FFFFFF",
		marginHorizontal: 20,
		marginBottom: 16,
		padding: 16,
		borderRadius: 12,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	filterLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2F4F4F",
		marginBottom: 12,
	},
	sortOptions: {
		flexDirection: "row",
		gap: 8,
		flexWrap: "wrap",
	},
	sortOption: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#FDF5E6",
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	sortOptionActive: {
		backgroundColor: "#2E8B57",
		borderColor: "#2E8B57",
	},
	sortOptionText: {
		fontSize: 13,
		color: "#2F4F4F",
		fontWeight: "500",
	},
	sortOptionTextActive: {
		color: "#FDF5E6",
	},
	tabsContainer: {
		flexDirection: "row",
		paddingHorizontal: 20,
		marginBottom: 16,
		gap: 8,
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#E5E5E5",
	},
	tabActive: {
		backgroundColor: "#2E8B57",
		borderColor: "#2E8B57",
	},
	tabText: {
		fontSize: 13,
		fontWeight: "600",
		color: "#8B4513",
	},
	tabTextActive: {
		color: "#FDF5E6",
	},
	coursesSection: {
		paddingHorizontal: 20,
		marginBottom: 24,
	},
	emptySearchContainer: {
		paddingVertical: 40,
		alignItems: "center",
	},
	emptySearchText: {
		fontSize: 15,
		color: "#8B4513",
		textAlign: "center",
	},
	browseSection: {
		paddingHorizontal: 20,
		paddingBottom: 32,
	},
	browseButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#2E8B57",
		gap: 12,
	},
	browseButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2E8B57",
	},
});
