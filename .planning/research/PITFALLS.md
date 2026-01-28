# Pitfalls Research

**Domain:** React Native Quality Improvements (Security, Performance, Bug Fixes)
**Researched:** 2026-01-28
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Exposing API Keys in EXPO_PUBLIC_ Variables

**What goes wrong:**
Developers use `EXPO_PUBLIC_` prefixed environment variables for API keys, thinking they're secure. These variables are bundled into the compiled app and visible in plain-text to anyone inspecting the app bundle. Attackers can extract keys from production apps, leading to unauthorized API usage, data breaches, and massive cloud bills.

**Why it happens:**
The convenience of `EXPO_PUBLIC_` variables makes them easy to use during development. Documentation emphasizes their availability in client code but doesn't prominently warn about security implications. Teams migrating from web development assume environment variables are server-side only.

**How to avoid:**
1. **Backend Proxy Pattern:** Build an orchestration layer (AWS Lambda, Google Cloud Functions) between your app and protected resources
2. **EAS Secrets for Build-Time:** Use EAS Dashboard Secrets for build-time configuration (app IDs, non-sensitive config)
3. **Never Include Secrets:** Don't store private keys, API secrets, or encryption keys in any client-accessible variables
4. **Runtime Secrets:** Use `expo-secure-store` for user credentials and auth tokens that must exist client-side

**Warning signs:**
- `.env` files containing `EXPO_PUBLIC_API_KEY` or similar patterns
- API keys hardcoded in source files
- No backend proxy for third-party services
- Environment variables committed to version control

**Phase to address:**
Phase 1 (Security Hardening) - Must validate all current environment variable usage and implement proxy pattern before other improvements

---

### Pitfall 2: Over-Memoization and Premature Optimization

**What goes wrong:**
Teams add `useMemo`, `useCallback`, and `React.memo` everywhere thinking it improves performance. Memoization has overhead - tracking dependencies, comparing previous values, and storing cached results. For most components, recalculating is cheaper than memoizing. This adds code complexity, increases bundle size, and can actually slow down the app.

**Why it happens:**
Performance optimization articles recommend memoization hooks without caveats. Developers see re-renders in React DevTools and assume they're all bad. Code reviews reward "optimized" code without measuring actual impact. The React compiler (auto-optimization) isn't stable yet, so manual memoization feels necessary.

**How to avoid:**
1. **Measure First:** Use React DevTools Profiler and Flipper to identify actual performance bottlenecks
2. **Optimize Critical Paths:** Only memoize expensive calculations (>10ms) and components re-rendering frequently (>10 times/second)
3. **Follow the Data:** Profile before/after optimization to verify improvement (target: >30% render time reduction)
4. **Strategic Memoization:** Focus on list items, heavy calculations, and components with expensive children
5. **Avoid Inline Functions:** In FlatList `renderItem`, extract to stable reference instead of using `useCallback` everywhere

**Warning signs:**
- Every functional component wrapped in `React.memo`
- `useCallback` and `useMemo` on simple operations (string concatenation, basic math)
- No performance measurements before adding optimization
- Optimization PRs without "before/after" profiler screenshots

**Phase to address:**
Phase 2 (Performance Baseline) - Establish performance metrics BEFORE adding optimizations. Phase 3 implements optimizations only where metrics prove necessity.

---

### Pitfall 3: Breaking Production with "Improvements" (No Rollback Strategy)

**What goes wrong:**
Quality improvement releases break existing functionality. Users can't complete core workflows (login, course playback). No rollback mechanism exists. Team scrambles to fix forward while users uninstall the app. Critical functionality regression takes days to resolve.

**Why it happens:**
Quality improvements are treated as "low-risk" changes. Testing focuses on the improved areas, missing regression in untouched code. React Native's JavaScript-native bridge means changes in one area can break unrelated features. No gradual rollout strategy - changes hit 100% of users immediately. Teams lack automated regression tests for critical user journeys.

