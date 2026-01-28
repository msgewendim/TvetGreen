# Requirements: TvetGreenBolt - Quality & Security Improvements

**Defined:** 2026-01-28
**Core Value:** Deliver secure, performant, and reliable learning experience for TVET students by fixing critical security vulnerabilities, eliminating performance bottlenecks, and resolving user-facing bugs

## v1 Requirements

Requirements for quality improvement release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: EAS Updates staged rollout configuration (5% → 25% → 100%)
- [ ] **INFRA-02**: Feature flags for instant disable capability
- [ ] **INFRA-03**: 3-5 critical-path E2E tests (auth, course playback, downloads)
- [ ] **INFRA-04**: Documented rollback procedure with defined triggers

### Security

- [ ] **SEC-01**: Migrate YouTube API key to backend proxy pattern
- [ ] **SEC-02**: Configure EAS Secrets for build-time configuration
- [ ] **SEC-03**: Migrate sensitive data from AsyncStorage to expo-secure-store
- [ ] **SEC-04**: Add Zod validation for courseId navigation parameter
- [ ] **SEC-05**: Add Zod validation for lessonId navigation parameter
- [ ] **SEC-06**: Validate YouTube videoId format before WebView loading
- [ ] **SEC-07**: Enforce HTTPS for all Pexels image URLs
- [ ] **SEC-08**: Add error boundary for video player component
- [ ] **SEC-09**: Add error boundary for course list component

### Performance Baseline

- [ ] **PERF-01**: Document current performance with React DevTools Profiler
- [ ] **PERF-02**: Measure FlatList performance metrics (frame rate, memory)
- [ ] **PERF-03**: Capture baseline screenshots for comparison
- [ ] **PERF-04**: Set up performance monitoring in development environment

### Performance Optimization

- [ ] **PERF-05**: Replace ScrollView with FlashList for courses tab
- [ ] **PERF-06**: Replace ScrollView with FlashList for downloads tab
- [ ] **PERF-07**: Migrate to expo-image for course thumbnails
- [ ] **PERF-08**: Configure expo-image caching and contentFit
- [ ] **PERF-09**: Add use-debounce for course search input
- [ ] **PERF-10**: Add use-debounce for video player control auto-hide
- [ ] **PERF-11**: Upgrade React Query from v3 to v5
- [ ] **PERF-12**: Configure React Query offline-first caching patterns
- [ ] **PERF-13**: Optimize React Query staleTime from 24h to 5min
- [ ] **PERF-14**: Add memory cleanup hook for video player components
- [ ] **PERF-15**: Memoize course filtering logic (only if profiling proves >30% improvement)

### Bug Fixes

- [ ] **BUG-01**: Add bounds checking for lesson navigation
- [ ] **BUG-02**: Prevent navigation to non-existent lesson IDs
- [ ] **BUG-03**: Disable next button on last lesson
- [ ] **BUG-04**: Persist video playback speed to AsyncStorage
- [ ] **BUG-05**: Persist subtitle language to AsyncStorage
- [ ] **BUG-06**: Persist subtitle visibility to AsyncStorage
- [ ] **BUG-07**: Restore video player settings on component mount
- [ ] **BUG-08**: Implement logout to clear AsyncStorage
- [ ] **BUG-09**: Implement logout to clear Zustand store
- [ ] **BUG-10**: Distinguish network errors from other error types in courses tab
- [ ] **BUG-11**: Add retry button for network errors
- [ ] **BUG-12**: Display specific error messages (network timeout, server error)

### Code Quality

- [ ] **QUAL-01**: Add network error handling with React Query retry logic
- [ ] **QUAL-02**: Add offline indicators using @react-native-community/netinfo
- [ ] **QUAL-03**: Add skeleton loading states for course catalog
- [ ] **QUAL-04**: Refactor language.tsx (407 lines) into logical sub-components
- [ ] **QUAL-05**: Refactor profile.tsx (298 lines) into logical sub-components
- [ ] **QUAL-06**: Add regression tests for each bug fix

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Security

