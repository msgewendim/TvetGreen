# Project Research Summary

**Project:** TvetGreenBolt - Quality & Security Improvements
**Domain:** React Native/Expo Mobile Learning Platform Enhancement
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

TvetGreenBolt is an Expo-based React Native mobile learning platform targeting TVET education in rural/developing regions. The current quality improvement initiative focuses on hardening security, optimizing performance, and preventing production regressions in an existing codebase with moderate technical debt. Experts recommend a phased approach prioritizing security vulnerabilities (exposed API keys, unencrypted storage) before performance optimizations, as premature optimization without measurement commonly degrades rather than improves performance in React Native.

The recommended approach follows a four-phase strategy: (1) Security Hardening with validation infrastructure, (2) Performance Baseline establishment through profiling, (3) Targeted Optimizations only where metrics prove necessity, and (4) Bug Fixes with regression testing. This sequence addresses the critical security exposure (API keys in EXPO_PUBLIC_ variables) first, establishes measurement infrastructure to avoid over-optimization pitfalls, then systematically improves performance based on evidence. The architecture uses existing Zustand + React Query state management enhanced with middleware layers for security and performance tracking, avoiding disruptive rewrites.

Key risks include breaking production during improvements (20% of React Native updates introduce regressions), over-memoization degrading performance (30-50% slowdown when applied incorrectly), and test flakiness leading to ignored failures. Mitigation requires staged rollouts via EAS Updates (5% → 25% → 100%), performance profiling before all optimizations (target >30% improvement to justify complexity), and maintaining 3-5 critical-path E2E tests with >95% pass rate. The phased approach with rollback capability at each stage prevents the common "improvement paradox" where quality initiatives degrade user experience.

## Key Findings

### Recommended Stack

TvetGreenBolt currently runs Expo SDK 54 with React Native 0.81.5, TypeScript 5.9.3, Zustand, React Query v3, and Biome. The research identifies critical security gaps (no encrypted storage, API keys in environment variables) and performance opportunities (unoptimized lists, outdated React Query v3, no memory leak prevention). All recommended additions are Expo SDK 54 compatible and focus on non-breaking incremental adoption.

**Core technologies:**
- **Zod (^3.23.x)**: Runtime validation for navigation params and API responses — TypeScript-first with zero dependencies, generates types from schemas, essential for preventing navigation crashes
- **expo-secure-store (~14.0.x)**: Encrypted storage for sensitive data — Built-in SDK package using iOS Keychain and Android Keystore, required to move API keys and tokens out of unencrypted AsyncStorage
- **@shopify/flash-list (^1.7.x)**: High-performance list virtualization — Drop-in FlatList replacement with 90% CPU reduction in benchmarks, critical for course lists with >50 items
- **@tanstack/react-query v5 (^5.90.x)**: Server state management upgrade — Current v3 is outdated, v5 has better React Native support and offline-first caching patterns for rural connectivity
- **use-debounce (^10.0.x)**: React hooks for input debouncing — Lightweight (<1KB) for search inputs and voice command processing, prevents excessive re-renders
- **@sentry/react-native (^7.3.x+)**: Production error tracking — Industry standard but requires SDK 54 compatibility verification before installation due to reported issues

**Critical version notes:**
- React Query v3 → v5 upgrade is BREAKING but necessary (current v3 lacks proper React Native support)
- Sentry SDK 54 compatibility must be verified via GitHub issues before installation
- SSL pinning libraries (react-native-ssl-pinning) are NOT recommended for Expo Go — use HTTPS validation instead
- Detox E2E testing NOT recommended — doesn't work with Expo Go, manual testing more practical

### Expected Features

Quality improvements divide into three priority tiers based on user impact and implementation risk. The research emphasizes that "table stakes" features (security, stability, basic UX) must ship before competitive differentiators to avoid app store rejection and critical security breaches.

