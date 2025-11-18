# Learning Platform - Technical Specification

## Overview
The Learning Platform is a comprehensive course management and video learning system integrated into TvetGreenBolt. It enables users to browse courses by category, enroll in free/paid courses, watch video lessons with progress tracking, and manage their learning journey.

## Architecture

### Technology Stack
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router v5 (file-based routing)
- **Video Player**: react-native-youtube-iframe
- **Storage**: @react-native-async-storage/async-storage
- **UI Framework**: React Native with StyleSheet
- **Type Safety**: TypeScript (strict mode)

### System Components

#### 1. Data Layer
- **Static JSON Files** (Phase 1): Local JSON files for categories, courses, lessons
- **Zustand Store**: Centralized state management for all learning data
- **AsyncStorage**: Persistent storage for user enrollments and progress
- **Future API Layer**: Designed for easy migration from JSON to REST/GraphQL APIs

#### 2. State Management

**Store Structure** (`src/store/learningStore.ts`):
```typescript
interface LearningStore {
  // Static Data
  categories: Category[]
  courses: Course[]
  lessons: Lesson[]

  // User Data (persisted)
  enrollments: Enrollment[]
  lessonProgress: LessonProgress[]

  // UI State
  selectedCategory: string | null
  currentLesson: Lesson | null
  isLoading: boolean
  error: string | null

  // Actions
  loadData: () => Promise<void>
  enrollInCourse: (courseId: string) => Promise<void>
  unenrollFromCourse: (courseId: string) => Promise<void>
  markLessonComplete: (lessonId: string) => Promise<void>
  updateLessonProgress: (lessonId: string, progress: number) => Promise<void>

  // Selectors
  getEnrolledCourses: () => Course[]
  getCourseProgress: (courseId: string) => number
  getLessonsByCourse: (courseId: string) => Lesson[]
  getNextLesson: (currentLessonId: string) => Lesson | null
}
```

**Persistence Strategy**:
- Enrollments stored in AsyncStorage under key: `@learning_enrollments`
- Lesson progress stored under key: `@lesson_progress`
- Auto-save on state updates with debouncing (500ms)
- Hydration on app launch

#### 3. Navigation Structure

**New Routes** (added to existing Expo Router structure):
```
app/
├── (tabs)/
│   ├── learn.tsx                 # NEW: Learning dashboard (tab)
│   └── _layout.tsx               # UPDATE: Add "Learn" tab
├── learning/
│   ├── categories.tsx            # Browse by category
│   ├── courses/
│   │   ├── index.tsx            # All courses list
│   │   ├── [id].tsx             # Course detail & enrollment
│   │   └── _layout.tsx          # Stack navigator
│   ├── lesson/
│   │   └── [id].tsx             # Video lesson player
│   └── _layout.tsx               # Learning section layout
```

**Route Parameters**:
- `/learning/courses/[id]`: `{ id: string }`
- `/learning/lesson/[id]`: `{ id: string, courseId: string }`
- `/learning/courses?category=[categoryId]`: Filter by category

#### 4. Component Architecture

**Screen Components**:
1. **CategoriesScreen** (`screens/learning/CategoriesScreen.tsx`)
   - Grid layout of category cards
   - Navigation to filtered course list

2. **CoursesListScreen** (`screens/learning/CoursesListScreen.tsx`)
   - Virtualized FlatList of courses
   - Filtering: All/Enrolled/Completed
   - Sorting: Newest/Popular/Alphabetical
   - Search functionality

3. **CourseDetailScreen** (`screens/learning/CourseDetailScreen.tsx`)
   - Tabbed interface: Overview/Curriculum/About
   - Enrollment CTA
   - Lesson list with locked/unlocked states

4. **LessonPlayerScreen** (`screens/learning/LessonPlayerScreen.tsx`)
   - Full-screen YouTube player
   - Custom controls overlay
   - Progress tracking
   - Lesson navigation

5. **MyLearningScreen** (`screens/learning/MyLearningScreen.tsx`)
   - Dashboard of enrolled courses
   - Continue watching section
   - Progress statistics

