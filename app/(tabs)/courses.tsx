import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
} from 'react-native';
import { Search, Download, Play, Clock, Users, Star, Mic, MicOff, CircleCheck as CheckCircle, Lock, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function CoursesScreen() {
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleVoiceGuide = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const categories = [
    {
      id: 'agriculture',
      title: 'Agriculture',
      emoji: '🌾',
      color: '#2E8B57',
      courseCount: 5,
      description: 'Sustainable farming & crop management',
      image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg'
    },
    {
      id: 'energy',
      title: 'Green Energy',
      emoji: '🔆',
      color: '#FF8C42',
      courseCount: 3,
      description: 'Solar power & renewable energy',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg'
    },
    {
      id: 'construction',
      title: 'Construction',
      emoji: '🔨',
      color: '#DAA520',
      courseCount: 4,
      description: 'Building skills & techniques',
      image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg'
    },
    {
      id: 'business',
      title: 'Business',
      emoji: '💼',
      color: '#87CEEB',
      courseCount: 6,
      description: 'Entrepreneurship & market skills',
      image: 'https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg'
    }
  ];

  const courses = [
    {
      id: 1,
      title: 'Sustainable Agriculture Basics',
      category: 'agriculture',
      instructor: 'Dr. Amara Ketema',
      duration: '4 hours',
      lessons: 12,
      difficulty: 'Beginner',
      rating: 4.8,
      enrolled: 2340,
      progress: 75,
      isDownloaded: true,
      isFree: true,
      image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
      description: 'Learn modern farming techniques for better harvests'
    },
    {
      id: 2,
      title: 'Solar Panel Installation',
      category: 'energy',
      instructor: 'Engineer Kofi Asante',
      duration: '6 hours',
      lessons: 18,
      difficulty: 'Intermediate',
      rating: 4.9,
      enrolled: 1890,
      progress: 0,
      isDownloaded: false,
      isFree: true,
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
      description: 'Master solar energy systems for homes and businesses'
    },
    {
      id: 3,
      title: 'Home Building Fundamentals',
      category: 'construction',
      instructor: 'Master Builder Wanjiku',
      duration: '8 hours',
      lessons: 24,
      difficulty: 'Beginner',
      rating: 4.7,
      enrolled: 3210,
      progress: 25,
      isDownloaded: true,
      isFree: true,
      image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg',
      description: 'Essential construction skills for safe homes'
    },
    {
      id: 4,
      title: 'Small Business Success',
      category: 'business',
      instructor: 'Entrepreneur Fatou Diallo',
      duration: '5 hours',
      lessons: 15,
      difficulty: 'Beginner',
      rating: 4.6,
      enrolled: 2890,
      progress: 0,
      isDownloaded: false,
      isFree: true,
      image: 'https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg',
      description: 'Start and grow your community business'
    },
    {
      id: 5,
      title: 'Water Conservation Methods',
      category: 'agriculture',
      instructor: 'Dr. Aisha Mohamed',
      duration: '3 hours',
      lessons: 10,
      difficulty: 'Beginner',
      rating: 4.8,
      enrolled: 1560,
      progress: 0,
      isDownloaded: false,
      isFree: true,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      description: 'Efficient water use for better crops'
    },
    {
      id: 6,
      title: 'Community Solar Projects',
      category: 'energy',
      instructor: 'Engineer Desta Bekele',
      duration: '7 hours',
      lessons: 20,
      difficulty: 'Advanced',
      rating: 4.7,
      enrolled: 890,
      progress: 0,
      isDownloaded: false,
      isFree: true,
      image: 'https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg',
      description: 'Large-scale renewable energy solutions'
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const renderCategoryCard = ({ item: category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => setSelectedCategory(category.id)}
      accessibilityLabel={`${category.title} category with ${category.courseCount} courses`}
    >
      <ImageBackground
        source={{ uri: category.image }}
        style={styles.categoryBackground}
        imageStyle={styles.categoryBackgroundImage}
      >
        <View style={[styles.categoryOverlay, { backgroundColor: `${category.color}95` }]}>
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          <Text style={styles.categoryCount}>{category.courseCount} courses • Free</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderCourseCard = ({ item: course }) => (
    <TouchableOpacity style={styles.courseCard} accessibilityLabel={`Course: ${course.title}`}>
      <ImageBackground
        source={{ uri: course.image }}
        style={styles.courseImage}
        imageStyle={styles.courseImageStyle}
      >
        <View style={styles.courseImageOverlay}>
          {course.progress > 0 ? (
            <View style={styles.progressIndicator}>
              <CheckCircle size={20} color="#32CD32" strokeWidth={2} />
              <Text style={styles.progressText}>{course.progress}%</Text>
            </View>
          ) : (
            <View style={styles.playButton}>
              <Play size={16} color="#FDF5E6" strokeWidth={2} />
            </View>
          )}
        </View>
      </ImageBackground>

      <View style={styles.courseInfo}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
          <View style={styles.courseActions}>
            {course.isDownloaded ? (
              <View style={styles.downloadedBadge}>
                <Download size={16} color="#32CD32" strokeWidth={2} />
              </View>
            ) : (
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={16} color="#8B4513" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.instructorName}>by {course.instructor}</Text>

        <View style={styles.courseMetrics}>
          <View style={styles.metricItem}>
            <Clock size={14} color="#8B4513" strokeWidth={2} />
            <Text style={styles.metricText}>{course.duration}</Text>
          </View>
          <View style={styles.metricItem}>
            <Users size={14} color="#8B4513" strokeWidth={2} />
            <Text style={styles.metricText}>{course.enrolled.toLocaleString()}</Text>
          </View>
          <View style={styles.metricItem}>
            <Star size={14} color="#DAA520" strokeWidth={2} />
            <Text style={styles.metricText}>{course.rating}</Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {course.description}
        </Text>

        <View style={styles.courseFooter}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{course.difficulty}</Text>
          </View>
          <Text style={styles.lessonCount}>{course.lessons} lessons</Text>
        </View>

        {course.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue Learning</Text>
              <ChevronRight size={16} color="#FDF5E6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Voice Guide */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Course Library</Text>
          <Text style={styles.headerSubtitle}>Learn practical skills for life</Text>
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
          <Text style={styles.voiceText}>🎤 Say "Browse Agriculture" or "Show all courses"</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Category Filter Buttons */}
        <View style={styles.categoryFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, selectedCategory === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterButtonText, selectedCategory === 'all' && styles.filterButtonTextActive]}>
                All Courses
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.filterButton, selectedCategory === category.id && styles.filterButtonActive]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.filterEmoji}>{category.emoji}</Text>
                <Text style={[styles.filterButtonText, selectedCategory === category.id && styles.filterButtonTextActive]}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Cards (shown when all selected) */}
        {selectedCategory === 'all' && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.categoryRow}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Courses Section */}
        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' 
              ? 'All Courses' 
              : `${categories.find(c => c.id === selectedCategory)?.title} Courses`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredCourses.length} courses available
          </Text>
          
          <FlatList
            data={filteredCourses}
            renderItem={renderCourseCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDF5E6',
    marginBottom: 4,
  },
  headerSubtitle: {
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
  },
  voiceText: {
    fontSize: 14,
    color: '#2F4F4F',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  categoryFilters: {
    paddingVertical: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 44,
  },
  filterButtonActive: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F',
  },
  filterButtonTextActive: {
    color: '#FDF5E6',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 16,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryBackgroundImage: {
    borderRadius: 12,
  },
  categoryOverlay: {
    padding: 16,
    borderRadius: 12,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FDF5E6',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#FDF5E6',
    opacity: 0.9,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#FDF5E6',
    fontWeight: '500',
  },
  coursesSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  courseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  courseImage: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  courseImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 139, 87, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F4F4F',
    marginLeft: 4,
  },
  playButton: {
    backgroundColor: 'rgba(255, 140, 66, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  courseInfo: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F4F',
    flex: 1,
    marginRight: 8,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadedBadge: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#E8F5E8',
  },
  downloadButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  instructorName: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 8,
  },
  courseMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    color: '#2F4F4F',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  difficultyText: {
    fontSize: 12,
    color: '#2F4F4F',
    fontWeight: '500',
  },
  lessonCount: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 2,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: '#FDF5E6',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});