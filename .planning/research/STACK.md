# Technology Stack - Quality & Security Improvements

**Project:** TvetGreenBolt - Quality & Security Improvements
**Researched:** 2026-01-28
**Existing Stack:** Expo SDK 54, React Native 0.81.5, TypeScript 5.9.3, Zustand, React Query v3, Biome

---

## Recommended Stack for Improvements

### Security & Data Protection

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| expo-secure-store | ~14.0.x | Secure storage for sensitive data (auth tokens, API keys) | Built-in Expo SDK package. Uses iOS Keychain and Android Keystore for platform-native encryption. **HIGH confidence** - [Official Expo docs](https://docs.expo.dev/versions/latest/sdk/securestore/) confirm compatibility with SDK 54. |
| expo-crypto | ~14.0.x | Cryptographic operations (hashing, random values) | Built-in Expo SDK package for client-side encryption needs. Compatible with SDK 54. **HIGH confidence** |
| zod | ^3.23.x | Runtime validation and TypeScript schema validation | Modern, TypeScript-first validation with zero dependencies. Better performance than Yup for TS projects. Generates TS types from schemas (`z.infer`). **HIGH confidence** - [Multiple 2026 sources](https://medium.com/@osmion/form-validation-yup-vs-zod-vs-joi-which-one-should-you-actually-use-681988f84692) recommend Zod for TS-heavy projects. |
| @react-native-community/netinfo | ^11.4.x | Network status monitoring for HTTPS enforcement | Industry standard for network state detection. Integrates with React Query for auto-refetch on reconnect. **MEDIUM confidence** |

**Security Implementation Patterns:**
- **API Key Management**: Use `expo-secure-store` for runtime secrets, EAS Build Secrets for build-time secrets
- **Input Validation**: Zod schemas for all user inputs, API responses, and navigation params
- **WebView Safety**: Validate URLs with Zod before loading, disable JavaScript for untrusted content
- **HTTPS Enforcement**: Use NetInfo to detect network changes, validate URLs start with `https://`

**SSL Pinning Decision:**
- **NOT RECOMMENDED** for this project: Requires native code configuration incompatible with Expo Go
- Available libraries (`@bam.tech/react-native-ssl-pinning`, `react-native-ssl-public-key-pinning`) require development builds
- **Alternative**: Strict HTTPS validation + certificate transparency checks
- **MEDIUM confidence** - [2025/2026 sources](https://medium.com/@ravibelwal/securing-your-react-native-node-js-app-with-ssl-pinning-f3a6c612c00b) confirm Expo limitations

---

### Performance Optimization

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @shopify/flash-list | ^1.7.x | High-performance list virtualization | 10x better performance than FlatList. Uses cell recycling instead of blanks. Drop-in FlatList replacement. **HIGH confidence** - [Recent benchmarks](https://medium.com/whitespectre/flashlist-vs-flatlist-understanding-the-key-differences-for-react-native-performance-15f59236a39f) show 90%+ CPU reduction vs FlatList. |
| expo-image | ~16.0.x | Optimized image loading and caching | Built-in Expo SDK package. Better caching than React Native Image. Force-resize for memory optimization. Supports responsive image selection. **HIGH confidence** - Official Expo package for SDK 54. |
| use-debounce | ^10.0.x | React hooks for debouncing | Lightweight (<1KB), React-first approach. Better than Lodash for hooks. Server-rendering friendly. **HIGH confidence** - [2026 sources](https://www.npmjs.com/package/use-debounce) show active maintenance. |
| @tanstack/react-query | ^5.90.x | Server state management (upgrade from v3) | **UPGRADE RECOMMENDED**: v5 has better React Native support, suspense integration, improved caching. Your v3 is outdated. **HIGH confidence** - [Official RN docs](https://tanstack.com/query/latest/docs/framework/react/react-native) show v5 as current standard. |

**Performance Implementation Patterns:**
- **Memoization**: Use React 19's built-in compiler (enabled in Expo SDK 54 by default). Manual `React.memo`/`useMemo`/`useCallback` only for proven bottlenecks
- **List Optimization**: Replace FlatList with FlashList for course lists, downloads list
- **Image Optimization**: Use `expo-image` with `contentFit` and `cachePolicy` props. Implement responsive image sizing
- **Debouncing**: Apply to search inputs, scroll handlers, voice command processing
- **React Query Tuning**: Configure `staleTime`, `cacheTime`, and `refetchOnWindowFocus` for offline-first behavior

**React 19 Compiler Note:**
- Expo SDK 54 enables React Compiler by default in new projects
- Automatically optimizes re-renders without manual memoization
- **HIGH confidence** - [React docs](https://react.dev/learn/react-compiler/introduction) confirm Expo SDK 54 support

---

### Error Monitoring & Debugging

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @sentry/react-native | ^7.3.x+ | Production error tracking and performance monitoring | Industry standard for React Native. Session replay, breadcrumbs, release tracking. **MEDIUM confidence** - [Compatibility issues reported](https://github.com/getsentry/sentry-react-native/issues/5222) with Expo SDK 54, but likely resolved in v7.3+. Verify before installing. |
| react-native-performance | ^5.2.x | Development performance metrics | FPS monitoring, render time tracking, interaction profiling. Lightweight dev-only tool. **MEDIUM confidence** - Active development, but check Expo SDK 54 compatibility. |
| Flipper | Latest | Development debugging (via React Native DevTools) | **NOTE**: React Native DevTools is replacing Flipper as the official tool. Use DevTools for profiling, Flipper for performance plugins if needed. **MEDIUM confidence** - [2026 guidance](https://reactnative.dev/docs/react-native-devtools) shows transition to DevTools. |

**Monitoring Strategy:**
- **Development**: React Native DevTools for profiling, Flipper Performance Monitor for lighthouse-style scoring
- **Production**: Sentry for crash reporting, performance monitoring, and user session replay
- **Testing**: Manual performance testing with DevTools Profiler before each release

**Sentry Setup Considerations:**
- Install with `npx @sentry/wizard@latest -i reactNative`
- Add `@sentry/react-native/metro` to metro.config.js
- Add `@sentry/react-native/expo` to app.json
- Source maps upload automatically during EAS Build
- **Action Required**: Verify Expo SDK 54 compatibility before installation (check latest GitHub issues)

---

### Testing & Quality Assurance

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| jest-expo | ~52.x | Unit and snapshot testing | Official Expo Jest preset. Handles Expo SDK mocking. Compatible with SDK 54. **HIGH confidence** |
| @testing-library/react-native | ^12.7.x | Component testing | Modern testing approach focusing on user behavior. Integrates with Jest. **HIGH confidence** |
| @testing-library/jest-native | ^5.4.x | Custom Jest matchers for RN | Extends Jest with RN-specific assertions (toBeVisible, toHaveStyle). **HIGH confidence** |

**Testing Strategy:**
- **Unit Tests**: Critical business logic, validation functions, utilities
- **Component Tests**: User-facing components, navigation flows, form validation
- **Integration Tests**: API integration, offline sync, state management
- **E2E Tests**: **NOT RECOMMENDED** - Detox requires release builds (incompatible with Expo Go). Manual testing more practical for current project scope

**Why Not Detox:**
- Detox doesn't officially support Expo (only works with release builds)
- Debug mode doesn't work with Detox
- Setup complexity high for moderate benefit given project size
- **MEDIUM confidence** - [Official guidance](https://reactnativetesting.io/e2e/setup/) confirms Expo limitations

---

### Code Quality & Linting

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @biomejs/biome | 2.2.5 (current) | Linting and formatting | Already in use. Modern, fast alternative to ESLint/Prettier. **HIGH confidence** - Currently installed. |
| TypeScript | 5.9.3 (current) | Type safety | Already in use. Current stable version. **HIGH confidence** - Currently installed. |

**Quality Gates:**
- Pre-commit: `biome check --write` (linting + formatting)
- Pre-push: `tsc --noEmit` (type checking) + `jest --coverage` (tests)
- CI/CD: Full test suite + build verification

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Validation | Zod | Yup | Yup is slower, has more dependencies, less TypeScript-native. Zod has `z.infer` for auto-typing. |
| List Virtualization | FlashList | RecyclerListView | FlashList is built on RecyclerListView with FlatList's easy API. Best of both worlds. |
| Image Optimization | expo-image | react-native-fast-image | Fast-image requires native config. expo-image is built-in, Expo-optimized, zero config. |
| Debouncing | use-debounce | lodash.debounce | use-debounce is React-first (hooks), smaller bundle. Lodash is general-purpose, larger. |
| Error Monitoring | Sentry | Bugsnag, Rollbar | Sentry has best React Native integration, session replay, free tier. Industry standard. |
| E2E Testing | Manual testing | Detox | Detox doesn't work with Expo Go (release builds only). Setup cost too high for project scope. |
| SSL Pinning | Strict HTTPS validation | Native SSL pinning | Native SSL pinning requires development builds, incompatible with Expo Go. Client-only app doesn't justify complexity. |
| State Management | Zustand (current) | Redux Toolkit | Zustand is simpler, smaller, already in use. No need to change. |
| Server State | TanStack Query v5 | React Query v3 (current), SWR | v5 is current standard with better RN support. Your v3 is outdated. SWR less feature-rich. |

---

## Installation Commands

### Security & Validation
```bash
# Already included in Expo SDK 54
# expo-secure-store, expo-crypto

# Add validation
pnpm add zod

# Add network monitoring
pnpm add @react-native-community/netinfo
```

### Performance Optimization
```bash
# Add FlashList
pnpm add @shopify/flash-list

# Already included in Expo SDK 54
# expo-image

# Add debouncing
pnpm add use-debounce

# Upgrade React Query (BREAKING CHANGES - requires migration)
pnpm add @tanstack/react-query@latest
# Follow migration guide: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5
```

### Error Monitoring
```bash
# Add Sentry (verify SDK 54 compatibility first)
npx @sentry/wizard@latest -i reactNative

# Add development performance monitoring
pnpm add -D react-native-performance
```

### Testing
```bash
# Add testing libraries
pnpm add -D jest-expo @testing-library/react-native @testing-library/jest-native

# Configure Jest in package.json:
# "jest": {
#   "preset": "jest-expo",
#   "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"]
# }
```

---

## Migration Priorities

### Phase 1: High-Impact, Low-Risk (Week 1)
1. **Add Zod validation** - Input validation, navigation params, API responses
2. **Replace FlatList with FlashList** - Course lists, downloads list (drop-in replacement)
3. **Add expo-secure-store** - API key management, sensitive data storage
4. **Add use-debounce** - Search inputs, scroll handlers

### Phase 2: Medium-Impact, Medium-Risk (Week 2)
5. **Upgrade React Query v3 → v5** - Requires migration, breaking changes
6. **Add Sentry** - Verify SDK 54 compatibility, configure error boundaries
7. **Implement expo-image** - Replace React Native Image components
8. **Add NetInfo** - Network monitoring, HTTPS enforcement

### Phase 3: Quality Gates (Week 3)
9. **Add testing setup** - Jest, Testing Library, test scripts
10. **Add performance monitoring** - DevTools profiling, Flipper plugins
11. **Document patterns** - Security checklist, performance guidelines

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| Security (Zod, expo-secure-store) | **HIGH** | Official Expo packages + widely adopted validation library. Verified SDK 54 compatibility. |
| Performance (FlashList, expo-image) | **HIGH** | Proven performance gains in production. FlashList benchmarks show 90%+ improvement. |
| Validation (Zod) | **HIGH** | TypeScript-first, zero dependencies, active maintenance. Multiple 2026 sources recommend for TS projects. |
| Error Monitoring (Sentry) | **MEDIUM** | Compatibility issues reported with SDK 54. Verify latest version before installation. |
| Testing (Jest, Testing Library) | **HIGH** | Official Expo preset, industry standard for React Native component testing. |
| React Query Upgrade | **MEDIUM** | Breaking changes require migration. v5 is current standard but migration has risk. |
| HTTPS Enforcement | **MEDIUM** | No native SSL pinning available for Expo Go. URL validation + strict HTTPS checks are fallback. |

---

## Version Verification Sources

- **Expo SDK 54**: [Official Expo Changelog](https://expo.dev/changelog/2025/01-20-sdk-54)
- **React Native 0.81.5**: Currently installed (package.json)
- **Zod**: [NPM latest](https://www.npmjs.com/package/zod) - v3.23.x
- **FlashList**: [Shopify GitHub](https://github.com/Shopify/flash-list) - v1.7.x
- **TanStack Query**: [Official docs](https://tanstack.com/query/latest) - v5.90.x
- **Sentry**: [GitHub issues](https://github.com/getsentry/sentry-react-native/issues/5222) - Check v7.3+ for SDK 54 support
- **expo-secure-store**: [Expo docs](https://docs.expo.dev/versions/latest/sdk/securestore/) - Built-in SDK 54
- **React Native DevTools**: [React Native docs](https://reactnative.dev/docs/react-native-devtools) - Official 2026 guidance

---

## Critical Warnings

### 🚨 DO NOT Install (Incompatible with Expo Go)
- **react-native-ssl-pinning** - Requires native configuration
- **@bam.tech/react-native-ssl-pinning** - Requires development builds
- **Detox** - Only works with release builds, not Expo Go

### ⚠️ Verify Before Installing
- **@sentry/react-native** - Check GitHub issues for Expo SDK 54 compatibility
- **react-native-performance** - Verify Expo SDK 54 support

### 📦 Upgrade Required
- **React Query v3 → v5** - Your current version (3.39.3) is outdated. Follow migration guide for breaking changes.

### 🎯 Use Existing Tools
- **Biome** - Already configured, don't add ESLint/Prettier
- **Zustand** - Already in use, no need for Redux
- **expo-image** - Built into SDK 54, don't add react-native-fast-image

---

## Implementation Notes

### Security Best Practices
1. **Never store secrets in code** - Use expo-secure-store for runtime, EAS Secrets for build-time
2. **Validate all inputs** - Use Zod schemas for user inputs, API responses, route params
3. **Enforce HTTPS** - Check URLs with Zod patterns before loading in WebView or making requests
4. **Sanitize user content** - Validate and escape user-generated content before rendering

### Performance Best Practices
1. **Profile before optimizing** - Use React DevTools Profiler to identify actual bottlenecks
2. **Trust React Compiler** - Expo SDK 54 has it enabled by default. Avoid manual memoization unless proven necessary
3. **Optimize images** - Use expo-image with proper `contentFit`, responsive sizing, and cache policies
4. **Virtualize lists** - Replace all FlatList with FlashList for lists >20 items
5. **Debounce user inputs** - Apply use-debounce to search, voice commands, rapid interactions

### Testing Best Practices
1. **Test user behavior, not implementation** - Use Testing Library patterns
2. **Focus on critical paths** - Auth flow, course access, offline sync, navigation
3. **Test validation logic** - All Zod schemas should have corresponding tests
4. **Mock external dependencies** - API calls, secure storage, network status

---

## Sources

### Security
- [SecureStore - Expo Documentation](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Building Secure Mobile Applications with React Native and Expo 2026](https://johal.in/building-secure-mobile-applications-with-react-native-and-expo-for-cross-platform-development-2026/)
- [React Native and Expo SecureStore - LogRocket Blog](https://blog.logrocket.com/encrypted-local-storage-in-react-native/)

### Validation
- [Yup vs Zod: Choosing the Right Validation Library | Better Stack](https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/)
- [Form Validation: Yup vs Zod vs Joi, Which One Should You Actually Use? | Medium](https://medium.com/@osmion/form-validation-yup-vs-zod-vs-joi-which-one-should-you-actually-use-681988f84692)
- [Building a Robust Form in React Native with React Hook Form and Zod | Medium](https://medium.com/@rutikpanchal121/building-a-robust-form-in-react-native-with-react-hook-form-and-zod-for-validation-7583678970c3)

### Performance
- [React Native DevTools · React Native](https://reactnative.dev/docs/react-native-devtools)
- [Optimizing React Native App Performance: Deep Techniques and Best Practices | Medium](https://medium.com/@EnaModernCoder/optimizing-react-native-app-performance-deep-techniques-and-best-practices-0b495134d1fd)
- [React 19 Memoization: Is useMemo & useCallback No Longer Necessary?](https://dev.to/joodi/react-19-memoization-is-usememo-usecallback-no-longer-necessary-3ifn)

### List Virtualization
- [FlashList vs. FlatList: Understanding the Key Differences | Medium](https://medium.com/whitespectre/flashlist-vs-flatlist-understanding-the-key-differences-for-react-native-performance-15f59236a39c)
- [React Native — FlashList: Performant List view | Medium](https://medium.com/@anisurrahmanbup/react-native-flashlist-performant-list-view-implementation-analysis-8b29df8f2560)

### Image Optimization
- [Image - Expo Documentation](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Native Image Optimization: Performance Essentials | Medium](https://medium.com/@engin.bolat/react-native-image-optimization-performance-essentials-9e8ce6a1193e)

### React Query
- [React Native | TanStack Query React Docs](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [TanStack Query: The Ultimate Data-Fetching Solution for React Native | Medium](https://medium.com/@andrew.chester/tanstack-query-the-ultimate-data-fetching-solution-for-react-native-developers-ea2af6ca99f2)

### Error Monitoring
- [Using Sentry - Expo Documentation](https://docs.expo.dev/guides/using-sentry/)
- [Expo + Sentry Integration | Sentry](https://sentry.io/integrations/expo/)
- [Expo 54 iOS build failure - GitHub Issue](https://github.com/getsentry/sentry-react-native/issues/5222)

### Testing
- [Unit testing with Jest - Expo Documentation](https://docs.expo.dev/develop/unit-testing/)
- [Testing · React Native](https://reactnative.dev/docs/testing-overview)
- [Setting Up Detox | ReactNativeTesting.io](https://reactnativetesting.io/e2e/setup/)

### SSL Pinning
- [Securing Your React Native & Node.js App With SSL Pinning | Medium](https://medium.com/@ravibelwal/securing-your-react-native-node-js-app-with-ssl-pinning-f3a6c612c00b)
- [GitHub - bamlab/react-native-ssl-pinning](https://github.com/bamlab/react-native-ssl-pinning)

### Debouncing
- [use-debounce - npm](https://www.npmjs.com/package/use-debounce)
- [How to debounce and throttle in React without losing your mind](https://www.developerway.com/posts/debouncing-in-react)
