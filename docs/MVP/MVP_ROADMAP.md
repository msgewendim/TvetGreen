# MVP Development Roadmap
## Skills Training Platform

**Version**: 1.0  
**Last Updated**: January 2025  
**Timeline**: 8 weeks to pilot-ready

---

## Phase Overview

| Phase | Weeks | Focus | Deliverable |
|-------|-------|-------|-------------|
| 1 | 1-2 | Foundation | Auth + basic navigation |
| 2 | 3-4 | Core Learning | Course browse, video playback |
| 3 | 5-6 | Offline | Downloads, sync |
| 4 | 7-8 | Polish | Testing, bug fixes, pilot prep |

---

## Week 1: Project Setup & Auth Backend

### Goals
- Development environment ready
- Auth API functional
- OTP sending working

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| Set up monorepo structure | 2h | `/app` (React Native), `/server` (Node) |
| Initialize Expo project | 2h | Expo SDK 50, TypeScript, Expo Router |
| Set up Node/Express backend | 3h | TypeScript, basic structure |
| Configure PostgreSQL | 2h | Local + RDS setup, run migrations |
| Integrate SuperTokens | 4h | Passwordless recipe, phone flow |
| Integrate Africa's Talking | 3h | SMS sending, OTP generation |
| Create auth endpoints | 4h | `/auth/otp/send`, `/auth/otp/verify`, `/auth/refresh` |
| Write auth tests | 4h | Jest + Supertest |

### Deliverables
- [ ] Can send OTP to real phone number
- [ ] Can verify OTP and receive tokens
- [ ] Tokens stored securely
- [ ] API tests passing

### Commands to Run
```bash
# Backend setup
cd server
npm init -y
npm install express supertokens-node africastalking pg dotenv helmet cors
npm install -D typescript @types/express @types/node jest supertest ts-node

# Frontend setup  
cd app
npx create-expo-app@latest . --template expo-template-blank-typescript
npx expo install expo-router expo-secure-store
```

---

## Week 2: Auth Frontend & Navigation

### Goals
- Mobile auth flow complete
- Navigation structure in place
- User can log in and stay logged in

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| Set up Expo Router | 2h | File-based routing structure |
| Phone entry screen | 4h | Country picker, input validation |
| OTP verification screen | 4h | 6-digit input, auto-submit, resend |
| SuperTokens React Native setup | 4h | Session management, token refresh |
| Auth context/store | 3h | Zustand store for auth state |
| Protected route logic | 2h | Redirect to login if not authenticated |
| Tab navigation skeleton | 2h | Home, Profile tabs |
| Basic Profile screen | 2h | Show phone number, logout button |

### Deliverables
- [ ] Complete login flow on device
- [ ] Session persists across app restarts
- [ ] Logout clears session
- [ ] Navigation between tabs works

### Key Files
```
app/
├── app/
│   ├── _layout.tsx          # Root layout with auth check
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── phone.tsx        # Phone entry
│   │   └── verify.tsx       # OTP verification
│   └── (main)/
│       ├── _layout.tsx      # Tab navigator
│       ├── index.tsx        # Home
│       └── profile.tsx      # Profile
├── stores/
│   └── authStore.ts
└── services/
    └── auth.ts
```

---

## Week 3: Backend API & Course Data

### Goals
- Course/lesson API complete
- Enrollment API working
- Progress tracking API ready

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| Database: courses, lessons tables | 2h | Migration scripts |
| Database: enrollments, progress tables | 2h | Migration scripts |
| GET /courses endpoint | 2h | List all published courses |
| GET /courses/:id endpoint | 2h | Course with lessons |
| POST /me/enrollments endpoint | 2h | Enroll user in course |
| GET /me/enrollments endpoint | 2h | User's enrolled courses |
| POST /me/progress endpoint | 3h | Update lesson progress |
| GET /me/progress endpoint | 2h | All user progress |
| S3 setup for videos | 3h | Bucket, IAM, upload test video |
| GET /lessons/:id/download-url | 3h | Generate signed URL |
| Seed test data | 2h | 1 course, 5 lessons, test video |

### Deliverables
- [ ] All course APIs responding
- [ ] Can enroll via API
- [ ] Progress updates persist
- [ ] Signed URLs work for video access

### Test Data
```sql
-- 5 lessons, ~2 min each test videos
-- Videos in S3: courses/digital-literacy/lesson-XX.mp4
```

---

## Week 4: Course UI & Video Playback

### Goals
- Course browsing works
- Video plays in app
- Progress tracked locally

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| CourseCard component | 2h | Thumbnail, title, lesson count |
| Home screen: My Courses section | 3h | Fetch enrollments, display |
| Home screen: Available Courses | 3h | Fetch courses, display |
| Course Detail screen | 4h | Info, lesson list, enroll button |
| LessonRow component | 2h | Title, duration, status icons |
| Video Player screen | 6h | expo-av integration, controls |
| Playback controls | 4h | Play/pause, seek, speed |
| Local progress tracking | 3h | Save position every 10s |
| Mark lesson complete | 2h | On 90% watch, update state |

### Deliverables
- [ ] Browse courses on Home
- [ ] View course details
- [ ] Enroll in course
- [ ] Play video lessons
- [ ] Progress tracked (local only)

### Key Components
```
components/
├── CourseCard.tsx
├── LessonRow.tsx
├── VideoPlayer.tsx
└── ProgressBar.tsx
```

---

## Week 5: Offline Database & Sync

