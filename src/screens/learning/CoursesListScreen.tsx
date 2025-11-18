import React, { useState, useMemo } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	TextInput,
	Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import { Search, X, Filter, ChevronRight } from "lucide-react-native";
import type { CourseFilter, CourseSortOption } from "@/src/types/learning";

export function CoursesListScreen() {
	const router = useRouter();
	const courses = useLearningStore((state) => state.courses);
	const selectedCategory = useLearningStore((state) => state.selectedCategory);
	const getCategoryById = useLearningStore((state) => state.getCategoryById);
	const isEnrolled = useLearningStore((state) => state.isEnrolled);
	const getCourseProgress = useLearningStore((state) => state.getCourseProgress);
	const isLoading = useLearningStore((state) => state.isLoading);

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<CourseFilter>("all");
	const [sortBy, setSortBy] = useState<CourseSortOption>("newest");

	// Get category name if filtered
	const category = selectedCategory ? getCategoryById(selectedCategory) : null;

	// Filter and sort courses
	const filteredCourses = useMemo(() => {
		let result = [...courses];

		// Filter by category
		if (selectedCategory) {
			result = result.filter((c) => c.categoryId === selectedCategory);
		}

		// Filter by enrollment status
		if (filter === "enrolled") {
			result = result.filter((c) => isEnrolled(c.id));
		} else if (filter === "completed") {
			result = result.filter(
				(c) => isEnrolled(c.id) && getCourseProgress(c.id) === 100
			);
		}

		// Search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(c) =>
					c.title.toLowerCase().includes(query) ||
					c.description.toLowerCase().includes(query) ||
					c.instructor.name.toLowerCase().includes(query) ||
					c.tags?.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Sort
		if (sortBy === "newest") {
			result.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		} else if (sortBy === "popular") {
			result.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
		} else if (sortBy === "alphabetical") {
			result.sort((a, b) => a.title.localeCompare(b.title));
		}

		return result;
	}, [
		courses,
		selectedCategory,
		filter,
		searchQuery,
		sortBy,
		isEnrolled,
		getCourseProgress,
	]);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Loading courses...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>
					{category ? category.name : "All Courses"}
				</Text>
				<Text style={styles.headerSubtitle}>
					{filteredCourses.length}{" "}
					{filteredCourses.length === 1 ? "course" : "courses"} available
				</Text>
			</View>

			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<View style={styles.searchInputContainer}>
					<Search size={20} color="#8B4513" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search courses..."
						placeholderTextColor="#8B4513"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity onPress={() => setSearchQuery("")}>
							<X size={20} color="#8B4513" />
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Filter and Sort */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.filtersContainer}
				contentContainerStyle={styles.filtersContent}
			>
				<TouchableOpacity
					style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
					onPress={() => setFilter("all")}
				>
					<Text
						style={[
							styles.filterChipText,
							filter === "all" && styles.filterChipTextActive,
						]}
					>
						All
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterChip,
						filter === "enrolled" && styles.filterChipActive,
					]}
					onPress={() => setFilter("enrolled")}
				>
					<Text
						style={[
							styles.filterChipText,
							filter === "enrolled" && styles.filterChipTextActive,
						]}
					>
						Enrolled
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterChip,
						filter === "completed" && styles.filterChipActive,
					]}
					onPress={() => setFilter("completed")}
				>
					<Text
						style={[
							styles.filterChipText,
							filter === "completed" && styles.filterChipTextActive,
						]}
					>
						Completed
					</Text>
				</TouchableOpacity>

				<View style={styles.divider} />

				<TouchableOpacity
					style={[styles.filterChip, sortBy === "newest" && styles.filterChipActive]}
					onPress={() => setSortBy("newest")}
				>
					<Text
						style={[
							styles.filterChipText,
							sortBy === "newest" && styles.filterChipTextActive,
						]}
					>
						Newest
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterChip,
						sortBy === "popular" && styles.filterChipActive,
					]}
					onPress={() => setSortBy("popular")}
				>
					<Text
						style={[
							styles.filterChipText,
							sortBy === "popular" && styles.filterChipTextActive,
						]}
					>
						Popular
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterChip,
						sortBy === "alphabetical" && styles.filterChipActive,
					]}
					onPress={() => setSortBy("alphabetical")}
				>
					<Text
						style={[
							styles.filterChipText,
							sortBy === "alphabetical" && styles.filterChipTextActive,
						]}
					>
						A-Z
					</Text>
				</TouchableOpacity>
			</ScrollView>

			{/* Course List */}
			{filteredCourses.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Filter size={60} color="#8B4513" strokeWidth={1.5} />
					<Text style={styles.emptyTitle}>No courses found</Text>
					<Text style={styles.emptySubtitle}>
						Try adjusting your filters or search query
					</Text>
				</View>
			) : (
				<FlatList
					data={filteredCourses}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					renderItem={({ item }) => {
						const enrolled = isEnrolled(item.id);
						const progress = enrolled ? getCourseProgress(item.id) : 0;

						return (
							<TouchableOpacity
								style={styles.courseCard}
								onPress={() => router.push(`/learning/courses/${item.id}`)}
								activeOpacity={0.8}
							>
								<Image
									source={{ uri: item.thumbnail }}
									style={styles.courseThumbnail}
									resizeMode="cover"
								/>
								<View style={styles.courseInfo}>
									<View style={styles.courseHeader}>
										<View style={styles.levelBadge}>
											<Text style={styles.levelText}>
												{item.level.toUpperCase()}
											</Text>
										</View>
										{enrolled && (
											<View style={styles.enrolledBadge}>
												<Text style={styles.enrolledText}>ENROLLED</Text>
											</View>
										)}
									</View>
									<Text style={styles.courseTitle} numberOfLines={2}>
										{item.title}
									</Text>
									<Text style={styles.courseInstructor} numberOfLines={1}>
										{item.instructor.name}
									</Text>
									<View style={styles.courseMeta}>
										<Text style={styles.metaText}>
											{item.lessonCount} lessons • {item.duration}
										</Text>
										{item.rating && (
											<Text style={styles.ratingText}>⭐ {item.rating}</Text>
										)}
									</View>
									{enrolled && progress > 0 && (
										<View style={styles.progressContainer}>
											<View style={styles.progressBar}>
												<View
													style={[styles.progressFill, { width: `${progress}%` }]}
												/>
											</View>
											<Text style={styles.progressText}>{progress}%</Text>
										</View>
									)}
								</View>
								<ChevronRight size={24} color="#2E8B57" />
							</TouchableOpacity>
						);
					}}
				/>
			)}
		</View>
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
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 16,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	headerSubtitle: {
		fontSize: 14,
		color: "#8B4513",
		marginTop: 4,
	},
	searchContainer: {
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	searchInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#2F4F4F",
	},
	filtersContainer: {
		maxHeight: 50,
		marginBottom: 16,
	},
	filtersContent: {
		paddingHorizontal: 20,
		gap: 8,
	},
	filterChip: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	filterChipActive: {
		backgroundColor: "#2E8B57",
		borderColor: "#2E8B57",
	},
	filterChipText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#2F4F4F",
	},
	filterChipTextActive: {
		color: "#FDF5E6",
	},
	divider: {
		width: 1,
		backgroundColor: "#E5E5E5",
		marginHorizontal: 8,
	},
	listContent: {
		paddingHorizontal: 20,
		paddingBottom: 20,
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
		padding: 12,
		gap: 12,
		alignItems: "center",
	},
	courseThumbnail: {
		width: 100,
		height: 120,
		borderRadius: 8,
		backgroundColor: "#E5E5E5",
	},
	courseInfo: {
		flex: 1,
	},
	courseHeader: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 8,
	},
	levelBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		backgroundColor: "#87CEEB20",
	},
	levelText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#87CEEB",
	},
	enrolledBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		backgroundColor: "#32CD3220",
	},
	enrolledText: {
		fontSize: 10,
		fontWeight: "700",
		color: "#32CD32",
	},
	courseTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2F4F4F",
		lineHeight: 22,
		marginBottom: 4,
	},
	courseInstructor: {
		fontSize: 13,
		color: "#8B4513",
		marginBottom: 6,
	},
	courseMeta: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	metaText: {
		fontSize: 12,
		color: "#8B4513",
	},
	ratingText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#DAA520",
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 8,
	},
	progressBar: {
		flex: 1,
		height: 4,
		backgroundColor: "#E5E5E5",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#32CD32",
		borderRadius: 2,
	},
	progressText: {
		fontSize: 11,
		fontWeight: "600",
		color: "#2F4F4F",
		width: 35,
		textAlign: "right",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2F4F4F",
		marginTop: 16,
	},
	emptySubtitle: {
		fontSize: 14,
		color: "#8B4513",
		marginTop: 8,
		textAlign: "center",
	},
});
