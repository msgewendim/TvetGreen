import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { colors, spacing, typography } from "@/design-system";
import type { Category } from "./CategoryCard";

interface CategoryFiltersProps {
	categories: Category[];
	selectedCategory: string;
	onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilters({
	categories,
	selectedCategory,
	onCategoryChange,
}: CategoryFiltersProps) {
	return (
		<View style={styles.container}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.scroll}
			>
				<TouchableOpacity
					style={[
						styles.filterButton,
						selectedCategory === "all" && styles.filterButtonActive,
					]}
					onPress={() => onCategoryChange("all")}
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
							selectedCategory === category.id && styles.filterButtonActive,
						]}
						onPress={() => onCategoryChange(category.id)}
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
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: spacing.md,
	},
	scroll: {
		paddingHorizontal: spacing.lg,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.secondary,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm + 2,
		borderRadius: spacing.radius.full,
		marginRight: spacing.sm,
		borderWidth: 2,
		borderColor: "transparent",
		minHeight: spacing.minTouchTarget,
	},
	filterButtonActive: {
		backgroundColor: colors.primary.main,
		borderColor: colors.primary.main,
	},
	filterEmoji: {
		fontSize: typography.fontSize.base,
		marginRight: spacing.xs + 2,
	},
	filterButtonText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	filterButtonTextActive: {
		color: colors.text.inverse,
	},
});
