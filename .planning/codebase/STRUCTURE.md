# Codebase Structure

**Analysis Date:** 2026-01-28

## Directory Layout

```
TvetGreenBolt/
├── app/                           # Expo Router - file-based routing
│   ├── _layout.tsx               # Root layout, providers, Stack navigator
│   ├── +not-found.tsx            # 404 error screen
│   ├── (tabs)/                   # Tab-based navigation group
│   │   ├── _layout.tsx           # Tab navigator (5 tabs)
│   │   ├── index.tsx             # Home dashboard
│   │   ├── courses.tsx           # Course catalog browser
│   │   ├── learn.tsx             # My learning/enrolled courses
│   │   ├── downloads.tsx         # Offline content management
│   │   └── profile.tsx           # User profile and settings
│   ├── video/                    # Video playback routes
│   │   └── [courseId]/
│   │       └── [lessonId].tsx    # Dynamic video player screen
│   ├── onboarding/               # First-time user setup flow
│   │   ├── _layout.tsx           # Onboarding Stack navigator
│   │   ├── welcome.tsx           # Initial welcome screen
│   │   ├── language.tsx          # Language selection
│   │   ├── goals.tsx             # Learning goals setup
│   │   ├── voice-setup.tsx       # Voice guide configuration
│   │   └── complete.tsx          # Onboarding completion
│   └── learning/                 # Learning platform routes (alternative/nested structure)
│       ├── _layout.tsx           # Learning Stack navigator
│       ├── categories.tsx        # Category browser
│       ├── courses/
│       │   ├── index.tsx         # Courses list
│       │   └── [id].tsx          # Course detail/enrollment
│       └── lesson/
│           └── [id].tsx          # Lesson player (full-screen modal)
│
├── src/                          # Source code - application logic
│   ├── components/               # Feature-specific components
│   │   ├── home/                # Home screen components
│   │   │   ├── CurrentCourseCard.tsx
│   │   │   ├── NextLessonCard.tsx
│   │   │   ├── QuickActionsGrid.tsx
│   │   │   ├── ActivityList.tsx
│   │   │   ├── AchievementBanner.tsx
│   │   │   └── index.ts          # Barrel export
│   │   ├── learning/            # Learning platform components
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── EnrolledCourseCard.tsx
│   │   │   ├── LessonListItem.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── AchievementBadge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── course/              # Course browse/filter components
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CoursesList.tsx
│   │   │   ├── CategoriesGrid.tsx
│   │   │   ├── CategoryFilters.tsx
│   │   │   └── index.ts
│   │   ├── video/               # Video player components
│   │   │   ├── player.tsx
│   │   │   ├── VideoControls.tsx
│   │   │   ├── VideoSettingsPanel.tsx
│   │   │   ├── LessonInfoPanel.tsx
│   │   │   ├── VoiceGuideOverlay.tsx
│   │   │   ├── SubtitlesOverlay.tsx
│   │   │   └── index.ts
│   │   ├── downloads/           # Download management components
│   │   │   ├── DownloadedCourseCard.tsx
│   │   │   ├── QueuedDownloadCard.tsx
│   │   │   ├── StorageCard.tsx
│   │   │   └── index.ts
│   │   ├── profile/             # Profile/settings components
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── SettingItem.tsx
│   │   │   └── index.ts
│   │   └── settings/            # Settings/config components
│   │       ├── LanguageSelector.tsx
│   │       └── index.ts
│   │
│   ├── design-system/           # Unified design system
│   │   ├── index.ts             # Main export barrel
│   │   ├── components/          # Reusable primitive components
│   │   │   ├── buttons/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── VoiceButton.tsx
│   │   │   │   ├── CategoryButton.tsx
│   │   │   │   └── index.ts
│   │   │   ├── cards/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── inputs/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   ├── VoiceInput.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── ScreenLayout.tsx
│   │   │   │   └── index.ts
│   │   │   ├── navigation/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── index.ts
│   │   │   ├── display/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Chip.tsx
│   │   │   │   └── index.ts
│   │   │   ├── feedback/
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx # SafeAreaProvider + PaperProvider
│   │   │   ├── theme.ts         # React Native Paper theme config
│   │   │   └── index.ts
│   │   └── tokens/              # Design tokens
│   │       ├── colors.ts        # Color palette
│   │       ├── typography.ts    # Font sizes, weights
│   │       ├── spacing.ts       # Margin, padding scales
│   │       └── index.ts
│   │
│   ├── store/                   # Global state management (Zustand)
│   │   └── learningStore.ts     # Zustand store with AsyncStorage persistence
│   │
│   ├── providers/               # React Context providers
│   │   └── player/
│   │       └── PlayerProvider.tsx # Video player modal context
│   │
│   ├── services/                # Service layer
│   │   └── query/
│   │       └── QueryClient.ts   # React Query client configuration
│   │
│   ├── screens/                 # Alternative screen organization (less used)
│   │   └── learning/
│   │       ├── CategoriesScreen.tsx
│   │       ├── CoursesListScreen.tsx
│   │       ├── CourseDetailScreen.tsx
│   │       ├── LessonPlayerScreen.tsx
│   │       └── MyLearningScreen.tsx
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── learning.ts          # Domain types (Course, Lesson, etc)
│   │   ├── design-system.d.ts   # Component prop types
│   │   └── api.ts              # API response types
│   │
│   └── data/                    # Static data files
│       └── courses/
│           ├── categories.json  # Category definitions
│           ├── courses.json     # Course catalog
│           └── lessons.json     # Lesson content
│
├── hooks/                       # Custom React hooks
│   ├── useLanguage.ts          # Language/i18n management
│   ├── useFrameworkReady.ts    # Framework detection for Bolt.new
│   ├── useCourses.ts           # Course data fetching with transformation
│   ├── useVideos.ts            # Video data with React Query
│   ├── useLesson.ts            # Single lesson data
│   ├── useVideoPlayer.ts       # Video player state management
│   └── useCourseFilters.ts     # Course filtering/search
│
├── api/                        # API layer
│   └── videos/
│       ├── index.ts            # fetchVideos function
│       └── response.json        # Mock video data
│
├── locales/                    # i18n translation files
│   ├── en/
│   │   └── translation.json    # English translations
│   ├── sw/
│   │   └── translation.json    # Swahili translations
│   └── am/
│       └── translation.json    # Amharic translations
│
├── assets/                     # Static assets
│   ├── fonts/                  # Custom fonts
│   ├── images/                 # PNG/JPG images
│   └── icons/                  # Icon assets
│
├── public/                     # Web static files
│   └── manifest.json          # Web manifest
│
├── docs/                       # Documentation
│   ├── DATA_STRUCTURE.md       # Data schema documentation
│   └── API.md                  # API documentation
│
├── .planning/                  # GSD planning documents
│   └── codebase/              # Codebase analysis docs
│
├── app.json                    # Expo/React Native config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
├── pnpm-lock.yaml            # Dependency lock file
├── biome.json                 # Code formatter/linter config
├── .prettierrc                # Prettier formatting
├── i18n.config.ts            # i18n initialization
├── CLAUDE.md                  # Claude AI instructions
└── README.md                  # Project documentation
```

