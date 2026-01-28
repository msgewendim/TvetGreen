# External Integrations

**Analysis Date:** 2026-01-28

## APIs & External Services

**YouTube Data API:**
- Service: YouTube Data API v3 - Video playlist content retrieval
  - SDK/Client: Native fetch API (no external SDK)
  - Auth: API key environment variable `EXPO_PUBLIC_YOUTUBE_API_KEY`
  - Endpoints:
    - `https://www.googleapis.com/youtube/v3/playlistItems` - Fetch playlist items
    - `https://www.googleapis.com/youtube/v3/videos` - Fetch video details (duration, statistics, live status)
  - Fallback: `https://yt.lemnoslife.com/noKey/playlistItems` - No-auth fallback endpoint
  - Implementation: `api/videos/index.ts`
  - Features:
    - Playlist ID: `PLSQl0a2vh4HDERCw_ddanXbsDpFWcpL-S` (hardcoded default)
    - Fetches: snippet, contentDetails, statistics, liveStreamingDetails
    - Video parsing: title, description, thumbnails, duration, view count, live status
    - ISO 8601 duration parsing to HH:MM:SS format

**YouTube Embedded Videos:**
- Service: YouTube iframe embedding
  - SDK/Client: `react-native-youtube-iframe` (v2.4.1)
  - Implementation: Video player screens
  - Features: Play video from URL, controls via iframe API

## Data Storage

**Databases:**
- None configured (currently using mock/static data)

**Local/Client Storage:**
- AsyncStorage (@react-native-async-storage/async-storage 2.2.0):
  - Storage location: Device filesystem (managed by React Native)
  - Keys stored:
    - `@tvetgreen_language` - Selected language preference (via i18n)
    - `@learning_enrollments` - User course enrollments with status and timestamps
    - `@lesson_progress` - Lesson completion tracking (watched seconds, total seconds, completion status)
  - Implementation: `src/store/learningStore.ts`, `i18n.config.ts`
  - Persistence: Automatic JSON serialization/deserialization
  - Debouncing: 500ms debounce on write operations to prevent excessive I/O

**File Storage:**
- Expo File System (expo-file-system 19.0.17):
  - Purpose: Offline course content storage (planned feature)
  - Implementation location: Not yet integrated
  - Capabilities: Directory structure management, file download/caching

**Caching:**
- React Query (v3.39.3):
  - Cache strategy: Stale-time based (configurable)
  - Implementation: `src/services/query/QueryClient.ts`
  - Configuration: `staleTime: 1000 * 60 * 60 * 24` (24 hours) for video data
  - Retry policy: 3 retries with 1000ms delay
  - Query keys: `["videos"]` for YouTube playlist data

## Authentication & Identity

**Auth Provider:**
- Custom/None - Currently unauthenticated
- Default user ID: `"user_default"` (hardcoded)
- Implementation: `src/store/learningStore.ts`
- Future: Authentication integration not yet implemented
- Progress tracking: Per-user in AsyncStorage with default user context

**Access Control:**
- None (all courses public, no user permissions)
- Device-local access control only (AsyncStorage-based)

## Localization & Device Integration

**Device Localization:**
- expo-localization (v17.0.7) - Device locale detection
- Implementation: `i18n.config.ts`
- Supported languages: English (en), Swahili (sw), Amharic (am)
- Fallback chain: Saved preference → Device locale → English (default)

**Text-to-Speech:**
- expo-speech (v14.0.7) - Native TTS for voice guide feature
- Status: Integrated but usage patterns to be implemented
- Purpose: Voice-guided navigation and accessibility

**Haptic Feedback:**
- expo-haptics (v15.0.7) - Native haptic feedback
- Status: Integrated but usage patterns to be implemented

**Camera Access:**
- expo-camera (v17.0.9) - Camera device access
- Status: Integrated but not used in current implementation

## Monitoring & Observability

**Error Tracking:**
- None detected - Standard console.error logging used
- Error logging locations:
  - `api/videos/index.ts` - API fetch errors
  - `i18n.config.ts` - Language detection/storage errors
  - `src/store/learningStore.ts` - State management errors

**Logs:**
- Approach: Console logging (console.error, console.log)
- No external logging service integrated
- Log locations: API calls, state changes, error states

## CI/CD & Deployment

**Hosting:**
- Web: Metro bundler export to static files
- Build output: `./dist` directory (via `npm run build:web`)

**CI Pipeline:**
- GitHub: `.git/config` present (Git repository detected)
- EAS Build integration: Planned (typical Expo setup) but not verified
- Build command: `npm run build:web` exports for web platform

**Build Scripts:**
- `scripts/generate-pwa-icons.js` - Icon generation for PWA manifest
- `scripts/add-pwa-manifest.js` - PWA manifest post-processing
- Puppeteer (24.29.1) and Sharp (0.34.5) used for image processing

## Web/PWA Configuration

**Progressive Web App:**
- Manifest configuration in `app.json`:
  - Name: "TvetGreen Skill Hub"
  - Short name: "TvetGreen"
  - Start URL: "/"
  - Display: "standalone"
  - Theme color: "#000000"
  - Background color: "#ffffff"
  - Orientation: "portrait"
  - Scope: "/"
  - Cross-origin: "use-credentials"
  - Favicon: `assets/logos/icon.png`
- Status: PWA-enabled for web builds

## Environment Configuration

**Required env vars:**
- `EXPO_PUBLIC_YOUTUBE_API_KEY` - YouTube Data API key (required for video fetching)
  - Value: Present in `.env` file
  - Scope: Public (EXPO_PUBLIC_ prefix)
  - Usage: Direct API authentication

**Optional/Planned env vars:**
- `EXPO_NO_TELEMETRY` - Disable Expo telemetry (used in npm scripts)

**Secrets location:**
- `.env` file (committed to repo - security concern for API key)
- Should migrate to `.env.local` (git-ignored) in production setup

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured

**Deep Linking:**
- expo-linking (v8.0.8) - Deep link handling
- Scheme: "myapp" (defined in app.json)
- Status: Infrastructure integrated but deep links not configured

## Network & Connectivity

**API Communication:**
- Fetch API (native to React Native and Web)
- No external HTTP client library (axios, got, etc.)
- Direct REST calls to YouTube API and fallback endpoint
- No request/response interceptors
- No retry middleware (handled by React Query)

**WebView:**
- react-native-webview (13.15.0) - In-app web content
- react-native-web-webview (1.0.2) - Web platform support
- expo-web-browser (15.0.9) - In-app browser functionality

## Data Format & Serialization

**JSON:**
- Static data loaded from JSON files:
  - `src/data/courses/categories.json` - Course categories
  - `src/data/courses/courses.json` - Course metadata
  - `src/data/courses/lessons.json` - Lesson data
  - `src/data/courses/enrollments.json` - Reference data

**Locale Data:**
- Translation files in `locales/` directory:
  - `locales/en/translation.json` - English translations
  - `locales/sw/translation.json` - Swahili translations
  - `locales/am/translation.json` - Amharic translations

---

*Integration audit: 2026-01-28*
