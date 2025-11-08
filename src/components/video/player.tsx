import { View, ActivityIndicator, StyleSheet, Platform, type ViewStyle } from 'react-native';
import WebView from 'react-native-webview';
import { colors } from '@/design-system';

interface VideoPlayerProps {
  videoId: string;
  style?: ViewStyle;
}

export function VideoPlayer({ videoId, style }: VideoPlayerProps) {
  // For web platform, use the iframe embed directly
  if (Platform.OS === 'web') {
    return (
      <iframe
        title={`YouTube video ${videoId}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // For mobile platforms, use WebView with direct URL
  return (
    <View style={[styles.container, style]}>
      <WebView
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{
          uri: `https://www.youtube.com/embed/${videoId}?playsinline=1`,
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error:', nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[800],
  },
});