## Directory Purposes

**app/:** Expo Router file-based routing structure defining all navigable screens and flow

**src/components/:** Feature domain-specific components (home, learning, video, etc)

**src/design-system/:** Centralized UI primitives, theme, and design tokens

**src/store/:** Zustand store with AsyncStorage persistence for global learning state

**src/providers/:** React Context providers for shared functionality (video player, theme)

**src/services/:** Service layer with React Query client and API abstractions

**src/types/:** TypeScript interfaces and type definitions for type safety

**src/data/:** Static JSON data files for course catalog, lessons, categories

**hooks/:** Custom React hooks for data access, state management, and framework integration

**api/:** API client layer with mock data and fetch functions

**locales/:** i18n translation files (English, Swahili, Amharic)

**assets/:** Static resources (fonts, images, icons)

**docs/:** Project documentation and data schemas

## Key File Locations

**Entry Points:**
- `app/_layout.tsx`: Root layout initializing all providers and routing
- `app/(tabs)/_layout.tsx`: Tab-based navigation setup (home, courses, learn, downloads, profile)
- `app/learning/_layout.tsx`: Learning flow nested Stack navigator

**Configuration:**
- `app.json`: Expo/React Native project config (SDK version, plugins, icons)
- `tsconfig.json`: TypeScript strict mode and path aliases
- `i18n.config.ts`: i18n setup with language detector and translation loading
- `package.json`: Dependencies (expo, react, react-native, zustand, react-query, etc)

