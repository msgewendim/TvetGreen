# Codebase Concerns

**Analysis Date:** 2026-01-28

## Tech Debt

**Incomplete Speech Recognition Implementation:**
- Issue: `expo-speech` is imported and integrated but speech recognition (input) is not implemented, only TTS (text-to-speech).
- Files: `src/design-system/components/inputs/VoiceInput.tsx` (lines 39, 51)
- Impact: Core voice-guided learning feature is marked as TODO; voice input is simulated with 2-second delays instead of real recognition
- Fix approach: Integrate actual speech recognition library (e.g., `expo-speech-recognition` once available, or third-party solution like Web Speech API with fallback); implement proper voice command parsing and handling

**Mock Data Throughout Application:**
- Issue: All home, courses, profile, and downloads screens use hardcoded mock objects instead of real data
- Files: `app/(tabs)/index.tsx`, `app/(tabs)/profile.tsx`, `app/(tabs)/downloads.tsx`
- Impact: No real backend integration; cannot persist user progress, course data, or download management
- Fix approach: Implement backend API integration with actual data fetching; replace mock objects with real API calls using react-query

**No Global State Management for User Session:**
- Issue: User authentication and session state is not centralized; no user context or state management
- Files: `app/_layout.tsx`, hooks throughout app
- Impact: Cannot maintain user state across navigation; logout in `app/(tabs)/profile.tsx` only logs to console
- Fix approach: Implement context API or state management library (Zustand already in deps) for user session; add proper authentication flow

**QueryClient Configuration Missing Production Settings:**
- Issue: QueryClient is created with no configuration; using default retry (3) and retryDelay (1000) which may be inadequate
- Files: `src/services/query/QueryClient.ts`
- Impact: No control over caching strategy, retry logic, or error boundaries; API failures not handled gracefully
- Fix approach: Add configuration for staleTime, cacheTime, retryOnMount, onError callbacks; implement error boundaries

**Event Handler Memory Leaks Potential:**
- Issue: setTimeout in `hooks/useVideoPlayer.ts` (line 33) doesn't check if component unmounts before clearing
- Files: `hooks/useVideoPlayer.ts`
- Impact: Timer may attempt to update state after component unmount, causing memory leaks
- Fix approach: Move useEffect dependency array logic and ensure cleanup properly handles all timers

**Unhandled Promise Rejection in Language Detection:**
- Issue: AsyncStorage operations in `i18n.config.ts` may fail but errors are only logged, not propagated
- Files: `i18n.config.ts` (lines 69-72, 77-80)
- Impact: Language preference changes silently fail; users may not know their language preference wasn't saved
- Fix approach: Add user-facing error notifications for failed storage operations; consider offline-first approach with retry queue

## Known Bugs

**YouTube API Key Exposed in Repository:**
- Symptoms: YouTube API key visible in `.env` file (EXPO_PUBLIC_YOUTUBE_API_KEY)
- Files: `.env`
- Trigger: Checking version control history or accessing the repository
- Workaround: Rotate API key immediately; move to environment-specific secrets management (use Expo secrets or CI/CD variables)
- Impact: High - API key quota theft, abuse, or service disruption possible

**Lesson Navigation Off-By-One Risk:**
- Symptoms: Lesson navigation with parseInt doesn't validate if lesson exists in course
- Files: `app/video/[courseId]/[lessonId].tsx` (lines 51, 60-62, 68)
- Trigger: User clicks next on last lesson or manually navigates to non-existent lesson ID
- Workaround: Add bounds checking before navigation
- Fix approach: Validate lessonId against total lessons; disable next button on last lesson; handle 404 properly

**Video Player Settings Not Persisted:**
- Symptoms: Playback speed, subtitle language, and subtitle visibility reset on navigation
- Files: `hooks/useVideoPlayer.ts` and `app/video/[courseId]/[lessonId].tsx`
- Trigger: User changes settings, navigates away, returns to lesson
- Workaround: No workaround; users must reconfigure settings
- Fix approach: Persist player settings to AsyncStorage or context; restore on component mount

**Error State Not Properly Displayed in Courses Tab:**
- Symptoms: Error state shows generic "No Results" message
- Files: `app/(tabs)/courses.tsx` (lines 103-110)
- Trigger: Network error or API failure
- Workaround: No user feedback about actual error type
- Fix approach: Display specific error messages (network timeout, server error, etc.); provide retry button

