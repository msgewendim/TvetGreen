# Feature Specification
## Skills Training Platform MVP

**Version**: 1.0  
**Last Updated**: January 2025

---

## Feature Priority Matrix

### MoSCoW Summary

| Priority | Features |
|----------|----------|
| **Must Have** | Phone auth, course browse, enrollment, video playback, offline download, progress tracking |
| **Should Have** | Search, download queue, profile screen, push notifications |
| **Could Have** | Completion certificate, bookmarks, categories |
| **Won't Have** | Voice UI, payments, community, quizzes, admin dashboard |

---

## Screen Specifications

### 1. Onboarding / Authentication

#### 1.1 Phone Entry Screen

**Purpose**: Collect user's phone number for OTP authentication

**Layout**:
```
┌─────────────────────────────────┐
│                                 │
│         [App Logo]              │
│                                 │
│    Welcome to SkillsHub         │
│                                 │
│    Enter your phone number      │
│    to get started               │
│                                 │
│  ┌─────────────────────────┐   │
│  │ +256 │ 7XX XXX XXX      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │      Continue →         │   │
│  └─────────────────────────┘   │
│                                 │
│  By continuing, you agree to    │
│  our Terms and Privacy Policy   │
│                                 │
└─────────────────────────────────┘
```

**Elements**:
| Element | Type | Behavior |
|---------|------|----------|
| Country picker | Dropdown | Default to Uganda (+256), show flag |
| Phone input | Text field | Numeric keyboard, auto-format |
| Continue button | Button | Disabled until valid phone entered |
| Terms link | Text link | Opens terms in browser |

**Validation**:
- Phone must be 9-10 digits after country code
- Show inline error if invalid format
- Rate limit: Max 3 OTP requests per phone per hour

**API Call**: `POST /auth/otp/send`

---

#### 1.2 OTP Verification Screen

**Purpose**: Verify phone ownership via SMS code