**Core Logic:**
- `src/store/learningStore.ts`: Central learning state (courses, enrollments, progress, persistence)
- `src/providers/player/PlayerProvider.tsx`: Global video player modal via Context
- `hooks/useLanguage.ts`: Localization and language switching
- `hooks/useCourses.ts`: Course data with transformation
- `hooks/useVideos.ts`: Video data fetching with React Query

**Theme & Design:**
- `src/design-system/tokens/colors.ts`: Color palette (green #2E8B57, cream #FDF5E6, etc)
- `src/design-system/theme/ThemeProvider.tsx`: SafeAreaProvider + Paper theme wrapper
- `src/design-system/components/`: Primitive components for consistent styling

**Testing:**
- Not yet present in current structure

## Naming Conventions

**Files:**
- `camelCase` for TypeScript files: `useLanguage.ts`, `useCourses.ts`
- `PascalCase` for component files: `VideoControls.tsx`, `CourseCard.tsx`
- `camelCase` for screens/routes in app/: `index.tsx`, `+not-found.tsx`, `[courseId].tsx`
- `camelCase` with full words for hooks: `useVideoPlayer.ts`, not `useVidPlayer.ts`

**Directories:**
- Lowercase plural for feature domain containers: `components/`, `hooks/`, `providers/`
- Lowercase singular for specific features: `home/`, `learning/`, `video/`
- Lowercase for tokens/services: `tokens/`, `services/`

**Types:**
- `PascalCase` for interface names: `Course`, `Lesson`, `LessonProgress`
- `camelCase` for properties: `courseId`, `lessonId`, `enrolledAt`
- `SuffixStatus` or `Type` for union types: `EnrollmentStatus`, `CourseLevel`

**Components:**
- `PascalCase` function names: `export default function HomeScreen()`
- Subcomponents in same file: `<ScreenLayout />`, `<Header />`
- Index files export as named exports: `export { CurrentCourseCard } from './CurrentCourseCard'`

## Where to Add New Code

**New Feature (e.g., Quizzes):**
- Primary code: Create `app/learning/quiz/[lessonId].tsx` for route, `src/components/quiz/` for components
- State: Extend `src/store/learningStore.ts` with quiz progress tracking
- Types: Add `Quiz`, `QuizAnswer` to `src/types/learning.ts`
- Tests: Create `quiz.test.ts` (when testing added)

**New Component/Module:**
- Implementation: `src/components/[feature]/ComponentName.tsx`
- Styling: Use design system tokens via `import { colors } from '@/design-system'`
- Export: Add to feature index: `src/components/[feature]/index.ts`
- Usage: Import from barrel: `import { ComponentName } from '@/src/components/[feature]'`

**Utilities:**
- Shared helpers: `src/services/` for API/query layer, `src/utils/` (if created) for helpers
- Custom hooks: `hooks/useFeatureName.ts`
- Type helpers: `src/types/` for shared types

## Special Directories

**app/(tabs):**
- Purpose: Tab-based navigation group with shared PlayerProvider context
- Generated: No
- Committed: Yes
- Pattern: Parentheses group routes without path segment; 5 tabs (home, courses, learn, downloads, profile)

**locales/:**
- Purpose: i18n translation files organized by language code
- Generated: No (manually managed)
- Committed: Yes
- Pattern: `locales/[language]/translation.json` with nested key structure

**src/data/:**
- Purpose: Static JSON seed data for development (categories, courses, lessons)
- Generated: No (manual data files)
- Committed: Yes
- Pattern: JSON files matching types in `src/types/learning.ts`

**src/design-system/tokens/:**
- Purpose: Centralized design token definitions (colors, spacing, typography)
- Generated: No
- Committed: Yes
- Pattern: Export objects/constants for use in components and theme config

**.planning/codebase/:**
- Purpose: GSD orchestrator analysis documents
- Generated: Yes (via `/gsd:map-codebase` command)
- Committed: No (ephemeral planning artifacts)
- Pattern: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

---

*Structure analysis: 2026-01-28*
