# Learning Platform - Usage Guide

## Getting Started

The learning platform store is ready to use. Follow these steps to integrate it into your screens.

## 1. Initialize the Store

In your app's entry point (e.g., `app/_layout.tsx` or `App.tsx`), initialize the store:

```typescript
import { useEffect } from 'react'
import { initializeLearningStore } from '@/store/learningStore'

export default function RootLayout() {
  useEffect(() => {
    // Load data on app start
    initializeLearningStore()
  }, [])

  // ... rest of your layout
}
```

## 2. Using the Store in Components

### Example: Display Categories

```typescript
import { useLearningStore } from '@/store/learningStore'

export function CategoriesScreen() {
  const categories = useLearningStore((state) => state.categories)
  const isLoading = useLearningStore((state) => state.isLoading)

  if (isLoading) {
    return <Text>Loading categories...</Text>
  }

  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <CategoryCard
          name={item.name}
          icon={item.icon}
          color={item.color}
          courseCount={item.courseCount}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}
```

### Example: Display Courses

```typescript
import { useLearningStore } from '@/store/learningStore'

export function CoursesListScreen() {
  const courses = useLearningStore((state) => state.courses)
  const selectedCategory = useLearningStore((state) => state.selectedCategory)
  const setSelectedCategory = useLearningStore((state) => state.setSelectedCategory)

  // Filter courses by category
  const filteredCourses = selectedCategory
    ? courses.filter((c) => c.categoryId === selectedCategory)
    : courses

  return (
    <View>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            thumbnail={item.thumbnail}
            instructor={item.instructor.name}
            duration={item.duration}
            lessonCount={item.lessonCount}
            level={item.level}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}
```

### Example: Course Detail with Enrollment

```typescript
import { useLearningStore } from '@/store/learningStore'
import { useRouter } from 'expo-router'

export function CourseDetailScreen({ courseId }: { courseId: string }) {
  const router = useRouter()
  const getCourseById = useLearningStore((state) => state.getCourseById)
  const getLessonsByCourse = useLearningStore((state) => state.getLessonsByCourse)
  const isEnrolled = useLearningStore((state) => state.isEnrolled)
  const enrollInCourse = useLearningStore((state) => state.enrollInCourse)
  const getCourseProgress = useLearningStore((state) => state.getCourseProgress)

  const course = getCourseById(courseId)
  const lessons = getLessonsByCourse(courseId)
  const enrolled = isEnrolled(courseId)
  const progress = getCourseProgress(courseId)

  if (!course) return <Text>Course not found</Text>

  const handleEnroll = async () => {
    await enrollInCourse(courseId)
    // Navigate to first lesson
    if (lessons.length > 0) {
      router.push(`/learning/lesson/${lessons[0].id}`)
    }
  }

  return (
    <ScrollView>
      <Image source={{ uri: course.thumbnail }} />
      <Text>{course.title}</Text>
      <Text>{course.description}</Text>

      {enrolled ? (
        <View>
          <ProgressBar progress={progress} />
          <Button
            title="Continue Learning"
            onPress={() => router.push(`/learning/lesson/${lessons[0].id}`)}
          />
        </View>
      ) : (
        <Button title="Enroll Now" onPress={handleEnroll} />
      )}

      <Text>Curriculum</Text>
      <FlatList
        data={lessons}
        renderItem={({ item }) => (
          <LessonListItem
            title={item.title}
            duration={item.duration}
            isCompleted={item.isCompleted}
            isLocked={!enrolled && !item.isPreview}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  )
}
```

### Example: Video Lesson Player

```typescript
import { useState, useEffect } from 'react'
import { useLearningStore } from '@/store/learningStore'

export function LessonPlayerScreen({ lessonId }: { lessonId: string }) {
  const getLessonById = useLearningStore((state) => state.getLessonById)
  const updateLessonProgress = useLearningStore((state) => state.updateLessonProgress)
  const markLessonComplete = useLearningStore((state) => state.markLessonComplete)
  const getNextLesson = useLearningStore((state) => state.getNextLesson)

  const lesson = getLessonById(lessonId)
  const [currentTime, setCurrentTime] = useState(0)

  if (!lesson) return <Text>Lesson not found</Text>

  // Handle playback progress
  const handleProgress = (seconds: number, total: number) => {
    setCurrentTime(seconds)
    // Update progress every 5 seconds
    if (Math.floor(seconds) % 5 === 0) {
      updateLessonProgress(
        lesson.id,
        lesson.courseId,
        seconds,
        total,
        seconds
      )
    }
  }

  // Handle manual completion
  const handleMarkComplete = async () => {
    await markLessonComplete(lesson.id, lesson.courseId)
    const nextLesson = getNextLesson(lesson.id)
    if (nextLesson) {
      // Navigate to next lesson
    }
  }

  return (
    <View>
      <YouTubePlayer
        videoId={lesson.videoId}
        onProgress={handleProgress}
      />
      <Text>{lesson.title}</Text>
      <Button title="Mark as Complete" onPress={handleMarkComplete} />
    </View>
  )
}
```

### Example: My Learning Dashboard

