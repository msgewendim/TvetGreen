import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import type { VideoPlayerProps, VideoPlayerRef } from "./types";
import { extractYouTubeId } from "./utils";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const YouTubeVideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
	(
		{
			source,
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
		const playerRef = useRef<any>(null);
		const [isPlaying, setIsPlaying] = useState(autoPlay);
		const videoId = extractYouTubeId(source);

		const onStateChange = useCallback(
			(state: string) => {
				if (state === "playing") {
					setIsPlaying(true);
					onPlayingChange?.(true);
					onBufferingChange?.(false);
				} else if (state === "paused") {
					setIsPlaying(false);
					onPlayingChange?.(false);
					onBufferingChange?.(false);
				} else if (state === "buffering") {
					onBufferingChange?.(true);
				} else if (state === "ended") {
					setIsPlaying(false);
					onPlayingChange?.(false);
					onComplete?.();
				}
			},
			[onPlayingChange, onBufferingChange, onComplete],
		);

		useImperativeHandle(ref, () => ({
			play: () => setIsPlaying(true),
			pause: () => setIsPlaying(false),
			seekTo: (seconds: number) => {
				playerRef.current?.seekTo(seconds, true);
			},
			seekBy: async (seconds: number) => {
				const current = await playerRef.current?.getCurrentTime();
				if (current !== undefined) {
					playerRef.current?.seekTo(
						Math.max(0, current + seconds),
						true,
					);
				}
			},
			get currentTime() {
				return 0; // async only via getCurrentTime
			},
			get duration() {
				return 0; // async only via getDuration
			},
			get playerRef() {
				return playerRef.current;
			},
		}));

		return (
			<View style={[styles.container, style]}>
				<YoutubePlayer
					ref={playerRef}
					height={SCREEN_WIDTH * (9 / 16)}
					width={SCREEN_WIDTH}
					videoId={videoId}
					play={isPlaying}
					mute={muted}
					onChangeState={onStateChange}
					onReady={async () => {
						onReady?.();
						if (initialPosition && initialPosition > 0) {
							playerRef.current?.seekTo(initialPosition, true);
						}
						const dur = await playerRef.current?.getDuration();
						if (dur && onProgress) {
							onProgress({ currentTime: 0, duration: dur });
						}
					}}
					onError={(error: string) => {
						onError?.(new Error(error));
					}}
					playbackRate={playbackRate}
					initialPlayerParams={{
						preventFullScreen: true,
						modestbranding: true,
					}}
				/>
			</View>
		);
	},
);

YouTubeVideoPlayer.displayName = "YouTubeVideoPlayer";

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#000",
	},
});