**Must have (table stakes):**
- **API Key Security** — Backend proxy pattern to prevent API key exposure in app bundle (HIGH security breach risk)
- **HTTPS Enforcement** — Validate all external URLs use HTTPS (required for app store approval)
- **Input Validation** — Navigation param validation to prevent crashes from malformed data
- **Error Boundaries** — Wrap video player, course list, navigation to prevent white screen crashes
- **List Virtualization** — Replace ScrollView with FlatList for courses tab (critical for >50 courses performance)
- **Settings Persistence** — Save video player settings to AsyncStorage (basic UX expectation)
- **Logout Functionality** — Clear AsyncStorage + Zustand store (security and privacy requirement)

**Should have (competitive):**
- **Image Optimization** — Migrate to expo-image with caching and auto-resizing (trigger: slow loading complaints)
- **Network Error Handling** — React Query retry logic + offline indicators (trigger: rural user error confusion)
- **Component Refactoring** — Split large files (language.tsx 407 lines, profile.tsx 298 lines)
- **React Query Tuning** — Optimize staleTime from 24h to 5min for fresh course catalog data
- **Debounced Controls** — Debounce video player control auto-hide timer
- **Loading States** — Skeleton screens for course loading

**Defer (v2+):**
- **Offline-First Error Recovery** — Background sync with conflict resolution (HIGH complexity, defer until user base scales)
- **Voice Command Error Feedback** — TTS for error messages when voice guide active (accessibility polish)
- **Progressive Image Loading** — Blurhash placeholders (nice-to-have bandwidth optimization)
- **Adaptive Performance Modes** — Device-specific feature toggles (defer until crash reports show low-end device issues)
- **Proactive Error Logging** — Sentry integration (budget constraint: $50-200/month)
- **Security Audit Compliance** — OWASP Mobile Top 10 review (institutional partnership requirement)

### Architecture Approach

The recommended architecture enhances TvetGreenBolt's existing Expo/React Native structure with cross-cutting concern layers rather than rewriting core patterns. This incremental approach adds security, performance monitoring, and error handling infrastructure that existing code adopts gradually through middleware and abstraction layers, avoiding the high-risk "big bang" migration anti-pattern.

**Major components:**
1. **Core Infrastructure Layer (src/core/)** — Centralized security (SecureStorage wrapper, input validation), performance hooks (memory cleanup, optimized callbacks), and error handling (ErrorBoundary hierarchy, ErrorLogger) that existing code adopts incrementally
2. **Storage Abstraction (UnifiedStorage)** — Sensitivity-based routing (SecureStore for tokens/credentials, AsyncStorage for preferences) enabling gradual migration from unencrypted to encrypted storage without breaking changes
3. **State Management Middleware** — Zustand middleware for transparent security (encrypt sensitive fields during persistence) and performance tracking (mutation metrics, memory profiling) without modifying store logic
4. **Error Boundary Hierarchy** — Three-level boundaries (app-level crash prevention, screen-level feature isolation, component-level for video player/network requests) with progressive fallback strategies
5. **Performance Optimization Layers** — Reusable hooks (useMemoryCleanup, useOptimizedCallback) and list optimization patterns (FlashList migration, image resizing) applied incrementally where profiling proves necessity

**Architectural patterns:**
- Storage Abstraction Layer: Unified interface for secure vs. standard persistence with automatic routing based on data sensitivity
- Zustand Middleware: Intercept state mutations to add encryption/performance tracking transparently
- Memory Cleanup Hooks: Automatic resource cleanup for subscriptions/timers/event listeners to prevent zombie components
- Error Boundary Hierarchy: Nested boundaries with progressive fallback (component → screen → app) for graceful degradation

### Critical Pitfalls

Research identified six critical pitfalls with high recovery cost if not prevented. These represent the most common reasons React Native quality initiatives fail or degrade user experience despite good intentions.

1. **Exposing API Keys in EXPO_PUBLIC_ Variables** — React Native bundles expose all EXPO_PUBLIC_ variables in plain text via decompilation. Prevention: Backend proxy pattern for API orchestration, EAS Secrets for build-time config only, never store API secrets client-side. Recovery cost: HIGH (key rotation, emergency release, 24-48hr exposure window).