**Logout Functionality Not Implemented:**
- Symptoms: Logout button only logs to console
- Files: `app/(tabs)/profile.tsx` (line 77)
- Trigger: User clicks logout
- Workaround: No proper logout; user session persists
- Fix approach: Implement actual logout with clearing user state, clearing AsyncStorage, and returning to auth flow

## Security Considerations

**API Key in Public Code:**
- Risk: YouTube API key hardcoded in `.env` file which may be committed to version control
- Files: `.env`
- Current mitigation: Using EXPO_PUBLIC_ prefix (intentional public exposure for Expo), but no rate limiting or key rotation strategy
- Recommendations: Implement API key rotation schedule; consider backend proxy for API calls instead of client-side keys; add request rate limiting; monitor API usage for anomalies

**No Input Validation on Navigation Parameters:**
- Risk: courseId and lessonId parameters used directly in strings without validation
- Files: `app/video/[courseId]/[lessonId].tsx` (lines 50-68)
- Current mitigation: Basic parseInt for lessonId, but courseId not validated
- Recommendations: Add type-safe parameter validation; implement schema validation (e.g., zod); handle invalid IDs gracefully

**WebView Remote Content Vulnerability:**
- Risk: WebView loads arbitrary YouTube embed URLs without validation
- Files: `src/providers/player/PlayerProvider.tsx` (lines 75-106)
- Current mitigation: URLs constructed from known YouTube domain, but embedded iframe attributes could be exploited
- Recommendations: Validate videoId format; use stricter CSP (Content Security Policy); sanitize URL construction; limit embedded iframe permissions

**Exposed User Location and Personal Info:**
- Risk: User profile includes hardcoded location and personal details
- Files: `app/(tabs)/profile.tsx` (lines 33-40)
- Current mitigation: Only in UI; no backend storage
- Recommendations: When implementing backend, use proper data encryption; implement data retention policies; add privacy controls for profile visibility

**No HTTPS Enforcement for External Resources:**
- Risk: Some Pexels image URLs may load over HTTP
- Files: `app/(tabs)/courses.tsx` (lines 36, 45, 54, 64), `app/(tabs)/profile.tsx` (line 39)
- Current mitigation: Pexels URLs are HTTPS, but pattern not enforced
- Recommendations: Add URL validation to ensure all external resources load over HTTPS; implement CSP headers if possible

## Performance Bottlenecks

**Inefficient Course Filtering:**
- Problem: Full course list re-filters on every render even when filters haven't changed
- Files: `hooks/useCourseFilters.ts`, `app/(tabs)/courses.tsx`
- Cause: useMemo might not be used in filter hook; category filter triggers re-render of entire ScrollView
- Improvement path: Memoize filtered results; debounce filter changes; use virtualization for large lists

**Video Player Controls Auto-Hide Not Debounced:**
- Problem: setTimeout for control hide (3 seconds) may fire excessively during interactions
- Files: `hooks/useVideoPlayer.ts` (line 33-39)
- Cause: useEffect depends on isPlaying but timer persists even during rapid play/pause
- Improvement path: Add debouncing to timer; track last interaction time; use useRef to prevent redundant timeouts

**No Image Optimization for Network-Based Thumbnails:**
- Problem: Thumbnail images from Pexels loaded at full resolution without size constraints
- Files: Multiple component files loading image URLs
- Cause: No image compression, caching, or lazy loading strategy
- Improvement path: Add image lazy loading with react-native-fast-image; implement thumbnail size constraints; add CDN caching headers

**Large Component Files Not Split:**
- Problem: Language selection screen is 407 lines; profile screen is 298 lines
- Files: `app/onboarding/language.tsx`, `app/(tabs)/profile.tsx`
- Cause: All functionality in single component file
- Improvement path: Extract sub-components; use composition pattern; split landing logic from rendering

**React Query Stale Time Set to 24 Hours for Video Data:**
- Problem: Course and video data cached for entire day despite potential changes
- Files: `hooks/useVideos.ts` (line 8)
- Cause: Hardcoded 24-hour staleTime with no invalidation strategy
- Improvement path: Reduce staleTime for frequently-changing data; implement manual cache invalidation on user actions; add background refetch

**No Virtualization for Activity List:**
- Problem: ActivityList component renders all items even if only visible few
- Files: `app/(tabs)/index.tsx`, `src/components/home/ActivityList.tsx`
- Cause: Using ScrollView instead of FlatList for dynamic lists
- Improvement path: Replace ScrollView with FlatList for activity feeds; use getItemLayout for optimization

