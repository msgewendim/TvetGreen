# Database Schema
## Skills Training Platform MVP

**Version**: 1.0  
**Last Updated**: January 2025

---

## Overview

Two databases:
1. **Server (PostgreSQL)** — Source of truth
2. **Mobile (SQLite)** — Offline cache + sync queue

---

## Server Database (PostgreSQL)

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │  organizations  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ phone           │──┐    │ name            │
│ phone_verified  │  │    │ created_at      │
│ organization_id │──│───>│                 │
│ created_at      │  │    └─────────────────┘
│ last_active     │  │
└─────────────────┘  │
         │           │
         │           │    ┌─────────────────┐
         │           │    │    courses      │
         │           │    ├─────────────────┤
         ▼           │    │ id (PK)         │
┌─────────────────┐  │    │ title           │
│   enrollments   │  │    │ description     │
├─────────────────┤  │    │ thumbnail_url   │
│ id (PK)         │  │    │ total_duration  │
│ user_id (FK)    │──┘    │ published       │
│ course_id (FK)  │──────>│ created_at      │
│ enrolled_at     │       └─────────────────┘
│ completed_at    │                │
└─────────────────┘                │
                                   ▼
                          ┌─────────────────┐
                          │    lessons      │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ course_id (FK)  │
                          │ title           │
                          │ duration        │
                          │ video_key (S3)  │
                          │ order_index     │
                          │ created_at      │
                          └─────────────────┘
                                   │
                                   │
┌─────────────────┐                │
│    progress     │                │
├─────────────────┤                │
│ id (PK)         │                │
│ user_id (FK)    │────────────────┤
│ lesson_id (FK)  │<───────────────┘
│ completed       │
│ position_secs   │
│ updated_at      │
└─────────────────┘
```

### Table Definitions

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (B2B customers)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    display_name VARCHAR(100),
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    
    -- Index for phone lookups
    CONSTRAINT phone_format CHECK (phone ~ '^\+[0-9]{10,15}$')
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_organization ON users(organization_id);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    total_duration_secs INTEGER DEFAULT 0,
    lesson_count INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT FALSE,
    partner VARCHAR(100), -- e.g., 'Campus IL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_courses_published ON courses(published);

-- Lessons
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_secs INTEGER NOT NULL,
    video_key VARCHAR(500) NOT NULL, -- S3 key, not full URL
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(course_id, order_index)
);
CREATE INDEX idx_lessons_course ON lessons(course_id);

-- Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, course_id)
);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);

-- Progress (per lesson)
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    position_secs INTEGER DEFAULT 0, -- Last watched position
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, lesson_id)
);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_lesson ON progress(lesson_id);

-- Audit log (for sync debugging)
CREATE TABLE sync_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    payload JSONB,
    client_timestamp TIMESTAMP WITH TIME ZONE,
    server_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_id VARCHAR(100)
);
CREATE INDEX idx_sync_log_user ON sync_log(user_id);
```

### Helper Views

```sql
-- Course progress summary per user
CREATE VIEW user_course_progress AS
SELECT 
    e.user_id,
    e.course_id,
    c.title AS course_title,
    c.lesson_count,
    COUNT(p.id) FILTER (WHERE p.completed) AS completed_lessons,
    ROUND(
        COUNT(p.id) FILTER (WHERE p.completed)::DECIMAL / 
        NULLIF(c.lesson_count, 0) * 100, 
        1
    ) AS progress_percent,
    e.enrolled_at,
    e.completed_at
FROM enrollments e
JOIN courses c ON c.id = e.course_id
LEFT JOIN lessons l ON l.course_id = c.id
LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
GROUP BY e.user_id, e.course_id, c.title, c.lesson_count, e.enrolled_at, e.completed_at;
```

### Seed Data (MVP)

```sql
-- Organization for Uganda pilot
INSERT INTO organizations (id, name, contact_email) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Uganda Women Entrepreneurs Program', 'admin@uwep.org');

-- Digital Literacy Course
INSERT INTO courses (id, title, description, published, partner) VALUES 
    ('22222222-2222-2222-2222-222222222222', 
     'Digital Literacy Fundamentals', 
     'Learn essential computer and internet skills for business',
     TRUE,
     'Campus IL');

-- Sample Lessons
INSERT INTO lessons (course_id, title, duration_secs, video_key, order_index) VALUES
    ('22222222-2222-2222-2222-222222222222', 'Introduction to Computers', 600, 'courses/digital-literacy/lesson-01.mp4', 1),
    ('22222222-2222-2222-2222-222222222222', 'Using a Keyboard and Mouse', 480, 'courses/digital-literacy/lesson-02.mp4', 2),
    ('22222222-2222-2222-2222-222222222222', 'Introduction to the Internet', 720, 'courses/digital-literacy/lesson-03.mp4', 3),
    ('22222222-2222-2222-2222-222222222222', 'Email Basics', 600, 'courses/digital-literacy/lesson-04.mp4', 4),
    ('22222222-2222-2222-2222-222222222222', 'Introduction to Microsoft Word', 900, 'courses/digital-literacy/lesson-05.mp4', 5);

-- Update course metadata
UPDATE courses SET 
    lesson_count = 5,
    total_duration_secs = 3300
WHERE id = '22222222-2222-2222-2222-222222222222';
```

