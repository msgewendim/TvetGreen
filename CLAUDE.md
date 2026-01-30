# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated**: 2026-01-30

## Project Overview

**TvetGreenBolt** is an Expo-based React Native mobile learning platform targeting TVET (Technical and Vocational Education and Training) education in rural/developing regions. The app features voice-guided learning, multilingual support, offline capabilities, and accessibility-first design.

**Key Features:**
- Voice-guided navigation and video controls
- Multilingual support (English, Swahili, Amharic)
- Offline-first course downloads with progress tracking
- Accessibility features for diverse literacy levels
- Category-based learning (Agriculture, Green Energy, Construction, Business)
- Video player with customizable playback and subtitles
- Learning progress tracking with persistent storage

## Technology Stack

**Core Framework:**
- **React**: 19.1.0 - UI framework
- **React Native**: 0.81.5 with New Architecture enabled
- **Expo**: SDK 54.0.23 - Managed native platform
- **TypeScript**: 5.9.3 with strict mode enabled

**Navigation:**
- **Expo Router**: 6.0.14 - File-based routing
- **React Navigation**: 7.0.14 - Navigation primitives
- **Bottom Tabs**: 7.2.0 - Tab navigation UI

**State Management:**
- **Zustand**: 5.0.8 - Global state management with AsyncStorage persistence
- **React Query**: 3.39.3 - Server state and data caching
- **React Context**: For shared providers (PlayerProvider, ThemeProvider)

**UI & Design:**
- **React Native Paper**: 5.14.5 - Material Design components
- **Lucide React Native**: 0.475.0 - Icon library
- **Custom Design System**: Centralized tokens and components in `src/design-system/`

**Internationalization:**
- **i18next**: 25.6.2 - i18n framework
- **react-i18next**: 16.3.3 - React bindings
- **expo-localization**: 17.0.7 - Device locale detection

**Media & Video:**
- **expo-av**: 16.0.7 - Audio/video playback
- **react-native-youtube-iframe**: 2.4.1 - YouTube embedding
- **react-native-webview**: 13.15.0 - WebView support

**Package Manager:**
- **pnpm** - Primary package manager (use `pnpm` for all scripts)

## Development Commands

### Starting Development
```bash
pnpm run dev
# or
EXPO_NO_TELEMETRY=1 pnpm expo start
```

Expo will start the Metro bundler. Press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- Scan QR code for physical device testing

### Building
```bash
pnpm run build:web
# Outputs to ./dist directory
```

### Linting
```bash
pnpm run lint
# Runs Biome linter with auto-fix
```

### Code Formatting
- **Biome** (primary): Tab indentation, double quotes
- **Prettier** (secondary): 2-space tabs

## Project Architecture

### Directory Structure