### Goals
- Local SQLite working
- Data syncs with server
- Progress persists offline

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| Set up expo-sqlite | 3h | Database wrapper, migrations |
| Local schema implementation | 3h | All tables from DATABASE.md |
| Cache courses on fetch | 3h | Write to SQLite after API call |
| Read from SQLite first | 3h | Offline-first data access |
| Sync queue table | 2h | Queue progress updates |
| Sync service: push | 4h | Send queue to server |
| Sync service: pull | 3h | Fetch updates from server |
| POST /sync endpoint | 3h | Batch sync handler |
| Connectivity detection | 2h | NetInfo integration |
| Auto-sync on reconnect | 2h | Background sync trigger |

### Deliverables
- [ ] App works offline with cached data
- [ ] Progress saves locally
- [ ] Progress syncs when online
- [ ] Sync status visible to user

### Key Files
```
services/
├── storage.ts       # SQLite wrapper
├── sync.ts          # Sync logic
└── api.ts           # HTTP client with offline awareness

hooks/
├── useOffline.ts    # Connectivity status
└── useSync.ts       # Sync trigger
```

---

## Week 6: Video Downloads

### Goals
- Users can download lessons
- Offline video playback works
- Storage management functional

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| Download button component | 2h | States: ready, downloading, done |
| Download manager service | 6h | Queue, progress, retry logic |
| Background download | 4h | expo-file-system download |
| Local file storage | 3h | Organize by course/lesson |
| Update video player for local | 3h | Check local file first |
| Download progress UI | 3h | Show % on lesson row |
| Manage Downloads screen | 4h | List, delete functionality |
| Storage usage display | 2h | Calculate, display total |
| WiFi-only setting | 2h | Preference, queue logic |

### Deliverables
- [ ] Download individual lessons
- [ ] Download all course lessons
- [ ] Play downloaded videos offline
- [ ] Delete downloads
- [ ] See storage usage

### Key Files
```
services/
└── downloadManager.ts

stores/
└── downloadStore.ts

app/(main)/
└── downloads.tsx
```

---

## Week 7: Polish & Bug Fixes

### Goals
- UI refinements
- Performance optimization
- Error handling complete

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| Loading skeletons | 3h | Course cards, lesson list |
| Error boundaries | 2h | Graceful error UI |
| Empty states | 2h | No courses, no downloads |
| Pull-to-refresh | 2h | All list screens |
| Offline indicator | 2h | Header bar offline mode |
| Performance profiling | 4h | Fix slow renders |
| Memory leak check | 3h | Video player cleanup |
| Crash reporting setup | 2h | Sentry integration |
| Analytics events | 3h | Key user actions |
| Accessibility pass | 3h | Labels, contrast, touch targets |
| UI polish | 4h | Spacing, colors, consistency |

### Deliverables
- [ ] No blocking crashes
- [ ] Smooth 60fps scrolling
- [ ] All errors handled gracefully
- [ ] Sentry receiving events

---

## Week 8: Testing & Pilot Prep

### Goals
- App ready for 50 pilot users
- APK built and distributed
- Support process ready

### Tasks

| Task | Est. Hours | Details |
|------|------------|---------|
| End-to-end testing | 6h | Manual test all flows |
| Device testing | 4h | Test on low-end Android |
| Load testing API | 3h | Simulate 50 concurrent users |
| Fix critical bugs | 6h | From testing findings |
| Build production APK | 2h | EAS Build |
| Internal testing | 2h | Team members test |
| Create user guide | 3h | Simple PDF for pilot users |
| Set up support channel | 2h | WhatsApp group or similar |
| Pilot user onboarding | 4h | Enroll users, verify phones work |
| Monitor launch | 4h | Watch logs, respond to issues |

### Deliverables
- [ ] APK distributed to 50 users
- [ ] All pilot users can log in
- [ ] Support channel active
- [ ] Monitoring dashboard ready

### Pre-Launch Checklist
```
[ ] Auth flow works on 3+ device types
[ ] Video plays online and offline
[ ] Progress syncs correctly
[ ] No crash on low memory
[ ] Error messages are user-friendly
[ ] API rate limits configured
[ ] Database backups verified
[ ] SSL certificates valid
[ ] Privacy policy accessible
```

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Africa's Talking SMS delays | Medium | High | Test extensively, have fallback provider ready |
| Video download fails on slow network | High | Medium | Implement resume, show clear progress |
| SQLite corruption | Low | High | Regular integrity checks, clear recovery path |
| Users forget they enrolled | Medium | Low | Push notification reminder |
| Content not localized in time | Medium | Medium | Start with English, localize iteratively |

---

## Success Criteria for Pilot

| Metric | Target | Measurement |
|--------|--------|-------------|
| Successful logins | 90% | Users who complete OTP on first try |
| Day 1 retention | 70% | Users who return after first session |
| Lesson completion | 50% | Users who finish at least 1 lesson |
| Offline usage | 40% | Sessions without connectivity |
| Crash-free rate | 99% | Sentry metrics |

---

## Post-Pilot Roadmap (Future)

| Timeline | Feature | Rationale |
|----------|---------|-----------|
| Week 9-10 | Push notifications | Improve retention |
| Week 11-12 | Completion certificates | User demand |
| Month 3 | Swahili/Luganda content | Expand market |
| Month 4 | Admin dashboard | Scale beyond 50 users |
| Month 5 | Voice UI exploration | Serve non-literate users |
| Month 6 | Payment integration | B2C revenue stream |
