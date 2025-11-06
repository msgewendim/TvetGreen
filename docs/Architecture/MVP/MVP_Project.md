# MVP Frontend Project Structure

```
Tvet-Green/
│
├── android/                      # Android native code
├── ios/                          # iOS native code (optional for MVP)
│
├── src/
│   ├── App.js                    # Main app entry point
│   │
│   ├── navigation/               # Navigation configuration
│   │   ├── AppNavigator.js       # Main stack navigator
│   │   └── TabNavigator.js       # Bottom tab navigation
│   │
│   ├── screens/                  # Screen components (5 main screens)
│   │   ├── HomeScreen.js         # Home screen with continue learning
│   │   ├── CoursesScreen.js      # Browse courses
│   │   ├── VideoPlayerScreen.js  # Video player with controls
│   │   ├── DownloadsScreen.js    # Manage downloads
│   │   └── ProfileScreen.js      # User profile and settings
│   │
│   ├── components/               # Reusable components
│   │   ├── common/
│   │   │   ├── Button.js         # Custom button
│   │   │   ├── Card.js           # Card wrapper
│   │   │   ├── Header.js         # Screen header
│   │   │   └── Loading.js        # Loading spinner
│   │   │
│   │   ├── course/
│   │   │   ├── CourseCard.js     # Display course info
│   │   │   ├── LessonItem.js     # Lesson list item
│   │   │   └── ProgressBar.js    # Progress indicator
│   │   │
│   │   ├── download/
│   │   │   ├── DownloadButton.js # Download control
│   │   │   └── DownloadQueue.js  # Download queue list
│   │   │
│   │   └── voice/
│   │       ├── VoiceButton.js    # Voice command button
│   │       └── OfflineBanner.js  # Connection status
│   │
│   ├── context/                  # State management with Context API
│   │   ├── AuthContext.js        # User authentication state
│   │   ├── CourseContext.js      # Course data state
│   │   ├── ProgressContext.js    # Learning progress state
│   │   ├── DownloadContext.js    # Download queue state
│   │   └── VoiceContext.js       # Voice command state
│   │
│   ├── services/                 # Business logic layer
│   │   ├── api/
│   │   │   ├── apiClient.js      # Axios instance config
│   │   │   ├── authApi.js        # Auth endpoints
│   │   │   ├── courseApi.js      # Course endpoints
│   │   │   └── progressApi.js    # Progress endpoints
│   │   │
│   │   ├── storage/
│   │   │   ├── database.js       # SQLite setup
│   │   │   ├── storageService.js # Local storage wrapper
│   │   │   └── cacheService.js   # File cache management
│   │   │
│   │   ├── authService.js        # Authentication logic
│   │   ├── courseService.js      # Course business logic
│   │   ├── progressService.js    # Progress tracking
│   │   ├── downloadService.js    # Download management
│   │   ├── syncService.js        # Offline sync logic
│   │   └── voiceService.js       # Voice command processing
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js            # Authentication hook
│   │   ├── useCourses.js         # Course data hook
│   │   ├── useDownload.js        # Download management hook
│   │   ├── useOffline.js         # Offline detection hook
│   │   └── useVoice.js           # Voice commands hook
│   │
│   ├── utils/                    # Helper functions
│   │   ├── constants.js          # App constants
│   │   ├── helpers.js            # General helpers
│   │   ├── validation.js         # Form validation
│   │   └── formatters.js         # Data formatters
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/               # Images and icons
│   │   ├── fonts/                # Custom fonts
│   │   └── audio/                # Audio files (voice feedback)
│   │
│   └── styles/                   # Global styles
│       ├── colors.js             # Color palette
│       ├── typography.js         # Font styles
│       └── spacing.js            # Spacing constants
│
├── __tests__/                    # Test files
│   ├── screens/
│   ├── components/
│   └── services/
│
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── package.json                  # Dependencies
├── babel.config.js               # Babel configuration
├── metro.config.js               # Metro bundler config
└── README.md                     # Project documentation
```

## Key Files Explained

### 📱 Main Entry Point
**src/App.js**
- Wraps app with Context Providers
- Initializes navigation
- Handles app lifecycle events

### 🧭 Navigation
**src/navigation/AppNavigator.js**
- Main stack navigator
- Handles authentication flow
- Deep linking setup

**src/navigation/TabNavigator.js**
- Bottom tabs: Home, Courses, Downloads, Profile
- Tab icons and labels
- Badge notifications

### 📺 Screens (5 Main Screens)
1. **HomeScreen.js** - Continue learning, quick actions, recent activity
2. **CoursesScreen.js** - Course library with filters and search
3. **VideoPlayerScreen.js** - Video playback with voice controls
4. **DownloadsScreen.js** - Download queue and offline content
5. **ProfileScreen.js** - User stats, goals, settings

### 🧩 Components
- **common/** - Reusable UI components (Button, Card, Header, Loading)
- **course/** - Course-related components (CourseCard, LessonItem, ProgressBar)
- **download/** - Download-related components (DownloadButton, DownloadQueue)
- **voice/** - Voice interface components (VoiceButton, OfflineBanner)

### 🌐 Context API (State Management)
- **AuthContext** - User authentication (login, logout, token)
- **CourseContext** - Course data (catalog, filters, search)
- **ProgressContext** - Learning progress (completion, achievements)
- **DownloadContext** - Download queue (pending, in-progress, completed)
- **VoiceContext** - Voice state (listening, processing, result)

### 🔧 Services (Business Logic)
- **api/** - API client and endpoint definitions
- **storage/** - Database and file system operations
- **authService** - Login, registration, token management
- **courseService** - Fetch, filter, search courses
- **progressService** - Track and update learning progress
- **downloadService** - Download queue management
- **syncService** - Offline-online synchronization
- **voiceService** - Voice command processing

### 🪝 Custom Hooks
- **useAuth()** - Access auth context
- **useCourses()** - Access course context
- **useDownload(courseId)** - Download management
- **useOffline()** - Network status detection
- **useVoice()** - Voice command handling

### 🎨 Styles
- **colors.js** - Brand colors (primary, secondary, accent)
- **typography.js** - Font sizes, weights, families
- **spacing.js** - Consistent spacing units

## Simplified Architecture Benefits

✅ **Easy to understand** - Clear separation of concerns  
✅ **Quick to implement** - Minimal boilerplate  
✅ **Scalable** - Can evolve as app grows  
✅ **Testable** - Each layer can be tested independently  
✅ **Maintainable** - Organized structure for solo developer  

## Key MVP Simplifications

### What We're Keeping Simple
1. **Zustand API instead of Redux** - Simpler state management
2. **SQLite + AsyncStorage** - No complex caching layers
3. **5 main screens** - Core functionality only
4. **Direct service calls** - No middleware/sagas
5. **Basic offline sync** - Queue-based, no complex conflict resolution

### What We're NOT Building Yet
- ❌ Advanced analytics dashboard
- ❌ Social features (sharing, comments)
- ❌ Multiple language UI (Amharic content only)
- ❌ Advanced video features (speed control, quality switching)
- ❌ Gamification (beyond basic badges)
- ❌ Push notifications
- ❌ In-app purchases