**Reusable Components**:
- `CourseCard`: Course preview with thumbnail, metadata, progress
- `LessonListItem`: Lesson in curriculum with completion state
- `CategoryChip`: Filter/navigation chip
- `ProgressBar`: Linear progress indicator
- `EnrollButton`: Context-aware CTA (Enroll/Continue/Start)
- `VideoControls`: Custom player controls overlay

### Data Models

#### Category
```typescript
interface Category {
  id: string
  name: string
  nameAmharic: string
  nameSwahili: string
  icon: string              // Lucide icon name
  color: string             // Hex color
  courseCount: number
  description?: string
}
```

#### Course
```typescript
interface Course {
  id: string
  title: string
  titleAmharic: string
  titleSwahili: string
  description: string
  descriptionAmharic?: string
  descriptionSwahili?: string
  categoryId: string
  thumbnail: string
  instructor: {
    name: string
    avatar?: string
    bio?: string
  }
  duration: string          // "4 hours"
  lessonCount: number
  level: 'beginner' | 'intermediate' | 'advanced'
  isPaid: boolean
  price: number             // 0 for free courses
  currency?: string         // "USD", "ETB", "KES"
  rating?: number           // 0-5
  enrollmentCount?: number
  language: string[]        // ["en", "am", "sw"]
  learningOutcomes: string[]
  requirements: string[]
  tags?: string[]
  createdAt: string         // ISO 8601
  updatedAt?: string
}
```

#### Lesson
```typescript
interface Lesson {
  id: string
  courseId: string
  moduleId: string
  moduleName: string
  moduleNameAmharic?: string
  moduleNameSwahili?: string
  order: number             // Position in course
  title: string
  titleAmharic: string
  titleSwahili: string
  description?: string
  videoId: string           // YouTube video ID
  duration: string          // "12:34" (mm:ss)
  isPreview: boolean        // Free preview available
  resources?: Resource[]
}

interface Resource {
  title: string
  url: string
  type: 'pdf' | 'link' | 'video' | 'quiz'
}
```

#### Enrollment
```typescript
interface Enrollment {
  id: string
  userId: string            // Future: actual user ID
  courseId: string
  enrolledAt: string        // ISO 8601
  lastAccessedAt?: string
  completedAt?: string
  status: 'active' | 'completed' | 'dropped'
}
```

#### LessonProgress
```typescript
interface LessonProgress {
  id: string
  userId: string
  lessonId: string
  courseId: string
  watchedSeconds: number
  totalSeconds: number
  lastPosition: number      // Resume point
  isCompleted: boolean
  completedAt?: string
  updatedAt: string
}
```

### Business Logic

#### Enrollment Flow
1. User views course detail
2. Clicks "Enroll Now" button
3. If paid course: Payment modal (future implementation)
4. If free course: Immediate enrollment
5. Enrollment record created in store
6. AsyncStorage updated
7. Navigate to first lesson or course overview

#### Progress Tracking
1. Video player emits playback position every 5 seconds
2. Store updates `LessonProgress` record
3. Calculate completion: `watchedSeconds / totalSeconds >= 0.9`
4. Auto-mark complete when threshold reached OR manual "Mark Complete" button
5. Update course progress: `completedLessons / totalLessons * 100`
6. Persist to AsyncStorage

#### Course Filtering & Search
- **By Category**: Filter `courses` array by `categoryId`
- **By Enrollment**: Check if course ID exists in `enrollments`
- **Search**: Full-text search across `title`, `description`, `instructor.name`, `tags`
- **Sort**:
  - Newest: `createdAt` DESC
  - Popular: `enrollmentCount` DESC
  - Alphabetical: `title` ASC

#### Offline Support (Future)
- Download video files to device storage
- Cache course metadata
- Sync progress when online
- Queue enrollments for server sync

### Performance Optimizations

#### List Virtualization
- Use `FlatList` with `windowSize`, `maxToRenderPerBatch`
- Implement `getItemLayout` for consistent item heights
- Use `keyExtractor` with stable IDs

#### Image Optimization
- Lazy load thumbnails with placeholder
- Cache images with react-native-fast-image (future)
- Responsive image sizes

#### State Management
- Memoize selectors with Zustand's built-in optimization
- Use React.memo for expensive components
- Debounce search input (300ms)
- Throttle progress updates (5s)

#### Video Player
- Preload next lesson metadata
- Handle low-bandwidth with quality selector
- Pause when app backgrounds

