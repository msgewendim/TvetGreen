### 7. Component Example

**src/components/course/CourseCard.js**
```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';

export default function CourseCard({ course, progress, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.instructor}>{course.instructor}</Text>
        <Text style={styles.duration}>{course.duration}</Text>
        
        {progress > 0 && (
          <ProgressBar progress={progress} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 8,
  },
});
```
