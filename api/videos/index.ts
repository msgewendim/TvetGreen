export const fetchVideos = async (): Promise<Video[]> => {
	const playlistId = "PLSQl0a2vh4HDERCw_ddanXbsDpFWcpL-S";
	return fetchYoutubeVideosWithApiKey(playlistId);
};

export const fetchYoutubeVideosWithoutApiKey = async (
	playlistId: string,
): Promise<Video[]> => {
	try {
		const response = await fetch(
			`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=${playlistId}`,
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch videos: ${response.status}`);
		}
		const data = (await response.json()) as unknown as YtPlaylistItemsResponse;
		const items = Array.isArray(data.items) ? data.items : [];
		return items.map(mapPlaylistItemToVideo);
	} catch (error) {
		throw new Error(`Failed to fetch videos: ${error}`);
	}
};

export const fetchYoutubeVideosWithApiKey = async (
	playlistId: string,
): Promise<Video[]> => {
	try {
		const apiKey = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
		if (!apiKey) {
			throw new Error(
				"YouTube API key is required (EXPO_PUBLIC_YOUTUBE_API_KEY)",
			);
		}
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}`,
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch videos: ${response.status}`);
		}
		const data = (await response.json()) as unknown as YtPlaylistItemsResponse;
		const items = Array.isArray(data.items) ? data.items : [];
		return items.map(mapPlaylistItemToVideo);
	} catch (error) {
		throw new Error(`Failed to fetch videos: ${error}`);
	}
};
type YtThumbnail = { url?: string };
type YtThumbnails = {
	default?: YtThumbnail;
	medium?: YtThumbnail;
	high?: YtThumbnail;
};
type YtResourceId = { videoId?: string };
type YtSnippet = {
	title?: string;
	description?: string;
	publishedAt?: string;
	channelTitle?: string;
	liveBroadcastContent?: string;
	thumbnails?: YtThumbnails;
	resourceId?: YtResourceId;
	videoOwnerChannelTitle?: string;
};
type YtPlaylistContentDetails = { videoId?: string };
type YtPlaylistItem = {
	snippet?: YtSnippet;
	contentDetails?: YtPlaylistContentDetails;
};
type YtPlaylistItemsResponse = { items?: YtPlaylistItem[] };

type YtVideoContentDetails = { duration?: string };
type YtVideoStatistics = { viewCount?: string };
type YtLiveStreamingDetails = {
	actualStartTime?: string;
	scheduledStartTime?: string;
};
type YtVideo = {
	id?: string;
	snippet?: YtSnippet;
	contentDetails?: YtVideoContentDetails;
	statistics?: YtVideoStatistics;
	liveStreamingDetails?: YtLiveStreamingDetails;
};
type YtVideosResponse = { items?: YtVideo[] };

function mapPlaylistItemToVideo(item: YtPlaylistItem): Video {
	const snippet = item?.snippet ?? {};
	const content = item?.contentDetails ?? {};
	const videoId = content?.videoId || snippet?.resourceId?.videoId || "";

	const title = snippet?.title || "";
	const description = snippet?.description || "";
	const thumbnailUrl =
		snippet?.thumbnails?.medium?.url ||
		snippet?.thumbnails?.high?.url ||
		snippet?.thumbnails?.default?.url ||
		"";
	const uploadTime = snippet?.publishedAt || "";
	const author = snippet?.videoOwnerChannelTitle || snippet?.channelTitle || "";

	return {
		id: videoId,
		title,
		thumbnailUrl,
		duration: "", // duration not in playlistItems; requires videos.list
		uploadTime,
		views: "0", // not in playlistItems
		author,
		videoUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : "",
		description,
		subscriber: "",
		isLive: snippet?.liveBroadcastContent === "live",
	};
}

export const fetchPlaylistVideos = async (
	playlistId: string,
	apiKey: string = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY as string,
): Promise<Video[]> => {
	if (!playlistId) {
		throw new Error("playlistId is required");
	}
	if (!apiKey) {
		throw new Error(
			"YouTube API key is required (EXPO_PUBLIC_YOUTUBE_API_KEY)",
		);
	}

	const base = "https://www.googleapis.com/youtube/v3";

	// 1) Get up to 50 items from the playlist
	const playlistItemsUrl = new URL(`${base}/playlistItems`);
	playlistItemsUrl.searchParams.set("part", "snippet,contentDetails");
	playlistItemsUrl.searchParams.set("maxResults", "50");
	playlistItemsUrl.searchParams.set("playlistId", playlistId);
	playlistItemsUrl.searchParams.set("key", apiKey);

	const itemsRes = await fetch(playlistItemsUrl.toString());
	if (!itemsRes.ok) {
		throw new Error(`Failed to fetch playlist items: ${itemsRes.status}`);
	}
	const itemsJson =
		(await itemsRes.json()) as unknown as YtPlaylistItemsResponse;
	const items = Array.isArray(itemsJson.items) ? itemsJson.items : [];
	if (items.length === 0) return [];

	const videoIds = items
		.map((it: YtPlaylistItem) => it?.contentDetails?.videoId)
		.filter((v: string | undefined): v is string => Boolean(v));

	// 2) Fetch video details (duration, views, live status)
	const videosUrl = new URL(`${base}/videos`);
	videosUrl.searchParams.set(
		"part",
		"snippet,contentDetails,statistics,liveStreamingDetails",
	);
	videosUrl.searchParams.set("id", videoIds.join(","));
	videosUrl.searchParams.set("key", apiKey);

	const videosRes = await fetch(videosUrl.toString());
	if (!videosRes.ok) {
		throw new Error(`Failed to fetch videos: ${videosRes.status}`);
	}
	const videosJson = (await videosRes.json()) as unknown as YtVideosResponse;
	const videos = Array.isArray(videosJson.items) ? videosJson.items : [];

	// Map videoId -> details for quick lookup
	const videoById = new Map<string, YtVideo>();
	for (const v of videos) {
		if (v?.id) videoById.set(v.id, v);
	}

	// 3) Normalize into your Video[] type
	return items.map((item: YtPlaylistItem): Video => {
		const snippet = item?.snippet ?? {};
		const contentDetails = item?.contentDetails ?? {};
		const videoId = contentDetails?.videoId as string;
		const full = videoById.get(videoId) ?? {};
		const fullSnippet = full?.snippet ?? {};
		const fullContent = full?.contentDetails ?? {};
		const stats = full?.statistics ?? {};
		const live = full?.liveStreamingDetails ?? {};

		const title = snippet?.title ?? fullSnippet?.title ?? "";
		const description = fullSnippet?.description ?? snippet?.description ?? "";
		const thumbnailUrl =
			fullSnippet?.thumbnails?.medium?.url ||
			fullSnippet?.thumbnails?.high?.url ||
			fullSnippet?.thumbnails?.default?.url ||
			snippet?.thumbnails?.medium?.url ||
			snippet?.thumbnails?.high?.url ||
			snippet?.thumbnails?.default?.url ||
			"";

		const uploadTime = fullSnippet?.publishedAt || snippet?.publishedAt || "";
		const durationIso = fullContent?.duration || "";
		const duration = formatYouTubeDuration(durationIso);
		const views = stats?.viewCount ? String(stats.viewCount) : "0";
		const author = snippet?.channelTitle || fullSnippet?.channelTitle || "";
		const videoUrl = videoId
			? `https://www.youtube.com/watch?v=${videoId}`
			: "";
		const isLive =
			Boolean(live?.actualStartTime || live?.scheduledStartTime) ||
			fullSnippet?.liveBroadcastContent === "live";

		return {
			id: videoId || "",
			title,
			thumbnailUrl,
			duration,
			uploadTime,
			views,
			author,
			videoUrl,
			description,
			subscriber: "", // not fetched here; requires channels.list and channel aggregation
			isLive,
		};
	});
};

function formatYouTubeDuration(iso: string): string {
	if (!iso) return "";
	// ISO 8601 like PT1H2M3S
	const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return "";
	const hours = parseInt(match[1] || "0", 10);
	const minutes = parseInt(match[2] || "0", 10);
	const seconds = parseInt(match[3] || "0", 10);

	const parts: string[] = [];
	if (hours > 0) parts.push(String(hours));
	parts.push(String(hours > 0 ? minutes.toString().padStart(2, "0") : minutes));
	parts.push(seconds.toString().padStart(2, "0"));
	return parts.join(":");
}

export type Video = {
	id: string;
	title: string;
	thumbnailUrl: string;
	duration: string;
	uploadTime: string;
	views: string;
	author: string;
	videoUrl: string;
	description: string;
	subscriber: string;
	isLive: boolean;
};
