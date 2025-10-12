# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TvetGreenBolt** is an Expo-based React Native mobile learning platform targeting TVET (Technical and Vocational Education and Training) education in rural/developing regions. The app features voice-guided learning, multilingual support, offline capabilities, and accessibility-first design.

**Key Features:**
- Voice-guided navigation and video controls
- Multilingual subtitle support (English, Amharic, Swahili)
- Offline-first course downloads
- Accessibility features for diverse literacy levels
- Category-based learning (Agriculture, Green Energy, Construction, Business)

## Technology Stack

- **Framework**: Expo SDK 53 with React 19 and React Native 0.79
- **Navigation**: Expo Router v5 (file-based routing)
- **Styling**: React Native StyleSheet (inline styles)
- **Icons**: Lucide React Native
- **TypeScript**: Strict mode enabled
- **New Architecture**: Enabled (`newArchEnabled: true`)

## Development Commands

### Starting Development
```bash
npm run dev
# or
EXPO_NO_TELEMETRY=1 expo start
```

Expo will start the Metro bundler. Press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- Scan QR code for physical device testing

### Building
```bash
npm run build:web
# Outputs to ./dist directory
```

### Linting
```bash
npm run lint
# Runs Expo's built-in linter
```

## Project Architecture

### File-Based Routing Structure

The app uses Expo Router's file-based routing system:

```
app/
├── _layout.tsx                    # Root layout with Stack navigator
├── +not-found.tsx                 # 404 error screen
├── onboarding/
│   ├── _layout.tsx               # Onboarding flow Stack navigator
│   ├── welcome.tsx               # Initial welcome screen
│   ├── language.tsx              # Language selection
│   ├── goals.tsx                 # Learning goals setup
│   ├── voice-setup.tsx           # Voice guide configuration
│   └── complete.tsx              # Onboarding completion
├── (tabs)/
│   ├── _layout.tsx               # Tab navigator with 4 tabs
│   ├── index.tsx                 # Home screen (main dashboard)
│   ├── courses.tsx               # Course catalog browser
│   ├── downloads.tsx             # Offline content management
│   └── profile.tsx               # User profile and settings
└── video/
    └── [courseId]/
        └── [lessonId].tsx        # Dynamic video player screen
```

**Route Patterns:**
- `/` → Home tab (main dashboard)
- `/courses` → Course catalog
- `/downloads` → Offline downloads
- `/profile` → User profile
- `/onboarding/welcome` → First-time user flow
- `/video/[courseId]/[lessonId]` → Video lesson player

### Navigation Architecture

**Three-Level Navigation:**
1. **Root Stack** (`app/_layout.tsx`): Controls top-level flows (onboarding, video, tabs)
2. **Tab Navigator** (`app/(tabs)/_layout.tsx`): Bottom tab bar with 4 main sections
3. **Nested Stacks**: Onboarding flow uses nested Stack for linear progression

**Navigation Patterns:**
- Use `expo-router` hooks: `useRouter()`, `useLocalSearchParams()`
- Navigate with `router.push()`, `router.back()`, `router.replace()`
- Dynamic routes use bracket syntax: `[courseId]`, `[lessonId]`

### Design System

**Color Palette (Earthy/Natural Theme):**
- Primary Green: `#2E8B57` (SeaGreen - headers, CTAs)
- Background: `#FDF5E6` (OldLace - warm cream)
- Accent Orange: `#FF8C42` (voice buttons, highlights)
- Success: `#32CD32` (LimeGreen - completion states)
- Text: `#2F4F4F` (DarkSlateGray - primary text)
- Secondary Text: `#8B4513` (SaddleBrown - metadata)
- Danger: `#DC143C` (Crimson - active voice recording)
- Info: `#87CEEB` (SkyBlue - instructions)
- Gold: `#DAA520` (Goldenrod - achievements)

**Typography:**
- Headings: Bold (600-700 weight), 18-24px
- Body: Regular (400-500 weight), 14-16px
- Metadata: 12-14px with reduced opacity

**Layout Patterns:**
- Consistent 20px horizontal padding
- 12-16px border radius for cards
- Shadow/elevation for depth: `shadowOpacity: 0.1-0.3`
- 60-70px top padding for safe areas (no SafeAreaView detected)