## Fragile Areas

**Voice Guide State Management:**
- Files: `hooks/useVideoPlayer.ts`, `app/video/[courseId]/[lessonId].tsx`
- Why fragile: isListening state causes video to pause but no mechanism to resume playback; if user dismisses voice guide, no clear state recovery
- Safe modification: Add explicit resume handler after voice guide ends; test pause/resume cycle thoroughly
- Test coverage: No tests for voice guide state transitions; edge case of rapid toggle not covered

**i18n Language Change Handling:**
- Files: `i18n.config.ts`, `hooks/useLanguage.ts`
- Why fragile: Language change is async but no loading state shown to user; if changeLanguage fails silently, UI may show wrong language
- Safe modification: Add loading state during language switch; wrap in error boundary; test with slow network
- Test coverage: No tests for failed language change; no tests for concurrent language change requests

**Tab Navigation with Player Context:**
- Files: `app/(tabs)/_layout.tsx`, `src/providers/player/PlayerProvider.tsx`
- Why fragile: PlayerProvider wraps all tabs but video state may persist when switching tabs; if user opens video in one tab, switching tabs doesn't update player state
- Safe modification: Clear player state on tab navigation; add route-aware player handling; test video player across tab switches
- Test coverage: No tests for multi-tab player state; edge cases of rapid tab switching not tested

**Dynamic Route Parameters Without Type Safety:**
- Files: `app/video/[courseId]/[lessonId].tsx`
- Why fragile: courseId and lessonId come from params without validation; parseInt called on potentially undefined lessonId
- Safe modification: Add zod/yup schema validation; type params properly; add fallback for missing params
- Test coverage: No tests for invalid parameter combinations; malformed route parameters not handled

**Hardcoded Color Values Throughout App:**
- Files: Multiple component files use inline color strings instead of design system colors
- Why fragile: Color changes require searching and replacing many files; inconsistencies can occur
- Safe modification: Move all colors to design-system/tokens; create semantic color aliases; audit files for hardcoded colors
- Test coverage: No color contrast validation tests; visual regression tests not present

## Scaling Limits

**Current Capacity: Single-Instance Renderer:**
- Current capacity: App currently renders all courses at once in ScrollView
- Limit: App will become sluggish with >100 courses due to rendering all items
- Scaling path: Implement pagination; use FlatList with lazy loading; add search/filter optimization

**No Backend Infrastructure:**
- Current capacity: Hardcoded mock data supports single user in development
- Limit: Cannot support multiple concurrent users or persistent data
- Scaling path: Implement backend API (Node.js, Python, Firebase, etc.); add database (PostgreSQL, MongoDB); implement user authentication

**AsyncStorage for User Data:**
- Current capacity: AsyncStorage can handle kilobytes of data (suitable for preferences, progress)
- Limit: Cannot store large amounts of data (course catalogs, video metadata, large downloads)
- Scaling path: Move user metadata to backend; cache in AsyncStorage; implement offline-first sync strategy

**YouTube API Rate Limits:**
- Current capacity: Free tier quota of 10,000 units/day shared across users
- Limit: With >500 daily active users fetching videos, quota exhaustion likely
- Scaling path: Implement backend API caching layer; cache playlist data; implement quota monitoring; consider paid API tier

**WebView Memory Usage:**
- Current capacity: Single embedded YouTube player takes 30-50MB memory
- Limit: Opening multiple players or concurrent videos will cause OOM errors
- Scaling path: Implement player pooling; limit concurrent players; use native player instead of WebView when possible

## Dependencies at Risk

**react-query v3 Deprecated:**
- Risk: react-query v3.39.3 is outdated; v4+ (TanStack Query) is current standard with breaking changes
- Files: `package.json`, all hook files using useQuery
- Impact: Dependency will eventually reach end-of-life; no security updates; newer libraries may be incompatible
- Migration plan: Plan migration to TanStack Query v4+; review breaking changes in caching, error handling; test thoroughly before upgrading; update all useQuery calls to new API

