import React from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useLearningStore } from "@/src/store/learningStore";
import { useLanguage } from "@/src/hooks/useLanguage";
import * as Icons from "lucide-react-native";

export function CategoriesScreen() {
	const { t } = useLanguage();
	const router = useRouter();
	const categories = useLearningStore((state) => state.categories);
	const setSelectedCategory = useLearningStore(
		(state) => state.setSelectedCategory,
	);
	const isLoading = useLearningStore((state) => state.isLoading);

	const handleCategoryPress = (categoryId: string) => {
		setSelectedCategory(categoryId);
		router.push("/learning/courses");
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>
					{t("learning.loading.categories")}
				</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{t("learning.browseCategories")}</Text>
				<Text style={styles.headerSubtitle}>
					{t("learning.browseCategoriesSubtitle")}
				</Text>
			</View>

			{/* Categories Grid */}
			<View style={styles.gridContainer}>
				{categories.map((category) => {
					// Dynamically get the icon component
					const IconComponent = (Icons as any)[category.icon] || Icons.BookOpen;

					return (
						<TouchableOpacity
							key={category.id}
							style={[styles.categoryCard, { borderColor: category.color }]}
							onPress={() => handleCategoryPress(category.id)}
							activeOpacity={0.7}
						>
							<View
								style={[
									styles.iconContainer,
									{ backgroundColor: category.color + "20" },
								]}
							>
								<IconComponent
									size={32}
									color={category.color}
									strokeWidth={2}
								/>
							</View>
							<Text style={styles.categoryName} numberOfLines={2}>
								{category.name}
							</Text>
							<Text style={styles.courseCount}>
								{t("courses.lessons", { count: category.courseCount })}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			{/* View All Courses Button */}
			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.viewAllButton}
					onPress={() => {
						setSelectedCategory(null);
						router.push("/learning/courses");
					}}
				>
					<Text style={styles.viewAllButtonText}>{t("common.viewAll")}</Text>
					<Icons.ArrowRight size={20} color="#FDF5E6" />
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
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 20,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2F4F4F",
	},
	headerSubtitle: {
		fontSize: 14,
		color: "#8B4513",
		marginTop: 6,
		lineHeight: 20,
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingHorizontal: 12,
		paddingBottom: 20,
	},
	categoryCard: {
		width: "47%",
		margin: "1.5%",
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		borderWidth: 2,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	iconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	categoryName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#2F4F4F",
		textAlign: "center",
		marginBottom: 6,
		lineHeight: 20,
		minHeight: 40,
	},
	courseCount: {
		fontSize: 13,
		color: "#8B4513",
		textAlign: "center",
	},
	footer: {
		paddingHorizontal: 20,
		paddingBottom: 32,
	},
	viewAllButton: {
		flexDirection: "row",
		backgroundColor: "#2E8B57",
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	viewAllButtonText: {
		color: "#FDF5E6",
		fontSize: 16,
		fontWeight: "600",
	},
});