### Voice Guide Integration

Voice recognition is a core accessibility feature:

**Implementation Patterns:**
- Toggle state: `isListening` boolean
- Visual feedback: Pulse rings, color changes (orange → crimson)
- Pause video/content when voice guide is active
- Overlay with clear voice commands/instructions
- `Mic` and `MicOff` icons from Lucide

**Voice Commands (as designed):**
- "Play", "Pause", "Next", "Previous"
- "Continue course", "Browse courses"
- "Repeat", "Bookmark"

### Video Player Architecture

**Key Features (in `/video/[courseId]/[lessonId].tsx`):**
- Custom controls overlay (auto-hide after 3s)
- Progress tracking with visual progress bar
- Playback speed control (0.5x to 2.0x)
- Multilingual subtitle system
- Voice command integration
- Course progress visualization
- Next lesson auto-suggestion
- Download status indicators

**State Management:**
- Local React state (useState) for player controls
- No global state management library (consider adding for production)

### Framework-Specific Considerations

**Expo Router Typed Routes:**
- `experiments.typedRoutes: true` in app.json
- TypeScript will generate route types automatically
- Use generated types for type-safe navigation

**useFrameworkReady Hook:**
- Custom hook in `hooks/useFrameworkReady.ts`
- Integrates with Bolt.new's framework detection
- Calls `window.frameworkReady()` when available (web compatibility)

**Expo Plugins:**
- `expo-router`: File-based routing
- `expo-font`: Custom font loading
- `expo-web-browser`: In-app browser functionality

## Key Implementation Patterns

### Screen Layout Pattern
```tsx
// Standard screen structure
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
  {/* Header with gradient/color background */}
  <View style={styles.header}>
    {/* Header content */}
  </View>

  {/* Content sections with cards */}
  <View style={styles.section}>
    {/* Section content */}
  </View>
</ScrollView>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  // Additional styles...
});
```

### Voice Button Pattern
```tsx
<TouchableOpacity
  style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
  onPress={toggleVoiceGuide}
  accessibilityLabel="Voice Guide"
>
  {isListening ? <MicOff /> : <Mic />}
</TouchableOpacity>
```

### Card Component Pattern
```tsx
<TouchableOpacity style={styles.card}>
  <View style={styles.cardContent}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardMeta}>{metadata}</Text>
  </View>
  <ChevronRight size={24} color="#2E8B57" />
</TouchableOpacity>
```

## Development Guidelines

### Adding New Screens
1. Create file in appropriate `app/` subdirectory
2. Follow naming: lowercase for routes, PascalCase for components
3. Export default function component
4. Use TypeScript for type safety
5. Include in parent `_layout.tsx` if using nested Stack

### Styling Approach
- Use StyleSheet.create() for all styles
- Keep styles at bottom of file
- Group related styles together
- Use theme colors consistently
- Prefer inline StyleSheet over external libraries

### Accessibility Requirements
- Add `accessibilityLabel` to interactive elements
- Use semantic HTML elements on web
- Ensure color contrast ratios meet WCAG AA
- Support voice navigation throughout
- Provide text alternatives for icons

### State Management
- Local state with useState for component-specific data
- Consider adding Context API or state library for:
  - User authentication state
  - Course progress tracking
  - Offline download management
  - Language/locale preferences

### Testing Approach
```bash
# Run on iOS simulator
npm run dev
# Press 'i' in terminal

# Run on Android emulator
npm run dev
# Press 'a' in terminal

# Test web version
npm run dev
# Press 'w' in terminal
```

## Future Considerations

**Backend Integration:**
- Currently uses mock data (static objects in components)
- Will need API integration for:
  - User authentication
  - Course catalog
  - Progress tracking
  - Video streaming/downloads

**State Management:**
- Consider React Query/TanStack Query for server state
- Consider Zustand/Jotai for global client state

**Internationalization:**
- Implement i18n library (react-i18next)
- Currently hardcoded English text

**Real Video Playback:**
- Replace mock video player with `expo-av` or `react-native-video`
- Implement actual video streaming/caching

**Voice Recognition:**
- Integrate `expo-speech` for TTS
- Integrate speech recognition library for voice commands
- always use pnpm for packgae mangments and running scripts