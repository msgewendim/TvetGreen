# Learning Platform - Data Structure Documentation

## Overview

This document defines the JSON data structure for the TvetGreen Learning Platform. During Phase 1, all data is stored in static JSON files. This design enables easy migration to a REST/GraphQL API in future phases.

---

## File Structure

```
src/data/courses/
├── categories.json          # Course categories
├── courses.json            # Course catalog
├── lessons.json            # Individual lessons
├── enrollments.json        # User enrollments (template)
└── README.md              # Data usage instructions
```

---

## Data Models

### 1. categories.json

**Purpose**: Define course categories for browsing and filtering.

**Structure**:
```json
{
  "categories": [
    {
      "id": "string",              // Unique identifier (e.g., "agriculture")
      "name": "string",            // English name
      "nameAmharic": "string",     // Amharic translation
      "nameSwahili": "string",     // Swahili translation
      "icon": "string",            // Lucide icon name
      "color": "string",           // Hex color code
      "courseCount": "number",     // Number of courses in category
      "description": "string"      // Optional description
    }
  ]
}
```

**Example**:
```json
{
  "categories": [
    {
      "id": "agriculture",
      "name": "Agriculture & Farming",
      "nameAmharic": "ግብርና እና የእርሻ አስተዳደር",
      "nameSwahili": "Kilimo na Ufugaji",
      "icon": "Sprout",
      "color": "#10B981",
      "courseCount": 8,
      "description": "Learn sustainable farming techniques and modern agricultural practices"
    },
    {
      "id": "green-energy",
      "name": "Green Energy & Sustainability",
      "nameAmharic": "አረንጓዴ ኃይል እና ዘላቂነት",
      "nameSwahili": "Nishati ya Kijani na Uendelevu",
      "icon": "Zap",
      "color": "#F59E0B",
      "courseCount": 5,
      "description": "Explore renewable energy solutions for communities"
    }
  ]
}
```

