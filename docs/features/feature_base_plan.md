# Feature Implementation Priority Plan

## Context
Mobile learning platform for 50 Ugandan businesswomen. MVP must deliver: browse courses, enroll, watch video lessons, track progress, download for offline viewing. Phone OTP auth required.

## Current State Summary

| Area | Status |
|------|--------|
| Navigation & UI | **Done** - 5 tabs, design system, screens built |
| Course catalog & enrollment | **Done** - mock data + Zustand persistence |
| Video playback | **Partial** - YouTube embed works, custom controls not integrated |
| Auth (Phone OTP) | **Not started** - hardcoded default user |
| Offline downloads | **Not started** - UI shells exist, no file system logic |
| Backend API | **Not started** - only YouTube API + static JSON |
| Progress sync | **Not started** - local Zustand only |

## Prioritized Implementation Order

Based on MVP PRD MoSCoW + the plan-feature prompt (Home + Course Detail screens first), here's the recommended build sequence:

### Phase 1: Core Learning Loop (Highest Priority)
_"Can a user browse, enroll, and watch a lesson?"_ - This must work end-to-end first.

1. **Video Player Integration** - Wire up custom controls with expo-av for real video playback (not just YouTube embed). Integrate playback speed, seek, progress bar with the existing controls UI.
2. **Progress Tracking Polish** - Auto-save position every 10s, mark lesson complete at 90%, show per-course progress aggregation on Home and Course Detail screens.
3. **Home Screen Enhancement** - "Continue Learning" card showing last-accessed course/lesson, "My Courses" horizontal scroll with progress %.

**Files**: `app/video/[courseId]/[lessonId].tsx`, `hooks/useVideoPlayer.ts`, `src/store/learningStore.ts`, `app/(tabs)/index.tsx`, `src/components/home/`

### Phase 2: Authentication
_"Who is this user?"_ - Needed before pilot but not before proving the learning loop works.

4. **Phone OTP Auth Flow** - Phone entry screen, OTP verification screen, session persistence (30 days), protected routes.
5. **Auth State Management** - Zustand auth store, secure token storage (expo-secure-store), auto-redirect logic.

**Files**: New `app/(auth)/` route group, new `src/store/authStore.ts`, `app/_layout.tsx` (auth guard)

### Phase 3: Offline Downloads
_"Can she learn without internet?"_ - Critical for the target users with unreliable connectivity.

6. **Download Manager Service** - expo-file-system download with progress, retry logic, queue management.
7. **Offline Video Playback** - Check local file first, fallback to streaming. Play downloaded content without internet.
8. **Storage Management** - Show usage, delete per-lesson/course, WiFi-only setting.

**Files**: New `src/services/downloadManager.ts`, `src/store/downloadStore.ts`, `app/(tabs)/downloads.tsx`, update video player

### Phase 4: Backend API & Sync
_"Does her progress persist across devices?"_ - Required for pilot accountability.

9. **Backend API** - Node/Express with courses, enrollments, progress endpoints.
10. **Progress Sync** - Sync queue for offline changes, push/pull on reconnect, conflict resolution (server wins).
11. **Course Data from Backend** - Replace static JSON with API calls, cache locally.

**Files**: New `/server` directory, `src/services/api.ts`, `src/services/sync.ts`, update React Query hooks

### Phase 5: Polish & Pilot Prep (Should-Have)
12. Course search/filter
13. Profile screen with real user data
14. Push notifications (learning reminders)
15. Error boundaries, loading skeletons, empty states
16. Low-end device testing & optimization
17. Production APK build

## Verification
- Phase 1: Launch app, browse courses, enroll, play a video lesson, close/reopen and see progress preserved
- Phase 2: Fresh install, enter phone number, receive OTP, verify, land on Home with courses
- Phase 3: Download a lesson, enable airplane mode, play the downloaded lesson
- Phase 4: Complete a lesson on one device, login on another device, see progress synced
- Phase 5: Manual test all flows on a low-end Android device (1-2GB RAM)

## Decision: Self-hosted video (S3 + expo-av)
Replace YouTube embeds with expo-av player + S3-hosted videos. This enables offline downloads and is required for MVP.
