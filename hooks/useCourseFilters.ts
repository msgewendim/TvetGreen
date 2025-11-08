import { useMemo, useState } from 'react'
import type { Course } from '@/src/components/course/CourseCard'

export function useCourseFilters(courses: Course[]) {
	const [selectedCategory, setSelectedCategory] = useState<string>('all')

	const filteredCourses = useMemo(() => {
		if (selectedCategory === 'all') {
			return courses
		}
		return courses.filter((course) => course.category === selectedCategory)
	}, [courses, selectedCategory])

	return {
		selectedCategory,
		setSelectedCategory,
		filteredCourses,
	}
}

