export type VideoSourceType = "local" | "url" | "youtube";

export interface VideoSource {
	source: string;
	type: VideoSourceType;
}

const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;
const YOUTUBE_URL_REGEX =
	/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=)[\w-]{11}/;

export function detectVideoSource(
	videoId: string,
	localUri: string | null,
): VideoSource {
	if (localUri) {
		return { source: localUri, type: "local" };
	}

	if (YOUTUBE_ID_REGEX.test(videoId) || YOUTUBE_URL_REGEX.test(videoId)) {
		return { source: videoId, type: "youtube" };
	}

	return { source: videoId, type: "url" };
}