```
TvetGreenBolt/
├── app/                           # Expo Router - file-based routing
│   ├── _layout.tsx               # Root layout, providers, Stack navigator
│   ├── +not-found.tsx            # 404 error screen
│   ├── (tabs)/                   # Tab-based navigation group (5 tabs)
│   │   ├── _layout.tsx           # Tab navigator with PlayerProvider
│   │   ├── index.tsx             # Home dashboard
│   │   ├── courses.tsx           # Course catalog browser
│   │   ├── learn.tsx             # My learning/enrolled courses
│   │   ├── downloads.tsx         # Offline content management
│   │   └── profile.tsx           # User profile and settings
│   ├── video/                    # Video playback routes
│   │   └── [courseId]/
│   │       └── [lessonId].tsx    # Dynamic video player
│   ├── onboarding/               # First-time user setup flow
│   │   ├── _layout.tsx           # Onboarding Stack navigator
│   │   ├── welcome.tsx           # Initial welcome screen
│   │   ├── language.tsx          # Language selection
│   │   ├── goals.tsx             # Learning goals setup
│   │   ├── voice-setup.tsx       # Voice guide configuration
│   │   └── complete.tsx          # Onboarding completion
│   └── learning/                 # Learning platform routes
│       ├── _layout.tsx           # Learning Stack navigator
│       ├── categories.tsx        # Category browser
│       ├── courses/
│       │   ├── index.tsx         # Courses list
│       │   └── [id].tsx          # Course detail/enrollment
│       └── lesson/
│           └── [id].tsx          # Lesson player (modal)
│
├── src/                          # Source code - application logic
│   ├── components/               # Feature-specific components
│   │   ├── home/                # Home screen components
│   │   ├── learning/            # Learning platform components
│   │   ├── course/              # Course browse/filter components
│   │   ├── video/               # Video player components
│   │   ├── downloads/           # Download management components
│   │   ├── profile/             # Profile/settings components
│   │   │   ├── CommunityImpactCard.tsx  # Community stats
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   └── SettingItem.tsx
│   │   └── settings/            # Settings components
│   │       └── LanguageSelector.tsx
│   │
│   ├── design-system/           # Unified design system
│   │   ├── index.ts             # Main export barrel
│   │   ├── components/          # Primitive components
│   │   │   ├── buttons/         # Button, VoiceButton, CategoryButton
│   │   │   ├── cards/           # Card, CourseCard, CategoryCard
│   │   │   ├── inputs/          # Input, SearchInput, VoiceInput
│   │   │   ├── layout/          # ScreenLayout
│   │   │   ├── navigation/      # Header, BottomNav
│   │   │   ├── display/         # Avatar, Badge, Chip
│   │   │   └── feedback/        # ProgressBar, LoadingSpinner, EmptyState, Toast
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx # SafeAreaProvider + PaperProvider
│   │   │   └── theme.ts         # React Native Paper theme config
│   │   ├── tokens/              # Design tokens
│   │   │   ├── colors.ts        # Color palette (UPDATED)
│   │   │   ├── typography.ts    # Font sizes, weights
│   │   │   ├── spacing.ts       # Margin, padding, shadows
│   │   │   └── index.ts
│   │   └── styles/              # Shared style patterns (NEW)
│   │       └── commonStyles.ts  # Reusable section/title styles
│   │
│   ├── store/                   # Global state management (Zustand)
│   │   └── learningStore.ts     # Learning state with AsyncStorage persistence
│   │
│   ├── providers/               # React Context providers
│   │   └── player/
│   │       └── PlayerProvider.tsx # Video player modal context
│   │
│   ├── services/                # Service layer
│   │   └── query/
│   │       └── QueryClient.ts   # React Query client configuration
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── learning.ts          # Course, Lesson, Category, Enrollment types
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
│   ├── en/translation.json     # English
│   ├── sw/translation.json     # Swahili
│   └── am/translation.json     # Amharic
│
├── assets/                     # Static assets
├── docs/                       # Documentation
└── .planning/                  # GSD planning documents
```

### File-Based Routing

**Route Patterns:**
- `/` → Home tab (main dashboard)
- `/courses` → Course catalog
- `/learn` → My Learning (enrolled courses)
- `/downloads` → Offline downloads
- `/profile` → User profile
- `/onboarding/welcome` → First-time user flow
- `/video/[courseId]/[lessonId]` → Video lesson player
- `/learning/categories` → Category browser
- `/learning/courses/[id]` → Course detail
- `/learning/lesson/[id]` → Lesson player (modal)

### Navigation Architecture

**Three-Level Navigation:**
1. **Root Stack** (`app/_layout.tsx`): Controls top-level flows (onboarding, video, tabs, learning)
2. **Tab Navigator** (`app/(tabs)/_layout.tsx`): Bottom tab bar with 5 tabs (home, courses, learn, downloads, profile)
3. **Nested Stacks**: Onboarding and Learning flows use nested Stack navigators

**Navigation Patterns:**
- Use `expo-router` hooks: `useRouter()`, `useLocalSearchParams()`
- Navigate with `router.push()`, `router.back()`, `router.replace()`
- Dynamic routes use bracket syntax: `[courseId]`, `[lessonId]`, `[id]`

## Design System (UPDATED 2026-01-30)

### Color Palette

**Modern Green & Orange Theme** (Updated from original earthy palette):

