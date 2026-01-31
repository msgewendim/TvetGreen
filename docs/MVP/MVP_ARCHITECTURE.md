# Technical Architecture Document
## Skills Training Platform MVP

**Version**: 1.0  
**Last Updated**: January 2025

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MOBILE APP (React Native)                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Auth       │  │   Courses    │  │   Video      │              │
│  │   Module     │  │   Module     │  │   Player     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Offline    │  │   Progress   │  │   Download   │              │
│  │   Storage    │  │   Sync       │  │   Manager    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            API LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Node.js / Express API                      │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │  │
│  │  │  Auth   │  │ Courses │  │Progress │  │  Sync   │         │  │
│  │  │ Routes  │  │ Routes  │  │ Routes  │  │ Routes  │         │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│  ┌───────────────────────────┼──────────────────────────────────┐  │
│  │                    SuperTokens (Auth)                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │  PostgreSQL │ │    S3 /     │ │  Africa's   │
        │  Database   │ │ CloudFront  │ │  Talking    │
        └─────────────┘ └─────────────┘ └─────────────┘
           (Data)         (Videos)        (SMS OTP)
```

---

## Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| Offline-First | All core features work without internet; sync when connected |
| Simple Over Clever | Standard patterns, minimal dependencies, easy to debug |
| Mobile-Optimized | Every API response designed for low bandwidth |
| Graceful Degradation | App remains usable on 2G connections |

---

## Component Architecture

### Mobile App (React Native)

```
src/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login, OTP verification
│   ├── (main)/            # Authenticated screens
│   │   ├── index.tsx      # Home (My Courses + Browse)
│   │   ├── course/[id].tsx    # Course detail
│   │   ├── lesson/[id].tsx    # Video player
│   │   └── profile.tsx    # Profile & settings
│   └── _layout.tsx        # Root layout
├── components/
│   ├── CourseCard.tsx
│   ├── LessonList.tsx
│   ├── VideoPlayer.tsx
│   ├── DownloadButton.tsx
│   └── ProgressBar.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCourses.ts
│   ├── useDownloads.ts
│   ├── useProgress.ts
│   └── useOfflineSync.ts
├── services/
│   ├── api.ts             # HTTP client
│   ├── auth.ts            # SuperTokens integration
│   ├── storage.ts         # SQLite wrapper
│   └── downloadManager.ts # Video download logic
├── stores/
│   ├── authStore.ts       # Zustand
│   ├── courseStore.ts
│   └── syncStore.ts
└── utils/
    ├── offline.ts
    └── formatters.ts
```

### Backend API (Node.js)

```
server/
├── src/
│   ├── routes/
│   │   ├── auth.ts        # OTP send/verify
│   │   ├── courses.ts     # Course CRUD
│   │   ├── progress.ts    # Progress tracking
│   │   └── sync.ts        # Offline sync endpoint
│   ├── middleware/
│   │   ├── auth.ts        # SuperTokens middleware
│   │   └── rateLimit.ts
│   ├── services/
│   │   ├── sms.ts         # Africa's Talking
│   │   └── storage.ts     # S3 operations
│   ├── db/
│   │   ├── schema.sql
│   │   └── queries.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Data Flow Diagrams

### Authentication Flow

```
┌────────┐         ┌────────┐         ┌────────────┐         ┌──────────┐
│  User  │         │  App   │         │   API      │         │ Africa's │
│        │         │        │         │            │         │ Talking  │
└───┬────┘         └───┬────┘         └─────┬──────┘         └────┬─────┘
    │                  │                    │                     │
    │ Enter phone      │                    │                     │
    │─────────────────>│                    │                     │
    │                  │                    │                     │
    │                  │ POST /auth/otp     │                     │
    │                  │───────────────────>│                     │
    │                  │                    │                     │
    │                  │                    │ Send SMS            │
    │                  │                    │────────────────────>│
    │                  │                    │                     │
    │                  │    OTP sent        │     SMS delivered   │
    │                  │<───────────────────│<────────────────────│
    │                  │                    │                     │
    │ Enter OTP code   │                    │                     │
    │─────────────────>│                    │                     │
    │                  │                    │                     │
    │                  │ POST /auth/verify  │                     │
    │                  │───────────────────>│                     │
    │                  │                    │                     │
    │                  │ Access + Refresh   │                     │
    │                  │    Tokens          │                     │
    │                  │<───────────────────│                     │
    │                  │                    │                     │
    │                  │ Store tokens       │                     │
    │  Login success   │ locally            │                     │
    │<─────────────────│                    │                     │
    │                  │                    │                     │
```