**Field Validation**:
- `id`: Required, lowercase, hyphenated, unique
- `name`: Required, max 50 characters
- `nameAmharic`: Required for localization
- `nameSwahili`: Required for localization
- `icon`: Must be valid Lucide React Native icon name
- `color`: Must be valid hex color (#RRGGBB)
- `courseCount`: Auto-calculated (count of courses with this categoryId)
- `description`: Optional, max 200 characters

**Icon Options** (from Lucide):
- Agriculture: `Sprout`, `Wheat`, `Leaf`
- Energy: `Zap`, `Sun`, `Wind`
- Construction: `Hammer`, `Home`, `HardHat`
- Business: `TrendingUp`, `Briefcase`, `DollarSign`
- ICT: `Laptop`, `Code`, `Smartphone`
- Health: `Heart`, `Shield`, `Cross`
- Water: `Droplets`, `Waves`

---

### 2. courses.json

**Purpose**: Store all course metadata and overview information.

**Structure**:
```json
{
  "courses": [
    {
      "id": "string",                     // Unique identifier
      "title": "string",                  // English title
      "titleAmharic": "string",           // Amharic title
      "titleSwahili": "string",           // Swahili title
      "description": "string",            // Full description (English)
      "descriptionAmharic": "string",     // Optional Amharic description
      "descriptionSwahili": "string",     // Optional Swahili description
      "categoryId": "string",             // Reference to category.id
      "thumbnail": "string",              // Image URL
      "instructor": {
        "name": "string",
        "avatar": "string",               // Optional image URL
        "bio": "string"                   // Optional bio
      },
      "duration": "string",               // Human-readable (e.g., "4 hours")
      "lessonCount": "number",            // Total lessons in course
      "level": "string",                  // "beginner" | "intermediate" | "advanced"
      "isPaid": "boolean",                // true if paid course
      "price": "number",                  // 0 for free courses
      "currency": "string",               // "USD" | "ETB" | "KES"
      "rating": "number",                 // 0-5, optional
      "enrollmentCount": "number",        // Optional popularity metric
      "language": ["string"],             // Array of ISO codes
      "learningOutcomes": ["string"],     // Array of outcomes
      "requirements": ["string"],         // Array of prerequisites
      "tags": ["string"],                 // Optional keywords
      "createdAt": "string",              // ISO 8601 date
      "updatedAt": "string"               // Optional ISO 8601 date
    }
  ]
}
```

**Example**:
```json
{
  "courses": [
    {
      "id": "course_agriculture_001",
      "title": "Organic Farming Fundamentals",
      "titleAmharic": "መሰረታዊ ኦርጋኒክ ግብርና",
      "titleSwahili": "Misingi ya Kilimo Kikaboni",
      "description": "Learn sustainable organic farming techniques that increase yield while protecting the environment. Perfect for smallholder farmers looking to improve soil health and crop quality.",
      "categoryId": "agriculture",
      "thumbnail": "https://i.ytimg.com/vi/iOBSamR0SLE/hqdefault.jpg",
      "instructor": {
        "name": "Dr. Amina Hassan",
        "avatar": "https://via.placeholder.com/150",
        "bio": "Agricultural scientist with 15 years of experience in sustainable farming across East Africa."
      },
      "duration": "4 hours 30 minutes",
      "lessonCount": 8,
      "level": "beginner",
      "isPaid": false,
      "price": 0,
      "currency": "USD",
      "rating": 4.7,
      "enrollmentCount": 1250,
      "language": ["en", "am", "sw"],
      "learningOutcomes": [
        "Understand principles of organic farming",
        "Implement composting techniques",
        "Manage pests naturally without chemicals",
        "Improve soil health sustainably"
      ],
      "requirements": [
        "Basic farming knowledge helpful but not required",
        "Access to farmland for practice"
      ],
      "tags": ["organic", "sustainable", "composting", "soil health"],
      "createdAt": "2024-10-15T08:00:00Z",
      "updatedAt": "2024-11-01T10:30:00Z"
    }
  ]
}
```

**Field Validation**:
- `id`: Required, unique, format: `course_{category}_{number}`
- `title`: Required, max 100 characters
- `description`: Required, max 500 characters
- `categoryId`: Must reference existing category
- `thumbnail`: Valid URL or placeholder
- `instructor.name`: Required
- `duration`: Human-readable string
- `lessonCount`: Must match actual lessons in lessons.json
- `level`: Enum ["beginner", "intermediate", "advanced"]
- `isPaid`: Required boolean
- `price`: Required, ≥0
- `currency`: ISO 4217 code
- `rating`: Optional, 0-5 range
- `language`: ISO 639-1 codes ["en", "am", "sw"]
- `learningOutcomes`: Min 3 items
- `requirements`: Optional array
- `tags`: Max 10 tags
- `createdAt`: Required ISO 8601 format

**Thumbnail Sources**:
- YouTube video thumbnails: `https://i.ytimg.com/vi/{videoId}/hqdefault.jpg`
- Placeholder service: `https://via.placeholder.com/400x225?text=Course+Title`
- Unsplash: `https://source.unsplash.com/400x225/?farming`

---

### 3. lessons.json

**Purpose**: Store individual lesson details and video references.

**Structure**:
```json
{
  "lessons": [
    {
      "id": "string",                     // Unique identifier
      "courseId": "string",               // Reference to course.id
      "moduleId": "string",               // Grouping identifier
      "moduleName": "string",             // Module title (English)
      "moduleNameAmharic": "string",      // Optional Amharic
      "moduleNameSwahili": "string",      // Optional Swahili
      "order": "number",                  // Position in course (1-indexed)
      "title": "string",                  // Lesson title (English)
      "titleAmharic": "string",           // Amharic title
      "titleSwahili": "string",           // Swahili title
      "description": "string",            // Optional lesson description
      "videoId": "string",                // YouTube video ID
      "duration": "string",               // "MM:SS" format
      "isPreview": "boolean",             // Free preview available
      "resources": [
        {
          "title": "string",
          "url": "string",
          "type": "string"                // "pdf" | "link" | "video" | "quiz"
        }
      ]
    }
  ]
}
```

**Example**:
```json
{
  "lessons": [
    {
      "id": "lesson_agriculture_001_001",
      "courseId": "course_agriculture_001",
      "moduleId": "module_001",
      "moduleName": "Getting Started with Organic Farming",
      "moduleNameAmharic": "ከኦርጋኒክ ግብርና ጋር መጀመር",
      "moduleNameSwahili": "Kuanza na Kilimo Kikaboni",
      "order": 1,
      "title": "Introduction to Organic Farming Principles",
      "titleAmharic": "የኦርጋኒክ ግብርና መርሆዎች መግቢያ",
      "titleSwahili": "Utangulizi wa Kanuni za Kilimo Kikaboni",
      "description": "Learn the core principles that make organic farming effective and sustainable.",
      "videoId": "iOBSamR0SLE",
      "duration": "18:45",
      "isPreview": true,
      "resources": [
        {
          "title": "Organic Farming Principles PDF",
          "url": "https://example.com/organic-principles.pdf",
          "type": "pdf"
        },
        {
          "title": "Recommended Reading",
          "url": "https://example.com/article",
          "type": "link"
        }
      ]
    },
    {
      "id": "lesson_agriculture_001_002",
      "courseId": "course_agriculture_001",
      "moduleId": "module_001",
      "moduleName": "Getting Started with Organic Farming",
      "order": 2,
      "title": "Understanding Soil Health",
      "titleAmharic": "የአፈር ጤንነትን መረዳት",
      "titleSwahili": "Kuelewa Afya ya Udongo",
      "description": "Deep dive into soil composition, testing, and improvement techniques.",
      "videoId": "7UrRvd6H7xE",
      "duration": "24:12",
      "isPreview": false,
      "resources": []
    }
  ]
}
```

**Field Validation**:
- `id`: Required, unique, format: `lesson_{category}_{courseNum}_{lessonNum}`
- `courseId`: Must reference existing course
- `moduleId`: Format: `module_{number}`, groups related lessons
- `moduleName`: Required for first lesson of module
- `order`: Required, unique per course, sequential
- `title`: Required, max 100 characters
- `videoId`: Required, valid YouTube video ID (11 characters)
- `duration`: Required, format "MM:SS" or "H:MM:SS"
- `isPreview`: Required boolean
- `resources`: Optional array

**Module Organization**:
- Group 3-6 lessons per module
- First lesson of module defines `moduleName`
- Subsequent lessons inherit module name
- Use consistent `moduleId` for grouping

**YouTube Video Selection**:
- Use educational videos from reputable channels:
  - CrashCourse
  - Khan Academy
  - TEDEd
  - Skill-specific channels (e.g., Epic Gardening for agriculture)
- Ensure videos are:
  - Publicly available
  - High quality
  - Appropriate length (10-30 minutes)
  - Relevant to East African context when possible

**Finding YouTube Video IDs**:
- URL format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Extract the 11-character ID after `v=`
- Example: `https://www.youtube.com/watch?v=iOBSamR0SLE` → `iOBSamR0SLE`

---

### 4. enrollments.json

**Purpose**: Track user course enrollments (template for initial state).

**Structure**:
```json
{
  "enrollments": []
}
```

**Runtime Structure** (stored in AsyncStorage):
```json
{
  "enrollments": [
    {
      "id": "string",                     // Unique identifier
      "userId": "string",                 // User identifier (future)
      "courseId": "string",               // Reference to course.id
      "enrolledAt": "string",             // ISO 8601 timestamp
      "lastAccessedAt": "string",         // ISO 8601 timestamp
      "completedAt": "string",            // ISO 8601 timestamp (nullable)
      "status": "string"                  // "active" | "completed" | "dropped"
    }
  ]
}
```

**Example**:
```json
{
  "enrollments": [
    {
      "id": "enrollment_001",
      "userId": "user_default",
      "courseId": "course_agriculture_001",
      "enrolledAt": "2024-11-15T10:00:00Z",
      "lastAccessedAt": "2024-11-18T14:30:00Z",
      "completedAt": null,
      "status": "active"
    }
  ]
}
```

**Field Validation**:
- `id`: Auto-generated, format: `enrollment_{timestamp}`
- `userId`: Default to "user_default" until auth implemented
- `courseId`: Must reference existing course
- `enrolledAt`: Auto-set to current timestamp
- `lastAccessedAt`: Updated on lesson access
- `completedAt`: Set when all lessons completed
- `status`: Enum ["active", "completed", "dropped"]

**AsyncStorage Key**: `@learning_enrollments`

---

### 5. lessonProgress.json (Runtime Only)

**Purpose**: Track user progress on individual lessons.

**Structure** (stored in AsyncStorage):
```json
{
  "lessonProgress": [
    {
      "id": "string",                     // Unique identifier
      "userId": "string",                 // User identifier
      "lessonId": "string",               // Reference to lesson.id
      "courseId": "string",               // Reference to course.id
      "watchedSeconds": "number",         // Seconds watched
      "totalSeconds": "number",           // Total video duration
      "lastPosition": "number",           // Resume point (seconds)
      "isCompleted": "boolean",           // Completion flag
      "completedAt": "string",            // ISO 8601 timestamp (nullable)
      "updatedAt": "string"               // Last update timestamp
    }
  ]
}
```

**Example**:
```json
{
  "lessonProgress": [
    {
      "id": "progress_001",
      "userId": "user_default",
      "lessonId": "lesson_agriculture_001_001",
      "courseId": "course_agriculture_001",
      "watchedSeconds": 1050,
      "totalSeconds": 1125,
      "lastPosition": 1050,
      "isCompleted": true,
      "completedAt": "2024-11-18T15:00:00Z",
      "updatedAt": "2024-11-18T15:00:00Z"
    }
  ]
}
```

**Field Validation**:
- `id`: Auto-generated, format: `progress_{timestamp}`
- `watchedSeconds`: 0 to totalSeconds
- `totalSeconds`: Match lesson duration in seconds
- `lastPosition`: Current playback position
- `isCompleted`: true if watchedSeconds/totalSeconds >= 0.9
- `completedAt`: Set when isCompleted becomes true
- `updatedAt`: Updated every 5 seconds during playback

**Completion Logic**:
```javascript
const isCompleted = (watchedSeconds / totalSeconds) >= 0.9
```

**AsyncStorage Key**: `@lesson_progress`

---

## Data Relationships

```
Category (1) ──< (N) Course (1) ──< (N) Lesson
                      ↓
                 Enrollment (1) ──< (N) LessonProgress
```

**Constraints**:
- One category has many courses
- One course belongs to one category
- One course has many lessons
- One enrollment belongs to one course and one user
- One lesson progress belongs to one lesson and one user

---

## Sample Data Quantities

### Phase 1 Initial Data
- **Categories**: 8
- **Courses**: 20 (distributed across categories)
- **Lessons**: ~120 (average 6 per course)
- **Enrollments**: 0 (empty template)
- **Lesson Progress**: 0 (created at runtime)

### Distribution Across Categories
| Category | Courses | Lessons |
|----------|---------|---------|
| Agriculture & Farming | 4 | 24 |
| Green Energy & Sustainability | 3 | 18 |
| Construction & Building | 3 | 18 |
| Entrepreneurship & Business | 3 | 18 |
| Information & Communication Technology | 2 | 12 |
| Health & Safety | 2 | 12 |
| Water Management | 2 | 12 |
| Community Development | 1 | 6 |

---

## Data Validation Rules

### General Rules
1. All IDs must be unique within their collection
2. All foreign keys must reference existing entities
3. All timestamps must be valid ISO 8601 format
4. All URLs must be valid HTTP/HTTPS
5. All required fields must be present
6. All enums must match allowed values

### JSON Schema Validation

**Category Schema**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "categories": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "nameAmharic", "nameSwahili", "icon", "color", "courseCount"],
        "properties": {
          "id": { "type": "string", "pattern": "^[a-z-]+$" },
          "name": { "type": "string", "maxLength": 50 },
          "nameAmharic": { "type": "string" },
          "nameSwahili": { "type": "string" },
          "icon": { "type": "string" },
          "color": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
          "courseCount": { "type": "integer", "minimum": 0 },
          "description": { "type": "string", "maxLength": 200 }
        }
      }
    }
  }
}
```

---

## Data Migration Strategy

### From JSON to API

**Step 1**: Create parallel API endpoints
```
GET /api/categories
GET /api/courses
GET /api/courses/:id
GET /api/lessons?courseId=:id
POST /api/enrollments
GET /api/enrollments?userId=:id
PUT /api/lesson-progress/:id
```

**Step 2**: Update Zustand store actions
```typescript
// Before
const loadCourses = () => {
  const data = require('@/data/courses/courses.json')
  set({ courses: data.courses })
}

