# TvetGreenBolt - Quality & Security Improvements

## What This Is

A focused improvement project to address security vulnerabilities, performance bottlenecks, and user-facing bugs in the TvetGreenBolt mobile learning platform. This work targets client-side improvements that can be completed without backend infrastructure or authentication provider decisions.

## Core Value

Deliver a secure, performant, and reliable learning experience for TVET students in rural/developing regions by fixing critical security vulnerabilities, eliminating performance bottlenecks, and resolving user-facing bugs.

## Requirements

### Validated

<!-- Existing capabilities confirmed by codebase analysis -->

- ✓ Mobile learning platform with Expo Router file-based navigation — existing
- ✓ Course catalog browsing with category-based filtering — existing
- ✓ Video lesson playback with YouTube integration — existing
- ✓ Multilingual support (English, Swahili, Amharic) with i18next — existing
- ✓ Course enrollment and progress tracking via Zustand store — existing
- ✓ Voice-guided navigation and video control features — existing
- ✓ Design system with accessibility labels and color tokens — existing
- ✓ Offline-first architecture with AsyncStorage persistence — existing

### Active

<!-- Current scope: Security, Performance, Bug Fixes -->

**Security Improvements:**
- [ ] Move YouTube API key from .env to proper secrets management (Expo Secrets)
- [ ] Add input validation for navigation parameters (courseId, lessonId)
- [ ] Validate YouTube videoId format before WebView loading
- [ ] Enforce HTTPS for all external image URLs (Pexels thumbnails)

**Performance Optimizations:**
- [ ] Memoize course filtering logic to prevent unnecessary re-renders
- [ ] Add debouncing to video player control auto-hide timer
- [ ] Implement image lazy loading and size constraints for thumbnails
- [ ] Refactor large component files (language.tsx 407 lines, profile.tsx 298 lines)
- [ ] Optimize React Query stale time configuration (reduce from 24 hours)
- [ ] Replace ScrollView with FlatList for activity list virtualization

**Bug Fixes:**
- [ ] Fix lesson navigation bounds checking to prevent invalid lesson IDs
- [ ] Persist video player settings (speed, subtitles) to AsyncStorage
- [ ] Improve error state messages in courses tab (distinguish error types)
- [ ] Implement proper logout functionality (clear AsyncStorage and local state)

### Out of Scope

- Authentication provider selection — not yet decided, deferred to future milestone
- Backend API integration — infrastructure not ready
- Real video playback implementation — kept as separate project
- Offline content download management — requires backend support
- User progress synchronization — requires backend and authentication
- Analytics and error tracking — requires backend infrastructure
- Accessibility compliance audit — comprehensive audit deferred to dedicated phase

## Context

**Existing Codebase:**
- TvetGreenBolt is a production React Native app built with Expo SDK 54
- Codebase has been mapped and concerns documented in `.planning/codebase/CONCERNS.md`
- App targets TVET education in rural/developing regions with voice-guided learning
- Current architecture uses Expo Router, Zustand for state, React Query for data fetching
- 20+ TypeScript files with strict mode enabled

**Known Issues:**
- YouTube API key exposed in version-controlled .env file (security risk)
- Navigation parameter validation missing (crash risk)
- Performance degradation with >50 courses due to inefficient filtering
- Video player settings reset on navigation (poor UX)
- Large component files causing maintainability issues

**Technical Environment:**
- Expo SDK 54 with React Native 0.81.5
- React 19.1.0 with New Architecture enabled
- TypeScript 5.9.3 strict mode
- Biome for linting/formatting
- pnpm package manager

## Constraints

- **No Backend Changes**: All improvements must be client-side only (backend not ready)
- **No Auth Dependencies**: Cannot implement features requiring authentication provider
- **Moderate Refactoring**: Extract logical sub-components, avoid aggressive redesign
- **Video Player Scope**: Keep real video playback separate from this work
- **Tech Stack**: No new major dependencies, use existing Expo/React Native ecosystem

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Client-side focus | Backend infrastructure not ready, auth provider not decided | — Pending |
| Moderate refactoring approach | Balance improvement with delivery speed | — Pending |
| Separate video player work | Real playback implementation is distinct from quality fixes | — Pending |
| Priority: Security > Performance > Bugs | Security vulnerabilities pose highest risk to users | — Pending |

---
*Last updated: 2026-01-28 after initialization*
