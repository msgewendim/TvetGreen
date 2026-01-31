import { forwardRef, useCallback, useState } from "react";
import type { VideoPlayerProps, VideoPlayerRef } from "./types";
import { isYouTubeSource } from "./utils";
import { DirectVideoPlayer } from "./DirectVideoPlayer";
import { YouTubeVideoPlayer } from "./YouTubePlayer";

/** Default dummy video used when YouTube is unavailable (e.g. video_not_found, embed_not_allowed). */
const DEFAULT_FALLBACK_VIDEO_URL =
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function isYouTubeUnavailableError(error: Error): boolean {
	const msg = (error?.message ?? "").toLowerCase();
	return (
		msg === "video_not_found" ||
		msg === "embed_not_allowed" ||
		msg.includes("unavailable") ||
		msg.includes("not found")
	);
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
	(props, ref) => {
		const [useFallbackPlayer, setUseFallbackPlayer] = useState(false);

		const handleError = useCallback(
			(err: Error) => {
				if (isYouTubeUnavailableError(err)) {
					setUseFallbackPlayer(true);
				}
				props.onError?.(err);
			},
			[props.onError],
		);

		const useYouTube =
			isYouTubeSource(props.source) && !props.localSource && !useFallbackPlayer;

		if (useYouTube) {
			return (
				<YouTubeVideoPlayer
					ref={ref}
					{...props}
					onError={handleError}
				/>
			);
		}

		const effectiveSource = useFallbackPlayer
			? (props.fallbackSource ?? DEFAULT_FALLBACK_VIDEO_URL)
			: props.source;

		return (
			<DirectVideoPlayer
				ref={ref}
				{...props}
				source={effectiveSource}
				localSource={useFallbackPlayer ? undefined : props.localSource}
			/>
		);
	},
);

VideoPlayer.displayName = "VideoPlayer";
