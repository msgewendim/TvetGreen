# Testing Patterns

**Analysis Date:** 2026-01-28

## Test Framework

**Runner:**
- Jest: Not detected in package.json or config files
- Vitest: Not detected in package.json or config files
- No test runner configured

**Test Infrastructure:**
- No `jest.config.js`, `vitest.config.ts`, or similar test configuration files found
- No test files detected: `.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx` patterns not found across codebase
- No test command in `package.json` (only `npm run dev`, `npm run build:web`, `npm run lint`, `npm run type-check`)

**Testing Status:** NOT IMPLEMENTED

**Assertion Library:**
- None configured

**Run Commands:**
```bash
# No testing commands available
# Testing framework needs to be set up
```

## Test File Organization

**Location:**
- No test files currently exist
- Recommended location: Co-located with source files (e.g., `hooks/__tests__/`, `src/components/__tests__/`)
- Or separate `__tests__/` directory at project root

**Naming:**
- Pattern would be: `ComponentName.test.tsx`, `hookName.test.ts`
- File co-location recommended for maintainability

**Structure:**
- Testing framework not yet installed
- Structure TBD when testing is implemented

## Test Structure

**Coverage Analysis (Current State):**
- Zero test coverage - no tests written
- All code currently untested including:
  - React components (screens, UI components)
  - Custom hooks (useVideoPlayer, useCourses, useLanguage)
  - Store actions (Zustand store with AsyncStorage)
  - API functions (YouTube API integration)
  - Utilities (duration formatting, data mapping)

**Critical Paths Without Tests:**
- Video player lifecycle and state management
- Course enrollment and progress tracking
- Language switching and i18n functionality
- API error handling and retry logic
- AsyncStorage persistence layer

## Mocking

**Framework:** Not yet selected (test framework needed first)

**Areas Requiring Mocks:**
- React Native modules: `expo-router`, `expo-av`, `@react-native-async-storage/async-storage`
- External APIs: YouTube API via fetch
- React hooks: `useTranslation`, `useLocalSearchParams`, `useRouter`
- File system operations: `expo-file-system` for offline downloads
- Browser/platform APIs: AsyncStorage, navigation

**What to Mock:**
- External API calls: YouTube video API (fetch wrapped in try/catch)
- AsyncStorage operations: All storage/retrieval in `learningStore`
- Navigation: useRouter, useLocalSearchParams
- i18n: useTranslation from react-i18next
- System modules: Platform-specific features

**What NOT to Mock:**
- Custom hook logic itself (test real behavior)
- State management (Zustand store should run real)
- Utility functions (should test actual logic)
- Component rendering (test actual UI behavior when possible)

## Fixtures and Factories

**Test Data:**
- Currently defined as mock data inline in components and screens
- Example: `app/(tabs)/index.tsx` defines CurrentCourse, NextLesson, activities as static objects
- Example: `hooks/useCourses.ts` maps API data to Course type

**Recommended Factory Pattern:**
```typescript
// Proposed: src/__tests__/factories/course.factory.ts
export const createMockCourse = (overrides?: Partial<Course>): Course => ({
  id: "course_1",
  title: "Sustainable Agriculture Basics",
  category: "Agriculture",
  instructor: "John Doe",
  // ... rest of properties
  ...overrides,
});

export const createMockVideo = (overrides?: Partial<Video>): Video => ({
  id: "vid_1",
  title: "Introduction",
  thumbnailUrl: "...",
  duration: "5:30",
  // ... rest of properties
  ...overrides,
});
```

**Location:**
- Proposed: `src/__tests__/factories/` for factory functions
- Proposed: `src/__tests__/fixtures/` for static test data JSON files
- Would simplify test data creation and consistency

**Current State:** No factories or fixtures exist; mock data hardcoded in components

## Coverage

**Requirements:** No coverage requirements enforced

**Target:** Not specified

**View Coverage:**
```bash
# No coverage command available
# Once testing framework installed, typically:
# jest --coverage
# vitest --coverage
```