```typescript
import { useLearningStore } from '@/store/learningStore'
import { getLearningStats } from '@/store/learningStore'

export function MyLearningScreen() {
  const getEnrolledCourses = useLearningStore((state) => state.getEnrolledCourses)
  const enrolledCourses = getEnrolledCourses()
  const stats = getLearningStats()

  return (
    <ScrollView>
      {/* Stats Section */}
      <View>
        <Text>Total Enrolled: {stats.totalEnrolled}</Text>
        <Text>In Progress: {stats.inProgress}</Text>
        <Text>Completed: {stats.completed}</Text>
        <Text>
          Watch Time: {Math.floor(stats.totalWatchTime / 3600)}h{' '}
          {Math.floor((stats.totalWatchTime % 3600) / 60)}m
        </Text>
      </View>

      {/* Enrolled Courses */}
      <Text>My Courses</Text>
      <FlatList
        data={enrolledCourses}
        renderItem={({ item }) => (
          <EnrolledCourseCard
            title={item.title}
            thumbnail={item.thumbnail}
            progress={item.progress}
            lastAccessed={item.lastAccessed}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  )
}
```

## 3. Common Patterns

### Filter Courses by Enrollment Status

```typescript
const courses = useLearningStore((state) => state.courses)
const isEnrolled = useLearningStore((state) => state.isEnrolled)

const enrolledCourses = courses.filter((c) => isEnrolled(c.id))
const notEnrolledCourses = courses.filter((c) => !isEnrolled(c.id))
```

### Search Courses

```typescript
const [searchQuery, setSearchQuery] = useState('')
const courses = useLearningStore((state) => state.courses)

const searchResults = courses.filter((course) => {
  const query = searchQuery.toLowerCase()
  return (
    course.title.toLowerCase().includes(query) ||
    course.description.toLowerCase().includes(query) ||
    course.instructor.name.toLowerCase().includes(query) ||
    course.tags?.some((tag) => tag.toLowerCase().includes(query))
  )
})
```

### Sort Courses

```typescript
const courses = useLearningStore((state) => state.courses)

// Sort by newest
const newestCourses = [...courses].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)

// Sort by popularity
const popularCourses = [...courses].sort(
  (a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0)
)

// Sort alphabetically
const alphabeticalCourses = [...courses].sort((a, b) =>
  a.title.localeCompare(b.title)
)
```

### Get Lessons Grouped by Module

```typescript
const getLessonsByModule = useLearningStore((state) => state.getLessonsByModule)
const modules = getLessonsByModule(courseId)

return (
  <FlatList
    data={modules}
    renderItem={({ item: module }) => (
      <View>
        <Text>{module.name}</Text>
        <FlatList
          data={module.lessons}
          renderItem={({ item: lesson }) => (
            <LessonListItem {...lesson} />
          )}
        />
      </View>
    )}
  />
)
```

## 4. Performance Optimization

### Use Selective Subscriptions

Only subscribe to the state you need:

```typescript
// ❌ Bad: Re-renders on any state change
const state = useLearningStore()

// ✅ Good: Only re-renders when courses change
const courses = useLearningStore((state) => state.courses)
```

### Memoize Computed Values

```typescript
import { useMemo } from 'react'

const courses = useLearningStore((state) => state.courses)
const selectedCategory = useLearningStore((state) => state.selectedCategory)

const filteredCourses = useMemo(
  () =>
    selectedCategory
      ? courses.filter((c) => c.categoryId === selectedCategory)
      : courses,
  [courses, selectedCategory]
)
```

## 5. Debugging

### View Current State

```typescript
import { useLearningStore } from '@/store/learningStore'

// In a debug component or console
const state = useLearningStore.getState()
console.log('Categories:', state.categories.length)
console.log('Courses:', state.courses.length)
console.log('Enrollments:', state.enrollments.length)
console.log('Lesson Progress:', state.lessonProgress.length)
```

### Clear Persisted Data (for testing)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Clear all learning data
await AsyncStorage.multiRemove([
  '@learning_enrollments',
  '@lesson_progress',
])

// Reload app to reset state
```

## 6. Error Handling

```typescript
const error = useLearningStore((state) => state.error)
const isLoading = useLearningStore((state) => state.isLoading)

if (error) {
  return <ErrorScreen message={error} />
}

if (isLoading) {
  return <LoadingScreen />
}
```

## 7. Migration to API (Future)

When ready to connect to a backend, update the store actions:

```typescript
// Before (JSON)
loadData: async () => {
  const categories = categoriesData.categories
  // ...
}

// After (API)
loadData: async () => {
  const response = await fetch('/api/categories')
  const categories = await response.json()
  // ...
}
```

## Next Steps

1. Create screen components for:
   - Categories browsing
   - Course listing
   - Course detail
   - Lesson player
   - My Learning dashboard

2. Integrate with Expo Router navigation

3. Add loading skeletons and error states

4. Implement search and filtering UI

5. Build video player with progress tracking

6. Add offline support (download lessons)

7. Implement certificates and achievements

## Support

For questions or issues, refer to:
- `SPEC.md` - Technical specification
- `DATA_STRUCTURE.md` - JSON schema details
- `FEATURES.md` - Complete feature list
- `ROADMAP.md` - Implementation plan