---

## Mobile Database (SQLite)

The mobile database mirrors server data for offline access plus stores local-only state.

### Schema

```sql
-- Cached courses (from server)
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    total_duration_secs INTEGER,
    lesson_count INTEGER,
    cached_at INTEGER NOT NULL -- Unix timestamp
);

-- Cached lessons (from server)
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    duration_secs INTEGER NOT NULL,
    video_url TEXT, -- Full URL for streaming
    order_index INTEGER NOT NULL,
    cached_at INTEGER NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Local enrollments
CREATE TABLE enrollments (
    course_id TEXT PRIMARY KEY,
    enrolled_at INTEGER NOT NULL,
    completed_at INTEGER,
    synced INTEGER DEFAULT 0, -- 0 = needs sync, 1 = synced
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Downloaded videos (local state only)
CREATE TABLE downloads (
    lesson_id TEXT PRIMARY KEY,
    local_path TEXT NOT NULL,
    file_size_bytes INTEGER,
    downloaded_at INTEGER NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Progress (syncs with server)
CREATE TABLE progress (
    lesson_id TEXT PRIMARY KEY,
    completed INTEGER DEFAULT 0, -- 0 or 1
    position_secs INTEGER DEFAULT 0,
    updated_at INTEGER NOT NULL,
    synced INTEGER DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Offline sync queue
CREATE TABLE sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL, -- 'enroll', 'progress_update', 'lesson_complete'
    payload TEXT NOT NULL, -- JSON string
    created_at INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    last_error TEXT
);

-- App metadata
CREATE TABLE app_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);
-- Stores: last_sync_at, user_id, device_id
```

### Sync Queue Actions

| Action | Payload | Description |
|--------|---------|-------------|
| `enroll` | `{course_id}` | User enrolled in course |
| `progress_update` | `{lesson_id, position_secs}` | Video position saved |
| `lesson_complete` | `{lesson_id}` | Lesson marked complete |

### Migration Strategy

```typescript
// migrations.ts
const MIGRATIONS = [
  {
    version: 1,
    up: `
      CREATE TABLE courses (...);
      CREATE TABLE lessons (...);
      CREATE TABLE enrollments (...);
      CREATE TABLE downloads (...);
      CREATE TABLE progress (...);
      CREATE TABLE sync_queue (...);
      CREATE TABLE app_meta (...);
    `
  },
  // Future migrations go here
];
```

---

## Data Sync Strategy

### Pull (Server → Mobile)

**When**: App opens with connectivity
**What**: Courses, lessons, enrollments, progress

```typescript
// Pseudocode
async function pullFromServer() {
  const lastSync = await db.getAppMeta('last_sync_at');
  
  // Get updated data since last sync
  const data = await api.get('/sync/pull', { since: lastSync });
  
  // Upsert into local SQLite
  await db.upsertCourses(data.courses);
  await db.upsertLessons(data.lessons);
  await db.upsertEnrollments(data.enrollments);
  await db.upsertProgress(data.progress);
  
  await db.setAppMeta('last_sync_at', Date.now());
}
```

### Push (Mobile → Server)

**When**: Connectivity restored, queue has items
**What**: Enrollments, progress updates

```typescript
// Pseudocode
async function pushToServer() {
  const queue = await db.getSyncQueue();
  
  if (queue.length === 0) return;
  
  try {
    await api.post('/sync/push', { actions: queue });
    await db.clearSyncQueue();
  } catch (error) {
    // Mark failed items for retry
    await db.incrementSyncAttempts(queue.map(q => q.id));
  }
}
```

### Conflict Resolution

**Rule**: Server timestamp wins (last-write-wins)

| Scenario | Resolution |
|----------|------------|
| User completes lesson offline, server has older state | Server accepts newer completion |
| User progress differs | Take higher position (user watched more) |
| Enrollment exists on both | Keep both, dedupe by course_id |

---

## Data Volumes (Estimates)

### MVP (50 users)

| Table | Rows | Size |
|-------|------|------|
| users | 50 | <1 KB |
| organizations | 1 | <1 KB |
| courses | 5-10 | <1 KB |
| lessons | 50-100 | <10 KB |
| enrollments | 100-250 | <10 KB |
| progress | 2,500-5,000 | <50 KB |

### Growth Projection

| Users | Database Size | Notes |
|-------|---------------|-------|
| 50 | <1 MB | Current |
| 500 | ~5 MB | RDS t3.micro handles easily |
| 5,000 | ~50 MB | Consider read replica |
| 50,000 | ~500 MB | Need proper indexing review |

---

## Backup Strategy

### PostgreSQL (Server)
- RDS automated daily backups (7 day retention)
- Point-in-time recovery enabled
- Manual snapshot before major changes

### SQLite (Mobile)
- No backup (data synced to server)
- Re-pull on reinstall
- Downloaded videos are user-managed

---

## Indexes Summary

```sql
-- Critical for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);

-- Consider adding if queries slow down
-- CREATE INDEX idx_progress_updated ON progress(updated_at);
-- CREATE INDEX idx_sync_log_timestamp ON sync_log(server_timestamp);
```