**Coverage Gaps (Current):**
- All code untested - 0% coverage
- Custom hooks need unit tests: `useVideoPlayer`, `useCourses`, `useLanguage`, `useLesson`
- Store actions need integration tests: enrollment, progress tracking, lesson completion
- API layer needs tests with mocked fetch: `api/videos/index.ts`
- Components need snapshot/rendering tests
- Error paths untested (error handling in API, storage)

## Test Types

**Unit Tests (Needed):**
- Custom hooks: Test state management, callbacks, side effects
- Utility functions: Duration formatting, data mapping, calculations
- Store actions: Data mutations, filtering, progress calculations
- API functions: Success/error responses, data transformation

**Integration Tests (Needed):**
- Store + AsyncStorage: Persistence and reload scenarios
- Navigation + state: Route params to component state
- Hooks + components: Hook state reflected in UI
- i18n + components: Language switching affects UI text

**E2E Tests (Needed):**
- Video player: Play, pause, seek, subtitle toggle, voice guide
- Course enrollment: Browse → enroll → view lessons → complete
- Offline: Download course → access offline → sync progress
- Language: Switch languages → UI updates → persists across sessions

**Framework:**
- Playwright: Not configured; would be for E2E browser testing
- Cypress: Not configured; alternative for E2E
- Native testing: Detox or similar for React Native mobile testing

## Common Patterns to Implement

**Async Testing:**
```typescript
// Pattern to use when testing framework added:
test("should load courses data", async () => {
  const { result } = renderHook(() => useCourses());
  await waitFor(() => {
    expect(result.current.courses.length).toBeGreaterThan(0);
  });
});

test("should update AsyncStorage on enrollment", async () => {
  const store = useLearningStore.getState();
  await store.enrollInCourse("course_1");
  const stored = await AsyncStorage.getItem("@learning_enrollments");
  expect(stored).toBeTruthy();
});
```

**Error Testing:**
```typescript
// Pattern for error handling:
test("should handle API errors gracefully", async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  try {
    await fetchVideos();
  } catch (error) {
    expect(error).toEqual(Error("Failed to fetch videos: Network error"));
  }
});

test("should return empty array on storage error", async () => {
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error("Storage unavailable"));
  const data = await loadPersistedData();
  expect(data).toEqual({ enrollments: [], lessonProgress: [] });
});
```

**Mock Setup Pattern:**
```typescript
// Proposed pattern for hook testing:
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));
```

**Component Rendering Test Pattern:**
```typescript
test("should render current course card with progress", () => {
  const course = createMockCourse();
  const { getByText } = render(
    <CurrentCourseCard course={course} onContinue={jest.fn()} />
  );
  expect(getByText("Sustainable Agriculture Basics")).toBeTruthy();
  expect(getByText("75")).toBeTruthy(); // Progress percentage
});
```

## Critical Test Priorities

**High Priority (Core Features):**
1. **Store enrollment flow**: `enrollInCourse`, `unenrollFromCourse`, `isEnrolled`
2. **Lesson progress tracking**: `markLessonComplete`, `updateLessonProgress`, `getLessonProgress`
3. **API data fetching**: YouTube API, error handling, data transformation
4. **AsyncStorage persistence**: Load/save to storage, recovery from errors

**Medium Priority (UX Features):**
1. **Video player state**: Play/pause, seek, speed, subtitle toggle
2. **Language switching**: `changeLanguage`, i18n integration
3. **Course filtering**: Category filtering, search
4. **Component rendering**: Home screen, course cards, video player UI

**Low Priority (Polish):**
1. **Achievement animations**
2. **Haptic feedback**
3. **Accessibility features** (will need separate accessibility testing)

## Setup Required

**Installation (Recommended):**
```bash
# Install Jest + React Native testing utils
pnpm add --save-dev jest @testing-library/react-native @testing-library/jest-native

# Or use Vitest for faster alternative
pnpm add --save-dev vitest @testing-library/react-native jsdom

# Install mocking utilities
pnpm add --save-dev jest-mock-async-storage
```

**Configuration Files Needed:**
- `jest.config.js` or `vitest.config.ts`
- `setup-tests.ts` for mock initialization
- `babel.config.js` updates for test preset

**Package.json Scripts to Add:**
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

*Testing analysis: 2026-01-28*
