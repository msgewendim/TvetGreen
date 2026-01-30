# API Design Document
## Skills Training Platform MVP

**Version**: 1.0  
**Last Updated**: January 2025  
**Base URL**: `https://api.skillsplatform.africa/v1`

---

## Overview

RESTful JSON API with JWT authentication via SuperTokens.

### Conventions
- All requests/responses use JSON
- Dates in ISO 8601 format
- IDs are UUIDs
- Pagination via `limit` and `offset` query params

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (valid token, no permission) |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

---

## Authentication

### Headers
```
Authorization: Bearer <access_token>
```

### Token Refresh
Access tokens expire in 1 hour. Use refresh token to get new access token.

---

## Endpoints

### Auth

#### Send OTP
```
POST /auth/otp/send
```

**Request**:
```json
{
  "phone": "+256700123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "OTP sent",
    "expires_in": 300
  }
}
```

**Errors**:
| Code | Message |
|------|---------|
| INVALID_PHONE | Phone number format is invalid |
| RATE_LIMITED | Too many requests. Try again in X minutes |
| SMS_FAILED | Failed to send SMS. Try again |

---

#### Verify OTP
```
POST /auth/otp/verify
```

**Request**:
```json
{
  "phone": "+256700123456",
  "code": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "phone": "+256700123456",
      "created_at": "2025-01-15T10:00:00Z"
    }
  }
}
```

**Errors**:
| Code | Message |
|------|---------|
| INVALID_CODE | The code you entered is incorrect |
| CODE_EXPIRED | Code has expired. Request a new one |
| MAX_ATTEMPTS | Too many failed attempts. Request a new code |

---

#### Refresh Token
```
POST /auth/refresh
```

**Request**:
```json
{
  "refresh_token": "eyJ..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "expires_in": 3600
  }
}
```

**Errors**:
| Code | Message |
|------|---------|
| INVALID_TOKEN | Invalid refresh token |
| TOKEN_EXPIRED | Session expired. Please log in again |

---

### Courses

#### List Courses
```
GET /courses
```

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | int | 20 | Max results |
| offset | int | 0 | Pagination offset |

**Response** (200):
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Digital Literacy Fundamentals",
        "description": "Learn essential computer skills...",
        "thumbnail_url": "https://cdn.../thumb.jpg",
        "lesson_count": 5,
        "total_duration_secs": 3300,
        "partner": "Campus IL"
      }
    ],
    "total": 10,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### Get Course Detail
```
GET /courses/:id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "uuid",
      "title": "Digital Literacy Fundamentals",
      "description": "Learn essential computer skills...",
      "thumbnail_url": "https://cdn.../thumb.jpg",
      "lesson_count": 5,
      "total_duration_secs": 3300,
      "partner": "Campus IL",
      "lessons": [
        {
          "id": "uuid",
          "title": "Introduction to Computers",
          "duration_secs": 600,
          "order_index": 1
        },
        {
          "id": "uuid",
          "title": "Using Keyboard and Mouse",
          "duration_secs": 480,
          "order_index": 2
        }
      ]
    }
  }
}
```

**Errors**:
| Code | Message |
|------|---------|
| NOT_FOUND | Course not found |

---

### Enrollments

#### Get My Enrollments
```
GET /me/enrollments
```

🔒 Requires authentication

**Response** (200):
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "course_id": "uuid",
        "course_title": "Digital Literacy Fundamentals",
        "course_thumbnail_url": "https://cdn.../thumb.jpg",
        "lesson_count": 5,
        "completed_lessons": 2,
        "progress_percent": 40,
        "enrolled_at": "2025-01-15T10:00:00Z",
        "completed_at": null
      }
    ]
  }
}
```

---

#### Enroll in Course
```
POST /me/enrollments
```

🔒 Requires authentication

**Request**:
```json
{
  "course_id": "uuid"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "course_id": "uuid",
      "enrolled_at": "2025-01-20T14:30:00Z"
    }
  }
}
```

**Errors**:
| Code | Message |
|------|---------|
| ALREADY_ENROLLED | You are already enrolled in this course |
| COURSE_NOT_FOUND | Course not found |

---

### Progress

#### Get My Progress
```
GET /me/progress
```

🔒 Requires authentication

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| course_id | uuid | Filter by course (optional) |

**Response** (200):
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "lesson_id": "uuid",
        "course_id": "uuid",
        "completed": true,
        "position_secs": 600,
        "updated_at": "2025-01-20T15:00:00Z"
      },
      {
        "lesson_id": "uuid",
        "course_id": "uuid",
        "completed": false,
        "position_secs": 245,
        "updated_at": "2025-01-20T15:30:00Z"
      }
    ]
  }
}
```

