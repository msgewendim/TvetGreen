import { Star } from 'lucide-react-native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { usePlayer } from '@/src/providers/player/PlayerProvider'
import {
	colors,
	EmptyState,
	LoadingSpinner,
	spacing,
	typography,
} from '@/design-system'
import { useCourses } from '@/hooks/useCourses'
import { useCourseFilters } from '@/hooks/useCourseFilters'
import {
	CategoryFilters,
	CategoriesGrid,
	CoursesList,
	type Category,
	type Course,
} from '@/src/components/course'

const categories: Category[] = [
	{
		id: 'agriculture',
		title: 'Agriculture',
		emoji: '🌾',
		color: '#2E8B57',
		courseCount: 5,
		description: 'Sustainable farming & crop management',
		image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
	},
	{
		id: 'energy',
		title: 'Green Energy',
		emoji: '🔆',
		color: '#FF8C42',
		courseCount: 3,
		description: 'Solar power & renewable energy',
		image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
	},
	{
		id: 'construction',
		title: 'Construction',
		emoji: '🔨',
		color: '#DAA520',
		courseCount: 4,
		description: 'Building skills & techniques',
		image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg',
	},
	{
		id: 'business',
		title: 'Business',
		emoji: '💼',
		color: '#87CEEB',
		courseCount: 6,
		description: 'Entrepreneurship & market skills',
		image: 'https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg',
	},
]

export default function CoursesScreen() {
	const { courses, isLoading, error } = useCourses()
	const { selectedCategory, setSelectedCategory, filteredCourses } =
		useCourseFilters(courses)
	const player = usePlayer()

	const handleCoursePress = (course: Course) => {
		player.open({
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
		})
	}

	const handleCategoryPress = (category: Category) => {
		setSelectedCategory(category.id)
	}

	return (
		<View style={styles.container}>
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
					<CategoryFilters
						categories={categories}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
					/>

					{selectedCategory === 'all' && (
						<CategoriesGrid
							categories={categories}
							onCategoryPress={handleCategoryPress}
						/>
					)}

					<CoursesList
						courses={filteredCourses}
						onCoursePress={handleCoursePress}
					/>
				</ScrollView>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.xl,
	},
	loadingText: {
		marginTop: spacing.md,
		fontSize: typography.fontSize.base,
		color: colors.text.secondary,
	},
	content: {
		flex: 1,
	},
})