### Offline Sync Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ONLINE MODE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Action ──> API Call ──> Update Server ──> Update Local   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        OFFLINE MODE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Action ──> Update Local DB ──> Queue for Sync            │
│                                                                  │
│   Sync Queue (SQLite):                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ id │ action          │ data              │ timestamp    │   │
│   ├────┼─────────────────┼───────────────────┼──────────────┤   │
│   │ 1  │ lesson_complete │ {lesson_id: 42}   │ 2025-01-20   │   │
│   │ 2  │ progress_update │ {position: 245}   │ 2025-01-20   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     RECONNECTION                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Detect Online ──> Process Queue ──> POST /sync ──> Clear Queue│
│                                                                  │
│   Conflict Resolution: Server timestamp wins (last-write-wins)  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Video Download Flow

```
┌────────┐         ┌────────┐         ┌────────────┐         ┌──────────┐
│  User  │         │  App   │         │   API      │         │ S3/CDN   │
└───┬────┘         └───┬────┘         └─────┬──────┘         └────┬─────┘
    │                  │                    │                     │
    │ Tap download     │                    │                     │
    │─────────────────>│                    │                     │
    │                  │                    │                     │
    │                  │ GET /lesson/{id}/  │                     │
    │                  │     download-url   │                     │
    │                  │───────────────────>│                     │
    │                  │                    │                     │
    │                  │ Signed URL (1hr)   │                     │
    │                  │<───────────────────│                     │
    │                  │                    │                     │
    │                  │ Download video file│                     │
    │                  │────────────────────────────────────────>│
    │                  │                    │                     │
    │  Progress: 45%   │<────────────────────────────────────────│
    │<─────────────────│    (streaming)     │                     │
    │                  │                    │                     │
    │                  │ Save to device     │                     │
    │                  │ storage            │                     │
    │  Download        │                    │                     │
    │  complete        │ Update local DB    │                     │
    │<─────────────────│ (downloaded=true)  │                     │
    │                  │                    │                     │
```

---

## Offline Architecture

### Local Storage Strategy

| Data Type | Storage | Sync Strategy |
|-----------|---------|---------------|
| User session | SecureStore (encrypted) | None (local only) |
| Course catalog | SQLite | Pull on app open (if online) |
| User progress | SQLite | Push on reconnect |
| Downloaded videos | File system | Never syncs (user-managed) |
| Sync queue | SQLite | Process on reconnect |

### SQLite Schema (Local)

```sql
-- Courses (cached from server)
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  lesson_count INTEGER,
  total_duration INTEGER,
  cached_at INTEGER
);

-- Lessons (cached from server)
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration INTEGER,
  video_url TEXT,
  order_index INTEGER,
  cached_at INTEGER,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Downloads (local state)
CREATE TABLE downloads (
  lesson_id TEXT PRIMARY KEY,
  local_path TEXT NOT NULL,
  file_size INTEGER,
  downloaded_at INTEGER,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Progress (syncs with server)
CREATE TABLE progress (
  lesson_id TEXT PRIMARY KEY,
  completed INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  updated_at INTEGER,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Sync queue (pending uploads)
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
```

### Offline-First Rules

1. **Always read from local SQLite first** — API is for sync, not primary data
2. **Queue all writes** — Never block UI on network requests
3. **Background sync** — Process queue when app comes to foreground and has connectivity
4. **Conflict resolution** — Server timestamp wins; user sees merged state
5. **Stale data indicator** — Show "Last synced: X" so users know data freshness

