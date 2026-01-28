# Architecture

**Analysis Date:** 2026-01-28

## Pattern Overview

**Overall:** Mobile-First Modular Architecture with Client-Side State Management

**Key Characteristics:**
- Expo Router file-based routing (React Native / web)
- Zustand for persistent client state with AsyncStorage
- React Query for remote data fetching and caching
- Modular component organization with design system layer
- Context-based providers for shared functionality (video player, theme, i18n)
- TypeScript strict mode throughout

## Layers

**Routing Layer:**
- Purpose: Navigation and screen composition
- Location: `app/`
- Contains: Expo Router layout files, screen definitions, dynamic routes
- Depends on: React Native, expo-router, providers
- Used by: Browser/device as entry point to application

**Screen & Feature Layer:**
- Purpose: Page-level compositions and feature screens
- Location: `app/(tabs)/`, `app/learning/`, `app/video/`, `app/onboarding/`
- Contains: Screen exports that orchestrate components and data
- Depends on: Components, hooks, stores
- Used by: Routing layer to render pages

**Component Layer:**
- Purpose: Reusable UI components organized by feature domain
- Location: `src/components/` (feature components) and `src/design-system/components/` (design system primitives)
- Contains: Feature-specific components (home, learning, video, downloads, profile) and design system components (buttons, cards, inputs, layouts)
- Depends on: Design tokens, design system primitives, hooks
- Used by: Screens and other components

**Design System Layer:**
- Purpose: Centralized design tokens, theme, and primitive components
- Location: `src/design-system/`
- Contains: Theme provider, color tokens, typography tokens, spacing tokens, button/card/input primitives
- Depends on: React Native, lucide-react-native, react-native-paper
- Used by: All components for consistent styling and theme access

**State Management Layer:**
- Purpose: Persistent application state and data flow
- Location: `src/store/` (Zustand stores), `src/providers/` (Context providers)
- Contains: Learning store (Zustand), Player provider (Context), Theme provider
- Depends on: AsyncStorage, React Context, Zustand
- Used by: All screens and components for state access

**Data & Services Layer:**
- Purpose: Data fetching, caching, and service abstractions
- Location: `src/services/`, `api/`, `hooks/`
- Contains: QueryClient configuration, custom hooks (useVideos, useCourses, useLesson), API response handlers
- Depends on: React Query, axios/fetch, static data
- Used by: Components and stores for data access

**Type Definition Layer:**
- Purpose: TypeScript type definitions and interfaces
- Location: `src/types/`
- Contains: Learning platform types (Course, Lesson, Category, Enrollment, LessonProgress), design system types
- Depends on: None (pure types)
- Used by: All layers for type safety

## Data Flow

**Course Browsing Flow:**

1. User navigates to `/courses` tab
2. `app/(tabs)/courses.tsx` renders (or `app/learning/courses/index.tsx`)
3. Component calls `useCourses()` hook
4. Hook calls `useVideos()` which uses React Query `useQuery` with `fetchVideos`
5. `api/videos/index.ts` fetches from static `response.json` or remote endpoint
6. Data transformed to Course type by `useCourses` memoization
7. Component renders course cards with loaded data
8. User taps course → navigates to `/learning/courses/[id]` with course context

**Video Playback Flow:**

1. User taps lesson from course detail page
2. Navigates to `/learning/lesson/[id]` (full-screen modal presentation)
3. `app/learning/lesson/[id].tsx` loads lesson with `useLesson()` hook
4. Component manages local video player state: `isPlaying`, `isMuted`, `showControls`, `currentTime`, `duration`
5. Video is rendered via custom player component or WebView for YouTube
6. Player context (`PlayerProvider`) wraps tab navigator to provide global video modal
7. On video completion, lesson progress tracked via `useLearningStore.updateLessonProgress()`
8. Progress persisted to AsyncStorage via Zustand store debounced save

**Learning Enrollment Flow:**

1. User taps "Enroll" on course detail
2. Calls `useLearningStore.enrollInCourse(courseId)`
3. Zustand store creates enrollment record with timestamp
4. Saves to AsyncStorage with debounced persistence (500ms)
5. Store mutation updates `enrollments` array in state
6. Component re-renders with updated course status (isEnrolled: true)
7. User appears in "My Learning" list via `getEnrolledCourses()` selector