**expo-speech Incomplete for Speech Recognition:**
- Risk: expo-speech only provides text-to-speech; no speech-to-text (input) support
- Files: `src/design-system/components/inputs/VoiceInput.tsx`
- Impact: Voice input feature cannot be implemented with current library; requires different solution
- Migration plan: Evaluate expo-speech-recognition (when released); implement Web Speech API fallback; consider third-party commercial libraries (Nuance, Google Cloud Speech-to-Text); design graceful fallback for non-supporting platforms

**New React Native Architecture Flag Enabled:**
- Risk: Experimental feature enabled in `app.json` (newArchEnabled: true) may cause stability issues
- Files: `app.json`, all app source
- Impact: Some libraries may not be compatible; debugging may be harder; performance characteristics uncertain
- Migration plan: Monitor for library incompatibilities; have rollback strategy; test on real devices thoroughly; document which libraries require compatibility layers

**TypeScript Strict Mode Without Full Coverage:**
- Risk: TypeScript strict mode enabled but `any` type used in i18n config
- Files: `i18n.config.ts` (line 93)
- Impact: Type safety compromised; potential runtime errors not caught
- Migration plan: Remove `as any` casts; implement proper TypeScript types for i18n; add strict type checking validation to build pipeline

## Missing Critical Features

**User Authentication:**
- Problem: No login/registration system; no user session management
- Blocks: User progress tracking, personalized recommendations, multi-device sync, offline progress sync
- Priority: Critical - blocks most advanced features

**Offline Content Management:**
- Problem: Downloads tab shows mock UI but no actual download functionality
- Blocks: Offline course access, bandwidth optimization, reliability in low-connectivity areas
- Priority: High - core feature for TVET target market

**Progress Tracking and Persistence:**
- Problem: No mechanism to save lesson completion, quiz scores, or course progress
- Blocks: Streak tracking, achievements, personalization, analytics
- Priority: Critical - impacts user engagement and learning outcomes

**Real Video Playback:**
- Problem: Mock video player; no actual HLS/DASH streaming implementation
- Blocks: Real video playback, adaptive bitrate, bandwidth management
- Priority: Critical - core feature

**Accessibility Auditing:**
- Problem: Color contrast, keyboard navigation, screen reader support not validated
- Blocks: WCAG AA compliance, accessibility for diverse literacy levels
- Priority: High - stated as accessibility-first design target

**Analytics and Error Tracking:**
- Problem: No error tracking, no user analytics, no crash reporting
- Blocks: Understanding user behavior, debugging production issues, feature optimization
- Priority: Medium - needed for production monitoring

## Test Coverage Gaps

**Voice Feature Testing:**
- What's not tested: Voice recognition implementation, voice command parsing, voice guide state transitions, pause/resume with voice active
- Files: `hooks/useVideoPlayer.ts`, `src/design-system/components/inputs/VoiceInput.tsx`, `app/video/[courseId]/[lessonId].tsx`
- Risk: Voice feature is core accessibility feature; untested means accessibility regressions possible
- Priority: High - impacts primary user experience

**Navigation Parameter Validation:**
- What's not tested: Invalid courseId/lessonId handling, missing lesson edge cases, rapid navigation
- Files: `app/video/[courseId]/[lessonId].tsx`
- Risk: Invalid parameters could cause crashes or unexpected behavior
- Priority: High - can break user workflow

**i18n Switching:**
- What's not tested: Language change during playback, failed language change, unsupported language fallback, concurrent language changes
- Files: `i18n.config.ts`, `hooks/useLanguage.ts`
- Risk: Language switching edge cases not covered; failed language changes silent
- Priority: Medium - affects multilingual experience

**Player State Across Tabs:**
- What's not tested: Opening video in one tab, switching tabs, returning to first tab; multiple player instances; player cleanup on unmount
- Files: `src/providers/player/PlayerProvider.tsx`, `app/(tabs)/_layout.tsx`
- Risk: Player state leaks across tabs; memory not properly released
- Priority: Medium - affects long-session stability

**Error Boundary Handling:**
- What's not tested: API failures, network timeouts, component render errors, missing data handling
- Files: Multiple component files
- Risk: Errors propagate to crash app; no graceful error UI
- Priority: High - impacts reliability

**Subtitle System:**
- What's not tested: Subtitle language switching, subtitle file loading, missing subtitle handling, rendering with different text lengths
- Files: `app/video/[courseId]/[lessonId].tsx`, subtitle components
- Risk: Subtitle feature may fail silently or crash with invalid data
- Priority: Medium - supports accessibility

---

*Concerns audit: 2026-01-28*