**Layout**:
```
┌─────────────────────────────────┐
│  ←                              │
│                                 │
│    Enter verification code      │
│                                 │
│    We sent a 6-digit code to    │
│    +256 7XX XXX XXX             │
│                                 │
│     ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐    │
│     │ │ │ │ │ │ │ │ │ │ │ │    │
│     └─┘ └─┘ └─┘ └─┘ └─┘ └─┘    │
│                                 │
│    Didn't receive code?         │
│    Resend in 0:45               │
│                                 │
│  ┌─────────────────────────┐   │
│  │       Verify →          │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Elements**:
| Element | Type | Behavior |
|---------|------|----------|
| Back button | Icon | Return to phone entry |
| OTP inputs | 6 text fields | Auto-advance on digit entry, numeric keyboard |
| Resend timer | Text | 60 second countdown, then "Resend code" link |
| Verify button | Button | Auto-triggered when 6 digits entered |

**States**:
- Default: Waiting for input
- Verifying: Button shows spinner
- Error: Shake animation, "Invalid code" message
- Success: Navigate to Home

**API Call**: `POST /auth/otp/verify`

---

### 2. Home Screen

**Purpose**: Show user's courses and available catalog

**Layout**:
```
┌─────────────────────────────────┐
│  SkillsHub              [👤]    │
├─────────────────────────────────┤
│                                 │
│  Continue Learning              │
│  ┌─────────────────────────┐   │
│  │ [thumb] Digital Literacy │   │
│  │ ████████░░░░░ 65%        │   │
│  │ Lesson 4 of 6            │   │
│  └─────────────────────────┘   │
│                                 │
│  My Courses (2)          See all│
│  ┌────────┐ ┌────────┐         │
│  │[thumb] │ │[thumb] │         │
│  │Course 1│ │Course 2│         │
│  │75%     │ │30%     │         │
│  └────────┘ └────────┘         │
│                                 │
│  Available Courses              │
│  ┌────────┐ ┌────────┐         │
│  │[thumb] │ │[thumb] │         │
│  │Course A│ │Course B│         │
│  │5 lessons│ │8 lessons│       │
│  └────────┘ └────────┘         │
│                                 │
└─────────────────────────────────┘
```

**Sections**:

| Section | Condition | Content |
|---------|-----------|---------|
| Continue Learning | Has in-progress course | Large card, last accessed course |
| My Courses | Has enrollments | Horizontal scroll, progress % shown |
| Available Courses | Always | Grid/list of non-enrolled courses |

**Elements**:
| Element | Tap Action |
|---------|------------|
| Profile icon | Navigate to Profile screen |
| Continue card | Navigate to Course Detail |
| My Course card | Navigate to Course Detail |
| Available Course card | Navigate to Course Detail |
| "See all" link | Navigate to full My Courses list |

**Data Requirements**:
- User's enrollments with progress
- All published courses
- Last accessed course/lesson

**Offline Behavior**:
- Show cached data
- "Last updated X ago" indicator
- Pull-to-refresh when online

---

### 3. Course Detail Screen

**Purpose**: Show course info, lessons, and enable enrollment/download

**Layout (Not Enrolled)**:
```
┌─────────────────────────────────┐
│  ←                     [⬇️ All] │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │    [Course Thumbnail]   │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  Digital Literacy               │
│  Fundamentals                   │
│                                 │
│  5 lessons • 55 min total       │
│  Partner: Campus IL             │
│                                 │
│  ┌─────────────────────────┐   │
│  │      Enroll Now →       │   │
│  └─────────────────────────┘   │
│                                 │
│  About this course              │
│  Learn essential computer...    │
│                                 │
│  Lessons                        │
│  ┌─────────────────────────┐   │
│  │ 1. Introduction (10min) │   │
│  │ 2. Keyboard & Mouse     │   │
│  │ 3. Internet Basics      │   │
│  │ ...                     │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Layout (Enrolled)**:
```
┌─────────────────────────────────┐
│  ←                     [⬇️ All] │
├─────────────────────────────────┤
│  ...same header...              │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Continue Learning →  │   │
│  └─────────────────────────┘   │
│                                 │
│  Progress: 3 of 5 complete      │
│  ████████████░░░░░░ 60%         │
│                                 │
│  Lessons                        │
│  ┌─────────────────────────┐   │
│  │ ✓ 1. Introduction  [✓]  │   │
│  │ ✓ 2. Keyboard      [✓]  │   │
│  │ ▶ 3. Internet      [⬇️] │   │
│  │   4. Email         [⬇️] │   │
│  │   5. MS Word       [⬇️] │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Elements**:
| Element | Type | Behavior |
|---------|------|----------|
| Back button | Icon | Return to previous screen |
| Download All | Icon button | Queue all lessons for download |
| Enroll button | Primary button | Enroll and navigate to first lesson |
| Continue button | Primary button | Go to next incomplete lesson |
| Lesson row | List item | Tap to play lesson |
| Lesson download icon | Icon button | Download individual lesson |

**Lesson Row States**:
| Icon | Meaning |
|------|---------|
| (none) | Not started |
| ▶ | In progress (has watch time) |
| ✓ | Completed |
| ⬇️ | Download available |
| ✓ (green) | Downloaded |
| 🔄 | Downloading |

**API Calls**:
- `GET /courses/:id` - Course details
- `POST /me/enrollments` - Enroll
- `GET /lessons/:id/download-url` - Signed URL for download

---

### 4. Video Player Screen

**Purpose**: Play lesson video with controls

**Layout**:
```
┌─────────────────────────────────┐
│ [Full-width video player]       │
│                                 │
│                                 │
│                                 │
│      advancement                 │
│   advancement                       │
│                                 │
│   advancement                    │
│                                 │
│ advancement                          │
│ ◀◀  [▶/⏸]  ▶▶  1x  🔈         │
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  │
│ 3:45 / 10:00                    │
├─────────────────────────────────┤
│                                 │
│  Lesson 3: Internet Basics      │
│  Course: Digital Literacy       │
│                                 │
│  ┌─────────────────────────┐   │
│  │     Next Lesson →       │   │
│  └─────────────────────────┘   │
│                                 │
│  ← Previous    Lesson 3 of 5    │
│                                 │
└─────────────────────────────────┘
```

**Video Controls**:
| Control | Behavior |
|---------|----------|
| Play/Pause | Toggle playback |
| Seek bar | Drag to position |
| Skip back 10s | Tap ◀◀ |
| Skip forward 10s | Tap ▶▶ |
| Speed | Cycle: 1x → 1.25x → 1.5x → 2x → 0.75x → 1x |
| Volume/Mute | Toggle or adjust |
| Fullscreen | Rotate to landscape |

**Progress Tracking**:
- Save position every 10 seconds
- Mark complete when >90% watched
- Sync position to server when online

**Offline Behavior**:
- Play from local storage if downloaded
- Show "Download to watch offline" if not downloaded and offline

**API Calls**:
- `POST /me/progress` - Update watch position
- Queued to sync_queue if offline

---

### 5. Profile Screen

**Purpose**: User settings, storage management, logout

**Layout**:
```
┌─────────────────────────────────┐
│  ←  Profile                     │
├─────────────────────────────────┤
│                                 │
│         [Avatar/Initial]        │
│         +256 7XX XXX XXX        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Downloads                      │
│  └─ 245 MB used                 │
│     [Manage Downloads →]        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  App Settings                   │
│  └─ Download on WiFi only [✓]   │
│  └─ Video quality: Medium       │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Support                        │
│  └─ Help & FAQ                  │
│  └─ Contact Us                  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ┌─────────────────────────┐   │
│  │       Log Out           │   │
│  └─────────────────────────┘   │
│                                 │
│  Version 1.0.0                  │
│                                 │
└─────────────────────────────────┘
```

**Sub-screens**:

#### Manage Downloads
```
┌─────────────────────────────────┐
│  ←  Downloads         Clear All │
├─────────────────────────────────┤
│                                 │
│  245 MB of 2 GB used            │
│  ▬▬▬▬▬▬▬░░░░░░░░░░░░░░░░░░░░░  │
│                                 │
│  Digital Literacy (180 MB)      │
│  ┌─────────────────────────┐   │
│  │ ✓ Lesson 1 (35 MB)  [🗑] │   │
│  │ ✓ Lesson 2 (40 MB)  [🗑] │   │
│  │ ✓ Lesson 3 (45 MB)  [🗑] │   │
│  │ ✓ Lesson 4 (60 MB)  [🗑] │   │
│  └─────────────────────────┘   │
│                                 │
│  Business Basics (65 MB)        │
│  ┌─────────────────────────┐   │
│  │ ✓ Lesson 1 (30 MB)  [🗑] │   │
│  │ ✓ Lesson 2 (35 MB)  [🗑] │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## Feature Details

