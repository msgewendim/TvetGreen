import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { StyleSheet } from "react-native";
import {
	VideoView,
	useVideoPlayer as useExpoVideoPlayer,
	type VideoPlayer as ExpoVideoPlayerType,
} from "expo-video";
import { useEventListener } from "expo";
import type { VideoPlayerProps, VideoPlayerRef } from "./types";

export const DirectVideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
	(
		{
			source,
			localSource,
			autoPlay = false,
			initialPosition,
			playbackRate = 1,
			muted = false,
			onProgress,
			onComplete,
			onError,
			onReady,
			onPlayingChange,
			onBufferingChange,
			style,
		},
		ref,
	) => {
		const videoSource = localSource || source;
		const durationRef = useRef(0);

		const player = useExpoVideoPlayer(videoSource, (p) => {
			p.loop = false;
			p.muted = muted;
			p.playbackRate = playbackRate;
			if (initialPosition && initialPosition > 0) {
				p.currentTime = initialPosition;
			}
			if (autoPlay) {
				p.play();
			}
		});

		useEventListener(player, "statusChange", (event) => {
			if (event.status === "readyToPlay") {
				durationRef.current = player.duration;
				onReady?.();
			} else if (event.status === "error") {
				onError?.(new Error(event.error?.message ?? "Video playback error"));
			}
		});

		useEventListener(player, "playingChange", (event) => {
			onPlayingChange?.(event.isPlaying);
		});

		useEventListener(player, "playToEnd", () => {
			onComplete?.();
		});

		// expo-video doesn't have a direct timeUpdate event in SDK 54,
		// so we use a polling approach via the progress callback from the parent hook.
		// The parent hook's interval will call getCurrentTime via ref.
		// But we can also track via playingChange + interval in the hook.

		useImperativeHandle(ref, () => ({
			play: () => player.play(),
			pause: () => player.pause(),
			seekTo: (seconds: number) => {
				player.currentTime = seconds;
			},
			seekBy: (seconds: number) => {
				player.currentTime = Math.max(0, player.currentTime + seconds);
			},
			get currentTime() {
				return player.currentTime;
			},
			get duration() {
				return player.duration;
			},
			get player() {
				return player;
			},
		}));

		// Sync muted and playbackRate changes
		player.muted = muted;
		player.playbackRate = playbackRate;

		return (
			<VideoView
				player={player}
				style={[styles.video, style]}
				nativeControls={true}
				contentFit="contain"
			/>
		);
	},
);

DirectVideoPlayer.displayName = "DirectVideoPlayer";

const styles = StyleSheet.create({
	video: {
		flex: 1,
	},
});
