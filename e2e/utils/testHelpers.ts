import { render } from '@testing-library/react-native';
import type React from 'react';

// Factory for mock course data
export function createMockCourse(overrides = {}) {
  return {
    id: 'course_1',
    title: 'Sustainable Agriculture Basics',
    category: 'Agriculture',
    instructor: 'John Doe',
    thumbnail: 'https://images.pexels.com/photos/1.jpg',
    duration: '2h 30m',
    lessonsCount: 12,
    progress: 0,
    isEnrolled: false,
    ...overrides,
  };
}

// Factory for mock lesson data
export function createMockLesson(overrides = {}) {
  return {
    id: 'lesson_1',
    title: 'Introduction to Sustainable Farming',
    duration: '15:30',
    videoId: 'abc123',
    completed: false,
    ...overrides,
  };
}

// Wrapper for rendering with common providers
export function renderWithProviders(component: React.ReactElement) {
  return render(component);
}

// Wait helper for async operations
export function waitForAsync(ms = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