### Error Handling

#### Network Errors
- Show offline banner
- Retry mechanism for data loading
- Graceful fallback to cached data

#### Video Playback Errors
- Display error message with retry
- Suggest checking internet connection
- Log errors for debugging

#### State Errors
- Validate data structure on load
- Reset corrupted state to defaults
- Error boundaries for React components

### Accessibility

#### Screen Readers
- Semantic labels for all interactive elements
- Announce progress changes
- Describe video player state

#### Touch Targets
- Minimum 44x44pt hit areas
- Adequate spacing between buttons
- Large tap targets for primary actions

#### Visual
- Color contrast ratios (WCAG AA)
- Text scaling support
- High contrast mode (future)

### Security Considerations

#### Data Validation
- Validate JSON structure on load
- Sanitize user inputs in search
- Type checking with TypeScript

#### Future Authentication
- JWT token storage in secure storage
- API request signing
- HTTPS only

### Testing Strategy

#### Unit Tests
- Zustand store actions
- Selectors and computed values
- Utility functions

#### Integration Tests
- Enrollment flow
- Progress tracking
- Navigation between screens

#### E2E Tests
- Complete user journey: Browse → Enroll → Watch → Complete
- Offline scenarios
- Error recovery

### Migration Path to API

**Phase 1**: JSON files (current)
**Phase 2**: API integration

```typescript
// Before (JSON)
import coursesData from '@/data/courses/courses.json'

// After (API)
const courses = await fetch('/api/courses')
```

**Migration Steps**:
1. Create API service layer (`src/services/api.ts`)
2. Update Zustand actions to use API calls
3. Implement caching strategy (React Query)
4. Add optimistic updates
5. Sync local enrollments to server
6. Remove JSON files

### Monitoring & Analytics

**Track Events** (future):
- Course views
- Enrollments
- Video play/pause/complete
- Search queries
- Drop-off points
- Error rates

**Metrics**:
- Average completion rate
- Time to complete
- Most popular courses
- User engagement

### Localization

**Current**: Multilingual data in JSON
**Future**: i18n library integration

- UI strings: English (default)
- Content: English, Amharic, Swahili
- RTL support for future languages
- Locale-based formatting (dates, numbers)

## Technical Constraints

### Platform Limitations
- iOS: Requires external link handling for YouTube
- Android: YouTube iframe restrictions
- Web: Limited offline capabilities

### Device Requirements
- Minimum iOS 13.0, Android 5.0
- 2GB RAM recommended
- Storage for offline videos (future)

### Network Requirements
- Video streaming: 1-5 Mbps
- Metadata sync: < 100KB per course
- Graceful degradation on slow networks

## Development Workflow

### Local Development
```bash
pnpm install
pnpm dev
# Press 'i' for iOS, 'a' for Android
```

### Testing
```bash
pnpm test                  # Unit tests
pnpm test:e2e             # E2E tests (future)
pnpm lint                 # ESLint
pnpm type-check           # TypeScript check
```

### Build
```bash
pnpm build:ios
pnpm build:android
pnpm build:web
```

## Deployment

### Phase 1 (Current)
- Static JSON bundled with app
- No backend required
- Update via app releases

### Phase 2 (API)
- Backend API deployed separately
- Mobile app connects to API
- Content updates without app release

## Future Enhancements

### Phase 3+
- [ ] Live classes/webinars
- [ ] Peer discussions/forums
- [ ] Quizzes and assessments
- [ ] Certificates of completion
- [ ] Instructor dashboard
- [ ] Course creation tools
- [ ] Payment integration
- [ ] Social features (study groups)
- [ ] Gamification (badges, leaderboards)
- [ ] AI-powered recommendations
- [ ] Adaptive learning paths
- [ ] Subtitle generation
- [ ] Video transcription
- [ ] Multi-device sync
- [ ] Chromecast/AirPlay support

## Appendix

### Glossary
- **Enrollment**: User's registration in a course
- **Module**: Grouping of related lessons within a course
- **Preview Lesson**: Free lesson available before enrollment
- **Progress**: Percentage of course/lesson completed
- **Curriculum**: Structured list of lessons in a course

### References
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Native YouTube iframe](https://lonelycpp.github.io/react-native-youtube-iframe/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