```typescript
// Primary - Green (growth, agriculture, sustainability)
primary: {
  main: "#16A34A",      // Primary green
  light: "#22C55E",     // Lighter variant
  dark: "#15803D",      // Darker variant
  surface: "#F0FDF4",   // Light background
}

// Secondary - Orange (energy, enthusiasm, warmth)
secondary: {
  main: "#F97316",      // Primary orange
  light: "#FB923C",     // Lighter variant
  dark: "#EA580C",      // Darker variant
  surface: "#FFF7ED",   // Light background
}

// Neutral - Cream/Gray palette
neutral: {
  cream: "#FEF9F1",     // Primary background
  white: "#FFFFFF",
  50-800: ...           // Gray scale
}

// Feedback colors
feedback: {
  success: "#22C55E",
  successLight: "#F0FDF4",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
}

// Category colors
categories: {
  agriculture: "#16A34A",
  greenEnergy: "#F97316",
  construction: "#F59E0B",
  business: "#3B82F6",
}

// Text colors
text: {
  primary: "#1F2937",
  secondary: "#6B7280",
  tertiary: "#9CA3AF",
  inverse: "#FFFFFF",
  disabled: "#D1D5DB",
}

// Background colors
background: {
  primary: "#FEF9F1",   // Main background
  cream: "#FEF9F1",     // Alias
  secondary: "#FFFFFF",
  tertiary: "#F9FAFB",
  overlay: "rgba(0, 0, 0, 0.5)",
}
```

**Usage:**
```tsx
import { colors } from "@/design-system";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
  },
  title: {
    color: colors.text.primary,
  },
});
```

### Typography Tokens

```typescript
// Font sizes
fontSize: {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
}

// Font weights
fontWeight: {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
}

// Line heights
lineHeight: {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
}
```

### Spacing Tokens

```typescript
// Spacing scale (4px grid)
spacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
}

// Border radius
radius: {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

// Shadows
shadow: {
  sm: { shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  md: { shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 },
  lg: { shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  xl: { shadowOpacity: 0.25, shadowRadius: 16, elevation: 12 },
}

// Icon sizes
iconSize: {
  xs: 16, sm: 20, md: 24, lg: 32, xl: 48,
}

// Minimum touch target (WCAG)
minTouchTarget: 44,
```

### Common Styles (NEW)

Reusable style patterns for consistency across screens:

```tsx
import { commonStyles } from "@/design-system";

const styles = StyleSheet.create({
  section: commonStyles.section,           // Standard section container
  sectionTitle: commonStyles.sectionTitle, // Standard section title
  sectionHeader: commonStyles.sectionHeader, // Header with action button
  // ... custom styles
});
```

### Design System Components

**Import from `@/design-system`:**

```tsx
import {
  // Layout
  ScreenLayout,
  Header,

  // Buttons
  Button,
  VoiceButton,
  CategoryButton,

  // Cards
  Card,
  CourseCard,
  CategoryCard,

  // Inputs
  Input,
  SearchInput,
  VoiceInput,

  // Feedback
  ProgressBar,
  LoadingSpinner,
  EmptyState,
  Toast,

  // Display
  Avatar,
  Badge,
  Chip,

  // Tokens
  colors,
  spacing,
  typography,

  // Common styles
  commonStyles,
} from "@/design-system";
```

## State Management

### Zustand Store (Learning State)

**Location**: `src/store/learningStore.ts`

**Features**:
- Course enrollments tracking
- Lesson progress tracking
- AsyncStorage persistence (debounced 500ms)
- Optimistic updates

**Usage**:
```tsx
import { useLearningStore } from "@/src/store/learningStore";

function MyComponent() {
  const enrollments = useLearningStore(state => state.enrollments);
  const enrollInCourse = useLearningStore(state => state.enrollInCourse);
  const updateLessonProgress = useLearningStore(state => state.updateLessonProgress);

  // Actions
  await enrollInCourse(courseId);
  await updateLessonProgress(lessonId, { completed: true, watchedDuration: 300 });
}
```

### React Query (Server State)

**Location**: `src/services/query/QueryClient.ts`

**Usage**:
```tsx
import { useVideos } from "@/hooks/useVideos";
import { useCourses } from "@/hooks/useCourses";

function MyComponent() {
  const { data: videos, isLoading, error } = useVideos();
  const { courses } = useCourses();
}
```

