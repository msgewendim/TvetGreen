Migrate Video Player from expo-av to expo-video with YouTube Support

### Context

I'm building a skills training platform for East African learners using React Native with Expo (managed workflow). The app needs to play video lessons that can come from two sources:

1. Direct video URLs (S3, CloudFront, or any direct .mp4/.m3u8 links)
2. YouTube links (various formats like youtube.com/watch?v=, youtu.be/, etc.)

Currently using expo-av which is deprecated and being removed in SDK 55. Need to migrate to expo-video for direct URLs and add react-native-youtube-iframe for YouTube content.

### Requirements

**1. Create a unified VideoPlayer component that:**

- Accepts a `source` prop (string URL)
- Automatically detects if the URL is YouTube or a direct video
- Renders the appropriate player (expo-video or react-native-youtube-iframe)
- Exposes a consistent API for play, pause, seek, and progress tracking regardless of source type
- Supports offline playback for direct videos (not YouTube)
- Has loading, error, and buffering states

**2. URL Detection Logic:**

- YouTube patterns to detect:
  - `youtube.com/watch?v=VIDEO_ID`
  - `youtu.be/VIDEO_ID`
  - `youtube.com/embed/VIDEO_ID`
  - `youtube.com/v/VIDEO_ID`
  - `youtube.com/shorts/VIDEO_ID`
  - `m.youtube.com/watch?v=VIDEO_ID`
- Extract the video ID from YouTube URLs
- Everything else = direct video URL

**3. For direct videos (expo-video):**

- Use native controls for simplicity
- Support fullscreen
- Track playback position (for progress saving)
- Handle streaming (HLS .m3u8) and static files (.mp4)
- Support local file paths for offline downloaded content

**4. For YouTube (react-native-youtube-iframe):**

- Use built-in YouTube controls
- Track playback state changes
- Support fullscreen
- Handle cases where video is unavailable/private

**5. Unified callback interface:**

```typescript
interface VideoPlayerProps {
  source: string; // URL (YouTube or direct)
  localSource?: string; // Optional local file path for offline
  autoPlay?: boolean;
  onProgress?: (progress: { currentTime: number; duration: number }) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
  initialPosition?: number; // Resume from position in seconds
  style?: ViewStyle;
}

interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => Promise<number>;
}
```

### File Structure to Create

```
src/
├── components/
│   └── VideoPlayer/
│       ├── index.tsx              # Main export
│       ├── VideoPlayer.tsx        # Unified component
│       ├── DirectVideoPlayer.tsx  # expo-video implementation
│       ├── YouTubePlayer.tsx      # youtube-iframe implementation
│       ├── types.ts               # TypeScript interfaces
│       └── utils.ts               # URL detection, ID extraction
├── hooks/
│   └── useVideoPlayer.ts          # Optional hook for external control
```

### Dependencies to Install

```bash
npx expo install expo-video react-native-youtube-iframe react-native-webview
```

Note: react-native-webview is a peer dependency of react-native-youtube-iframe.

### Migration Notes

- Replace all imports of `Video` from `expo-av` with the new unified VideoPlayer
- The old expo-av used `onPlaybackStatusUpdate` - map this to the new `onProgress` callback
- expo-video uses `useVideoPlayer` hook pattern, not ref-based like expo-av
- For YouTube, progress updates come from `onProgress` callback with elapsed/duration

### Example Usage After Migration

```tsx
import { VideoPlayer, VideoPlayerRef } from '@/components/VideoPlayer';

function LessonScreen({ lesson }) {
  const playerRef = useRef<VideoPlayerRef>(null);

  // Works with both YouTube and direct URLs
  const videoSource = lesson.videoUrl; // Could be either
  const localPath = lesson.downloadedPath; // For offline direct videos

  return (
    <VideoPlayer
      ref={playerRef}
      source={videoSource}
      localSource={localPath}
      initialPosition={lesson.lastPosition}
      onProgress={({ currentTime, duration }) => {
        // Save progress every 10 seconds
        saveProgress(lesson.id, currentTime);
      }}
      onComplete={() => markLessonComplete(lesson.id)}
      onError={(e) => console.error('Video error:', e)}
    />
  );
}
```

### Edge Cases to Handle

1. Invalid/malformed YouTube URLs - fallback to error state
2. YouTube video is private/deleted - show appropriate error
3. Network timeout during streaming - retry logic or error state
4. Local file doesn't exist - fallback to streaming URL
5. User has no internet and no local file - show "Download required" message

### Testing Checklist

- [ ] Direct MP4 URL plays correctly
- [ ] HLS stream (.m3u8) plays correctly
- [ ] Local downloaded file plays correctly
- [ ] YouTube standard URL plays correctly
- [ ] YouTube short URL (youtu.be) plays correctly
- [ ] YouTube Shorts URL plays correctly
- [ ] Progress callbacks fire for both player types
- [ ] Seek works for both player types
- [ ] Fullscreen works for both player types
- [ ] Error states display correctly
- [ ] Loading states display correctly

Please implement this migration with clean, typed TypeScript code. Prioritize simplicity and reliability over advanced features. Add JSDoc comments for the public API.
