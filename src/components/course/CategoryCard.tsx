import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { colors, spacing, typography } from "@/design-system";

export interface Category {
	id: string;
	title: string;
	emoji: string;
	color: string;
	courseCount: number;
	description: string;
	image: string;
}

interface CategoryCardProps {
	category: Category;
	onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
	return (
		<TouchableOpacity
			style={styles.card}
			delayPressIn={80}
			activeOpacity={0.85}
			pressRetentionOffset={{ top: 8, left: 8, right: 8, bottom: 8 }}
			onPress={onPress}
			accessibilityLabel={`${category.title} category with ${category.courseCount} courses`}
		>
			<ImageBackground
				source={{ uri: category.image }}
				style={styles.background}
				imageStyle={styles.backgroundImage}
			>
				<View
					style={[styles.overlay, { backgroundColor: `${category.color}95` }]}
				>
					<Text style={styles.emoji}>{category.emoji}</Text>
					<Text style={styles.title}>{category.title}</Text>
					<Text style={styles.description}>{category.description}</Text>
					<Text style={styles.count}>
						{category.courseCount} courses • Free
					</Text>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "48%",
		height: 140,
		borderRadius: spacing.radius.md,
		overflow: "hidden",
		...spacing.shadow.md,
	},
	background: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backgroundImage: {
		borderRadius: spacing.radius.md,
	},
	overlay: {
		padding: spacing.md,
		borderRadius: spacing.radius.md,
	},
	emoji: {
		fontSize: 24,
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.inverse,
		marginBottom: spacing.xs,
	},
	description: {
		fontSize: typography.fontSize.xs,
		color: colors.text.inverse,
		opacity: 0.9,
		marginBottom: spacing.xs,
	},
	count: {
		fontSize: typography.fontSize.xs,
		color: colors.text.inverse,
		fontWeight: typography.fontWeight.medium,
	},
});
