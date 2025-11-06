### 3. Context API Setup

**src/context/CourseContext.js**
```javascript
import React, { createContext, useState, useEffect } from 'react';
import courseService from '../services/courseService';

export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = (id) => {
    return courses.find(course => course.id === id);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider 
      value={{ 
        courses, 
        loading, 
        error, 
        fetchCourses,
        getCourseById 
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
```

**src/context/ProgressContext.js**
```javascript
import React, { createContext, useState, useEffect } from 'react';
import progressService from '../services/progressService';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});
  
  const updateProgress = async (courseId, lessonId, percentage) => {
    try {
      // Update locally first (optimistic update)
      setProgress(prev => ({
        ...prev,
        [`${courseId}-${lessonId}`]: percentage
      }));
      
      // Then sync to server
      await progressService.updateProgress(courseId, lessonId, percentage);
    } catch (err) {
      console.error('Failed to update progress:', err);
      // Revert on error or queue for later sync
    }
  };

  const getCourseProgress = (courseId) => {
    return Object.entries(progress)
      .filter(([key]) => key.startsWith(`${courseId}-`))
      .reduce((acc, [_, value]) => acc + value, 0);
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        progress, 
        updateProgress,
        getCourseProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
```

**src/context/DownloadContext.js**
```javascript
import React, { createContext, useState } from 'react';
import downloadService from '../services/downloadService';

export const DownloadContext = createContext();

export function DownloadProvider({ children }) {
  const [downloads, setDownloads] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const addToDownloadQueue = async (course) => {
    const newDownload = {
      id: course.id,
      title: course.title,
      progress: 0,
      status: 'pending', // pending, downloading, completed, failed
    };
    
    setDownloads(prev => [...prev, newDownload]);
    await processDownloadQueue();
  };

  const processDownloadQueue = async () => {
    if (downloading) return;
    
    setDownloading(true);
    const pending = downloads.find(d => d.status === 'pending');
    
    if (pending) {
      try {
        await downloadService.downloadCourse(pending.id, (progress) => {
          updateDownloadProgress(pending.id, progress);
        });
        updateDownloadStatus(pending.id, 'completed');
      } catch (err) {
        updateDownloadStatus(pending.id, 'failed');
      }
    }
    
    setDownloading(false);
  };

  const updateDownloadProgress = (id, progress) => {
    setDownloads(prev => 
      prev.map(d => d.id === id ? { ...d, progress } : d)
    );
  };

  const updateDownloadStatus = (id, status) => {
    setDownloads(prev => 
      prev.map(d => d.id === id ? { ...d, status } : d)
    );
  };

  return (
    <DownloadContext.Provider 
      value={{ 
        downloads, 
        addToDownloadQueue,
        downloading
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
}
```


