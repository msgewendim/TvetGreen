# Learning Platform Data

This directory contains the static JSON data files for the TvetGreen Learning Platform.

## Files

### categories.json
Defines 8 course categories with multilingual names (English, Amharic, Swahili).

**Usage**:
```typescript
import categoriesData from '@/data/courses/categories.json'
const categories = categoriesData.categories
```

### courses.json
Contains 20 courses across all categories with complete metadata.

**Usage**:
```typescript
import coursesData from '@/data/courses/courses.json'
const courses = coursesData.courses
```

### lessons.json
Individual lesson data with YouTube video IDs and multilingual titles.

**Usage**:
```typescript
import lessonsData from '@/data/courses/lessons.json'
const lessons = lessonsData.lessons
```

### enrollments.json
Empty template. User enrollments are managed at runtime via Zustand + AsyncStorage.

**Note**: This file is not imported directly. Enrollments are created and stored in AsyncStorage when users enroll in courses.

## Data Relationships

```
Category → Course → Lesson
              ↓
         Enrollment → LessonProgress
```

## Adding New Content

### Adding a Category
1. Open `categories.json`
2. Add new category object with unique ID
3. Update `courseCount` after adding courses
4. Provide translations in all supported languages

### Adding a Course
1. Open `courses.json`
2. Add new course object
3. Ensure `categoryId` references existing category
4. Update category's `courseCount`
5. Add lessons for the course in `lessons.json`

### Adding Lessons
1. Open `lessons.json`
2. Add lesson objects with sequential `order` numbers
3. Group lessons by `moduleId`
4. Use valid YouTube video IDs
5. Update course's `lessonCount`

## YouTube Video IDs

Extract the 11-character ID from YouTube URLs:
- URL: `https://www.youtube.com/watch?v=iOBSamR0SLE`
- ID: `iOBSamR0SLE`

Thumbnail URL format:
```
https://i.ytimg.com/vi/{videoId}/hqdefault.jpg
```

## Localization

All user-facing text includes translations:
- `name` / `nameAmharic` / `nameSwahili`
- `title` / `titleAmharic` / `titleSwahili`

Future: Implement `description` translations.

## Validation

Before committing changes:
1. Ensure all JSON is valid (no trailing commas, proper formatting)
2. Verify all IDs are unique
3. Check all foreign key references exist
4. Confirm lesson counts match actual lessons
5. Test video IDs are accessible

## Migration to API

When migrating to a backend API:
1. Keep these files as reference/backup
2. Update Zustand store to fetch from API endpoints
3. Maintain the same data structure for compatibility
4. Remove JSON imports from production build

## Data Statistics

- **Categories**: 8
- **Courses**: 20
- **Lessons**: 60+ (sample, expand to 120+)
- **Languages**: 3 (English, Amharic, Swahili)

## License

Course content sourced from public educational videos on YouTube. All video rights belong to respective creators.
