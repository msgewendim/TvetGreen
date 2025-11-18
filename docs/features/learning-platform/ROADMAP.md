# Learning Platform - Implementation Roadmap

## Project Timeline: 4 Weeks

**Start Date**: Week of November 18, 2025
**Target Completion**: Week of December 16, 2025

---

## Phase 1: Foundation & Data Structure ✅ IN PROGRESS
**Duration**: Week 1 (Nov 18-24, 2025)
**Status**: 🟡 In Progress

### Objectives
- Establish data architecture and documentation
- Create realistic course catalog
- Set up state management infrastructure
- Enable data persistence

### Tasks

#### Documentation (Days 1-2)
- [x] Create `/docs/features/learning-platform/` directory
- [x] Generate `SPEC.md` - Technical specification
- [ ] Generate `ROADMAP.md` - This document
- [ ] Generate `FEATURES.md` - Feature list with user stories
- [ ] Generate `DATA_STRUCTURE.md` - JSON schema documentation

#### Data Infrastructure (Days 2-3)
- [ ] Create `/src/data/courses/` directory
- [ ] Generate `categories.json` - 8 categories (Agriculture, Green Energy, Construction, Entrepreneurship, ICT, Health & Safety, Water Management, Business Skills)
- [ ] Generate `courses.json` - 20 courses distributed across categories
- [ ] Generate `lessons.json` - 120+ lessons (5-10 per course)
- [ ] Generate `enrollments.json` - Template for user enrollments
- [ ] Create `README.md` in data directory with usage instructions

#### Type System (Day 4)
- [ ] Create `/src/types/learning.ts`
- [ ] Define TypeScript interfaces: Category, Course, Lesson, Enrollment, LessonProgress
- [ ] Export all types for app-wide usage

#### State Management (Days 4-5)
- [ ] Install dependencies: `zustand`, `@react-native-async-storage/async-storage`
- [ ] Create `/src/store/learningStore.ts`
- [ ] Implement Zustand store with:
  - State properties (categories, courses, lessons, enrollments, lessonProgress)
  - Actions (loadData, enrollInCourse, markLessonComplete, etc.)
  - Selectors (getEnrolledCourses, getCourseProgress, etc.)
- [ ] Integrate AsyncStorage middleware for persistence
- [ ] Add error handling and loading states

#### Testing & Validation (Days 5-6)
- [ ] Verify JSON data loads correctly
- [ ] Test enrollment flow
- [ ] Test progress tracking
- [ ] Verify AsyncStorage persistence across app restarts
- [ ] Validate TypeScript types

### Acceptance Criteria
- [ ] All documentation files created and comprehensive
- [ ] 20 courses with culturally relevant content (East Africa focus)
- [ ] 120+ lessons with real YouTube video IDs
- [ ] Zustand store handles all CRUD operations without errors
- [ ] Enrollment and progress data persists after app restart
- [ ] TypeScript compilation succeeds with no errors

### Blockers & Risks
- None currently

### Completion Notes
_To be filled upon phase completion_

---

## Phase 2: Navigation & Screen Structure
**Duration**: Week 1-2 (Nov 24-Dec 1, 2025)
**Status**: 🔴 Not Started

### Objectives
- Establish navigation architecture
- Create screen skeletons with proper routing
- Integrate with existing tab navigation

### Tasks

#### Navigation Setup (Days 1-2)
- [ ] Update `/app/(tabs)/_layout.tsx` to add "Learn" tab
- [ ] Create `/app/learning/_layout.tsx` - Learning section root layout
- [ ] Create `/app/(tabs)/learn.tsx` - Learning dashboard (tab screen)
- [ ] Set up nested navigation structure

#### Screen Files (Days 2-4)
- [ ] Create `/src/screens/learning/CategoriesScreen.tsx`
- [ ] Create `/src/screens/learning/CoursesListScreen.tsx`
- [ ] Create `/src/screens/learning/CourseDetailScreen.tsx`
- [ ] Create `/src/screens/learning/LessonPlayerScreen.tsx`
- [ ] Create `/src/screens/learning/MyLearningScreen.tsx`

#### Route Implementation (Days 4-5)
- [ ] Implement route: `/learning/categories`
- [ ] Implement route: `/learning/courses` (with optional `?category=` param)
- [ ] Implement route: `/learning/courses/[id]`
- [ ] Implement route: `/learning/lesson/[id]`
- [ ] Configure navigation params typing