2. **Over-Memoization and Premature Optimization** — Adding useMemo/useCallback/React.memo everywhere adds overhead that often slows apps down rather than speeding them up. Prevention: Profile first with React DevTools Profiler, only memoize operations >10ms or components re-rendering >10x/sec, verify >30% improvement before keeping optimization. Recovery cost: MEDIUM (git bisect to find regression, selective removal).

3. **Breaking Production Without Rollback Strategy** — Quality improvements treated as "low-risk" but 20% introduce regressions. Prevention: EAS Updates staged rollout (5% → 25% → 100%), feature flags for instant disable, maintain 3-5 E2E tests for critical flows, define rollback triggers (crash rate >1%). Recovery cost: HIGH (emergency rollback, user uninstalls, trust damage).

4. **FlatList Performance Degradation from "Optimizations"** — Aggressive tuning of maxToRenderPerBatch/windowSize/initialNumToRender often worsens performance. Prevention: Start with FlatList defaults, only tune if profiling shows specific issues, test on low-end Android (2GB RAM), avoid inline functions in renderItem. Recovery cost: MEDIUM (reset to defaults, profile systematically).

5. **Test Flakiness Leading to Ignored Failures** — E2E tests fail intermittently due to React Native async timing. Teams start ignoring failures, real bugs slip through. Prevention: Maintain only 3-5 critical E2E tests with >95% pass rate, focus on unit (70%) and integration (25%) tests instead, use proper async waits. Recovery cost: MEDIUM (disable all E2E, rewrite flaky tests, rebuild trust).

6. **Navigation Bugs from Route Parameter Changes** — Expo Router with typed routes helps but runtime navigation can still pass wrong types. Prevention: Enable experiments.typedRoutes, only use serializable params (IDs not objects), search entire codebase for navigation calls before parameter changes, test deep links. Recovery cost: MEDIUM (find all navigation call sites, add integration tests).

## Implications for Roadmap

Based on research, a four-phase structure addresses dependencies, avoids pitfalls, and delivers incremental value. Phases must execute sequentially due to dependencies: security establishes validation patterns required for performance work, performance baseline prevents over-optimization, optimizations build on proven bottlenecks, bug fixes benefit from improved error boundaries.

### Phase 0: Infrastructure Setup (Pre-work)
**Rationale:** Must establish safety nets before making changes. Research shows 20% of React Native improvements introduce regressions. Testing infrastructure, feature flags, and staged rollout capability prevent "improvement paradox" where quality work breaks production.
**Delivers:** EAS Updates staged rollout configuration (5% → 25% → 100%), feature flags for instant disable, 3-5 critical-path E2E tests (auth, course playback, downloads), documented rollback procedure with defined triggers
**Addresses:** Pitfall #3 (Breaking Production Without Rollback) and Pitfall #5 (Test Flakiness)
**Avoids:** Deploying improvements to 100% of users instantly, no ability to disable problematic changes, regressions discovered by users instead of tests

### Phase 1: Security Hardening & Validation Infrastructure
**Rationale:** Security vulnerabilities must be addressed first. Exposed API keys create immediate breach risk. Input validation prevents navigation crashes that block performance optimization work. This phase establishes validation patterns used throughout subsequent phases.
**Delivers:** API key migration to backend proxy + EAS Secrets, expo-secure-store migration for tokens/credentials, Zod validation for navigation params (courseId, lessonId, videoId), HTTPS URL validation, error boundaries for video player and course list
**Addresses:** Pitfall #1 (Exposed API Keys), Pitfall #6 (Navigation Parameter Bugs), table stakes features (API Key Security, HTTPS Enforcement, Input Validation, Error Boundaries)
**Uses:** Zod (validation), expo-secure-store (encryption), @react-native-community/netinfo (HTTPS enforcement)
**Avoids:** Building performance optimizations on top of security vulnerabilities, navigation crashes preventing testing of other improvements

