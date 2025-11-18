/**
 * Learning Platform Zustand Store
 *
 * Centralized state management for the learning platform with AsyncStorage persistence.
 */

import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {
  LearningState,
  Category,
  Course,
  Lesson,
  Enrollment,
  LessonProgress,
  CourseWithStatus,
  LessonWithProgress,
  Module,
  STORAGE_KEYS,
} from '@/src/types/learning'

// Import static data
import categoriesData from '@/src/data/courses/categories.json'
import coursesData from '@/src/data/courses/courses.json'
import lessonsData from '@/src/data/courses/lessons.json'

// Storage keys
const ENROLLMENTS_KEY = '@learning_enrollments'
const LESSON_PROGRESS_KEY = '@lesson_progress'

// Default user ID (until authentication is implemented)
const DEFAULT_USER_ID = 'user_default'

/**
 * Load persisted data from AsyncStorage
 */
const loadPersistedData = async (): Promise<{
  enrollments: Enrollment[]
  lessonProgress: LessonProgress[]
}> => {
  try {
    const [enrollmentsJson, progressJson] = await Promise.all([
      AsyncStorage.getItem(ENROLLMENTS_KEY),
      AsyncStorage.getItem(LESSON_PROGRESS_KEY),
    ])

    return {
      enrollments: enrollmentsJson ? JSON.parse(enrollmentsJson) : [],
      lessonProgress: progressJson ? JSON.parse(progressJson) : [],
    }
  } catch (error) {
    console.error('Error loading persisted data:', error)
    return {
      enrollments: [],
      lessonProgress: [],
    }
  }
}

/**
 * Save data to AsyncStorage with debouncing
 */
let saveTimeout: NodeJS.Timeout | null = null