#### Navigation Testing (Day 5)
- [ ] Test forward/backward navigation
- [ ] Verify route parameters pass correctly
- [ ] Test deep linking (future-ready)
- [ ] Validate screen transitions

### Acceptance Criteria
- [ ] "Learn" tab appears in bottom tab bar
- [ ] All 5 screens navigable from tab
- [ ] Back button works correctly on all screens
- [ ] Screen transitions are smooth (60fps)
- [ ] TypeScript types for navigation params
- [ ] No navigation warnings in console

### Dependencies
- Phase 1 complete (data structure available)

### Blockers & Risks
- None anticipated

### Completion Notes
_To be filled upon phase completion_

---

## Phase 3: Categories & Course Browsing
**Duration**: Week 2 (Dec 1-8, 2025)
**Status**: 🔴 Not Started

### Objectives
- Build category browsing experience
- Implement course listing with filtering
- Create reusable UI components

### Tasks

#### Categories Screen (Days 1-2)
- [ ] Design grid layout (2 columns)
- [ ] Create CategoryCard component
- [ ] Integrate with learningStore (categories data)
- [ ] Implement navigation to filtered courses
- [ ] Add search functionality
- [ ] Style with design system colors

#### Courses List Screen (Days 2-4)
- [ ] Create CourseCard component:
  - [ ] Thumbnail image with placeholder
  - [ ] Title, description, metadata
  - [ ] Enrollment badge
  - [ ] Progress indicator (if enrolled)
  - [ ] Difficulty level badge
- [ ] Implement FlatList with virtualization
- [ ] Add filtering: All / Enrolled / Completed
- [ ] Add sorting: Newest / Popular / Alphabetical
- [ ] Implement search across title/description
- [ ] Pull-to-refresh functionality
- [ ] Empty states (no courses, no results)
- [ ] Loading skeleton screens

#### Reusable Components (Days 4-5)
- [ ] Create `/src/components/learning/CategoryChip.tsx`
- [ ] Create `/src/components/learning/ProgressBar.tsx`
- [ ] Create `/src/components/learning/EnrollButton.tsx`
- [ ] Create `/src/components/learning/DifficultyBadge.tsx`
- [ ] Document component props with TypeScript

#### Polish & Optimization (Day 5)
- [ ] Optimize FlatList performance (getItemLayout, memo)
- [ ] Add loading shimmer effects
- [ ] Implement debounced search (300ms)
- [ ] Accessibility labels
- [ ] Error handling

### Acceptance Criteria
- [ ] Categories display in responsive grid
- [ ] Course filtering by category works
- [ ] Search returns relevant results
- [ ] Smooth scrolling with 20+ courses
- [ ] Components follow design system
- [ ] Loading states implemented
- [ ] Empty states with helpful messaging
- [ ] Accessibility labels present

### Dependencies
- Phase 2 complete (navigation ready)

### Blockers & Risks
- Image loading performance (mitigate with lazy loading)

### Completion Notes
_To be filled upon phase completion_

---

## Phase 4: Course Detail & Enrollment
**Duration**: Week 2-3 (Dec 8-15, 2025)
**Status**: 🔴 Not Started

### Objectives
- Build comprehensive course detail screen
- Implement enrollment flow
- Show curriculum with lesson states

### Tasks

#### Course Detail Header (Days 1-2)
- [ ] Hero section with cover image
- [ ] Course title, subtitle, category
- [ ] Instructor info card
- [ ] Rating and enrollment count
- [ ] Duration, lesson count, level badges
- [ ] Parallax scroll effect (optional)

#### Tabbed Content (Days 2-3)
- [ ] Implement tab navigation (Overview / Curriculum / About)
- [ ] Overview tab:
  - [ ] Description
  - [ ] Learning outcomes list
  - [ ] Prerequisites
  - [ ] Tags
- [ ] Curriculum tab:
  - [ ] Grouped by modules
  - [ ] Lesson list items
  - [ ] Lock/unlock indicators
  - [ ] Preview badges
  - [ ] Completion checkmarks
  - [ ] Scroll to current lesson
- [ ] About tab:
  - [ ] Instructor bio
  - [ ] Requirements
  - [ ] Language support info

