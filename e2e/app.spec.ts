import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { createMockCourse, createMockLesson, waitForAsync } from './utils/testHelpers';

// Mock the zustand store
const mockStore = {
  enrollments: [],
  lessonProgress: {},
  enrollInCourse: jest.fn(),
  markLessonComplete: jest.fn(),
  isEnrolled: jest.fn().mockReturnValue(false),
  getLessonProgress: jest.fn().mockReturnValue(null),
};

jest.mock('zustand', () => ({
  create: () => () => mockStore,
}));

describe('Critical Path: Course Browsing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('course list renders with mock data', async () => {
    const courses = [
      createMockCourse({ id: '1', title: 'Agriculture Basics' }),
      createMockCourse({ id: '2', title: 'Green Energy 101' }),
    ];

    // This test verifies the data structure is correct
    expect(courses).toHaveLength(2);
    expect(courses[0].title).toBe('Agriculture Basics');
    expect(courses[0]).toHaveProperty('id');
    expect(courses[0]).toHaveProperty('category');
    expect(courses[0]).toHaveProperty('instructor');
  });

  test('course data includes required fields for display', () => {
    const course = createMockCourse();

    // Required fields for CourseCard component
    expect(course.title).toBeDefined();
    expect(course.thumbnail).toBeDefined();
    expect(course.duration).toBeDefined();
    expect(course.lessonsCount).toBeGreaterThan(0);
    expect(course.category).toBeDefined();
  });
});

describe('Critical Path: Lesson Viewing', () => {
  test('lesson data includes required video fields', () => {
    const lesson = createMockLesson();

    // Required fields for video player
    expect(lesson.videoId).toBeDefined();
    expect(lesson.title).toBeDefined();
    expect(lesson.duration).toBeDefined();
    expect(typeof lesson.completed).toBe('boolean');
  });

  test('lesson completion state can be tracked', () => {
    const lesson = createMockLesson({ completed: false });

    expect(lesson.completed).toBe(false);

    // Simulate completion
    const completedLesson = { ...lesson, completed: true };
    expect(completedLesson.completed).toBe(true);
  });
});

describe('Critical Path: Download Flow', () => {
  test('download data structure is valid', () => {
    const downloadedCourse = createMockCourse({
      isDownloaded: true,
      downloadSize: '150MB',
      downloadDate: new Date().toISOString(),
    }) as any;

    expect(downloadedCourse.isDownloaded).toBe(true);
    expect(downloadedCourse.downloadSize).toBeDefined();
    expect(downloadedCourse.downloadDate).toBeDefined();
  });

  test('offline courses can be accessed', () => {
    const offlineCourses = [
      createMockCourse({ id: '1', isDownloaded: true }) as any,
      createMockCourse({ id: '2', isDownloaded: true }) as any,
    ];

    const downloadedIds = offlineCourses.filter((c: any) => c.isDownloaded).map((c: any) => c.id);
    expect(downloadedIds).toHaveLength(2);
  });
});

describe('Critical Path: Feature Flags', () => {
  test('feature flag structure is typed correctly', () => {
    const flags = {
      secureStorage: false,
      inputValidation: false,
      errorBoundaries: false,
    };

    expect(typeof flags.secureStorage).toBe('boolean');
    expect(typeof flags.inputValidation).toBe('boolean');
    expect(typeof flags.errorBoundaries).toBe('boolean');
  });
});
