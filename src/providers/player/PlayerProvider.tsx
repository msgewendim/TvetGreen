import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Modal, View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'
import { X } from 'lucide-react-native'
import { WebView } from 'react-native-webview'
import type { Video } from '@/api/videos'

type PlayerContextValue = {
  open: (video: Video) => void
  close: () => void
  currentVideo: Video | null
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export function PlayerProvider ({ children }: { children: React.ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)

  const close = useCallback(() => setCurrentVideo(null), [])
  const open = useCallback((video: Video) => setCurrentVideo(video), [])

  const value = useMemo(() => ({ open, close, currentVideo }), [open, close, currentVideo])

  const videoId = useMemo(() => {
    if (!currentVideo) return ''
    // Prefer explicit id; fallback to parse from URL
    if (currentVideo.id) return currentVideo.id
    const match = currentVideo.videoUrl?.match(/[?&]v=([^&]+)/)
    return match?.[1] || ''
  }, [currentVideo])

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : ''

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <Modal visible={Boolean(currentVideo)} animationType='slide' onRequestClose={close} presentationStyle='fullScreen'>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{currentVideo?.title || 'Now Playing'}</Text>
            <TouchableOpacity accessibilityLabel='Close player' onPress={close} style={styles.closeBtn}>
              <X size={22} color={'#2F4F4F'} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.playerArea}>
            {embedUrl ? (
              Platform.OS === 'web' ? (
                // Use native iframe on web since react-native-webview does not support web
                // eslint-disable-next-line react/no-unknown-property
                <iframe
                  src={embedUrl}
                  title={currentVideo?.title || 'YouTube Player'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              ) : (
                <WebView
                  source={{ uri: embedUrl }}
                  allowsFullscreenVideo
                  javaScriptEnabled
                  setSupportMultipleWindows={false}
                  mediaPlaybackRequiresUserAction={false}
                  allowsInlineMediaPlayback
                  style={styles.webview}
                />
              )
            ) : (
              <View style={styles.fallback}><Text style={styles.fallbackText}>Unable to load video</Text></View>
            )}
          </View>
          <View style={styles.meta}>
            {currentVideo?.description ? (
              <Text style={styles.description} numberOfLines={6}>{currentVideo.description}</Text>
            ) : null}
          </View>
        </View>
      </Modal>
    </PlayerContext.Provider>
  )
}

export function usePlayer () {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.select({ ios: 54, android: 24, default: 16 }),
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE8D5'
  },
  title: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2F4F4F', marginRight: 8 },
  closeBtn: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.05)' },
  playerArea: { height: 240, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: '#2F4F4F' },
  meta: { flex: 1, padding: 16 },
  description: { color: '#2F4F4F', fontSize: 14, lineHeight: 20 }
})


