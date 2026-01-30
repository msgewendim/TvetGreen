# Technology Stack

**Analysis Date:** 2026-01-28

## Languages

**Primary:**
- TypeScript 5.9.3 - Full codebase with strict mode enabled
- JavaScript - Expo Metro bundler and build scripts
- JSON - Data storage and configuration files

**Secondary:**
- TSX/JSX - React Native component markup

## Runtime

**Environment:**
- Node.js (Expo managed)
- React Native 0.81.5 with New Architecture enabled (`newArchEnabled: true`)
- Expo SDK 54.0.23 - Managed React Native platform

**Package Manager:**
- pnpm - Primary package manager
- npm/Yarn compatible via pnpm workspace support
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- React 19.1.0 - UI framework
- React Native 0.81.5 - Native mobile development
- Expo 54.0.23 - Managed native platform framework

**Navigation:**
- Expo Router 6.0.14 - File-based routing (app directory)
- React Navigation 7.0.14 - Navigation primitives
- @react-navigation/bottom-tabs 7.2.0 - Tab navigation UI

**UI & Components:**
- React Native Paper 5.14.5 - Material Design components
- React Native Gesture Handler 2.28.0 - Touch gesture handling
- React Native Reanimated 4.1.3 - Native animations
- React Native SVG 15.12.1 - SVG component rendering
- Expo Linear Gradient 15.0.7 - Gradient backgrounds
- Expo Blur 15.0.7 - Blur effects

**Icons & Visuals:**
- Lucide React Native 0.475.0 - Icon library
- @expo/vector-icons 15.0.3 - Expo icon fonts
- React Native Vector Icons 10.3.0 - Additional icon library
- @lucide/lab 0.1.2 - Additional Lucide components

**Data Fetching & State:**
- React Query 3.39.3 - Server state management and caching
- Zustand 5.0.8 - Lightweight global state management

**Localization & Internationalization:**
- i18next 25.6.2 - Internationalization framework
- react-i18next 16.3.3 - React bindings for i18next
- expo-localization 17.0.7 - Device locale detection

**Storage & Persistence:**
- @react-native-async-storage/async-storage 2.2.0 - Persistent key-value storage

**Video & Media:**
- expo-av 16.0.7 - Audio/video playback
- react-native-youtube-iframe 2.4.1 - YouTube video embedding
- react-native-webview 13.15.0 - WebView component
- react-native-web-webview 1.0.2 - Web-specific WebView support

**Platform Support:**
- React Native Web 0.21.2 - React Native on web browsers
- React DOM 19.1.0 - Web rendering
- Expo File System 19.0.17 - File system access
- Expo Web Browser 15.0.9 - In-app browser functionality
- Expo Camera 17.0.9 - Camera access
- Expo Status Bar 3.0.8 - Status bar control
- Expo Splash Screen 31.0.10 - Splash screen management
- Expo Symbols 1.0.7 - Native symbol integration
- Expo System UI 6.0.8 - System UI integration
- Expo Font 14.0.9 - Custom font loading
- Expo Constants 18.0.10 - Constants and expo configuration
- Expo Linking 8.0.8 - Deep linking
- Expo Haptics 15.0.7 - Haptic feedback
- Expo Speech 14.0.7 - Text-to-speech synthesis
- React Native Screens 4.16.0 - Native screen navigation
- React Native Safe Area Context 5.6.2 - Safe area management

**Web & Browser Support:**
- React Native URL Polyfill 2.0.0 - URL API polyfill for React Native
- @expo/metro-runtime 6.1.2 - Metro bundler runtime for Expo

**Utilities:**
- React Native Worklets 0.5.1 - Worklet runtime for animations

## Development Tools

**Build & Compilation:**
- Biome 2.2.5 - Linting and formatting (unified toolchain replacing ESLint/Prettier)
- TypeScript 5.9.3 - Static type checking

**Testing & Development:**
- Puppeteer 24.29.1 - Headless browser automation (for build/test scripts)
- Sharp 0.34.5 - Image processing (for PWA icon generation)

**Build System:**
- Metro Bundler - Bundler (managed by Expo)
- Expo CLI - Development and build CLI

## Configuration

**Environment:**
- .env file present with: `EXPO_PUBLIC_YOUTUBE_API_KEY`
- Environment variables are prefixed with `EXPO_PUBLIC_` for client-side access
- .npmrc configured with `legacy-peer-deps=true` for pnpm compatibility

**Build Configuration:**
- app.json - Expo configuration with:
  - Icon and splash screen setup
  - Web bundler configuration (Metro)
  - PWA manifest configuration (name, shortName, theme colors)
  - Typed routes enabled (`typedRoutes: true`)
  - New Architecture enabled (`newArchEnabled: true`)
  - iOS tablet support enabled

**Code Quality:**
- biome.json - Code formatter and linter config:
  - Formatter enabled (tab indentation)
  - Linter enabled (recommended rules)
  - JavaScript double-quote style
  - Import organization disabled
  - Git VCS disabled

**TypeScript:**
- tsconfig.json - TypeScript configuration:
  - Strict mode enabled
  - JSX set to react-native
  - Path aliases: `@/*`, `@/design-system`

**Internationalization:**
- i18n.config.ts - i18next configuration:
  - Supported languages: English (en), Swahili (sw), Amharic (am)
  - Language detector with AsyncStorage persistence
  - Device locale auto-detection fallback
  - Custom language metadata for UI display

## Platform Requirements

**Development:**
- Node.js 18+ (recommended for Expo 54)
- pnpm 8.0+
- Expo CLI 54.0.23+
- iOS: Xcode 15.0+ (for iOS simulator testing)
- Android: Android Studio or similar (for Android emulator testing)

**Production:**
- iOS 13.0+ (based on Expo SDK 54 minimum)
- Android API 24+ (Android 7.0+)
- Web: Modern browsers supporting ES2020+ and WebAssembly
- PWA support configured for web deployments

**Deployment Targets:**
- iOS App Store (via EAS Build)
- Google Play Store (via EAS Build)
- Web browsers (via Metro bundler export)
- Expo Go app for testing

---

*Stack analysis: 2026-01-28*
