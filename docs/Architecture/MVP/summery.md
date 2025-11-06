# Offline-First Mobile App Architecture: Executive Summary

## Core Technology Stack (Expo/React Native)

### Storage Solutions
**Best Practice: Separate media from metadata**

- **expo-file-system** → Store videos, audio, images
  - Resumable downloads with progress tracking
  - Works in Expo managed workflow
  - Supports both permanent and cache storage
  
- **expo-sqlite** → Store metadata, progress, app state
  - Lightweight (2MB overhead)
  - Works in Expo Go
  - Perfect for simple data models

- **WatermelonDB** (Advanced) → Complex apps with 10K+ records
  - Reactive queries with auto-UI updates
  - Built-in sync capabilities
  - Requires custom development build

- **react-native-mmkv** → Fast key-value storage
  - 20-30x faster than AsyncStorage
  - Perfect for app state and preferences

## Video Architecture

### Playback
- **expo-video** (SDK 52+) - Official replacement for expo-av
- **react-native-video** - For advanced DRM needs (requires custom build)

### Compression & Format
- **Use H.264 codec** (not H.265) for universal Android compatibility
- **Target 480p resolution** at 800 kbps for 2-4GB RAM devices
- **Use FFmpeg** for server-side compression:
  ```bash
  ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium \
    -vf scale=-1:480 -b:v 800k -movflags +faststart output.mp4
  ```
- Expect ~65MB per 10-minute video

## Content Security (Casual Protection)

### Recommended Approach
1. **expo-crypto** + **crypto-es** → Basic file encryption
2. **expo-secure-store** → Store encryption keys securely
3. **expo-screen-capture** → Prevent screenshots (Android only)
4. **License validation** → Token-based offline access control

**Reality Check**: Can't prevent screen recording on iOS or determined users with cameras. Focus on making sharing inconvenient, not impossible.

## Sync Strategies

### Network Monitoring
- **@react-native-community/netinfo** → Detect connectivity changes
- Enforce WiFi-only for downloads >50MB
- Check `isConnectionExpensive` flag for metered connections

### Background Sync
- **expo-background-task** (SDK 53+) → Periodic sync when idle
- Minimum 1-hour intervals, system-optimized scheduling
- Respects battery levels and network conditions

### Sync Pattern (if using WatermelonDB)
```javascript
await synchronize({
  database,
  pullChanges: async ({ lastPulledAt }) => {
    // Fetch server changes
  },
  pushChanges: async ({ changes }) => {
    // Send local changes
  }
});
```

### Best Practices
- **Exponential backoff** for failed syncs
- **Queue-based prioritization**: Progress sync first, then downloads
- **Save progress every 2-3 seconds** during video playback
- **Mark videos "completed" at 95%** (not 100%)

## Performance Optimization

### For 2-4GB RAM Android Devices

1. **Enable Hermes** (default in Expo 48+)
   - 30-50% faster startups
   - 20-30% less memory usage

2. **Use WebP images** → 20-40% smaller than PNG/JPG

3. **Optimize FlatList**:
   - `initialNumToRender={10}`
   - `windowSize={5}`
   - `removeClippedSubviews={true}`

4. **Enable ProGuard/R8** for production builds
   - Removes unused code
   - Shrinks resources
   - Can save 30-40% APK size

5. **Split APKs by architecture** → Smaller downloads per device

### CDN Recommendations
- **Cloudflare** (Free tier) → Best for African deployment
  - Presence in Cape Town, Johannesburg, Lagos, Nairobi, Cairo
  - Generous bandwidth, DDoS protection included
  
- **AWS CloudFront** → If already using AWS infrastructure

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Set up expo-file-system + expo-sqlite
- Create database schema
- Implement basic download manager

### Phase 2: Video Playback (Weeks 3-4)
- Configure expo-video with progress tracking
- Implement resumable downloads
- Add queue management (max 2 concurrent on low-end devices)

### Phase 3: Sync (Weeks 5-6)
- Network monitoring with NetInfo
- Progress sync API
- Background sync with expo-background-task

### Phase 4: Polish (Weeks 7-8)
- Convert images to WebP
- Storage management UI
- Memory warning handlers
- Enable production optimizations (Hermes, ProGuard)

## Common Pitfalls to Avoid

❌ **DON'T** store video files in SQLite/databases
✅ **DO** use expo-file-system and store file paths in database

❌ **DON'T** use AsyncStorage for frequent operations
✅ **DO** use react-native-mmkv instead

❌ **DON'T** download large files on cellular by default
✅ **DO** enforce WiFi-only for videos >50MB

❌ **DON'T** assume users have reliable internet
✅ **DO** design all features for offline-first

❌ **DON'T** test only on emulators or high-end phones
✅ **DO** test on actual 2-4GB RAM Android devices

## Real-World Success Stories

### Kolibri (Learning Equality)
- **3M+ learners** across 220+ countries
- **30% improvement** in reading scores (South Africa)
- Fully offline-first from inception
- P2P content distribution
- 173+ language support

### Key Takeaways from Kolibri
- Design for permanent disconnection, not temporary offline
- Enable peer-to-peer content sharing
- Prioritize device compatibility over features
- Physical "sneakernet" distribution still works in remote areas

## Essential Library Versions (Sept 2025)

```json
{
  "dependencies": {
    "expo-file-system": "19.0.14",
    "expo-sqlite": "16.0.8",
    "expo-video": "latest (SDK 52+)",
    "expo-audio": "latest (SDK 52+)",
    "expo-crypto": "15.0.6",
    "expo-secure-store": "latest",
    "expo-background-task": "latest (SDK 53+)",
    "@react-native-community/netinfo": "11.3.2",
    "react-native-mmkv": "2.12.2",
    "zustand": "4.5.2"
  }
}
```

## Success Metrics to Track

**Performance**
- App startup: <3s on 2GB RAM devices
- Video playback start: <2s for cached content
- Crash-free rate: >99.5%

**Offline Functionality**
- Features functional offline: >95%
- Sync success rate: >90%
- Progress loss: <0.1%

**User Engagement**
- Content completion rates
- Download adoption percentage
- Average storage used per user

## Quick Decision Guide

**Choose expo-sqlite when:**
- Simple data models with <1000 records
- Want to stay in Expo managed workflow
- Don't need reactive queries

**Upgrade to WatermelonDB when:**
- 10,000+ records with complex relationships
- Need automatic UI updates on data changes
- Require sophisticated sync conflict resolution

**For content protection:**
- Start with license validation + file path obfuscation
- Add expo-screen-capture for screenshot prevention
- Only implement full encryption if legally required

**For video quality:**
- 2GB RAM devices → 360-480p
- 3GB RAM devices → 480p
- 4GB+ RAM devices → 720p option

## Final Recommendation

**The winning stack for East African education apps:**
- expo-file-system (media) + expo-sqlite (metadata) + react-native-mmkv (state)
- expo-video for playback
- H.264 @ 480p, 800 kbps
- WiFi-only enforcement for large downloads
- Cloudflare CDN with African presence
- Hermes + ProGuard in production

This combination is **proven at scale** (Kolibri's 3M+ users), **works on budget hardware**, and **stays within Expo's managed workflow** for most features.