#### Enrollment Flow (Days 3-4)
- [ ] Create EnrollButton component states:
  - [ ] "Enroll Now" (not enrolled)
  - [ ] "Continue Learning" (in progress)
  - [ ] "Start Course" (enrolled, not started)
  - [ ] "Completed" (all lessons done)
- [ ] Implement enrollment modal/bottom sheet
- [ ] Handle free course enrollment
- [ ] Payment placeholder for paid courses
- [ ] Update Zustand store on enrollment
- [ ] Persist to AsyncStorage
- [ ] Navigate to first lesson or curriculum

#### Lesson List Component (Days 4-5)
- [ ] Create LessonListItem component
- [ ] Show lesson number, title, duration
- [ ] Display completion state
- [ ] Lock icon for non-enrolled users
- [ ] Preview badge for sample lessons
- [ ] Tap to navigate to player
- [ ] Module grouping with expandable sections

#### Polish (Day 5)
- [ ] Share course functionality
- [ ] Add to wishlist (future)
- [ ] Error handling for enrollment
- [ ] Loading states
- [ ] Accessibility

### Acceptance Criteria
- [ ] Course information displays correctly
- [ ] Tabs switch smoothly
- [ ] Enrollment updates store and persists
- [ ] Can access lessons after enrollment
- [ ] Locked lessons prevent access
- [ ] Preview lessons always accessible
- [ ] Proper error handling on enrollment failure
- [ ] Responsive layout on various screen sizes

### Dependencies
- Phase 3 complete (course list ready)

### Blockers & Risks
- None anticipated

### Completion Notes
_To be filled upon phase completion_

---

## Phase 5: Lesson Player
**Duration**: Week 3 (Dec 15-22, 2025)
**Status**: 🔴 Not Started

### Objectives
- Implement full-featured video lesson player
- Track watch progress
- Enable lesson navigation

### Tasks

#### Video Player Integration (Days 1-2)
- [ ] Integrate react-native-youtube-iframe
- [ ] Full-screen video display
- [ ] Handle player ready state
- [ ] Handle playback errors
- [ ] Orientation change support
- [ ] Quality selector (auto, 720p, 480p, 360p)

#### Custom Controls Overlay (Days 2-3)
- [ ] Create VideoControls component:
  - [ ] Play/Pause button
  - [ ] Progress bar with seek
  - [ ] Current time / Total time display
  - [ ] 10s forward/backward buttons
  - [ ] Playback speed selector (0.5x, 1x, 1.5x, 2x)
  - [ ] Fullscreen toggle
  - [ ] Settings menu
- [ ] Auto-hide controls after 3s inactivity
- [ ] Show controls on tap
- [ ] Prevent accidental seeks

#### Progress Tracking (Days 3-4)
- [ ] Emit playback position every 5s
- [ ] Update Zustand lessonProgress state
- [ ] Calculate completion (90% watched)
- [ ] Auto-mark complete at threshold
- [ ] "Mark as Complete" button
- [ ] Resume from last position
- [ ] Persist progress to AsyncStorage

#### Lesson Navigation (Days 4-5)
- [ ] Bottom sheet with course curriculum
- [ ] Previous/Next lesson buttons
- [ ] Auto-suggest next lesson on completion
- [ ] Navigate between lessons
- [ ] Update current lesson state
- [ ] Breadcrumb navigation (Course > Module > Lesson)

#### Additional Features (Day 5)
- [ ] Download button (UI only, future implementation)
- [ ] Subtitle toggle (prep for localization)
- [ ] Notes/bookmarks placeholder
- [ ] Quiz/assessment placeholder at end
- [ ] Error recovery (retry, reload)
- [ ] Offline mode indicator

### Acceptance Criteria
- [ ] Video plays smoothly
- [ ] Custom controls work correctly
- [ ] Progress saves automatically
- [ ] Can navigate to previous/next lesson
- [ ] Resume playback from last position
- [ ] Completion updates course progress
- [ ] Portrait and landscape modes work
- [ ] Handles slow internet gracefully
- [ ] Error states display helpful messages

### Dependencies
- Phase 4 complete (enrollment and course data ready)
- react-native-youtube-iframe installed

### Blockers & Risks
- YouTube iframe restrictions on mobile
- Network latency affecting playback

### Completion Notes
_To be filled upon phase completion_

---