**How to avoid:**
1. **Gradual Rollout:** Use Expo EAS Updates with staged rollout (5% → 25% → 50% → 100%)
2. **Feature Flags:** Implement feature toggles for new optimizations (allows instant disable without redeployment)
3. **Rollback Criteria:** Define automatic rollback triggers (crash rate >1%, critical flow success rate <99%)
4. **Fix Forward Preference:** Plan fixes before rollback (rollback sets back progress significantly)
5. **Critical Flow E2E Tests:** Maintain 3-5 automated E2E tests covering authentication, course playback, downloads, profile updates
6. **Dual Testing:** Test improvements on both old and new React Native architectures if New Architecture enabled

**Warning signs:**
- No staging environment or beta testing group
- Deployments directly to production without phased rollout
- Missing E2E tests for critical user journeys
- No defined rollback procedure in deployment docs
- "It worked on my machine" as testing strategy

**Phase to address:**
Phase 0 (Pre-work) - Set up testing infrastructure, feature flags, and staged rollout before implementing improvements. Every subsequent phase uses this safety net.

---

### Pitfall 4: FlatList Performance Degradation from "Optimizations"

**What goes wrong:**
Team optimizes FlatList by aggressively tuning `maxToRenderPerBatch`, `windowSize`, `initialNumToRender`. Lists become jankier instead of smoother. White screens/blanks appear during scrolling. Users complain about sluggish course browsing. The "optimization" made performance worse.

**Why it happens:**
FlatList configuration is highly context-dependent. Articles provide tuning recommendations without explaining tradeoffs. Teams copy configurations from Stack Overflow without understanding their device/data profile. Each parameter has opposing effects: `maxToRenderPerBatch` (bigger = less blank areas, but longer JS blocking), `windowSize` (smaller = better memory, but more blank areas).

**How to avoid:**
1. **Understand Tradeoffs:**
   - `maxToRenderPerBatch`: Higher values reduce blank areas but block event processing longer
   - `windowSize`: Smaller values save memory but show more blanks during fast scrolling
   - `initialNumToRender`: Too high delays initial render, too low shows blanks immediately
2. **Device-Specific Testing:** Test on low-end Android devices (target: Samsung Galaxy A series, 2GB RAM)
3. **Default First:** Start with defaults, only tune if profiling shows specific issues
4. **Measure Metrics:** Track JS frame rate (target: 60fps), memory usage, time to interaction
5. **Avoid Common Mistakes:**
   - Don't use inline arrow functions in `renderItem` (creates new function each render)
   - Don't use ScrollView for >50 items
   - Avoid 1080p images in list items (resize to display dimensions)
   - Extract `keyExtractor` to stable function

**Warning signs:**
- FlatList configuration copied from external source without testing
- No performance comparison before/after configuration changes
- Testing only on high-end devices or iOS
- User reports of blank screens during scrolling

**Phase to address:**
Phase 2 (Performance Baseline) - Document current FlatList performance. Phase 3 (Optimization) only changes configuration if baseline shows problems.

---

### Pitfall 5: Test Flakiness Leading to Ignored Test Failures

**What goes wrong:**
E2E tests fail intermittently. Team can't reproduce failures locally. Test suite becomes unreliable - sometimes 100% pass, sometimes 30% fail. Developers start ignoring test failures or disabling "flaky" tests. Eventually, real bugs slip through because test suite has lost credibility.

**Why it happens:**
E2E tests in React Native are inherently flaky due to animation timing, async state updates, and device variability. Tests don't wait for animations to complete before assertions. Network requests in tests use real APIs instead of mocks. Tests depend on specific device state (logged-in user, downloaded courses). Detox/Appium configuration doesn't account for React Native's async bridge.

**How to avoid:**
1. **Balanced Testing Strategy (2026 Best Practice):**
   - Unit Tests (70%): Fast, reliable, test individual functions/components
   - Integration Tests (25%): Test component interactions without full device
   - E2E Tests (5%): Only 3-5 critical flows wired into CI
2. **E2E Test Discipline:**
   - Wait for animations: `await element(by.id('item')).waitForExist(5000)`
   - Mock network requests in test environment
   - Reset device state before each test (logout, clear storage)
   - Use unique test IDs (`testID` prop) instead of text selectors