// After
const loadCourses = async () => {
  const response = await fetch('/api/courses')
  const data = await response.json()
  set({ courses: data.courses })
}
```

**Step 3**: Implement caching layer (React Query)

**Step 4**: Remove JSON files

---

## Data Seeding

### For Development
Create a script to generate realistic test data:

```typescript
// src/scripts/seedData.ts
import { faker } from '@faker-js/faker'

function generateCourse(categoryId: string) {
  return {
    id: `course_${categoryId}_${faker.string.alphanumeric(3)}`,
    title: faker.lorem.words(3),
    // ... other fields
  }
}
```

### For Production
- Curate real educational content
- Work with subject matter experts
- Ensure cultural relevance
- Verify video availability
- Test all links

---

## Data Backup & Recovery

### AsyncStorage Backup
```typescript
// Export user data
async function exportUserData() {
  const enrollments = await AsyncStorage.getItem('@learning_enrollments')
  const progress = await AsyncStorage.getItem('@lesson_progress')
  return JSON.stringify({ enrollments, progress })
}

// Import user data
async function importUserData(data: string) {
  const parsed = JSON.parse(data)
  await AsyncStorage.setItem('@learning_enrollments', parsed.enrollments)
  await AsyncStorage.setItem('@lesson_progress', parsed.progress)
}
```

---

## Performance Considerations

### Large Dataset Handling
- **Pagination**: Load courses in batches of 20
- **Virtualization**: Use FlatList for long lists
- **Lazy Loading**: Load lesson details on demand
- **Indexing**: Create lookup maps for fast access

```typescript
// Create index for fast lookups
const courseIndex = courses.reduce((acc, course) => {
  acc[course.id] = course
  return acc
}, {} as Record<string, Course>)
```

### Data Caching
- Cache static data (categories, courses) in memory
- Only reload on pull-to-refresh or app restart
- Store user data (enrollments, progress) in AsyncStorage

---

## Appendix

### A. Complete Data Example

See example files in `/src/data/courses/`:
- `categories.example.json`
- `courses.example.json`
- `lessons.example.json`

### B. Data Integrity Checks

Run validation script before deployment:
```bash
pnpm run validate:data
```

Checks:
- All course IDs referenced in lessons exist
- All category IDs referenced in courses exist
- All video IDs are valid YouTube IDs
- Lesson counts match actual lessons
- No duplicate IDs
- All required fields present

### C. Localization Workflow

1. Extract all English text
2. Send to translators (Amharic, Swahili)
3. Update JSON with translations
4. Validate UTF-8 encoding
5. Test RTL layout (future)

### D. Video Content Guidelines

**Quality Standards**:
- Minimum resolution: 480p
- Maximum duration: 45 minutes
- Clear audio
- English subtitles preferred
- Professional production

**Content Criteria**:
- Relevant to TVET education
- Culturally appropriate
- Accurate information
- Accessible language
- Practical, hands-on focus

---

**Last Updated**: November 18, 2025
**Version**: 1.0