---

## API Design Overview

### Base URL
```
Production: https://api.skillsplatform.africa/v1
Staging:    https://staging-api.skillsplatform.africa/v1
```

### Authentication
All endpoints except `/auth/*` require Bearer token:
```
Authorization: Bearer <access_token>
```

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/otp/send | Send OTP to phone number |
| POST | /auth/otp/verify | Verify OTP, return tokens |
| POST | /auth/refresh | Refresh access token |
| GET | /courses | List all courses |
| GET | /courses/:id | Course detail with lessons |
| GET | /lessons/:id/download-url | Get signed URL for video |
| GET | /me/enrollments | User's enrolled courses |
| POST | /me/enrollments | Enroll in course |
| GET | /me/progress | All progress data |
| POST | /sync | Batch sync offline changes |

### Response Format
```json
{
  "success": true,
  "data": { },
  "error": null
}
```

### Error Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_OTP",
    "message": "The code you entered is incorrect"
  }
}
```

---

## Security Architecture

### Authentication Layers

| Layer | Implementation |
|-------|----------------|
| Identity | Phone number (verified via OTP) |
| Session | SuperTokens (JWT access + refresh tokens) |
| Local Auth | Biometric/PIN for offline access (optional) |
| API Security | HTTPS, rate limiting, token validation |

### Token Strategy

| Token | Lifetime | Storage | Purpose |
|-------|----------|---------|---------|
| Access Token | 1 hour | Memory | API requests |
| Refresh Token | 30 days | SecureStore | Renew access token |
| Offline Token | 30 days | SecureStore | Enable offline access |

### Data Protection

| Data | Protection |
|------|------------|
| Phone numbers | Hashed in logs, encrypted at rest |
| Auth tokens | Device SecureStore (encrypted) |
| Video files | Device storage (unencrypted, user-managed) |
| Progress data | Encrypted in transit, plain in local SQLite |

---

## Infrastructure

### Cloud Services (AWS)

| Service | Purpose | Estimated Cost |
|---------|---------|----------------|
| EC2 t3.small | API server | $15/month |
| RDS PostgreSQL (t3.micro) | Database | $15/month |
| S3 | Video storage | $5/month (50GB) |
| CloudFront | Video CDN | $10/month |
| **Total** | | **~$45/month** |

### Scaling Considerations (Post-MVP)

| Users | Infrastructure Change |
|-------|----------------------|
| 50 | Single EC2 + RDS |
| 500 | Add read replica, increase EC2 |
| 5,000 | Load balancer, multiple EC2, Redis cache |
| 50,000+ | Kubernetes, global CDN, regional databases |

---

## Monitoring & Logging

### MVP Monitoring Stack

| Tool | Purpose | Cost |
|------|---------|------|
| CloudWatch | Server logs, basic metrics | Included |
| Sentry | Mobile app crash reporting | Free tier |
| Simple Analytics | User behavior (privacy-focused) | Free tier |

### Key Metrics to Track

| Metric | Alert Threshold |
|--------|-----------------|
| API response time | > 2 seconds |
| Error rate | > 5% |
| Download failures | > 10% |
| OTP delivery time | > 60 seconds |

---

## Deployment Architecture

### Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local dev | localhost:3000 |
| Staging | Testing | staging.skillsplatform.africa |
| Production | Live users | app.skillsplatform.africa |

### CI/CD Pipeline

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Push   │────>│  Build  │────>│  Test   │────>│ Deploy  │
│  Code   │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
    │               │               │               │
    │           npm build       Jest tests     Staging auto
    │           Type check      E2E (basic)    Prod manual
    │
    └── GitHub Actions
```

### Mobile Releases

| Track | Purpose | Update Method |
|-------|---------|---------------|
| Internal | Dev testing | Direct APK |
| Closed Beta | MVP users | Play Store closed track |
| Production | Public (post-MVP) | Play Store |