3. **Critical Flow Coverage:**
   - Authentication (login, signup, logout)
   - Core functionality (course playback, download, voice guide)
   - Payments/premium features (if applicable)
4. **Fail-Fast CI:** Test failures block merge, not warnings to investigate later

**Warning signs:**
- "Run tests again, they'll probably pass" culture
- Test failure rate >5% on identical code
- Tests disabled with "// TODO: Fix flaky test" comments
- No clear owner for test infrastructure maintenance
- Tests passing locally but failing in CI (or vice versa)

**Phase to address:**
Phase 0 (Pre-work) - Establish reliable test suite foundation before making changes. Phase 4 (Bug Fixes) adds regression tests for each fix.

---

### Pitfall 6: Navigation Bugs from Route Parameter Changes

**What goes wrong:**
Improvements to navigation add parameters or change parameter types. Existing navigation calls break because they pass wrong types. Deep links stop working. Back button navigation breaks. Users get stuck on screens or see "undefined" errors. The app appears broken despite code "working" in isolated testing.

**Why it happens:**
Expo Router uses file-based routing with type safety, but runtime navigation can still pass wrong types. Teams change route parameter structure without finding all call sites. Search/replace misses dynamic navigation (e.g., `router.push(\`/video/${id}\`)`). TypeScript types aren't strict enough on route params. Non-serializable values (objects, functions) passed in params break deep linking and state persistence.

**How to avoid:**
1. **Typed Routes:** Enable `experiments.typedRoutes: true` in app.json (generates TypeScript types)
2. **Serializable Params Only:** Never pass objects, functions, or class instances - use IDs and fetch data in destination screen
3. **Comprehensive Search:** Before changing route params, search entire codebase:
   - `router.push` / `router.replace` / `router.navigate`
   - `<Link href=` components
   - String template literals with route paths
   - Deep link configurations
4. **Navigation Test Suite:** Add integration tests for all navigation paths
5. **Deep Link Testing:** Test all deep link URLs after navigation changes

**Warning signs:**
- TypeScript errors ignored in navigation code
- Route parameter types documented in comments instead of TypeScript
- Dynamic route generation with string templates
- No deep link testing in test suite
- "Couldn't find a navigation context" errors

