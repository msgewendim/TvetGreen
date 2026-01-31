const YOUTUBE_URL_PATTERNS = [
	/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=)([\w-]{11})/,
];

const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;

export function isYouTubeSource(source: string): boolean {
	if (YOUTUBE_ID_REGEX.test(source)) return true;
	return YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(source));
}

export function extractYouTubeId(source: string): string {
	if (YOUTUBE_ID_REGEX.test(source)) return source;
	for (const pattern of YOUTUBE_URL_PATTERNS) {
		const match = source.match(pattern);
		if (match?.[1]) return match[1];
	}
	return source;
}
