/**
 * Learning Platform Type Definitions
 *
 * These types define the data structure for the TvetGreen Learning Platform.
 * All types match the JSON schema defined in DATA_STRUCTURE.md
 */

/**
 * Course Category
 */
export interface Category {
  id: string
  name: string
  nameAmharic: string
  nameSwahili: string
  icon: string
  color: string
  courseCount: number
  description?: string
}

/**
 * Course Instructor Information
 */
export interface Instructor {
  name: string
  avatar?: string
  bio?: string
}

/**
 * Course Level
 */
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * Course Information
 */
export interface Course {
  id: string
  title: string
  titleAmharic: string
  titleSwahili: string
  description: string
  descriptionAmharic?: string
  descriptionSwahili?: string
  categoryId: string
  thumbnail: string
  instructor: Instructor
  duration: string
  lessonCount: number
  level: CourseLevel
  isPaid: boolean
  price: number
  currency?: string
  rating?: number
  enrollmentCount?: number
  language: string[]
  learningOutcomes: string[]
  requirements: string[]
  tags?: string[]
  createdAt: string
  updatedAt?: string
}

/**
 * Lesson Resource
 */
export interface Resource {
  title: string
  url: string
  type: 'pdf' | 'link' | 'video' | 'quiz'
}

/**
 * Individual Lesson
 */
export interface Lesson {
  id: string
  courseId: string
  moduleId: string
  moduleName: string
  moduleNameAmharic?: string
  moduleNameSwahili?: string
  order: number
  title: string
  titleAmharic: string
  titleSwahili: string
  description?: string
  videoId: string
  duration: string
  isPreview: boolean
  resources?: Resource[]
}

/**
 * Enrollment Status
 */
export type EnrollmentStatus = 'active' | 'completed' | 'dropped'

/**
 * User Course Enrollment
 */
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  lastAccessedAt?: string
  completedAt?: string
  status: EnrollmentStatus
}

/**
 * Lesson Progress Tracking
 */
export interface LessonProgress {
  id: string
  userId: string
  lessonId: string
  courseId: string
  watchedSeconds: number
  totalSeconds: number
  lastPosition: number
  isCompleted: boolean
  completedAt?: string
  updatedAt: string
}

/**
 * Lesson Module (for grouping lessons)
 */
export interface Module {
  id: string
  name: string
  nameAmharic?: string
  nameSwahili?: string
  lessons: Lesson[]
}

/**
 * Course with computed enrollment status
 */
export interface CourseWithStatus extends Course {
  isEnrolled: boolean
  progress?: number
  lastAccessed?: string
}

/**
 * Lesson with completion status
 */
export interface LessonWithProgress extends Lesson {
  isCompleted: boolean
  watchedSeconds?: number
  totalSeconds?: number
  progress?: number
}

/**
 * Learning Store State
 */
export interface LearningState {
  // Static data
  categories: Category[]
  courses: Course[]
  lessons: Lesson[]

  // User data (persisted)
  enrollments: Enrollment[]
  lessonProgress: LessonProgress[]

  // UI state
  selectedCategory: string | null
  currentLesson: Lesson | null
  isLoading: boolean
  error: string | null

  // Actions
  loadData: () => Promise<void>
  setSelectedCategory: (categoryId: string | null) => void
  setCurrentLesson: (lesson: Lesson | null) => void

  // Enrollment actions
  enrollInCourse: (courseId: string) => Promise<void>
  unenrollFromCourse: (courseId: string) => Promise<void>
  updateLastAccessed: (courseId: string) => Promise<void>

  // Progress actions
  markLessonComplete: (lessonId: string, courseId: string) => Promise<void>
  updateLessonProgress: (
    lessonId: string,
    courseId: string,
    watchedSeconds: number,
    totalSeconds: number,
    lastPosition: number
  ) => Promise<void>

  // Selectors
  getEnrolledCourses: () => CourseWithStatus[]
  getCourseProgress: (courseId: string) => number
  getLessonsByCourse: (courseId: string) => LessonWithProgress[]
  getLessonsByModule: (courseId: string) => Module[]
  getNextLesson: (currentLessonId: string) => Lesson | null
  getCourseById: (courseId: string) => Course | undefined
  getLessonById: (lessonId: string) => Lesson | undefined
  getCategoryById: (categoryId: string) => Category | undefined
  getCoursesByCategory: (categoryId: string) => Course[]
  isEnrolled: (courseId: string) => boolean
  getLessonProgress: (lessonId: string) => LessonProgress | undefined
}

/**
 * AsyncStorage Keys
 */
export const STORAGE_KEYS = {
  ENROLLMENTS: '@learning_enrollments',
  LESSON_PROGRESS: '@lesson_progress',
} as const

/**
 * Data Loading Status
 */
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Filter options for course list
 */
export type CourseFilter = 'all' | 'enrolled' | 'completed'

/**
 * Sort options for course list
 */
export type CourseSortOption = 'newest' | 'popular' | 'alphabetical'

/**
 * Learning statistics
 */
export interface LearningStats {
  totalEnrolled: number
  inProgress: number
  completed: number
  totalWatchTime: number // in seconds
  learningStreak?: number // consecutive days
}
