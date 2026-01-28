# Roadmap: TvetGreenBolt - Quality & Security Improvements

**Project:** TvetGreenBolt Mobile Learning Platform
**Milestone:** Security, Performance & Reliability Improvements
**Created:** 2026-01-28
**Depth:** Quick (5 phases)

## Overview

This roadmap delivers a secure, performant, and reliable learning experience for TVET students by systematically addressing critical security vulnerabilities, establishing performance measurement infrastructure, optimizing proven bottlenecks, and resolving user-facing bugs. The phase sequence prevents common React Native improvement pitfalls through staged rollout capability (Phase 0), security-first validation (Phase 1), evidence-based optimization (Phase 2-3), and regression-tested bug fixes (Phase 4).

## Phase Structure

### Phase 0: Infrastructure Setup
**Goal:** Establish safety nets and rollback capability before making changes

**Dependencies:** None (foundation work)

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04

**Plans:** 3 plans

Plans:
- [ ] 00-01-PLAN.md — EAS Updates configuration and feature flag system
- [ ] 00-02-PLAN.md — Jest testing framework and critical path tests
- [ ] 00-03-PLAN.md — Rollback and deployment documentation

**Success Criteria:**
1. Team can deploy improvements to 5% of users via EAS Updates staged rollout
2. Team can instantly disable problematic changes using feature flags without app resubmission
3. Team can verify critical user flows (auth, course playback, downloads) pass automated E2E tests before deployment
4. Team can execute documented rollback procedure within 30 minutes when crash rate exceeds 1%

**Rationale:** Research shows 20% of React Native quality improvements introduce regressions. Testing infrastructure, feature flags, and staged rollout capability prevent "improvement paradox" where quality work breaks production.

---

### Phase 1: Security Hardening & Validation Infrastructure
**Goal:** Eliminate critical security vulnerabilities and prevent navigation crashes

**Dependencies:** Phase 0 (requires rollback capability before deploying security changes)

**Requirements:** SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, SEC-09

**Success Criteria:**
1. YouTube API keys are no longer exposed in app bundle (verified via decompilation test)
2. User credentials and tokens are stored in encrypted storage (iOS Keychain/Android Keystore)
3. App validates all navigation parameters and rejects malformed courseId/lessonId inputs gracefully
4. App enforces HTTPS for all external image URLs and displays error for non-HTTPS sources
5. App catches video player and course list crashes with error boundaries instead of white screen

**Rationale:** Security vulnerabilities must be addressed first. Exposed API keys create immediate breach risk. Input validation prevents navigation crashes that would block performance optimization work.

---

### Phase 2: Performance Baseline & Measurement Infrastructure
**Goal:** Establish evidence-based performance metrics to guide optimization decisions

**Dependencies:** Phase 1 (requires stable navigation for reliable performance testing)

**Requirements:** PERF-01, PERF-02, PERF-03, PERF-04

**Success Criteria:**
1. Team can view documented render times and re-render counts for course catalog and video player screens
2. Team can measure FlatList scroll performance metrics (frame rate, memory usage, jank) on test devices
3. Team can compare before/after screenshots showing performance improvements for stakeholders
4. Development environment displays real-time performance metrics during local testing

**Rationale:** Must establish baseline metrics before optimizing to avoid over-optimization degrading performance. React Native performance is context-dependent; evidence-based approach prevents wasted effort.

---

### Phase 3: Targeted Optimization & List Performance
**Goal:** Improve performance in proven bottlenecks with measurable impact

**Dependencies:** Phase 2 (requires baseline metrics to validate improvements)

**Requirements:** PERF-05, PERF-06, PERF-07, PERF-08, PERF-09, PERF-10, PERF-11, PERF-12, PERF-13, PERF-14, PERF-15

**Success Criteria:**
1. Course catalog scrolls smoothly with >50 courses showing no frame drops on low-end Android devices
2. Course thumbnails load progressively with visible caching behavior (instant load on revisit)
3. Search input typing feels responsive with no lag during rapid keystrokes
4. Video player controls auto-hide smoothly without stuttering or premature hiding
5. App remains responsive during offline mode transitions with cached course data available
6. Profiler confirms optimizations achieve >30% improvement in targeted metrics

**Rationale:** With baseline established, target proven bottlenecks only. Research shows FlashList provides 90% CPU reduction as drop-in replacement for course lists.

---

### Phase 4: Bug Fixes & Network Resilience
**Goal:** Resolve user-reported bugs and handle network errors gracefully for rural connectivity

**Dependencies:** Phase 3 (benefits from error boundaries and validation infrastructure)

**Requirements:** BUG-01, BUG-02, BUG-03, BUG-04, BUG-05, BUG-06, BUG-07, BUG-08, BUG-09, BUG-10, BUG-11, BUG-12, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06

**Success Criteria:**
1. Users cannot navigate beyond last lesson or to non-existent lessons (navigation buttons disabled appropriately)
2. Video player settings (speed, subtitles) persist across app restarts and lesson changes
3. Users see clear, actionable error messages distinguishing network failures from server errors
4. Offline mode indicator appears when network is unavailable with retry button for failed operations
5. Logout completely clears user data from local storage and resets app state to initial screen
6. Each bug fix has passing regression test preventing recurrence

**Rationale:** With security hardened and performance baselined, address user-reported bugs and add network error handling. Error boundaries from Phase 1 enable better error logging.

---

## Progress Tracking

| Phase | Status | Requirements | Success Criteria | Dependencies Met |
|-------|--------|--------------|------------------|------------------|
| 0 - Infrastructure Setup | Complete | 4 | 4 | ✓ None |
| 1 - Security Hardening | Pending | 9 | 5 | ✓ Phase 0 |
| 2 - Performance Baseline | Pending | 4 | 4 | ⏳ Phase 1 |
| 3 - Targeted Optimization | Pending | 11 | 6 | ⏳ Phase 2 |
| 4 - Bug Fixes & Network Resilience | Pending | 18 | 6 | ⏳ Phase 3 |

**Total:** 46 requirements mapped (45 unique + QUAL-06 counted in Phase 4)
**Coverage:** 100% ✓

## Phase Ordering Rationale

**Security before performance:** Cannot build reliable performance optimizations on top of security vulnerabilities. Navigation validation prevents crashes that would block performance testing.

**Baseline before optimization:** 30-50% of manual optimizations worsen performance in React Native. Measurement prevents over-optimization pitfall and wasted effort.

**FlashList as highest-impact optimization:** Research shows 90% CPU reduction with drop-in migration. Low risk, high reward makes this first optimization priority after baseline.

**Bug fixes last:** Benefit from error boundaries and validation infrastructure established in earlier phases. Regression tests build on testing infrastructure from Phase 0.

**Sequential not parallel:** Each phase provides infrastructure for the next. Phase 1 validation patterns used in Phase 3 optimizations. Phase 2 baselines prove which Phase 3 optimizations are necessary.

## Notes

- Phases must execute sequentially due to technical dependencies
- Each phase delivers independently verifiable user-facing improvements
- Phase 0 enables safe rollback for all subsequent phases
- Research identified 6 critical pitfalls prevented by this phase structure
- Success criteria focus on observable user behaviors, not implementation details

---
*Roadmap created: 2026-01-28*
*Phase 0 planned: 2026-01-28*
*Phase 0 completed: 2026-01-28*
*Next step: `/gsd:plan-phase 1`*
