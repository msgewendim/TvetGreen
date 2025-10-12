import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings, Download, Mic, MicOff, RotateCcw, ChevronDown, Bookmark, MessageSquare, CircleCheck as CheckCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const { courseId, lessonId } = useLocalSearchParams();
  const router = useRouter();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes example
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showSettings, setShowSettings] = useState(false);

  // Mock lesson data
  const lessonData = {
    title: 'Soil Preparation Techniques',
    courseTitle: 'Sustainable Agriculture Basics',
    lessonNumber: 8,
    totalLessons: 12,
    instructor: 'Dr. Amara Ketema',
    duration: '12 min',
    description: 'Learn the essential techniques for preparing soil for optimal crop growth.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isDownloaded: true,
    nextLesson: {
      id: 9,
      title: 'Composting Methods',
      duration: '15 min'
    }
  };

  const subtitleLanguages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'amharic', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'swahili', name: 'Kiswahili', flag: '🇰🇪' },
  ];

  const playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const toggleVoiceGuide = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Pause video when voice guide is active
      setIsPlaying(false);
    }
  };

  const handleSeek = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(newTime);
    setShowControls(true);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;
  const lessonProgress = (lessonData.lessonNumber / lessonData.totalLessons) * 100;

  const handleCompleteLesson = () => {
    Alert.alert(
      'Lesson Complete! 🎉',
      'Great job! You\'ve completed this lesson. Ready for the next one?',
      [
        { text: 'Review Again', style: 'cancel' },
        { 
          text: 'Next Lesson', 
          onPress: () => {
            // Navigate to next lesson
            router.push(`/video/${courseId}/${parseInt(lessonId as string) + 1}`);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Container */}
      <TouchableOpacity 
        style={styles.videoContainer}
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      >
        {/* Mock Video Background */}
        <View style={styles.videoBackground}>
          <Text style={styles.videoPlaceholder}>
            🎥 {lessonData.title}
          </Text>
          
          {/* Subtitles Overlay */}
          {showSubtitles && (
            <View style={styles.subtitlesContainer}>
              <Text style={styles.subtitlesText}>
                "First, we prepare the soil by removing weeds and rocks..."
              </Text>
            </View>
          )}
        </View>

        {/* Video Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#FDF5E6" strokeWidth={2} />
              </TouchableOpacity>
              
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle} numberOfLines={1}>
                  {lessonData.title}
                </Text>
                <Text style={styles.lessonMeta}>
                  Lesson {lessonData.lessonNumber} of {lessonData.totalLessons}
                </Text>
              </View>

              <TouchableOpacity 
                style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
                onPress={toggleVoiceGuide}
              >
                {isListening ? (
                  <MicOff size={20} color="#FDF5E6" strokeWidth={2} />
                ) : (
                  <Mic size={20} color="#FDF5E6" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            {/* Center Play Button */}
            <TouchableOpacity 
              style={styles.centerPlayButton}
              onPress={togglePlayPause}
            >
              {isPlaying ? (
                <Pause size={32} color="#FDF5E6" strokeWidth={2} />
              ) : (
                <Play size={32} color="#FDF5E6" strokeWidth={2} />
              )}
            </TouchableOpacity>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                  <View style={styles.progressThumb} />
                </View>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>

              {/* Control Buttons */}
              <View style={styles.controlButtons}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => handleSeek(-10)}
                >
                  <RotateCcw size={24} color="#FDF5E6" strokeWidth={2} />
                  <Text style={styles.controlButtonText}>-10s</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => handleSeek(-30)}
                >
                  <SkipBack size={24} color="#FDF5E6" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.mainPlayButton}
                  onPress={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={28} color="#FDF5E6" strokeWidth={2} />
                  ) : (
                    <Play size={28} color="#FDF5E6" strokeWidth={2} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => handleSeek(30)}
                >
                  <SkipForward size={24} color="#FDF5E6" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => handleSeek(10)}
                >
                  <RotateCcw size={24} color="#FDF5E6" strokeWidth={2} style={{ transform: [{ scaleX: -1 }] }} />
                  <Text style={styles.controlButtonText}>+10s</Text>
                </TouchableOpacity>
              </View>

              {/* Additional Controls */}
              <View style={styles.additionalControls}>
                <TouchableOpacity 
                  style={styles.additionalButton}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX size={20} color="#FDF5E6" strokeWidth={2} />
                  ) : (
                    <Volume2 size={20} color="#FDF5E6" strokeWidth={2} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.additionalButton}>
                  <Bookmark size={20} color="#FDF5E6" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.additionalButton}>
                  <MessageSquare size={20} color="#FDF5E6" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.additionalButton}
                  onPress={() => setShowSettings(!showSettings)}
                >
                  <Settings size={20} color="#FDF5E6" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Voice Instructions Overlay */}
        {isListening && (
          <View style={styles.voiceOverlay}>
            <View style={styles.voiceInstructions}>
              <View style={styles.listeningIndicator}>
                <View style={styles.pulseRing} />
                <Mic size={32} color="#FDF5E6" strokeWidth={2} />
              </View>
              <Text style={styles.voiceInstructionText}>
                🎤 Listening for commands...
              </Text>
              <Text style={styles.voiceCommands}>
                Say: "Play", "Pause", "Next", "Previous", "Repeat", "Bookmark"
              </Text>
            </View>
          </View>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <View style={styles.settingsPanel}>
            <View style={styles.settingsContent}>
              <View style={styles.settingsHeader}>
                <Text style={styles.settingsTitle}>Video Settings</Text>
                <TouchableOpacity onPress={() => setShowSettings(false)}>
                  <ChevronDown size={24} color="#2F4F4F" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Playback Speed */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Playback Speed</Text>
                <View style={styles.speedOptions}>
                  {playbackSpeeds.map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      style={[
                        styles.speedOption,
                        playbackSpeed === speed && styles.speedOptionActive
                      ]}
                      onPress={() => handleSpeedChange(speed)}
                    >
                      <Text style={[
                        styles.speedOptionText,
                        playbackSpeed === speed && styles.speedOptionTextActive
                      ]}>
                        {speed}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subtitle Language */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Subtitle Language</Text>
                {subtitleLanguages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      selectedLanguage === lang.code && styles.languageOptionActive
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={[
                      styles.languageText,
                      selectedLanguage === lang.code && styles.languageTextActive
                    ]}>
                      {lang.name}
                    </Text>
                    {selectedLanguage === lang.code && (
                      <CheckCircle size={20} color="#2E8B57" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Subtitle Toggle */}
              <TouchableOpacity 
                style={styles.subtitleToggle}
                onPress={() => setShowSubtitles(!showSubtitles)}
              >
                <Text style={styles.subtitleToggleText}>
                  {showSubtitles ? 'Hide' : 'Show'} Subtitles
                </Text>
                <View style={[
                  styles.toggle,
                  showSubtitles && styles.toggleActive
                ]}>
                  <View style={[
                    styles.toggleThumb,
                    showSubtitles && styles.toggleThumbActive
                  ]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Lesson Information Panel */}
      <View style={styles.lessonPanel}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonTitleContainer}>
            <Text style={styles.lessonPanelTitle} numberOfLines={2}>
              {lessonData.title}
            </Text>
            <Text style={styles.courseTitleText}>{lessonData.courseTitle}</Text>
            <Text style={styles.instructorText}>by {lessonData.instructor}</Text>
          </View>
          
          <View style={styles.lessonActions}>
            {lessonData.isDownloaded ? (
              <View style={styles.downloadedBadge}>
                <Download size={16} color="#32CD32" strokeWidth={2} />
                <Text style={styles.downloadedText}>Downloaded</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={16} color="#2E8B57" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Course Progress */}
        <View style={styles.courseProgress}>
          <Text style={styles.progressLabel}>Course Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.courseProgressBar}>
              <View style={[styles.courseProgressFill, { width: `${lessonProgress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>
              {lessonData.lessonNumber}/{lessonData.totalLessons} lessons
            </Text>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, styles.previousButton]}
            disabled={lessonData.lessonNumber === 1}
          >
            <SkipBack size={20} color={lessonData.lessonNumber === 1 ? "#A0A0A0" : "#2F4F4F"} strokeWidth={2} />
            <Text style={[
              styles.navButtonText,
              lessonData.lessonNumber === 1 && styles.navButtonTextDisabled
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteLesson}
          >
            <CheckCircle size={20} color="#FDF5E6" strokeWidth={2} />
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]}
            onPress={() => router.push(`/video/${courseId}/${parseInt(lessonId as string) + 1}`)}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <SkipForward size={20} color="#2F4F4F" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Next Lesson Preview */}
        {lessonData.nextLesson && (
          <View style={styles.nextLessonPreview}>
            <Text style={styles.nextLessonLabel}>Up Next:</Text>
            <TouchableOpacity style={styles.nextLessonCard}>
              <Play size={16} color="#2E8B57" strokeWidth={2} />
              <View style={styles.nextLessonInfo}>
                <Text style={styles.nextLessonTitle}>{lessonData.nextLesson.title}</Text>
                <Text style={styles.nextLessonDuration}>{lessonData.nextLesson.duration}</Text>
              </View>
              <ChevronRight size={20} color="#2E8B57" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoBackground: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 24,
    color: '#FDF5E6',
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitlesContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  subtitlesText: {
    fontSize: 18,
    color: '#FDF5E6',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    lineHeight: 24,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FDF5E6',
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 14,
    color: '#FDF5E6',
    opacity: 0.8,
  },
  voiceButton: {
    backgroundColor: '#FF8C42',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#DC143C',
  },
  centerPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -35 }, { translateY: -35 }],
    backgroundColor: 'rgba(46, 139, 87, 0.9)',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: '#FDF5E6',
    fontWeight: '500',
    minWidth: 45,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(253, 245, 230, 0.3)',
    borderRadius: 2,
    marginHorizontal: 12,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    right: 0,
    top: -4,
    width: 12,
    height: 12,
    backgroundColor: '#FF8C42',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FDF5E6',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
  },
  controlButtonText: {
    fontSize: 12,
    color: '#FDF5E6',
    fontWeight: '500',
  },
  mainPlayButton: {
    backgroundColor: 'rgba(46, 139, 87, 0.9)',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  additionalButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceInstructions: {
    backgroundColor: 'rgba(46, 139, 87, 0.95)',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  listeningIndicator: {
    position: 'relative',
    marginBottom: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FDF5E6',
    opacity: 0.5,
    top: -24,
    left: -24,
  },
  voiceInstructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FDF5E6',
    textAlign: 'center',
    marginBottom: 12,
  },
  voiceCommands: {
    fontSize: 14,
    color: '#FDF5E6',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  settingsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(253, 245, 230, 0.98)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.6,
  },
  settingsContent: {
    padding: 20,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F4F4F',
  },
  settingSection: {
    marginBottom: 24,
  },
  settingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 12,
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speedOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  speedOptionActive: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  speedOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F',
  },
  speedOptionTextActive: {
    color: '#FDF5E6',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    borderColor: '#2E8B57',
    backgroundColor: '#E8F5E8',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageText: {
    fontSize: 16,
    color: '#2F4F4F',
    flex: 1,
  },
  languageTextActive: {
    fontWeight: '600',
    color: '#2E8B57',
  },
  subtitleToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
  },
  subtitleToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F4F4F',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#2E8B57',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FDF5E6',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  lessonPanel: {
    backgroundColor: '#FDF5E6',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  lessonTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  lessonPanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  courseTitleText: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
    marginBottom: 2,
  },
  instructorText: {
    fontSize: 14,
    color: '#8B4513',
  },
  lessonActions: {
    alignItems: 'center',
  },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  downloadedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32CD32',
    marginLeft: 4,
  },
  downloadButton: {
    backgroundColor: '#E8F5E8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseProgress: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  courseProgressFill: {
    height: '100%',
    backgroundColor: '#2E8B57',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F4F4F',
    minWidth: 80,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  previousButton: {
    maxWidth: 100,
  },
  nextButton: {
    maxWidth: 100,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F',
  },
  navButtonTextDisabled: {
    color: '#A0A0A0',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 2,
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FDF5E6',
  },
  nextLessonPreview: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  nextLessonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 8,
  },
  nextLessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextLessonInfo: {
    flex: 1,
  },
  nextLessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 2,
  },
  nextLessonDuration: {
    fontSize: 14,
    color: '#8B4513',
  },
});