**Phase to address:**
Phase 1 (Validation Hardening) - Audit all navigation code before other changes. Phase 4 (Bug Fixes) addresses specific navigation issues with tests.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skipping performance measurement before optimization | Faster PR velocity | Wasted effort on non-bottlenecks, potential performance regression | Never - always profile first |
| Using `EXPO_PUBLIC_` for convenience | Easy access to config in all components | Security vulnerabilities, expensive API abuse | Only for truly public values (theme names, feature flags that aren't secret) |
| Disabling flaky tests instead of fixing | Tests pass consistently | Real bugs slip through, technical debt compounds | Never - fix or delete, don't disable |
| Testing only on iOS or high-end Android | Faster test cycles | Bugs on low-end devices (majority of users in developing regions) | Never for this project - target audience uses low-end devices |
| Aggressive FlatList tuning without measurement | Feeling of optimization | Worse performance, more memory usage | Never - defaults are well-tuned for most cases |
| Memoizing everything "to be safe" | Peace of mind | Bundle bloat, maintenance burden, potential slowdown | Never - memoize strategically based on measurements |
| Adding dependencies without security audit | Fast feature implementation | Vulnerabilities, abandoned packages (17.2% of npm packages abandoned) | Only if package is widely used, actively maintained, and security-scanned |
| Fix-forward without rollback plan | Appears decisive | Extended downtime if fix takes days | Only if rollback is technically impossible - always prefer rollback capability |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| YouTube API (video playback) | Exposing API key in app bundle | Backend proxy that adds API key server-side, app calls your API |
| Analytics (tracking) | Tracking PII in event properties | Hash/anonymize user IDs, avoid names/emails in analytics events |
| Crash reporting (Sentry/Bugsnag) | Uploading source maps to public repos | Use EAS Secrets for DSN keys, gitignore source maps, upload via CI only |
| Image CDN (Cloudinary/Imgix) | No image optimization parameters | Always request sized/optimized versions (e.g., `w_400,q_auto,f_auto`) |
| Network requests | Using HTTP in production | HTTPS only - configure Android Network Security Config to block HTTP |
| File downloads (offline courses) | No progress tracking or resume capability | Use `expo-file-system` with download resumption, show progress to user |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized images in lists | Slow scrolling, memory warnings | Resize images to display size, use `resizeMode: 'cover'`, implement image caching | >20 images in list on low-end devices |
| Too many API requests on screen load | Slow initial render, high data usage | Batch requests, cache responses with `react-query` or `expo-file-system` | >5 sequential requests or >500ms total request time |
| No list virtualization (ScrollView for long lists) | App freezes on scroll, out-of-memory crashes | Use FlatList/SectionList for >50 items, implement pagination | >100 items on low-end Android (2GB RAM) |
| Storing large data in AsyncStorage | Slow app launch, ANR (Application Not Responding) on Android | Use SQLite (expo-sqlite) for >1MB data, AsyncStorage only for small config | >5MB stored data on Android |
| Heavy computations on main thread | Frozen UI, dropped frames during interaction | Use `react-native-worklets` or web workers for heavy processing | Computations >16ms (60fps frame budget) |
| No memoization on expensive list items | Slow scrolling, unnecessary re-renders | Memoize components that re-render with same props in lists | Lists with >100 items or complex item rendering |
| Animations blocking JavaScript thread | Choppy animations, unresponsive gestures | Use `useNativeDriver: true` for all animations possible | Any animation >500ms duration |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing auth tokens in AsyncStorage without encryption | Token theft via malicious apps with storage access | Use `expo-secure-store` for tokens, credentials, encryption keys |
| Enabling HTTP globally on Android | Man-in-the-middle attacks, data interception | Android Network Security Config with `cleartextTrafficPermitted="false"` |
| Deep links with sensitive data | URL hijacking by malicious apps | Never send passwords/tokens in deep links - use one-time codes validated server-side |
| Client-side input validation only | API abuse, injection attacks | Always validate server-side, client validation is UX only |
| Unvalidated URLs from user input or external sources | Script injection, malicious redirects | Validate URL format and whitelist allowed domains before opening |
| Using abandoned dependencies | Known vulnerabilities, no security patches | Monthly audit: check last commit date, open issues, test coverage (12.6% of RN packages have known vulnerabilities) |
| Logging sensitive data | PII exposure in crash reports and analytics | Sanitize logs - redact tokens, emails, phone numbers before logging |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No offline error states | Users confused when features don't work offline | Check network state, show clear "offline" messaging, queue actions for retry |
| Missing loading states during optimization | App appears frozen, users tap multiple times | Always show loading indicators for >300ms operations |
| Breaking existing gestures with "improvements" | Users can't navigate, frustration, uninstalls | Test all gestures (swipe back, pull to refresh) after navigation changes |
| Over-aggressive memoization breaking updates | UI doesn't update when data changes | Verify components re-render when props change - test optimized components |
| No visual feedback during voice guide activation | Users don't know if voice is listening | Clear visual state: pulse animation, color change (orange → crimson), overlay message |
| Download progress without cancellation | Users can't stop large downloads eating data | Add cancel button, show MB remaining, warn before large downloads on cellular |
| Changing navigation patterns inconsistently | Users lost in app, have to re-learn navigation | Maintain navigation patterns across all improvements - don't mix paradigms |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Security Hardening:** Often missing server-side validation — verify backend validates all inputs, not just client
- [ ] **Performance Optimization:** Often missing low-end device testing — verify on Android devices with 2GB RAM or less
- [ ] **API Integration:** Often missing error handling for network failures — verify offline behavior, retry logic, timeout handling
- [ ] **FlatList Optimization:** Often missing memory profiling — verify memory usage doesn't grow unbounded on long scrolling sessions
- [ ] **Navigation Changes:** Often missing deep link testing — verify all deep link URLs still work after changes
- [ ] **Memoization:** Often missing before/after performance comparison — verify optimization actually improved metrics by >30%
- [ ] **Environment Variables:** Often missing security audit — verify no secrets in `EXPO_PUBLIC_` variables or committed `.env` files
- [ ] **Rollback Plan:** Often missing staged rollout configuration — verify EAS Update channels configured for gradual rollout
- [ ] **Bug Fixes:** Often missing regression tests — verify each bug fix has test preventing recurrence
- [ ] **Production Deploy:** Often missing critical flow E2E test run — verify login, course playback, download work in production build

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| API keys exposed in app bundle | HIGH | 1. Rotate all exposed keys immediately. 2. Implement backend proxy. 3. Release emergency update. 4. Monitor for abuse (24-48hr lag before users update). |
| Production breaking change deployed | HIGH | 1. Rollback via `eas update --branch production --message "Rollback"` immediately. 2. Identify root cause with error logs. 3. Fix in development with tests. 4. Gradual re-deploy (5% → 25% → 100%). |
| Performance regression from over-optimization | MEDIUM | 1. Use git bisect to identify regression commit. 2. Remove optimizations selectively. 3. Re-measure performance. 4. Only re-add optimizations that show >30% improvement. |
| Flaky test suite ignored, bugs shipped | MEDIUM | 1. Disable all E2E tests temporarily. 2. Keep only 3-5 most critical flows. 3. Rewrite flaky tests with proper waits. 4. Add test reliability monitoring (track pass rate). |
| Navigation broken by parameter changes | MEDIUM | 1. Search all navigation calls for old parameter format. 2. Add TypeScript strict mode for routes. 3. Add navigation integration tests. 4. Test all deep links manually. |
| FlatList janky after tuning | LOW | 1. Reset FlatList configuration to defaults. 2. Profile specific issue (memory? blanks? frame drops?). 3. Tune one parameter at a time. 4. Measure impact before/after each change. |
| Memoization preventing updates | LOW | 1. Check React DevTools to see if component re-renders when expected. 2. Verify dependency arrays in `useMemo`/`useCallback`. 3. Remove memoization if dependencies complex. 4. Add integration test verifying updates work. |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Exposed API keys | Phase 1: Security Hardening | Audit all env vars, no `EXPO_PUBLIC_` secrets, backend proxy implemented |
| Breaking production changes | Phase 0: Infrastructure Setup | EAS staged rollout configured, feature flags working, 3-5 E2E tests passing in CI |
| Over-memoization | Phase 2: Performance Baseline → Phase 3: Optimization | Performance profiler screenshots before/after, optimization shows >30% improvement |
| FlatList performance degradation | Phase 2: Performance Baseline → Phase 3: Optimization | FlatList metrics documented (frame rate, memory), changes improve metrics |
| Test flakiness | Phase 0: Infrastructure Setup | Test suite pass rate >95%, critical flows covered, flaky tests removed/fixed |
| Navigation parameter bugs | Phase 1: Validation Hardening | TypeScript typed routes enabled, all navigation calls found and verified, deep links tested |
| Security vulnerabilities in dependencies | Phase 1: Security Hardening | `npm audit` shows 0 critical/high issues, dependencies <6 months old |
| Network error handling missing | Phase 1: Validation Hardening | All API calls have error handlers, offline state tested, timeout handling verified |
| No rollback strategy | Phase 0: Infrastructure Setup | Documented rollback procedure, tested rollback on staging, rollback criteria defined |
| Regression in untouched code | Phase 4: Bug Fixes | Each bug fix has regression test, E2E tests cover critical flows, integration tests added |

## Sources

**Security:**
- [React Native Security - Official Docs](https://reactnative.dev/docs/security)
- [React Security Best Practices 2026](https://www.glorywebs.com/blog/react-security-practices)
- [React Native HTTP API Not Working (Android & iOS Fix)](https://www.agilesoftlabs.com/blog/2026/01/react-native-http-api-not-working-while)
- [Security Aspects for React Native Applications - Medium](https://medium.com/simform-engineering/security-aspects-to-consider-for-a-react-native-application-95556f0e4244)
- [React Native Libraries Security Considerations](https://www.cossacklabs.com/blog/react-native-libraries-security/)
- [Environment Variables in Expo - Official Docs](https://docs.expo.dev/guides/environment-variables/)
- [How to Securely Store Environment Variables in React Native Expo](https://www.codegenes.net/blog/react-native-expo-environment-variables/)

**Performance:**
- [Optimizing React Native Performance 2026 - DEV](https://dev.to/ajmal_hasan/optimizing-react-native-performance-a-developers-guide-3hd1)
- [7 React Native Mistakes Slowing Your App in 2026 - Medium](https://medium.com/@baheer224/7-react-native-mistakes-slowing-your-app-in-2026-19702572796a)
- [Optimizing FlatList Configuration - Official Docs](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [React Native Performance Tactics - Sentry](https://blog.sentry.io/react-native-performance-strategies-tools/)
- [How to Improve React Native Performance - Medium](https://medium.com/@onix_react/how-to-improve-react-native-performance-adab7347e78c)
- [Optimizing Performance in React Native Apps (Expo) - DEV](https://dev.to/vrinch/optimizing-performance-in-react-native-apps-expo-354k)

**Testing:**
- [Testing Overview - React Native Official Docs](https://reactnative.dev/docs/testing-overview)
- [From Flaky E2E Tests to Confident Development - Medium](https://medium.com/connecteam-engineering/from-flaky-e2e-tests-to-confident-development-rethinking-our-testing-strategy-1ed5bf62b834)
- [Testing Strategies for React Native: Unit, Integration, and E2E - Medium](https://medium.com/@edu2578527/testing-strategies-for-react-native-unit-integration-and-e2e-tests-7a3730e89717)
- [From Unit to E2E: Testing React Native TV in 2026](https://www.callstack.com/blog/testing-react-native-tv-apps)
- [Performance Regression Testing for React Native](https://www.callstack.com/blog/performance-regression-testing-react-native)

**Navigation:**
- [Common Navigation Issues in Expo and React Native - Medium](https://medium.com/@ghulamabbas10/common-navigation-issues-in-expo-and-react-native-solutions-and-best-practices-fa10e2c3e3ab)
- [Expo Router Troubleshooting - Official Docs](https://docs.expo.dev/router/reference/troubleshooting/)
- [NativeWind + Expo Router Navigation Context Nightmare - DEV](https://dev.to/sammytdev/48-hours-lost-nativewind-expo-router-couldnt-find-a-navigation-context-nightmare-3opp)
- [Migrating from React Navigation to Expo Router - Medium](https://benhur-martins.medium.com/migrating-an-app-from-react-navigation-to-expo-router-and-the-params-issue-862b203d9133)

**Deployment & Rollback:**
- [React Native New Architecture Migration Process for 2026 - DEV](https://dev.to/sherry_walker_bba406fb339/the-react-native-new-architecture-migration-process-for-2026-27l3)
- [Migrating to React Native's New Architecture - Shopify Engineering](https://shopify.engineering/react-native-new-architecture)
- [React Native CodePush - GitHub](https://github.com/microsoft/react-native-code-push)
- [Deployment Rollback Plan: Quick Recovery Tips](https://codepushgo.com/blog/deployment-rollback-plan/)
- [React Native Versioning Policy - Official Docs](https://reactnative.dev/docs/releases/versioning-policy)

**Production Best Practices:**
- [Expo 2026: Best Way to Build Cross-Platform Apps](https://metadesignsolutions.com/expo-2026-the-best-way-to-build-cross-platform-apps/)
- [React Native Expo Complete Guide 2026](https://reactnativeexpert.com/blog/react-native-expo-complete-guide/)
- [React Native 0.83 Release: Zero Breaking Changes](https://www.creolestudios.com/react-native-0-83-zero-breaking-changes/)

---
*Pitfalls research for: TvetGreenBolt Quality & Security Improvements*
*Researched: 2026-01-28*
