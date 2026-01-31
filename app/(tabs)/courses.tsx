import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { Star } from "lucide-react-native";
import { useRouter } from "expo-router";
import {
	colors,
	commonStyles,
	EmptyState,
	Header,
	LoadingSpinner,
	ModernCourseCard,
	CategoryChip,
	ScreenLayout,
	SearchInput,
	spacing,
	typography,
} from "@/design-system";
import { useLearningStore } from "@/src/store/learningStore";
import type { Course } from "@/src/types/learning";
import { useLanguage } from "@/src/hooks/useLanguage";

export default function CoursesScreen() {
	const { t } = useLanguage();
	const router = useRouter();

	const courses = useLearningStore((state) => state.courses);
	const categories = useLearningStore((state) => state.categories);
	const isLoading = useLearningStore((state) => state.isLoading);
	const error = useLearningStore((state) => state.error);
	const loadData = useLearningStore((state) => state.loadData);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	useEffect(() => {
		if (courses.length === 0 && !isLoading) {
			loadData();
		}
	}, [courses.length, isLoading, loadData]);

	const categoryChips = useMemo(() => {
		const chips = [
			{
				id: "all",
				label: t("courses.allCourses"),
				emoji: "📚",
				color: colors.primary.main,
			},
		];
		for (const cat of categories) {
			chips.push({
				id: cat.id,
				label: cat.name,
				emoji: cat.icon,
				color: cat.color || colors.primary.main,
			});
		}
		return chips;
	}, [categories, t]);

	const displayCourses = useMemo(() => {
		let filtered = courses;
		if (selectedCategory !== "all") {
			filtered = filtered.filter((c) => c.categoryId === selectedCategory);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(q) ||
					c.instructor.name.toLowerCase().includes(q),
			);
		}
		return filtered;
	}, [courses, selectedCategory, searchQuery]);

	const getCategoryName = useCallback(
		(categoryId: string) => {
			const cat = categories.find((c) => c.id === categoryId);
			return cat?.name ?? "";
		},
		[categories],
	);

	const getCategoryColor = useCallback(
		(categoryId: string) => {
			const cat = categories.find((c) => c.id === categoryId);
			return cat?.color || colors.primary.main;
		},
		[categories],
	);

	const handleCoursePress = useCallback(
		(course: Course) => {
			router.push(`/learning/courses/${course.id}`);
		},
		[router],
	);

	const renderCourse = useCallback(
		({ item }: { item: Course }) => (
			<ModernCourseCard
				title={item.title}
				instructor={item.instructor.name}
				category={getCategoryName(item.categoryId)}
				categoryColor={getCategoryColor(item.categoryId)}
				lessonsCount={item.lessonCount}
				duration={item.duration}
				rating={item.rating}
				thumbnailUrl={item.thumbnail}
				onPress={() => handleCoursePress(item)}
			/>
		),
		[getCategoryName, getCategoryColor, handleCoursePress],
	);

	const keyExtractor = useCallback((item: Course) => item.id, []);

	const ListHeaderComponent = useMemo(
		() => (
			<View style={styles.listHeader}>
				<Text style={styles.resultsText}>
					{t("courses.resultsCount", { count: displayCourses.length })}
				</Text>
			</View>
		),
		[displayCourses.length, t],
	);

	const ListEmptyComponent = useMemo(
		() => (
			<View style={styles.centerContainer}>
				<EmptyState
					title={t("courses.noResults")}
					description={t("courses.noResultsDescription")}
				/>
			</View>
		),
		[t],
	);

	return (
		<ScreenLayout scrollable={false} style={styles.container}>
			<Header
				variant="minimal"
				title={t("courses.title")}
				subtitle={t("courses.subtitle", { count: courses.length })}
			/>

			{/* Search */}
			<View style={styles.searchContainer}>
				<SearchInput
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholder={t("courses.searchPlaceholder")}
				/>
			</View>

			{/* Category Filter */}
			<View style={styles.filterSection}>
				<Text style={styles.filterLabel}>{t("courses.filterBy")}</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.chipsRow}
				>
					{categoryChips.map((cat) => (
						<CategoryChip
							key={cat.id}
							label={cat.label}
							emoji={cat.emoji}
							color={cat.color}
							isActive={selectedCategory === cat.id}
							onPress={() => setSelectedCategory(cat.id)}
						/>
					))}
				</ScrollView>
			</View>

			{isLoading ? (
				<View style={styles.centerContainer}>
					<LoadingSpinner size="large" />
					<Text style={styles.loadingText}>
						{t("learning.loading.courses")}
					</Text>
				</View>
			) : error ? (
				<View style={styles.centerContainer}>
					<EmptyState
						icon={<Star size={spacing.iconSize.xl} color={colors.text.tertiary} />}
						title={t("errors.general")}
						description={t("errors.network")}
					/>
				</View>
			) : (
				<FlatList
					data={displayCourses}
					renderItem={renderCourse}
					keyExtractor={keyExtractor}
					style={styles.courseList}
					contentContainerStyle={styles.courseListContent}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={ListHeaderComponent}
					ListEmptyComponent={ListEmptyComponent}
				/>
			)}
		</ScreenLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.tertiary,
	},
	searchContainer: commonStyles.searchContainer,
	filterSection: {
		marginBottom: spacing.md,
	},
	filterLabel: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.secondary,
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.xs,
		textTransform: "uppercase",
		letterSpacing: typography.letterSpacing.wide,
	},
	chipsRow: {
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
	},
	centerContainer: commonStyles.centerContainer,
	loadingText: {
		marginTop: spacing.md,
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
	},
	listHeader: {
		marginBottom: spacing.sm,
	},
	resultsText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.tertiary,
	},
	courseList: {
		flex: 1,
	},
	courseListContent: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xl,
	},
});