---

#### Update Progress
```
POST /me/progress
```

🔒 Requires authentication

**Request**:
```json
{
  "lesson_id": "uuid",
  "position_secs": 245,
  "completed": false
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "progress": {
      "lesson_id": "uuid",
      "position_secs": 245,
      "completed": false,
      "updated_at": "2025-01-20T15:35:00Z"
    }
  }
}
```

**Notes**:
- If `completed` is true, `position_secs` is ignored
- Progress is upserted (created if not exists)

---

### Lessons

#### Get Download URL
```
GET /lessons/:id/download-url
```

🔒 Requires authentication

**Response** (200):
```json
{
  "success": true,
  "data": {
    "download_url": "https://cdn.../video.mp4?signature=...",
    "expires_in": 3600,
    "file_size_bytes": 52428800
  }
}
```

**Errors**:
| Code | Message |
|------|---------|
| NOT_FOUND | Lesson not found |
| NOT_ENROLLED | You must enroll in the course first |

---

### Sync

#### Batch Sync
```
POST /sync
```

🔒 Requires authentication

Used for offline sync. Accepts batch of actions and returns updated data.

**Request**:
```json
{
  "actions": [
    {
      "type": "progress_update",
      "lesson_id": "uuid",
      "position_secs": 300,
      "completed": false,
      "client_timestamp": "2025-01-20T10:00:00Z"
    },
    {
      "type": "lesson_complete",
      "lesson_id": "uuid",
      "client_timestamp": "2025-01-20T10:05:00Z"
    },
    {
      "type": "enroll",
      "course_id": "uuid",
      "client_timestamp": "2025-01-20T10:10:00Z"
    }
  ],
  "last_sync_at": "2025-01-19T00:00:00Z"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "processed": 3,
    "failed": [],
    "updates": {
      "courses": [...],
      "enrollments": [...],
      "progress": [...]
    },
    "sync_timestamp": "2025-01-20T15:00:00Z"
  }
}
```

**Action Types**:
| Type | Required Fields |
|------|-----------------|
| progress_update | lesson_id, position_secs, completed |
| lesson_complete | lesson_id |
| enroll | course_id |

**Conflict Resolution**:
- Server compares `client_timestamp` with server's `updated_at`
- If client is newer, accept change
- If server is newer, return server value
- For progress: take maximum of `position_secs`

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| POST /auth/otp/send | 3 per phone per hour |
| POST /auth/otp/verify | 5 attempts per code |
| All authenticated | 100 requests per minute |
| GET /lessons/:id/download-url | 50 per hour |

**Rate Limit Response** (429):
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retry_after": 60
  }
}
```

---

## Webhooks (Future)

For admin/reporting, not MVP:

| Event | Payload |
|-------|---------|
| user.enrolled | user_id, course_id, timestamp |
| user.completed_lesson | user_id, lesson_id, timestamp |
| user.completed_course | user_id, course_id, timestamp |

---

## Error Codes Reference

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_PHONE | 400 | Phone format invalid |
| INVALID_CODE | 400 | OTP code incorrect |
| CODE_EXPIRED | 400 | OTP code expired |
| INVALID_TOKEN | 401 | Auth token invalid |
| TOKEN_EXPIRED | 401 | Auth token expired |
| NOT_FOUND | 404 | Resource not found |
| ALREADY_ENROLLED | 409 | Already enrolled |
| NOT_ENROLLED | 403 | Not enrolled in course |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Example Flows

### Login Flow
```
1. POST /auth/otp/send { phone: "+256..." }
2. User receives SMS
3. POST /auth/otp/verify { phone: "+256...", code: "123456" }
4. Store access_token and refresh_token
5. Use Authorization header for all requests
```

### Course Enrollment Flow
```
1. GET /courses (browse available)
2. GET /courses/:id (view detail)
3. POST /me/enrollments { course_id }
4. GET /lessons/:id/download-url (optional: download)
5. POST /me/progress { lesson_id, position_secs } (while watching)
```

### Offline Sync Flow
```
1. User goes offline
2. Actions queued locally:
   - Progress updates
   - Lesson completions
3. User comes online
4. POST /sync { actions: [...], last_sync_at }
5. Receive updates.progress, merge with local
6. Clear local queue
```