### Context Providers

**PlayerProvider** (`src/providers/player/PlayerProvider.tsx`):
- Global video player modal
- YouTube iframe integration
- Platform-specific rendering

**ThemeProvider** (`src/design-system/theme/ThemeProvider.tsx`):
- SafeAreaProvider wrapper
- React Native Paper theme

## Key Implementation Patterns

### Screen Layout Pattern (UPDATED)

Use the `ScreenLayout` component and design tokens:

```tsx
import {
  ScreenLayout,
  Header,
  colors,
  spacing,
  typography,
  commonStyles,
} from "@/design-system";

export default function MyScreen() {
  return (
    <ScreenLayout headerExtendsToStatusBar>
      <Header title="Screen Title" subtitle="Subtitle" />

      <View style={commonStyles.section}>
        <Text style={commonStyles.sectionTitle}>Section Title</Text>
        {/* Content */}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  customStyle: {
    padding: spacing.lg,
    backgroundColor: colors.primary.surface,
    borderRadius: spacing.radius.md,
  },
});
```

### Voice Button Pattern

```tsx
import { VoiceButton } from "@/design-system";

<VoiceButton
  isListening={isListening}
  onPress={toggleVoiceGuide}
/>
```

### Card Component Pattern

```tsx
import { Card, CourseCard } from "@/design-system";

// Generic card
<Card>
  <Text>Card content</Text>
</Card>

// Course card
<CourseCard
  course={course}
  onPress={() => router.push(`/learning/courses/${course.id}`)}
/>
```

## Voice Guide Integration

Voice recognition is a core accessibility feature:

**Implementation Patterns:**
- Toggle state: `isListening` boolean
- Visual feedback: Pulse rings, color changes
- Pause video/content when voice guide is active
- Overlay with clear voice commands/instructions
- Use `VoiceButton` component from design system

**Voice Commands (as designed):**
- "Play", "Pause", "Next", "Previous"
- "Continue course", "Browse courses"
- "Repeat", "Bookmark"

## Video Player Architecture

**Key Features**:
- Custom controls overlay (auto-hide after 3s)
- Progress tracking with visual progress bar
- Playback speed control (0.5x to 2.0x)
- Multilingual subtitle system
- Voice command integration
- Course progress visualization
- Next lesson auto-suggestion
- Download status indicators

**State Management**:
- Local player state via `useVideoPlayer` hook
- Global progress via `useLearningStore`
- Player modal via `PlayerProvider` context

## Development Guidelines

### Adding New Screens

1. Create file in appropriate `app/` subdirectory
2. Use `ScreenLayout` and `Header` components
3. Import design tokens: `colors`, `spacing`, `typography`
4. Use `commonStyles` for standard patterns
5. Follow TypeScript strict mode
6. Include accessibility labels

### Styling Approach

**DO:**
- Import design tokens: `import { colors, spacing, typography } from "@/design-system"`
- Use `commonStyles` for section/title patterns
- Apply spacing tokens: `spacing.lg`, `spacing.md`
- Use shadow tokens: `...spacing.shadow.lg`
- Keep styles at bottom of file with `StyleSheet.create()`

**DON'T:**
- Use hardcoded colors (`#16A34A` → `colors.primary.main`)
- Use magic numbers (`20` → `spacing.lg`)
- Use inline styles (use StyleSheet for performance)
- Skip accessibility labels on interactive elements

### Component Organization

**Feature Components** (`src/components/[feature]/`):
- Group by feature domain (home, learning, course, video, downloads, profile)
- Export via barrel files (`index.ts`)
- Use design system primitives as building blocks

**Design System Components** (`src/design-system/components/`):
- Reusable, themed primitives
- Accept design tokens via props
- Include accessibility compliance
- Document with TypeScript interfaces

### State Management Guidelines

**Local State (useState)**:
- UI state (modals, dropdowns, forms)
- Component-specific toggles
- Temporary input values

**Zustand Store**:
- Learning progress
- Enrollments
- Persistent user data