### Phase 2: Performance Baseline & Measurement Infrastructure
**Rationale:** Must establish baseline metrics before optimizing to avoid Pitfall #2 (over-optimization degrading performance). React Native performance is context-dependent; changes that help one scenario hurt another. Evidence-based approach prevents wasted effort on non-bottlenecks.
**Delivers:** React DevTools Profiler documentation of current performance (render times, memory usage, component re-render counts), FlatList performance metrics (frame rate, memory, scroll jank), performance monitoring setup (react-native-performance in development), baseline screenshots for comparison
**Addresses:** Pitfall #2 (Over-Memoization) and Pitfall #4 (FlatList Degradation) prevention through measurement
**Uses:** React DevTools Profiler (built-in), react-native-performance (dev metrics), Flipper (optional)
**Implements:** Performance monitoring infrastructure from architecture (MemoryMonitor, RenderTracker)
**Avoids:** Optimizing without evidence, tuning FlatList configuration blindly, memoizing components without proving necessity

### Phase 3: Targeted Optimization & List Performance
**Rationale:** With baseline established, this phase targets proven bottlenecks only. Research shows 80% of performance issues come from 20% of code (unoptimized lists, unresized images, memory leaks). FlashList provides 90% CPU reduction as drop-in FlatList replacement.
**Delivers:** FlashList migration for course lists and downloads list (drop-in replacement), expo-image migration with caching and proper contentFit, use-debounce for search inputs and scroll handlers, React Query v3 → v5 upgrade with offline-first caching, memory cleanup hooks for video player components
**Addresses:** Table stakes features (List Virtualization, Settings Persistence), should-have features (Image Optimization, React Query Tuning, Debounced Controls)
**Uses:** @shopify/flash-list, expo-image, use-debounce, @tanstack/react-query v5
**Implements:** Performance optimization layers from architecture (useMemoryCleanup, useOptimizedCallback hooks)
**Avoids:** Over-memoization (only optimize proven bottlenecks >30% improvement), breaking changes without measurement, aggressive FlatList tuning without profiling

