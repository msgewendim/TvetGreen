# PWA Functionality & Web Compatibility Guide

This document explains what functionality works in the PWA version versus the web version, and any limitations or considerations.

## Quick Answer

**Yes, all functionality that works in the web version will work identically in the PWA version.** PWAs are essentially web apps that can be installed - they run the same JavaScript code and have the same capabilities as the web version.

However, there are some important considerations and limitations to be aware of.

## How PWAs Work

PWAs are **not separate applications** - they are web applications that:
- Run in a standalone window (no browser UI)
- Can be installed on the home screen
- Use the same JavaScript code as the web version
- Have access to the same browser APIs

**Key Point**: When you install a PWA, you're essentially creating a shortcut to the web app that opens in a special standalone window. The code execution is identical.

## Functionality Comparison

### ✅ Fully Supported Features

These features work identically in both web and PWA versions:

#### 1. **Video Playback**
- ✅ YouTube video embeds work perfectly
- ✅ Uses native `<iframe>` on web/PWA (as configured in `VideoPlayer` component)
- ✅ Full-screen mode supported
- ✅ Picture-in-picture mode supported
- ✅ Video controls work normally

**Implementation**: The app already handles this correctly:
```typescript
if (Platform.OS === 'web') {
  return <iframe src={youtubeEmbedUrl} />
}
```

#### 2. **Navigation & Routing**
- ✅ All routes work identically
- ✅ Expo Router navigation functions normally
- ✅ Deep linking works
- ✅ Browser history works

#### 3. **UI Components**
- ✅ All React Native Web components render correctly
- ✅ Styling works identically
- ✅ Animations and transitions work
- ✅ Responsive design works

#### 4. **State Management**
- ✅ Zustand stores work identically
- ✅ React Query caching works
- ✅ AsyncStorage works (uses localStorage on web)
- ✅ All state persists correctly

#### 5. **API Calls & Data Fetching**
- ✅ All HTTP requests work normally
- ✅ React Query works identically
- ✅ Caching strategies work
- ✅ Error handling works

#### 6. **Forms & Inputs**
- ✅ Text inputs work normally
- ✅ Form validation works
- ✅ Search functionality works

### ⚠️ Features with Limitations

These features work but may have web-specific limitations:

#### 1. **Voice Input (`expo-speech`)**

**Status**: ⚠️ Limited on Web

**What Works**:
- Text-to-speech (speaking) works via Web Speech API
- Basic voice feedback works

**Limitations**:
- Speech recognition (listening) requires Web Speech API support
- Browser compatibility varies (Chrome/Edge: ✅, Firefox: ⚠️, Safari: ⚠️)
- May require HTTPS for full functionality
- Microphone permissions needed

**Current Implementation**:
```typescript
// Uses expo-speech which has web support
Speech.speak("Listening for voice input", { language: "en" });
```

**Recommendation**: Test voice input thoroughly on target browsers. Consider adding Web Speech API fallback for better compatibility.

#### 2. **File Downloads (`expo-file-system`)**

**Status**: ⚠️ Different Implementation on Web

**What Works**:
- File downloads work via browser download API
- Progress tracking possible with Fetch API
- File saving works (browser download dialog)

**Limitations**:
- No direct file system access (security restriction)
- Files download to user's Downloads folder
- No programmatic file access after download
- Storage limits depend on browser (varies by browser)

**Web Alternative**:
```typescript
// Web uses browser download API
if (Platform.OS === 'web') {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.click();
}
```

**Recommendation**: Consider implementing web-specific download handling for better UX.

#### 3. **Camera Access (`expo-camera`)**

**Status**: ⚠️ Requires User Permission

**What Works**:
- Camera access works via browser MediaDevices API
- Photo capture works
- Video recording works (with limitations)

**Limitations**:
- Requires HTTPS (or localhost)
- User must grant camera permission
- Some browsers have stricter permissions
- Mobile browsers may have better support than desktop

**Recommendation**: Test camera functionality on target devices. Consider adding permission request UI.

#### 4. **Haptics (`expo-haptics`)**

**Status**: ❌ Not Available on Web

**What Works**:
- Nothing (haptics are device-specific)

**Limitations**:
- No haptic feedback on web/PWA
- Silent failure (no error, just no feedback)

**Current Behavior**: The app likely handles this gracefully with Platform checks. Haptics simply won't trigger on web.

#### 5. **Offline Storage**

**Status**: ⚠️ Different Storage Mechanisms

**What Works**:
- `AsyncStorage` → Uses `localStorage` on web
- IndexedDB available for larger storage
- Cache API available (with service workers)

**Limitations**:
- Storage limits vary by browser (typically 5-10GB)
- No direct file system access
- Different storage APIs than mobile

