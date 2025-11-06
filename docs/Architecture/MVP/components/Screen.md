
### 6. Screen Example

**src/screens/HomeScreen.js**
```javascript
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useCourses } from '../hooks/useCourses';
import { useProgress } from '../hooks/useProgress';
import CourseCard from '../components/course/CourseCard';
import VoiceButton from '../components/voice/VoiceButton';
import OfflineBanner from '../components/voice/OfflineBanner';

export default function HomeScreen({ navigation }) {
  const { courses, loading } = useCourses();
  const { getCourseProgress } = useProgress();

  const inProgressCourses = courses.filter(
    course => getCourseProgress(course.id) > 0 && 
              getCourseProgress(course.id) < 100
  );

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <VoiceButton />
      
      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subtitle}>Ready to continue learning?</Text>

        {inProgressCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            {inProgressCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getCourseProgress(course.id)}
                onPress={() => navigation.navigate('VideoPlayer', { 
                  courseId: course.id 
                })}
              />
            ))}
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {/* Quick action buttons */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  quickActions: {
    marginTop: 16,
  },
});
```