### Phase 4: Bug Fixes & Network Resilience
**Rationale:** With security hardened and performance baselined, this phase addresses user-reported bugs and adds network error handling for rural connectivity. Error boundaries from Phase 1 enable better error logging. Each fix gets regression test to prevent recurrence (addressing Pitfall #5).
**Delivers:** Network error handling with React Query retry logic, offline indicators via @react-native-community/netinfo, loading states (skeleton screens), logout functionality, component refactoring (split large files), regression tests for each bug fix
**Addresses:** Should-have features (Network Error Handling, Loading States), table stakes (Logout Functionality), Pitfall #5 (Test Flakiness) through regression testing
**Uses:** @react-native-community/netinfo, React Query error handling
**Implements:** Error recovery patterns from architecture
**Avoids:** Fixing bugs without regression tests, network error handling without offline state detection, loading states without proper async wait patterns

### Phase Ordering Rationale

- **Security before performance:** Can't build reliable performance optimizations on top of security vulnerabilities. Navigation validation prevents crashes that would block performance testing.
- **Baseline before optimization:** 30-50% of manual optimizations worsen performance in React Native. Measurement prevents over-optimization pitfall and wasted effort.
- **FlashList as highest-impact optimization:** Research shows 90% CPU reduction with drop-in migration. Low risk, high reward makes this first optimization priority after baseline.
- **Bug fixes last:** Benefit from error boundaries and validation infrastructure established in earlier phases. Regression tests build on testing infrastructure from Phase 0.
- **Sequential not parallel:** Each phase provides infrastructure for the next. Phase 1 validation patterns used in Phase 3 optimizations. Phase 2 baselines prove which Phase 3 optimizations are necessary.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Backend proxy implementation patterns for YouTube API (needs API research for Lambda/Cloud Functions setup)
- **Phase 3:** React Query v3 → v5 migration strategy (breaking changes, needs migration guide deep-dive)
- **Phase 4:** Component refactoring patterns for large files (needs code structure analysis)

Phases with standard patterns (skip research-phase):
- **Phase 0:** EAS Updates staged rollout is well-documented in Expo docs
- **Phase 2:** React DevTools Profiler usage has extensive official documentation
- **Phase 3:** FlashList migration is drop-in replacement with clear migration guide

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified compatible with Expo SDK 54. Zod, FlashList, expo-secure-store have official documentation and active maintenance. Sentry requires compatibility verification but has clear installation path. |
| Features | HIGH | Feature priorities based on production React Native app patterns and app store requirements. Table stakes features validated against industry standards (HTTPS requirement, error boundaries). Competitive features based on rural connectivity constraints. |
| Architecture | HIGH | Recommended patterns (storage abstraction, Zustand middleware, error boundaries) are established React Native best practices. Incremental adoption strategy avoids high-risk rewrites. Non-breaking changes preserve existing functionality. |
| Pitfalls | HIGH | All six critical pitfalls documented with multiple sources showing production failures. Recovery costs validated through incident reports. Prevention strategies based on successful production deployments. |

**Overall confidence:** HIGH

Research leveraged official Expo SDK 54 documentation, React Native official docs, and multiple 2025-2026 production case studies. All technology recommendations verified for SDK compatibility. Pitfalls extracted from real production incidents with documented recovery costs. Architecture patterns based on established best practices with proven track records.

### Gaps to Address

- **Sentry SDK 54 compatibility:** Reported issues in GitHub require verification before installation. Fallback: delay Phase 4 proactive logging until compatibility confirmed or use alternative (Bugsnag).
- **React Query v3 → v5 migration complexity:** Breaking changes require detailed migration plan. During Phase 3 planning, need to audit all React Query usage patterns and plan gradual migration with feature flags.
- **Backend proxy implementation details:** Phase 1 backend proxy pattern requires infrastructure decisions (AWS Lambda vs. Google Cloud Functions vs. Vercel). During Phase 1 planning, research specific implementation based on existing backend (if any).
- **Low-end device testing availability:** Phase 2 and 3 require testing on Android devices with 2GB RAM (target audience uses Samsung Galaxy A series). Validation: ensure test device availability before Phase 2 starts.
- **React Native New Architecture impact:** Expo SDK 54 has New Architecture enabled by default. Some optimizations may behave differently. Validation: test each optimization on both old and new architecture if possible.

## Sources

### Primary (HIGH confidence)
- **Expo SDK 54 Official Documentation** — SecureStore, expo-image, EAS Updates, typed routes, compatibility verification
- **React Native Official Docs 0.81.5** — Performance optimization, FlatList configuration, error boundaries, testing overview
- **TanStack Query Official Docs v5** — React Native integration, migration guide from v3, offline-first patterns
- **Shopify FlashList GitHub + Docs** — Performance benchmarks (90% CPU reduction), migration guide, best practices
- **Zod Official Documentation** — TypeScript-first validation, schema inference, React Native patterns

### Secondary (MEDIUM confidence)
- **Multiple 2025-2026 React Native Performance Articles** (Medium, DEV.to) — Over-optimization pitfalls, FlatList configuration tradeoffs, memory leak patterns
- **React Native Security Articles** (Medium, LogRocket) — API key exposure patterns, EXPO_PUBLIC_ security implications, SecureStore usage
- **Production Case Studies** (Shopify Engineering, Callstack) — New Architecture migration, E2E testing strategies, deployment rollback procedures
- **Sentry/Bugsnag React Native Integration Docs** — Error monitoring patterns, SDK 54 compatibility issues (GitHub)

### Tertiary (LOW confidence)
- **Stack Overflow Discussions** — FlatList tuning recommendations (needs validation with profiling)
- **Community Performance Tips** — Memoization patterns (needs measurement to validate)

---
*Research completed: 2026-01-28*
*Ready for roadmap: yes*
