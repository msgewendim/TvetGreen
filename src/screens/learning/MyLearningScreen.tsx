import { useMemo, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { GraduationCap, BookOpen } from "lucide-react-native";
import { useLearningStore, getLearningStats } from "@/src/store/learningStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import {
	ScreenLayout,
	Header,
	SearchInput,
	ModernCourseCard,
	EmptyState,
	commonStyles,
	colors,
	spacing,
	typography,
} from "@/design-system";

type Tab = "all" | "in_progress" | "completed";

export function MyLearningScreen() {
	const { t } = useLanguage();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<Tab>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	const getEnrolledCourses = useLearningStore((s) => s.getEnrolledCourses);
	const loadData = useLearningStore((s) => s.loadData);
	const isLoading = useLearningStore((s) => s.isLoading);

	const enrolledCourses = getEnrolledCourses();
	const stats = getLearningStats();

	const filteredCourses = useMemo(() => {
		let filtered = enrolledCourses;

		if (activeTab === "in_progress") {
			filtered = filtered.filter(
				(c) => c.progress && c.progress > 0 && c.progress < 100,
			);
		} else if (activeTab === "completed") {
			filtered = filtered.filter((c) => c.progress === 100);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(query) ||
					c.instructor.name.toLowerCase().includes(query),
			);
		}

		return filtered;
	}, [enrolledCourses, activeTab, searchQuery]);

	const onRefresh = async () => {
		setRefreshing(true);
		await loadData();
		setRefreshing(false);
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

	const TABS: { key: Tab; label: string; count: number }[] = [
		{ key: "all", label: t("learning.all"), count: enrolledCourses.length },
		{
			key: "in_progress",
			label: t("learning.inProgress"),
			count: stats.inProgress,
		},
		{
			key: "completed",
			label: t("learning.completed"),
			count: stats.completed,
		},
	];

	return (
		<ScreenLayout scrollable={false}>
			<Header variant="minimal" title="My Courses" />

			{/* Search */}
			<View style={styles.searchContainer}>
				<SearchInput
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholder={t("learning.searchCourses") || "Search your courses..."}
				/>
			</View>

			{/* Tab Filters */}
			<View style={styles.tabsRow}>
				{TABS.map((tab) => (
					<TouchableOpacity
						key={tab.key}
						style={[
							styles.tab,
							activeTab === tab.key && styles.tabActive,
						]}
						onPress={() => setActiveTab(tab.key)}
						accessibilityRole="tab"
						accessibilityState={{ selected: activeTab === tab.key }}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === tab.key && styles.tabTextActive,
							]}
						>
							{tab.label} ({tab.count})
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Course List or Empty State */}
			{enrolledCourses.length === 0 ? (
				<View style={styles.emptyContainer}>
					<EmptyState
						icon={
							<GraduationCap
								size={64}
								color={colors.text.tertiary}
								strokeWidth={1.5}
							/>
						}
						title={t("learning.startYourJourney")}
						description={t("learning.emptySubtitle")}
						action={{
							label: t("learning.browseCourses"),
							onPress: () => router.push("/(tabs)/courses"),
						}}
					/>
				</View>
			) : (
				<FlatList
					data={filteredCourses}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContent}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={colors.primary.main}
						/>
					}
					ListEmptyComponent={
						<View style={styles.emptySearch}>
							<Text style={styles.emptySearchText}>
								{searchQuery
									? t("learning.noSearchResults")
									: t("learning.noCoursesInTab")}
							</Text>
						</View>
					}
					renderItem={({ item }) => (
						<ModernCourseCard
							title={item.title}
							instructor={item.instructor?.name}
							category={item.categoryId
								?.replace("category_", "")
								.replace(/_/g, " ")}
							categoryColor={colors.primary.main}
							lessonsCount={item.lessonCount}
							progress={item.progress}
							thumbnailUrl={item.thumbnail}
							onPress={() =>
								router.push(`/learning/courses/${item.id}`)
							}
						/>
					)}
					ListFooterComponent={
						<TouchableOpacity
							style={styles.browseButton}
							onPress={() => router.push("/(tabs)/courses")}
						>
							<BookOpen
								size={20}
								color={colors.primary.main}
								strokeWidth={2}
							/>
							<Text style={styles.browseButtonText}>
								{t("learning.browseMoreCourses")}
							</Text>
						</TouchableOpacity>
					}
				/>
			)}
		</ScreenLayout>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.tertiary,
	},
	loadingText: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
		marginTop: spacing.md,
	},
	searchContainer: commonStyles.searchContainer,
	tabsRow: {
		flexDirection: "row",
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.md,
		gap: spacing.sm,
	},
	tab: {
		flex: 1,
		paddingVertical: spacing.sm + 2,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.neutral.white,
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border.light,
	},
	tabActive: {
		backgroundColor: colors.primary.main,
		borderColor: colors.primary.main,
	},
	tabText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.secondary,
	},
	tabTextActive: {
		color: colors.text.inverse,
	},
	listContent: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xl,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.xl,
	},
	emptySearch: {
		paddingVertical: spacing["2xl"],
		alignItems: "center",
	},
	emptySearchText: {
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
		textAlign: "center",
	},
	browseButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.neutral.white,
		paddingVertical: spacing.md,
		borderRadius: spacing.radius.md,
		borderWidth: 1,
		borderColor: colors.primary.main,
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	browseButtonText: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.primary.main,
	},
});
