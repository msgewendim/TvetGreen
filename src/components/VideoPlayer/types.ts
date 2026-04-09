import type { ViewStyle } from "react-native";

export interface VideoPlayerProps {
	source: string;
	localSource?: string;
	/** When YouTube is unavailable, use this URL in the default (direct) player. Omit to use built-in dummy video. */
	fallbackSource?: string;
	autoPlay?: boolean;
	initialPosition?: number;
	playbackRate?: number;
	muted?: boolean;
	onProgress?: (progress: { currentTime: number; duration: number }) => void;
	onComplete?: () => void;
	onError?: (error: Error) => void;
	onReady?: () => void;
	onPlayingChange?: (isPlaying: boolean) => void;
	onBufferingChange?: (isBuffering: boolean) => void;
	style?: ViewStyle;
}

export interface VideoPlayerRef {
	play: () => void;
	pause: () => void;
	seekTo: (seconds: number) => void;
	seekBy: (seconds: number) => void;
	/** Current playback position in seconds (sync for expo-video, 0 for YouTube) */
	readonly currentTime: number;
	/** Total duration in seconds (sync for expo-video, 0 for YouTube) */
	readonly duration: number;
	/** YouTube player ref for async getCurrentTime/getDuration */
	readonly playerRef?: {
		getCurrentTime?: () => Promise<number>;
		getDuration?: () => Promise<number>;
	};
}
