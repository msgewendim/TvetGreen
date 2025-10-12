export const fetchVideos = async (): Promise<Video[]> => {
	const link =
		"https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json"
	const response = await fetch(link);
	const data = await response.json();
	return data;
};

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
