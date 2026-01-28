# Coding Conventions

**Analysis Date:** 2026-01-28

## Naming Patterns

**Files:**
- Lowercase kebab-case for routes and screens: `welcome.tsx`, `[courseId].tsx`, `_layout.tsx`
- PascalCase for component files: `CurrentCourseCard.tsx`, `VideoControls.tsx`
- Lowercase camelCase for hooks: `useVideoPlayer.ts`, `useCourses.ts`, `useLanguage.ts`
- Lowercase camelCase for utility/service files: `QueryClient.ts`, `learningStore.ts`
- Lowercase with hyphens for type definition files: `design-system.d.ts`

**Functions:**
- camelCase for all function declarations and function components
- useXxx naming pattern for React hooks (required by convention)
- Verb-first naming for action/handler functions: `togglePlayPause`, `handleSeek`, `markLessonComplete`
- Prefix handlers with `handle`: `handleCompleteLesson`, `handleNext`, `handleLanguageChange`
- Prefix setters with `set`: `setIsPlaying`, `setCurrentTime`, `setShowControls`
- Prefix toggle functions with `toggle`: `toggleVoiceGuide`, `togglePlayPause`

**Variables:**
- camelCase for all variable declarations
- Boolean variables prefixed with `is`, `show`, or `has`: `isPlaying`, `showControls`, `isListening`, `hasError`
- Plural nouns for collections: `courses`, `lessons`, `enrollments`, `subtitleLanguages`
- CONSTANT_CASE for true constants/configuration: `ENROLLMENTS_KEY`, `LESSON_PROGRESS_KEY`, `DEFAULT_USER_ID`, `playbackSpeeds`
- Single letter or short vars in loops acceptable: `i`, `e`, `c`, `p`

**Types:**
- PascalCase for interface and type names: `CurrentCourse`, `UseVideoPlayerOptions`, `LearningState`, `Course`, `Lesson`
- Include suffix in type names when clarifying purpose: `CurrentCourseCardProps`, `YtPlaylistItem`, `LessonProgress`
- Prefix optional fields in types with `?`: `category?: string`, `onContinue?: () => void`

## Code Style

**Formatting:**
- Biome 2.2.5 as primary formatter with tab indentation (configured in `biome.json`)
- Tab indentation enabled: `indentStyle: "tab"`
- Double quotes for JavaScript/TypeScript strings (per `biome.json`: `quoteStyle: "double"`)
- Prettier as secondary formatter with 2-space indentation (`.prettierrc`): `tabWidth: 2`
- Single quotes for component prop values in JSX (camelCase prop names)
- 2-space indentation in styled objects and configuration files

**Linting:**
- Biome linter with recommended rule set enabled
- File: `biome.json` with `recommended: true` rules
- Import organization disabled: `organizeImports: "off"` (manual control)
- Assist actions disabled for import organization

**Indentation Conflict:** biome.json uses tabs while .prettierrc uses 2-space tabs. Priority: Biome (tabs) for primary lint/format passes.

## Import Organization

**Order:**
1. External React and framework imports: `react`, `react-native`, `expo-*` packages
2. Third-party library imports: `react-i18next`, `zustand`, `lucide-react-native`, `react-query`
3. Internal absolute path imports from `@/` alias: `@/design-system`, `@/hooks`, `@/src`
4. Type imports: `import type { ... }`
5. Side-effect imports: `import "../i18n.config"` (for initialization)

**Path Aliases:**
- `@/*` maps to project root
- `@/design-system` maps to `./src/design-system`
- Used consistently across codebase for relative imports to root-level dirs
- Example: `import { colors } from "@/design-system"` instead of relative paths

**Style:**
- One import per line (when multiple items)
- Destructured imports for named exports: `import { useLanguage, colors }`
- Default imports for single exports: `import QueryClientProvider from "react-query"`
- Type imports on separate lines when grouping by type: `import type { Course }`

## Error Handling

**Patterns:**
- Try/catch blocks used in async functions and API calls
- Errors logged with context: `console.error("Error loading persisted data:", error)`
- Error messages prefixed with context: `"Failed to fetch videos: ${response.status}"`
- Errors re-thrown after logging in critical paths: `throw new Error("...")`
- Graceful fallback returns: `catch (error) { return []; }`

**File examples:**
- `api/videos/index.ts`: Validates response status, throws descriptive errors for API failures
- `src/store/learningStore.ts`: Catches storage errors, returns default empty state, logs errors
- `hooks/useLanguage.ts`: Catches language change errors, logs with `console.error`

