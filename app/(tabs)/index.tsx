import { colors, Header, ScreenLayout } from '@/design-system'
import {
	ActivityList,
	AchievementBanner,
	CurrentCourseCard,
	NextLessonCard,
	QuickActionsGrid,
	type Activity,
	type CurrentCourse,
	type NextLesson,
	type QuickAction,
} from '@/src/components/home'

export default function HomeScreen() {
	const currentCourse: CurrentCourse = {
		title: 'Sustainable Agriculture Basics',
		category: 'Agriculture',
		progress: 75,
		imageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
	}

	const nextLesson: NextLesson = {
		title: 'Lesson 8: Composting Techniques',
		duration: '12 min',
		isDownloaded: true,
	}

	const quickActions: QuickAction[] = [
		{
			id: 'agriculture',
			label: 'Agriculture',
			emoji: '🌾',
			color: colors.categories.agriculture,
		},
		{
			id: 'energy',
			label: 'Green Energy',
			emoji: '🔆',
			color: colors.categories.greenEnergy,
		},
		{
			id: 'construction',
			label: 'Construction',
			emoji: '🔨',
			color: colors.categories.construction,
		},
		{
			id: 'business',
			label: 'Business',
			emoji: '💼',
			color: colors.categories.business,
		},
	]

	const recentActivities: Activity[] = [
		{
			title: 'Completed: Soil Preparation',
			type: 'completed',
			time: '2 hours ago',
		},
		{
			title: 'Downloaded: Green Energy Course',
			type: 'download',
			time: '1 day ago',
		},
		{
			title: 'Started: Community Leadership',
			type: 'started',
			time: '3 days ago',
		},
	]

	return (
		<ScreenLayout>
			<Header title="Home" subtitle="Welcome back to TvetGreen" />

			<CurrentCourseCard course={currentCourse} onContinue={() => {}} />

			<NextLessonCard lesson={nextLesson} onPress={() => {}} />

			<QuickActionsGrid actions={quickActions} onActionPress={() => {}} />

			<ActivityList activities={recentActivities} />

			<AchievementBanner
				title="🎉 Well Done!"
				subtitle="You've completed 3 courses this month"
			/>
		</ScreenLayout>
	)
}
