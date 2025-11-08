import { useMemo } from 'react'
import { useVideos } from './useVideos'
import type { Video } from '@/api/videos'
import type { Course } from '@/src/components/course/CourseCard'

export function useCourses() {
	const { data: videosData, isLoading, error } = useVideos()

	const courses = useMemo<Course[]>(() => {
		if (!videosData) return []

		return videosData.map((video: Video, index: number) => ({
			id: video.id || index.toString(),
			title: video.title,
			category: 'all', // API doesn't have category, default to "all"
			instructor: video.author || 'Unknown Instructor',
			duration: video.duration,
			lessons: 1,
			difficulty: 'All Levels',
			rating: 4.5,
			enrolled: Number.parseInt(video.views.replace(/[^0-9]/g, ''), 10) || 0,
			progress: 0,
			isDownloaded: false,
			isFree: true,
			image: video.thumbnailUrl,
			description: video.description || video.title,
			videoUrl: video.videoUrl,
		}))
	}, [videosData])

	return { courses, isLoading, error }
}