## Phase 6: My Learning Dashboard
**Duration**: Week 3-4 (Dec 22-29, 2025)
**Status**: 🔴 Not Started

### Objectives
- Build personalized learning hub
- Display course progress
- Enable quick access to ongoing courses

### Tasks

#### Dashboard Layout (Days 1-2)
- [ ] Hero section with statistics:
  - [ ] Total enrolled courses
  - [ ] Courses in progress
  - [ ] Courses completed
  - [ ] Total watch time
  - [ ] Learning streak (future)
- [ ] Tab navigation: In Progress / Completed / Wishlist
- [ ] "Continue Watching" section at top

#### Course Progress Cards (Days 2-3)
- [ ] Create EnrolledCourseCard component:
  - [ ] Course thumbnail
  - [ ] Title and category
  - [ ] Linear progress bar with percentage
  - [ ] "Continue Learning" button
  - [ ] Last accessed timestamp
  - [ ] Next lesson preview
- [ ] Display completed courses with certificate badge
- [ ] Group by status (in progress, completed)

#### Continue Watching Section (Day 3)
- [ ] Horizontal scroll of recently accessed lessons
- [ ] Thumbnail with play icon overlay
- [ ] Resume from last position
- [ ] Quick access to lesson player

#### Filters & Search (Day 4)
- [ ] Filter by category
- [ ] Sort by progress, recently accessed, alphabetical
- [ ] Search enrolled courses
- [ ] Empty states for new users

#### Achievements & Gamification (Day 4-5)
- [ ] Achievement badges placeholder:
  - [ ] First Course Completed
  - [ ] 5 Courses Completed
  - [ ] 10 Hours Watched
  - [ ] 7 Day Streak
- [ ] Progress milestones
- [ ] Completion certificates (future)

#### Polish (Day 5)
- [ ] Pull to refresh
- [ ] Loading states
- [ ] Error handling
- [ ] Accessibility
- [ ] Animations (progress bar fill)

### Acceptance Criteria
- [ ] Shows all enrolled courses
- [ ] Progress displays accurately
- [ ] Continue watching resumes correctly
- [ ] Empty states for new users
- [ ] Filters and search work
- [ ] Performance with 50+ enrolled courses
- [ ] Statistics calculate correctly
- [ ] Responsive layout

### Dependencies
- Phase 5 complete (lesson progress tracking)

### Blockers & Risks
- None anticipated

### Completion Notes
_To be filled upon phase completion_

---

## Phase 7: Polish & Optimization
**Duration**: Week 4 (Dec 29, 2025 - Jan 5, 2026)
**Status**: 🔴 Not Started

### Objectives
- Enhance user experience
- Optimize performance
- Improve accessibility
- Prepare for production

### Tasks

#### Loading States (Days 1-2)
- [ ] Skeleton loaders for all screens:
  - [ ] Categories grid skeleton
  - [ ] Course list skeleton
  - [ ] Course detail skeleton
  - [ ] Lesson player skeleton
  - [ ] Dashboard skeleton
- [ ] Shimmer effects on placeholders
- [ ] Smooth transitions from loading to loaded
- [ ] Loading indicators for actions (enroll, mark complete)

#### Error Handling (Day 2)
- [ ] Network error states:
  - [ ] Offline banner
  - [ ] Retry button
  - [ ] Cached data fallback
- [ ] Video playback errors:
  - [ ] Display error message
  - [ ] Suggest troubleshooting
  - [ ] Reload button
- [ ] Data loading errors:
  - [ ] Graceful degradation
  - [ ] Error boundaries
  - [ ] Log errors for debugging

#### Animations (Days 3-4)
- [ ] Screen transitions (slide, fade)
- [ ] Card interactions (press, hover)
- [ ] Progress bar animations
- [ ] Micro-interactions:
  - [ ] Heart icon on wishlist add
  - [ ] Checkmark on lesson complete
  - [ ] Confetti on course complete (optional)
- [ ] Use react-native-reanimated for smooth 60fps animations

#### Performance Optimization (Days 4-5)
- [ ] Lazy load images with placeholders
- [ ] Virtualized lists with optimized rendering
- [ ] Memoize expensive components (React.memo)
- [ ] Optimize re-renders (useMemo, useCallback)
- [ ] Debounce search input (300ms)
- [ ] Throttle progress updates (5s)
- [ ] Code splitting (lazy load screens)
- [ ] Reduce bundle size

