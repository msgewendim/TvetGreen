import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  Dimensions 
} from 'react-native';
import { 
  Mic, 
  MicOff, 
  Play, 
  ChevronRight,
  Trophy,
  Clock,
  Download
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const toggleVoiceGuide = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const currentCourse = {
    title: 'Sustainable Agriculture Basics',
    category: 'Agriculture',
    progress: 75,
    nextLesson: 'Lesson 8: Composting Techniques',
    duration: '12 min',
    isDownloaded: true
  };

  const recentActivities = [
    { title: 'Completed: Soil Preparation', type: 'completed', time: '2 hours ago' },
    { title: 'Downloaded: Green Energy Course', type: 'download', time: '1 day ago' },
    { title: 'Started: Community Leadership', type: 'started', time: '3 days ago' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Voice Guide */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{greeting}, Fatima</Text>
          <Text style={styles.subtitle}>Ready to continue learning?</Text>
        </View>
        <TouchableOpacity 
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={toggleVoiceGuide}
          accessibilityLabel="Voice Guide"
        >
          {isListening ? (
            <View style={styles.listeningIndicator}>
              <MicOff size={24} color="#FDF5E6" strokeWidth={2} />
              <View style={styles.pulseRing} />
            </View>
          ) : (
            <Mic size={24} color="#FDF5E6" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      {/* Voice Instructions */}
      {isListening && (
        <View style={styles.voiceInstructions}>
          <Text style={styles.voiceText}>🎤 Listening... Say "Continue course" or "Browse courses"</Text>
        </View>
      )}

      {/* Current Course Progress */}
      <View style={styles.currentCourseContainer}>
        <ImageBackground
          source={{ uri: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg' }}
          style={styles.courseBanner}
          imageStyle={styles.courseBannerImage}
        >
          <View style={styles.courseBannerOverlay}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseCategory}>{currentCourse.category}</Text>
              <Text style={styles.courseTitle}>{currentCourse.title}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${currentCourse.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{currentCourse.progress}% Complete</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Play size={20} color="#FDF5E6" strokeWidth={2} />
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Next Lesson Preview */}
      <View style={styles.nextLessonContainer}>
        <View style={styles.nextLessonHeader}>
          <Clock size={20} color="#2E8B57" strokeWidth={2} />
          <Text style={styles.nextLessonTitle}>Up Next</Text>
        </View>
        <TouchableOpacity style={styles.nextLessonCard}>
          <View style={styles.nextLessonInfo}>
            <Text style={styles.nextLessonName}>{currentCourse.nextLesson}</Text>
            <Text style={styles.nextLessonDuration}>Duration: {currentCourse.duration}</Text>
          </View>
          <View style={styles.nextLessonActions}>
            {currentCourse.isDownloaded && (
              <View style={styles.downloadedBadge}>
                <Download size={16} color="#32CD32" strokeWidth={2} />
              </View>
            )}
            <ChevronRight size={24} color="#2E8B57" strokeWidth={2} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#2E8B57' }]}>
              <Text style={styles.quickActionEmoji}>🌾</Text>
            </View>
            <Text style={styles.quickActionText}>Agriculture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF8C42' }]}>
              <Text style={styles.quickActionEmoji}>🔆</Text>
            </View>
            <Text style={styles.quickActionText}>Green Energy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#DAA520' }]}>
              <Text style={styles.quickActionEmoji}>🔨</Text>
            </View>
            <Text style={styles.quickActionText}>Construction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#87CEEB' }]}>
              <Text style={styles.quickActionEmoji}>💼</Text>
            </View>
            <Text style={styles.quickActionText}>Business</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[
              styles.activityIcon,
              activity.type === 'completed' && styles.completedIcon,
              activity.type === 'download' && styles.downloadIcon,
              activity.type === 'started' && styles.startedIcon
            ]}>
              {activity.type === 'completed' && <Trophy size={16} color="#FDF5E6" strokeWidth={2} />}
              {activity.type === 'download' && <Download size={16} color="#FDF5E6" strokeWidth={2} />}
              {activity.type === 'started' && <Play size={16} color="#FDF5E6" strokeWidth={2} />}
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Achievement Banner */}
      <View style={styles.achievementBanner}>
        <View style={styles.achievementContent}>
          <Trophy size={32} color="#DAA520" strokeWidth={2} />
          <View style={styles.achievementText}>
            <Text style={styles.achievementTitle}>🎉 Well Done!</Text>
            <Text style={styles.achievementSubtitle}>You've completed 3 courses this month</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#2E8B57',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDF5E6',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FDF5E6',
    opacity: 0.9,
  },
  voiceButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  voiceButtonActive: {
    backgroundColor: '#DC143C',
  },
  listeningIndicator: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FDF5E6',
    opacity: 0.3,
  },
  voiceInstructions: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DAA520',
  },
  voiceText: {
    fontSize: 14,
    color: '#2F4F4F',
    textAlign: 'center',
    fontWeight: '500',
  },
  currentCourseContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  courseBanner: {
    height: 200,
    justifyContent: 'flex-end',
  },
  courseBannerImage: {
    borderRadius: 12,
  },
  courseBannerOverlay: {
    backgroundColor: 'rgba(46, 139, 87, 0.85)',
    padding: 20,
    borderRadius: 12,
  },
  courseInfo: {
    marginBottom: 16,
  },
  courseCategory: {
    fontSize: 14,
    color: '#DAA520',
    fontWeight: '600',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FDF5E6',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(253, 245, 230, 0.3)',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#FDF5E6',
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: '#FDF5E6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextLessonContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  nextLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextLessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginLeft: 8,
  },
  nextLessonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextLessonInfo: {
    flex: 1,
  },
  nextLessonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  nextLessonDuration: {
    fontSize: 14,
    color: '#8B4513',
  },
  nextLessonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadedBadge: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#E8F5E8',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F',
    textAlign: 'center',
  },
  recentActivityContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIcon: {
    backgroundColor: '#32CD32',
  },
  downloadIcon: {
    backgroundColor: '#87CEEB',
  },
  startedIcon: {
    backgroundColor: '#FF8C42',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#8B4513',
  },
  achievementBanner: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DAA520',
    overflow: 'hidden',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  achievementText: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#8B4513',
  },
});