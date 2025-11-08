import { FlatList, StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '@/design-system'
import { CategoryCard, type Category } from './CategoryCard'

interface CategoriesGridProps {
	categories: Category[]
	onCategoryPress: (category: Category) => void
}

export function CategoriesGrid({ categories, onCategoryPress }: CategoriesGridProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Browse by Category</Text>
			<FlatList
				data={categories}
				renderItem={({ item }) => (
					<CategoryCard
						category={item}
						onPress={() => onCategoryPress(item)}
					/>
				)}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={styles.row}
				scrollEnabled={false}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	row: {
		justifyContent: 'space-between',
		marginBottom: spacing.sm,
	},
})