**Pattern: Error Boundary Pattern**
- Runtime guard in providers: `if (!ctx) throw new Error("usePlayer must be used within PlayerProvider")`
- Type-safe error handling with `instanceof Error` check: `error instanceof Error ? error.message : "..."`
- Errors in handlers caught silently with console warnings: `console.warn("WebView error:", nativeEvent)`

**No explicit throw in most handlers** - errors logged and operation continues (non-blocking)

## Logging

**Framework:** Built-in `console` methods (no logging library detected)

**Patterns:**
- `console.error()`: For errors and exceptions with descriptive context
- `console.warn()`: For warnings (WebView errors, etc.)
- `console.log()`: For informational logging (less common in production)
- Error messages include operation context: `"Error changing language:"`, `"Error loading persisted data:"`
- Async storage errors logged without throwing: `console.error("Error loading data:", error)`
- Course/data lookup failures logged: `console.error("Course not found: ${courseId}")`

**Location:** Search for `console.error` and `console.warn` scattered across files rather than centralized

## Comments

**When to Comment:**
- JSDoc/TSDoc for public hook functions and exported utilities
- Inline comments for non-obvious logic: `// Duration not in playlistItems; requires videos.list`
- Section headers in larger files: `// 1) Get up to 50 items from the playlist`
- Fallback explanations: `// API doesn't have category, default to "all"`

**JSDoc/TSDoc:**
- Used in custom hooks: `/** Custom hook for language management */`
- Documents parameters with `@param`: `@param language - The language code to switch to`
- Documents return types implicitly through TypeScript
- Function descriptions included in exported hooks
- Component JSDoc at top of file: `/** CurrentCourseCard Component ... */`

**Examples:**
- `src/store/learningStore.ts`: Comprehensive JSDoc for each store action
- `hooks/useLanguage.ts`: JSDoc for hook and each exported method
- `src/components/home/CurrentCourseCard.tsx`: JSDoc at component header

## Function Design

**Size:** Mix of small (10-20 lines) and medium (50-100 lines) functions; no explicit max size rule observed

**Parameters:**
- Destructured parameters preferred: `({ course, onContinue }) => {}`
- Object parameters for multiple related options: `useVideoPlayer(options: UseVideoPlayerOptions = {})`
- Typed parameters required in TypeScript strict mode
- Default parameters for optional config: `initialPlaying = false`

**Return Values:**
- Explicit return types for hooks and utilities: `Promise<Video[]>`, `LearningState`
- Object returns grouping related state and actions: `{ courses, isLoading, error }`
- Hook returns separate state and action handlers: `{ isPlaying, togglePlayPause, ... }`
- Nullable returns for optional data: `getNextLesson(): Lesson | null`
- Array/empty fallback for collection returns: `return []; // fallback`

**Hook Pattern (Standard):**
- Input options interface (optional config)
- Initialize state with useState
- Setup side effects with useEffect
- Return object with state and handlers: `{ state, handlers, computed }`

## Module Design

**Exports:**
- Named exports for most utilities: `export function useCourses()`, `export const learningStore = ...`
- Default export for screen/route components: `export default function HomeScreen()`
- Type exports separate: `export type Video = { ... }`
- Barrel exports in index files: `src/components/home/index.ts` exports all home components

**Barrel Files:**
- Used in component directories: `src/components/home/index.ts` exports `{ ActivityList, AchievementBanner, ... }`
- Simplifies imports: `import { ActivityList } from "@/src/components/home"`
- Not used in hooks directory (hooks imported individually)

**File Structure:**
- One main export per file (component or hook)
- Supporting types/interfaces in same file
- Related utilities grouped in same directory
- Store (Zustand) as single instance per domain: `useLearningStore`

## Async/Await Pattern

**Usage:**
- Used for Promise-based operations (fetch, AsyncStorage)
- Try/catch wrapping async function bodies
- Promise.all for parallel async operations: `const [enrollmentsJson, progressJson] = await Promise.all([...])`
- Async callbacks in event handlers: `onPress={async () => { ... }}`
- Store actions marked async: `enrollInCourse: async (courseId) => { ... }`

**Error Handling:**
- Errors caught at source (no propagation unless critical)
- State updates before/after async operations
- Loading flags during async operations: `set({ isLoading: true })`

---

*Convention analysis: 2026-01-28*