**Recommendation**: Consider implementing IndexedDB for larger offline content storage on web.

### ❌ Features Not Available on Web

These features are mobile-only and won't work in PWA:

#### 1. **Native Device Features**
- ❌ Push notifications (requires service worker + user permission)
- ❌ Background tasks (limited on web)
- ❌ Native sharing (limited browser support)
- ❌ Device sensors (accelerometer, gyroscope - limited)

#### 2. **Platform-Specific APIs**
- ❌ Native file system access
- ❌ Direct SQLite access (would need Web SQL or IndexedDB)
- ❌ Native modules that don't have web implementations

## Platform Detection

The app already uses platform detection for web-specific handling:

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
} else {
  // Mobile-specific code
}
```

**Important**: `Platform.OS === 'web'` is **true for both regular web and PWA**. There's no difference from the app's perspective.

## Testing PWA Functionality

### 1. **Build and Test**

```bash
# Build the PWA
pnpm run build:web

# Serve locally
npx serve dist

# Open in browser and install
```

### 2. **Test Checklist**

- [ ] Video playback works
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API calls work
- [ ] State persists after page refresh
- [ ] Offline behavior (if service worker implemented)
- [ ] Voice input (if implemented)
- [ ] File downloads (if implemented)

### 3. **Browser-Specific Testing**

Test on:
- ✅ Chrome/Edge (Desktop) - Best PWA support
- ✅ Chrome (Android) - Full PWA support
- ⚠️ Safari (iOS) - Limited PWA support
- ⚠️ Firefox - Basic PWA support
- ⚠️ Safari (Desktop) - Limited PWA support

## Service Workers & Offline Support

**Current Status**: Not implemented

**Future Enhancement**: To add offline support, you would need to:

1. **Implement Service Worker** (using Workbox):
   ```bash
   npx workbox-cli wizard
   ```

2. **Cache Strategies**:
   - Cache API responses
   - Cache static assets
   - Cache video content (with storage limits)

3. **Offline Queue**:
   - Queue API requests when offline
   - Sync when connection restored

**Note**: The current PWA setup does **not** include offline functionality. The app requires an internet connection to function.

## Recommendations

### 1. **Add Platform-Specific Handling**

Consider adding explicit web handling for features that differ:

```typescript
// Example: File downloads
const downloadFile = async (url: string, filename: string) => {
  if (Platform.OS === 'web') {
    // Web: Use browser download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  } else {
    // Mobile: Use expo-file-system
    await FileSystem.downloadAsync(url, FileSystem.documentDirectory + filename);
  }
};
```

### 2. **Test Voice Features**

Voice input may need Web Speech API implementation:

```typescript
if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
  // Use Web Speech API
} else {
  // Use expo-speech or show message
}
```

### 3. **Handle Storage Limits**

Web browsers have storage limits. Consider:

- Using IndexedDB for larger data
- Implementing storage quota checks
- Providing storage management UI

### 4. **Add Service Worker (Optional)**

For true offline support:

- Follow [Expo PWA Service Worker guide](https://docs.expo.dev/guides/progressive-web-apps/#service-workers)
- Implement caching strategies
- Handle offline/online state

## Summary

| Feature Category | Web Support | PWA Support | Notes |
|-----------------|-------------|-------------|-------|
| Video Playback | ✅ | ✅ | Identical |
| Navigation | ✅ | ✅ | Identical |
| UI Components | ✅ | ✅ | Identical |
| State Management | ✅ | ✅ | Identical |
| API Calls | ✅ | ✅ | Identical |
| Voice Input | ⚠️ | ⚠️ | Browser-dependent |
| File Downloads | ⚠️ | ⚠️ | Different API |
| Camera | ⚠️ | ⚠️ | Requires HTTPS |
| Haptics | ❌ | ❌ | Not available |
| Offline Storage | ⚠️ | ⚠️ | Limited, needs SW |

## Conclusion

**The PWA version will work identically to the web version** for all core functionality. The main differences are:

1. **Installation**: PWA can be installed and launched like a native app
2. **Standalone Mode**: Opens without browser UI
3. **Platform APIs**: Some mobile-specific features have web alternatives or limitations

For the best user experience:
- ✅ Core features (video, navigation, UI) work perfectly
- ⚠️ Some advanced features may need web-specific implementations
- ❌ Mobile-only features won't work (but are handled gracefully)

**Recommendation**: Test the PWA thoroughly on target browsers and devices to ensure all features work as expected. Most functionality should work seamlessly!

---

**Last Updated**: November 2024  
**Related Docs**: [PWA Setup Guide](./PWA_SETUP.md)