**React Query**:
- Server data fetching
- API responses
- Cached remote state

**Context**:
- Cross-cutting concerns (theme, video player, i18n)

### Localization

**Add New Translation**:
1. Add key to `locales/en/translation.json`
2. Add corresponding keys to `sw/` and `am/`
3. Use in components: `const { t } = useLanguage(); t("key.path")`

**Supported Languages**:
- English (en) - Default
- Swahili (sw)
- Amharic (am)

### Accessibility Requirements

- Add `accessibilityLabel` to all interactive elements
- Use semantic color contrast (design tokens ensure WCAG AA)
- Support voice navigation throughout
- Provide text alternatives for icons
- Use `spacing.minTouchTarget` (44px) for touch targets

## Naming Conventions

**Files:**
- Screens/routes: lowercase (`index.tsx`, `[id].tsx`, `welcome.tsx`)
- Components: PascalCase (`CourseCard.tsx`, `VideoControls.tsx`)
- Hooks: camelCase (`useCourses.ts`, `useVideoPlayer.ts`)

**Functions:**
- camelCase for all functions
- Prefix handlers with `handle`: `handlePress`, `handleLanguageChange`
- Prefix toggles with `toggle`: `toggleVoiceGuide`, `togglePlayPause`
- Prefix setters with `set`: `setIsPlaying`, `setCurrentTime`

**Variables:**
- camelCase for all variables
- Boolean prefix with `is`, `show`, `has`: `isPlaying`, `showControls`, `hasError`
- Plural for collections: `courses`, `lessons`, `enrollments`

**Types:**
- PascalCase for interfaces: `Course`, `Lesson`, `UserProfile`
- Suffix props with `Props`: `CourseCardProps`, `HeaderProps`

## Common Patterns

### Data Fetching
```tsx
const { courses, isLoading, error } = useCourses();

if (isLoading) return <LoadingSpinner />;
if (error) return <EmptyState message="Failed to load courses" />;
```

### Navigation
```tsx
import { useRouter } from "expo-router";

const router = useRouter();
router.push(`/learning/courses/${courseId}`);
router.back();
router.replace("/(tabs)");
```

### Enrollments
```tsx
const enrollInCourse = useLearningStore(state => state.enrollInCourse);
const isEnrolled = useLearningStore(state =>
  state.enrollments.some(e => e.courseId === courseId)
);

await enrollInCourse(courseId);
```

### Progress Tracking
```tsx
const updateLessonProgress = useLearningStore(state => state.updateLessonProgress);

await updateLessonProgress(lessonId, {
  completed: true,
  watchedDuration: 300,
  lastWatchedAt: new Date().toISOString(),
});
```

## Testing Approach

```bash
# Run on iOS simulator
pnpm run dev
# Press 'i' in terminal

# Run on Android emulator
pnpm run dev
# Press 'a' in terminal

# Test web version
pnpm run dev
# Press 'w' in terminal
```

## Future Considerations

**Backend Integration:**
- Currently uses mock data (static JSON in `src/data/courses/`)
- Will need API integration for production
- Consider using tRPC or GraphQL for type-safe APIs

**State Management:**
- React Query for server state (already integrated)
- Zustand for client state (already integrated)
- Consider Redux Toolkit for complex state if needed

**Real Video Playback:**
- Currently uses YouTube iframe and mock video URLs
- Consider implementing native video player with `expo-av`
- Implement video streaming/caching for offline

**Voice Recognition:**
- Integrate `expo-speech` for text-to-speech
- Integrate speech recognition library for voice commands
- Currently mock implementation

## Important Notes

- **Always use pnpm** for package management and running scripts
- **Design system is the source of truth** for colors, spacing, typography
- **TypeScript strict mode** is enabled - all types must be properly defined
- **Accessibility is a priority** - include labels and support voice navigation
- **Mobile-first approach** - optimize for mobile, enhance for web

---

**For detailed architecture and conventions**, see `.planning/codebase/` directory:
- `ARCHITECTURE.md` - Overall architecture patterns
- `STRUCTURE.md` - Directory organization
- `STACK.md` - Technology stack details
- `CONVENTIONS.md` - Coding standards