#### Accessibility (Day 5)
- [ ] Screen reader support:
  - [ ] Semantic labels for all elements
  - [ ] Announce state changes
  - [ ] Logical focus order
- [ ] Touch targets:
  - [ ] Minimum 44x44pt
  - [ ] Adequate spacing
- [ ] Visual:
  - [ ] Color contrast ratios (WCAG AA)
  - [ ] Text scaling support
  - [ ] Reduced motion option
- [ ] Keyboard navigation (web)

#### Testing & QA (Day 5)
- [ ] Manual testing on iOS
- [ ] Manual testing on Android
- [ ] Test on physical devices
- [ ] Test various screen sizes
- [ ] Test slow network conditions
- [ ] Test offline mode
- [ ] Memory leak detection
- [ ] Crash testing

### Acceptance Criteria
- [ ] All loading states implemented
- [ ] Errors handled gracefully
- [ ] Smooth animations at 60fps
- [ ] App feels responsive and fast
- [ ] No memory leaks
- [ ] Meets WCAG AA accessibility standards
- [ ] Performance metrics within targets:
  - [ ] Time to Interactive < 3s
  - [ ] Smooth scrolling (60fps)
  - [ ] No jank in animations

### Dependencies
- All previous phases complete

### Blockers & Risks
- Performance issues on older devices (mitigate with optimization)

### Completion Notes
_To be filled upon phase completion_

---

## Post-Launch: API Integration (Future)
**Duration**: TBD
**Status**: 🔴 Planned

### Objectives
- Migrate from JSON to REST/GraphQL API
- Enable real-time content updates
- Implement authentication

### Tasks
- [ ] Design API schema
- [ ] Set up backend infrastructure
- [ ] Create API service layer
- [ ] Implement caching with React Query
- [ ] Add optimistic updates
- [ ] Sync local data to server
- [ ] Implement authentication
- [ ] Handle API errors
- [ ] Add offline queue for actions
- [ ] Remove JSON dependencies

---

## Success Metrics

### Phase 1
- ✅ 20 courses with 120+ lessons created
- ✅ Data structure validated
- ✅ Store persistence working

### Phase 2
- 🎯 All screens navigable
- 🎯 TypeScript compilation successful

### Phase 3
- 🎯 Course browsing smooth with 20+ courses
- 🎯 Search returns results < 300ms

### Phase 4
- 🎯 Enrollment flow completes in < 3 taps
- 🎯 Course detail loads in < 1s

### Phase 5
- 🎯 Video playback starts in < 2s
- 🎯 Progress tracking accurate to ±5s

### Phase 6
- 🎯 Dashboard loads in < 1s
- 🎯 Handles 50+ enrolled courses smoothly

### Phase 7
- 🎯 All screens score 90+ on performance
- 🎯 Zero critical accessibility issues

---

## Risk Management

### Identified Risks
1. **YouTube iframe limitations**: Mitigate with fallback to web view
2. **Performance on older devices**: Mitigate with optimization and testing
3. **Data structure changes**: Mitigate with TypeScript and validation
4. **State synchronization issues**: Mitigate with Zustand middleware
5. **Large bundle size**: Mitigate with code splitting

### Contingency Plans
- **Scope reduction**: Remove wishlist, achievements if behind schedule
- **Performance issues**: Prioritize optimization over new features
- **Technical blockers**: Escalate to team, consider alternatives

---

## Team & Resources

### Required Skills
- React Native development
- TypeScript
- State management (Zustand)
- Video player integration
- UI/UX design

### Tools
- Expo CLI
- React Native Debugger
- Flipper (for performance)
- TypeScript compiler

---

## Definition of Done

A phase is considered complete when:
- [ ] All tasks marked complete
- [ ] Acceptance criteria met
- [ ] Code reviewed (self-review minimum)
- [ ] TypeScript compiles without errors
- [ ] No console warnings
- [ ] Manual testing passed
- [ ] Documentation updated
- [ ] Committed to feature branch

---

## Progress Tracking

Update this roadmap after completing each phase with:
- Completion date
- Blockers encountered
- Lessons learned
- Time variance from estimate

**Last Updated**: November 18, 2025
**Current Phase**: Phase 1 (In Progress)
**Overall Progress**: 10% (2/7 phases complete)
