import { useQuery } from "react-query";
import { fetchVideos } from "@/api/videos";

export function useVideos() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["videos"],
		queryFn: fetchVideos,
		staleTime: 1000 * 60 * 60 * 24, // 15 minutes
		retry: 3,
		retryDelay: 1000,
	});

	return { data, isLoading, error };
}