const saveToStorage = async (key: string, data: unknown): Promise<void> => {
  if (saveTimeout) clearTimeout(saveTimeout)

  saveTimeout = setTimeout(async () => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving to ${key}:`, error)
    }
  }, 500) // Debounce 500ms
}

/**
 * Learning Store
 */
export const useLearningStore = create<LearningState>((set, get) => ({
  // Initial state
  categories: [],
  courses: [],
  lessons: [],
  enrollments: [],
  lessonProgress: [],
  selectedCategory: null,
  currentLesson: null,
  isLoading: false,
  error: null,

  /**
   * Load static data and restore persisted user data
   */
  loadData: async () => {
    set({ isLoading: true, error: null })

    try {
      // Load static data from JSON files
      const categories = categoriesData.categories as Category[]
      const courses = coursesData.courses as Course[]
      const lessons = lessonsData.lessons as Lesson[]

      // Load persisted user data
      const { enrollments, lessonProgress } = await loadPersistedData()

      set({
        categories,
        courses,
        lessons,
        enrollments,
        lessonProgress,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error loading data:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false,
      })
    }
  },

  /**
   * Set selected category for filtering
   */
  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId })
  },

  /**
   * Set current lesson being viewed
   */
  setCurrentLesson: (lesson) => {
    set({ currentLesson: lesson })
  },

  /**
   * Enroll user in a course
   */
  enrollInCourse: async (courseId) => {
    const { enrollments, courses } = get()
    const course = courses.find((c) => c.id === courseId)

    if (!course) {
      console.error(`Course not found: ${courseId}`)
      return
    }

    // Check if already enrolled
    if (enrollments.some((e) => e.courseId === courseId && e.status === 'active')) {
      console.log(`Already enrolled in course: ${courseId}`)
      return
    }

    const newEnrollment: Enrollment = {
      id: `enrollment_${Date.now()}`,
      userId: DEFAULT_USER_ID,
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      status: 'active',
    }

    const updatedEnrollments = [...enrollments, newEnrollment]
    set({ enrollments: updatedEnrollments })

    // Persist to AsyncStorage
    await saveToStorage(ENROLLMENTS_KEY, updatedEnrollments)
  },

  /**
   * Unenroll from a course
   */
  unenrollFromCourse: async (courseId) => {
    const { enrollments } = get()

    const updatedEnrollments = enrollments.map((e) =>
      e.courseId === courseId ? { ...e, status: 'dropped' as const } : e
    )

    set({ enrollments: updatedEnrollments })
    await saveToStorage(ENROLLMENTS_KEY, updatedEnrollments)
  },

  /**
   * Update last accessed timestamp for a course
   */
  updateLastAccessed: async (courseId) => {
    const { enrollments } = get()

    const updatedEnrollments = enrollments.map((e) =>
      e.courseId === courseId
        ? { ...e, lastAccessedAt: new Date().toISOString() }
        : e
    )

    set({ enrollments: updatedEnrollments })
    await saveToStorage(ENROLLMENTS_KEY, updatedEnrollments)
  },

  /**
   * Mark a lesson as complete
   */
  markLessonComplete: async (lessonId, courseId) => {
    const { lessonProgress, lessons } = get()
    const lesson = lessons.find((l) => l.id === lessonId)

    if (!lesson) return

    // Parse duration to seconds
    const durationParts = lesson.duration.split(':').map(Number)
    const totalSeconds =
      durationParts.length === 2
        ? durationParts[0] * 60 + durationParts[1]
        : durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]

    const existingProgress = lessonProgress.find((p) => p.lessonId === lessonId)

    if (existingProgress) {
      // Update existing progress
      const updatedProgress = lessonProgress.map((p) =>
        p.lessonId === lessonId
          ? {
              ...p,
              watchedSeconds: totalSeconds,
              isCompleted: true,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
      set({ lessonProgress: updatedProgress })
      await saveToStorage(LESSON_PROGRESS_KEY, updatedProgress)
    } else {
      // Create new progress entry
      const newProgress: LessonProgress = {
        id: `progress_${Date.now()}`,
        userId: DEFAULT_USER_ID,
        lessonId,
        courseId,
        watchedSeconds: totalSeconds,
        totalSeconds,
        lastPosition: totalSeconds,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updatedProgress = [...lessonProgress, newProgress]
      set({ lessonProgress: updatedProgress })
      await saveToStorage(LESSON_PROGRESS_KEY, updatedProgress)
    }

    // Check if course is now complete
    const courseLessons = lessons.filter((l) => l.courseId === courseId)
    const completedLessons = get().lessonProgress.filter(
      (p) => p.courseId === courseId && p.isCompleted
    ).length

    if (completedLessons === courseLessons.length) {
      // Mark course as completed
      const { enrollments } = get()
      const updatedEnrollments = enrollments.map((e) =>
        e.courseId === courseId
          ? {
              ...e,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
            }
          : e
      )
      set({ enrollments: updatedEnrollments })
      await saveToStorage(ENROLLMENTS_KEY, updatedEnrollments)
    }
  },

  /**
   * Update lesson progress (called during video playback)
   */
  updateLessonProgress: async (
    lessonId,
    courseId,
    watchedSeconds,
    totalSeconds,
    lastPosition
  ) => {
    const { lessonProgress } = get()
    const existingProgress = lessonProgress.find((p) => p.lessonId === lessonId)

    // Auto-complete if watched >= 90%
    const isCompleted = watchedSeconds / totalSeconds >= 0.9

    if (existingProgress) {
      const updatedProgress = lessonProgress.map((p) =>
        p.lessonId === lessonId
          ? {
              ...p,
              watchedSeconds: Math.max(p.watchedSeconds, watchedSeconds),
              totalSeconds,
              lastPosition,
              isCompleted: isCompleted || p.isCompleted,
              completedAt: isCompleted && !p.isCompleted ? new Date().toISOString() : p.completedAt,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
      set({ lessonProgress: updatedProgress })
      await saveToStorage(LESSON_PROGRESS_KEY, updatedProgress)
    } else {
      const newProgress: LessonProgress = {
        id: `progress_${Date.now()}`,
        userId: DEFAULT_USER_ID,
        lessonId,
        courseId,
        watchedSeconds,
        totalSeconds,
        lastPosition,
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      }
      const updatedProgress = [...lessonProgress, newProgress]
      set({ lessonProgress: updatedProgress })
      await saveToStorage(LESSON_PROGRESS_KEY, updatedProgress)
    }

    // Update last accessed for the course
    await get().updateLastAccessed(courseId)
  },

  /**
   * Get all enrolled courses with status
   */
  getEnrolledCourses: () => {
    const { courses, enrollments } = get()
    const getCourseProgress = get().getCourseProgress

    return courses
      .filter((course) =>
        enrollments.some(
          (e) => e.courseId === course.id && (e.status === 'active' || e.status === 'completed')
        )
      )
      .map((course) => {
        const enrollment = enrollments.find((e) => e.courseId === course.id)
        return {
          ...course,
          isEnrolled: true,
          progress: getCourseProgress(course.id),
          lastAccessed: enrollment?.lastAccessedAt,
        }
      })
      .sort((a, b) => {
        // Sort by last accessed (most recent first)
        const aTime = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 0
        const bTime = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 0
        return bTime - aTime
      })
  },

  /**
   * Calculate course completion percentage
   */
  getCourseProgress: (courseId) => {
    const { lessons, lessonProgress } = get()
    const courseLessons = lessons.filter((l) => l.courseId === courseId)

    if (courseLessons.length === 0) return 0

    const completedLessons = courseLessons.filter((lesson) => {
      const progress = lessonProgress.find((p) => p.lessonId === lesson.id)
      return progress?.isCompleted
    }).length

    return Math.round((completedLessons / courseLessons.length) * 100)
  },

  /**
   * Get lessons for a course with progress info
   */
  getLessonsByCourse: (courseId) => {
    const { lessons, lessonProgress } = get()

    return lessons
      .filter((l) => l.courseId === courseId)
      .sort((a, b) => a.order - b.order)
      .map((lesson) => {
        const progress = lessonProgress.find((p) => p.lessonId === lesson.id)
        return {
          ...lesson,
          isCompleted: progress?.isCompleted || false,
          watchedSeconds: progress?.watchedSeconds,
          totalSeconds: progress?.totalSeconds,
          progress: progress
            ? Math.round((progress.watchedSeconds / progress.totalSeconds) * 100)
            : 0,
        }
      })
  },

  /**
   * Get lessons grouped by module
   */
  getLessonsByModule: (courseId) => {
    const lessons = get().getLessonsByCourse(courseId)
    const modules: Module[] = []

    lessons.forEach((lesson) => {
      let module = modules.find((m) => m.id === lesson.moduleId)

      if (!module) {
        module = {
          id: lesson.moduleId,
          name: lesson.moduleName,
          nameAmharic: lesson.moduleNameAmharic,
          nameSwahili: lesson.moduleNameSwahili,
          lessons: [],
        }
        modules.push(module)
      }

      module.lessons.push(lesson)
    })

    return modules
  },

  /**
   * Get next lesson in a course
   */
  getNextLesson: (currentLessonId) => {
    const { lessons } = get()
    const currentLesson = lessons.find((l) => l.id === currentLessonId)

    if (!currentLesson) return null

    const courseLessons = lessons
      .filter((l) => l.courseId === currentLesson.courseId)
      .sort((a, b) => a.order - b.order)

    const currentIndex = courseLessons.findIndex((l) => l.id === currentLessonId)

    return currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : null
  },

  /**
   * Get course by ID
   */
  getCourseById: (courseId) => {
    return get().courses.find((c) => c.id === courseId)
  },

  /**
   * Get lesson by ID
   */
  getLessonById: (lessonId) => {
    return get().lessons.find((l) => l.id === lessonId)
  },

  /**
   * Get category by ID
   */
  getCategoryById: (categoryId) => {
    return get().categories.find((c) => c.id === categoryId)
  },

  /**
   * Get courses by category
   */
  getCoursesByCategory: (categoryId) => {
    return get().courses.filter((c) => c.categoryId === categoryId)
  },

  /**
   * Check if user is enrolled in a course
   */
  isEnrolled: (courseId) => {
    const { enrollments } = get()
    return enrollments.some(
      (e) => e.courseId === courseId && (e.status === 'active' || e.status === 'completed')
    )
  },

  /**
   * Get lesson progress
   */
  getLessonProgress: (lessonId) => {
    return get().lessonProgress.find((p) => p.lessonId === lessonId)
  },
}))

/**
 * Hook to initialize the learning store on app load
 */
export const initializeLearningStore = async () => {
  await useLearningStore.getState().loadData()
}

/**
 * Utility function to get learning statistics
 */
export const getLearningStats = () => {
  const { enrollments, lessonProgress, courses } = useLearningStore.getState()

  const totalEnrolled = enrollments.filter(
    (e) => e.status === 'active' || e.status === 'completed'
  ).length

  const inProgress = enrollments.filter((e) => e.status === 'active').length

  const completed = enrollments.filter((e) => e.status === 'completed').length

  const totalWatchTime = lessonProgress.reduce(
    (sum, p) => sum + p.watchedSeconds,
    0
  )

  return {
    totalEnrolled,
    inProgress,
    completed,
    totalWatchTime,
  }
}
