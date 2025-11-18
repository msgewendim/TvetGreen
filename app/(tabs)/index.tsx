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
import { useLanguage } from '@/hooks/useLanguage'

export default function HomeScreen() {
	const { t } = useLanguage()
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
			label: t('courses.agriculture'),
			emoji: '🌾',
			color: colors.categories.agriculture,
		},
		{
			id: 'energy',
			label: t('courses.greenEnergy'),
			emoji: '🔆',
			color: colors.categories.greenEnergy,
		},
		{
			id: 'construction',
			label: t('courses.construction'),
			emoji: '🔨',
			color: colors.categories.construction,
		},
		{
			id: 'business',
			label: t('courses.business'),
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
			<Header title={t('navigation.home')} subtitle={t('home.welcomeMessage')} />

			<CurrentCourseCard course={currentCourse} onContinue={() => {}} />

			<NextLessonCard lesson={nextLesson} onPress={() => {}} />

			<QuickActionsGrid actions={quickActions} onActionPress={() => {}} />

			<ActivityList activities={recentActivities} />

			<AchievementBanner
				title={`🎉 ${t('home.congratulations')}`}
				subtitle="You've completed 3 courses this month"
			/>
		</ScreenLayout>
	)
}