**Localization Flow:**

1. App initializes i18n config in `app/_layout.tsx` via import `../i18n.config`
2. Language detector checks AsyncStorage for saved language, falls back to device locale
3. Loads appropriate translation file (en/sw/am from `locales/`)
4. Components use `useLanguage()` hook to access `t()` translation function
5. User changes language → calls `changeLanguage()` → saves to AsyncStorage → i18n reloads translations
6. All text re-renders automatically via React i18next integration

## Key Abstractions

**Learning Store (Zustand):**
- Purpose: Single source of truth for learning platform state
- Examples: `src/store/learningStore.ts`
- Pattern: Create hook with persist middleware, AsyncStorage integration, selectors for derived state
- Responsibilities: Course/lesson/category management, enrollment tracking, progress tracking, persistence

**Video Player Provider (Context):**
- Purpose: Global video modal accessible from anywhere in app
- Examples: `src/providers/player/PlayerProvider.tsx`
- Pattern: Context provider with modal overlay, YouTube iframe/WebView integration, open/close callbacks
- Responsibilities: Video modal state, YouTube video embedding, platform-specific rendering

**Hooks for Data Access:**
- Purpose: Encapsulate data fetching logic and transformations
- Examples: `hooks/useCourses.ts`, `hooks/useVideos.ts`, `hooks/useLesson.ts`
- Pattern: Custom hooks wrapping React Query or Zustand, return typed data with loading/error states
- Responsibilities: Data transformation, memoization, composition

**Design System Components:**
- Purpose: Reusable, themed, accessible primitives
- Examples: `src/design-system/components/buttons/Button.tsx`, `src/design-system/components/cards/Card.tsx`
- Pattern: Functional components with StyleSheet, accept theme colors via props, accessibility labels
- Responsibilities: Consistent styling, theme enforcement, accessibility compliance

## Entry Points

**Root Layout:**
- Location: `app/_layout.tsx`
- Triggers: App initialization on any platform (iOS/Android/web)
- Responsibilities: Wraps entire app with providers (ThemeProvider, QueryClientProvider), initializes i18n, sets up Stack navigator with onboarding/video/tabs routes

**Tab Navigator:**
- Location: `app/(tabs)/_layout.tsx`
- Triggers: After onboarding completion, renders default app view
- Responsibilities: Renders 5-tab bottom navigation (home, courses, learn, downloads, profile), wraps PlayerProvider context

**Learning Stack:**
- Location: `app/learning/_layout.tsx`
- Triggers: When user navigates to learning flow from other sections
- Responsibilities: Nested Stack navigator for categories → courses → course details → lesson playback

**Onboarding Stack:**
- Location: `app/onboarding/_layout.tsx`
- Triggers: First app launch (detected elsewhere, typically in app._layout or post-auth)
- Responsibilities: Linear flow through welcome → language selection → goals → voice setup → completion

## Error Handling

**Strategy:** Try-catch with console.error logging and graceful fallbacks

**Patterns:**

1. **Async Operations (Zustand actions):**
   ```typescript
   // In store: try-catch wrapping async operations
   // Set isLoading, error state on failure
   // Return early without crashing
   ```

2. **Data Fetching (React Query):**
   ```typescript
   // useQuery: error field populated, isLoading=false on failure
   // useVideos hook checks data existence before using
   // Component renders empty state or null if error/no data
   ```

3. **Language Detection:**
   ```typescript
   // Fallback to English if locale detection fails
   // Silent error catch with console warning
   ```

4. **Storage Operations:**
   ```typescript
   // AsyncStorage errors caught, logged, silently fail
   // App continues with in-memory data
   ```

## Cross-Cutting Concerns

**Logging:** console.error for failures in async operations, console.log for non-critical info

**Validation:** TypeScript types enforce structure, minimal runtime validation in stores

**Authentication:** Not yet implemented; placeholder DEFAULT_USER_ID in learning store

**Styling:** Centralized theme via ThemeProvider, design tokens from `src/design-system/tokens/`, StyleSheet.create() for performance

**Accessibility:**
- `accessibilityLabel` on interactive elements (buttons, touchables)
- Semantic hierarchy with Text component variations
- Color contrast enforced via design system tokens
- Icon alternatives with text labels where applicable

---

*Architecture analysis: 2026-01-28*