### Offline Download System

**Download Flow**:
1. User taps download icon on lesson
2. App requests signed URL from server
3. Download starts in background
4. Progress indicator shows %
5. On complete, file saved to app storage
6. Database updated with local path

**Download States**:
| State | UI |
|-------|-----|
| Not downloaded | Hollow download icon |
| Queued | Clock icon |
| Downloading | Progress circle |
| Downloaded | Checkmark |
| Failed | Retry icon |

**Storage Management**:
- Show total storage used
- Allow delete per-lesson or per-course
- Warn when device storage low (<500MB)

**WiFi Preference**:
- Setting: "Download on WiFi only"
- If enabled, queue downloads until WiFi connected
- Show toast: "Download queued for WiFi"

---

### Progress Sync System

**Local Tracking**:
- Every 10 seconds: save position to SQLite
- On lesson end: mark completed
- On app close: final position save

**Sync Logic**:
```
On app foreground:
  1. Check connectivity
  2. If online:
     a. Push sync_queue to server
     b. Pull latest progress from server
     c. Merge (server wins for conflicts)
  3. Clear sync_queue
```

**Sync Status Indicator**:
- Show "Synced" with timestamp
- Show "Syncing..." during sync
- Show "Offline" when no connectivity

---

### Push Notifications (Should Have)

**Notification Types**:
| Type | Trigger | Message |
|------|---------|---------|
| Reminder | 3 days inactive | "Continue your learning journey!" |
| Course update | New lesson added | "New lesson available in [Course]" |
| Completion | Course finished | "Congratulations! You completed [Course]" |

**Implementation**:
- Expo Push Notifications
- Store push token on server
- Respect device notification settings

---

## UI/UX Guidelines

### Design Principles

1. **Simple navigation**: Max 2 taps to any content
2. **Clear progress**: Always show where user is in learning journey
3. **Offline-aware**: Never show errors for expected offline use
4. **Fast feedback**: Instant UI response, sync in background

### Color Palette (Suggested)

| Use | Color | Hex |
|-----|-------|-----|
| Primary | Blue | #2563EB |
| Success/Complete | Green | #16A34A |
| Warning | Orange | #EA580C |
| Error | Red | #DC2626 |
| Text Primary | Dark Gray | #1F2937 |
| Text Secondary | Gray | #6B7280 |
| Background | White | #FFFFFF |
| Surface | Light Gray | #F3F4F6 |

### Typography

| Style | Size | Weight | Use |
|-------|------|--------|-----|
| Heading 1 | 24px | Bold | Screen titles |
| Heading 2 | 20px | Semi-bold | Section headers |
| Body | 16px | Regular | General text |
| Caption | 14px | Regular | Secondary info |
| Small | 12px | Regular | Metadata |

### Touch Targets

- Minimum tap target: 44x44 points
- Button padding: 16px vertical, 24px horizontal
- List item height: 56px minimum

### Loading States

- Skeleton screens for initial load
- Inline spinners for actions
- Pull-to-refresh on list screens
- Never block UI for background sync
