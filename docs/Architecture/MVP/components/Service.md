### 5. Services

**src/services/api/apiClient.js**
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.yourapp.com/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**src/services/courseService.js**
```javascript
import apiClient from './api/apiClient';
import { database } from './storage/database';

class CourseService {
  async getCourses() {
    try {
      // Try to fetch from API
      const response = await apiClient.get('/courses');
      const courses = response.data;
      
      // Cache in local database
      await this.cacheCourses(courses);
      
      return courses;
    } catch (error) {
      // If offline, return cached data
      console.log('Fetching from cache...');
      return await this.getCachedCourses();
    }
  }

  async getCourseById(id) {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      return await this.getCachedCourse(id);
    }
  }

  async cacheCourses(courses) {
    const db = await database.getConnection();
    for (const course of courses) {
      await db.executeSql(
        'INSERT OR REPLACE INTO courses (id, title, data) VALUES (?, ?, ?)',
        [course.id, course.title, JSON.stringify(course)]
      );
    }
  }

  async getCachedCourses() {
    const db = await database.getConnection();
    const [results] = await db.executeSql('SELECT * FROM courses');
    return results.rows.raw().map(row => JSON.parse(row.data));
  }

  async getCachedCourse(id) {
    const db = await database.getConnection();
    const [results] = await db.executeSql(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );
    return results.rows.length > 0 
      ? JSON.parse(results.rows.item(0).data) 
      : null;
  }
}

export default new CourseService();
```