- **SEC-ADV-01**: OWASP Mobile Top 10 security audit
- **SEC-ADV-02**: Implement SSL pinning for API calls (requires development build)
- **SEC-ADV-03**: Add security compliance documentation for institutional partnerships

### Advanced Performance

- **PERF-ADV-01**: Implement progressive image loading with blurhash placeholders
- **PERF-ADV-02**: Add adaptive performance modes for low-end devices
- **PERF-ADV-03**: Implement device-specific feature toggles based on performance
- **PERF-ADV-04**: Advanced memory profiling and optimization

### Monitoring & Analytics

- **MON-01**: Integrate Sentry for production error tracking
- **MON-02**: Set up crash reporting and analytics
- **MON-03**: Implement performance monitoring dashboards
- **MON-04**: Add user behavior analytics

### Advanced Features

- **FEAT-01**: Offline-first error recovery with background sync
- **FEAT-02**: Voice command error feedback with TTS
- **FEAT-03**: Enhanced accessibility features beyond WCAG AA
- **FEAT-04**: Advanced caching strategies for rural connectivity

## Out of Scope

Explicitly excluded from this quality improvement project.

| Feature | Reason |
|---------|--------|
| Authentication system implementation | Auth provider not yet decided, requires separate project |
| Backend API integration | Backend infrastructure not ready |
| Real video playback implementation | Kept as separate project, out of current scope |
| Offline content download management | Requires backend support and authentication |
| User progress synchronization | Requires backend and authentication infrastructure |
| Database schema changes | Client-side focus, no backend modifications |
| New feature development | Focus on fixing existing issues, not adding features |
| Complete component rewrite | Moderate refactoring only, avoid aggressive redesign |
| Migration to different tech stack | Work within existing Expo/React Native architecture |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 0 | Complete |
| INFRA-02 | Phase 0 | Complete |
| INFRA-03 | Phase 0 | Complete |
| INFRA-04 | Phase 0 | Complete |
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-03 | Phase 1 | Pending |
| SEC-04 | Phase 1 | Pending |
| SEC-05 | Phase 1 | Pending |
| SEC-06 | Phase 1 | Pending |
| SEC-07 | Phase 1 | Pending |
| SEC-08 | Phase 1 | Pending |
| SEC-09 | Phase 1 | Pending |
| PERF-01 | Phase 2 | Pending |
| PERF-02 | Phase 2 | Pending |
| PERF-03 | Phase 2 | Pending |
| PERF-04 | Phase 2 | Pending |
| PERF-05 | Phase 3 | Pending |
| PERF-06 | Phase 3 | Pending |
| PERF-07 | Phase 3 | Pending |
| PERF-08 | Phase 3 | Pending |
| PERF-09 | Phase 3 | Pending |
| PERF-10 | Phase 3 | Pending |
| PERF-11 | Phase 3 | Pending |
| PERF-12 | Phase 3 | Pending |
| PERF-13 | Phase 3 | Pending |
| PERF-14 | Phase 3 | Pending |
| PERF-15 | Phase 3 | Pending |
| BUG-01 | Phase 4 | Pending |
| BUG-02 | Phase 4 | Pending |
| BUG-03 | Phase 4 | Pending |
| BUG-04 | Phase 4 | Pending |
| BUG-05 | Phase 4 | Pending |
| BUG-06 | Phase 4 | Pending |
| BUG-07 | Phase 4 | Pending |
| BUG-08 | Phase 4 | Pending |
| BUG-09 | Phase 4 | Pending |
| BUG-10 | Phase 4 | Pending |
| BUG-11 | Phase 4 | Pending |
| BUG-12 | Phase 4 | Pending |
| QUAL-01 | Phase 4 | Pending |
| QUAL-02 | Phase 4 | Pending |
| QUAL-03 | Phase 4 | Pending |
| QUAL-04 | Phase 4 | Pending |
| QUAL-05 | Phase 4 | Pending |
| QUAL-06 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after initial definition*
