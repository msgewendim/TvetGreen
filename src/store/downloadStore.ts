import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	downloadManager,
	type DownloadProgress,
} from "@/src/services/downloadManager";

const DOWNLOADS_KEY = "@downloaded_lessons";

export interface DownloadedLesson {
	lessonId: string;
	courseId: string;
	localUri: string;
	downloadedAt: string;
	fileSize: number;
}

interface DownloadState {
	downloadedLessons: DownloadedLesson[];
	activeDownloads: Map<string, DownloadProgress>;
	downloadQueue: string[];
	wifiOnly: boolean;
	isLoading: boolean;

	loadDownloads: () => Promise<void>;
	startDownload: (
		lessonId: string,
		courseId: string,
		videoUrl: string,
	) => Promise<void>;
	cancelDownload: (lessonId: string) => Promise<void>;
	deleteDownload: (lessonId: string) => Promise<void>;
	deleteCourseDownloads: (courseId: string) => Promise<void>;
	isDownloaded: (lessonId: string) => boolean;
	getLocalUri: (lessonId: string) => string | null;
	setWifiOnly: (value: boolean) => void;
	getStorageUsage: () => Promise<{ totalBytes: number; fileCount: number }>;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
	downloadedLessons: [],
	activeDownloads: new Map(),
	downloadQueue: [],
	wifiOnly: true,
	isLoading: false,

	loadDownloads: async () => {
		set({ isLoading: true });
		try {
			const json = await AsyncStorage.getItem(DOWNLOADS_KEY);
			const downloadedLessons: DownloadedLesson[] = json
				? JSON.parse(json)
				: [];
			set({ downloadedLessons, isLoading: false });
		} catch {
			set({ isLoading: false });
		}
	},

	startDownload: async (lessonId, courseId, videoUrl) => {
		const { activeDownloads, downloadedLessons } = get();

		// Already downloaded or downloading
		if (downloadedLessons.some((d) => d.lessonId === lessonId)) return;
		if (activeDownloads.has(lessonId)) return;

		set((state) => {
			const newActive = new Map(state.activeDownloads);
			newActive.set(lessonId, {
				lessonId,
				totalBytes: 0,
				downloadedBytes: 0,
				progress: 0,
			});
			return {
				activeDownloads: newActive,
				downloadQueue: [...state.downloadQueue, lessonId],
			};
		});

		try {
			const localUri = await downloadManager.download(
				{
					lessonId,
					courseId,
					url: videoUrl,
					fileName: `${lessonId}.mp4`,
				},
				(progress) => {
					set((state) => {
						const newActive = new Map(state.activeDownloads);
						newActive.set(lessonId, progress);
						return { activeDownloads: newActive };
					});
				},
			);

			const usage = await downloadManager.getStorageUsage();
			const newDownload: DownloadedLesson = {
				lessonId,
				courseId,
				localUri,
				downloadedAt: new Date().toISOString(),
				fileSize: 0,
			};

			const updated = [...get().downloadedLessons, newDownload];
			set((state) => {
				const newActive = new Map(state.activeDownloads);
				newActive.delete(lessonId);
				return {
					downloadedLessons: updated,
					activeDownloads: newActive,
					downloadQueue: state.downloadQueue.filter(
						(id) => id !== lessonId,
					),
				};
			});

			await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated));
		} catch {
			set((state) => {
				const newActive = new Map(state.activeDownloads);
				newActive.delete(lessonId);
				return {
					activeDownloads: newActive,
					downloadQueue: state.downloadQueue.filter(
						(id) => id !== lessonId,
					),
				};
			});
		}
	},

	cancelDownload: async (lessonId) => {
		downloadManager.cancel(lessonId);
		set((state) => {
			const newActive = new Map(state.activeDownloads);
			newActive.delete(lessonId);
			return {
				activeDownloads: newActive,
				downloadQueue: state.downloadQueue.filter(
					(id) => id !== lessonId,
				),
			};
		});
	},

	deleteDownload: async (lessonId) => {
		await downloadManager.deleteDownload(lessonId);
		const updated = get().downloadedLessons.filter(
			(d) => d.lessonId !== lessonId,
		);
		set({ downloadedLessons: updated });
		await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated));
	},

	deleteCourseDownloads: async (courseId) => {
		const toDelete = get().downloadedLessons.filter(
			(d) => d.courseId === courseId,
		);
		await downloadManager.deleteCourseDownloads(
			toDelete.map((d) => d.lessonId),
		);
		const updated = get().downloadedLessons.filter(
			(d) => d.courseId !== courseId,
		);
		set({ downloadedLessons: updated });
		await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated));
	},

	isDownloaded: (lessonId) => {
		return get().downloadedLessons.some((d) => d.lessonId === lessonId);
	},

	getLocalUri: (lessonId) => {
		const dl = get().downloadedLessons.find(
			(d) => d.lessonId === lessonId,
		);
		return dl?.localUri ?? null;
	},

	setWifiOnly: (value) => set({ wifiOnly: value }),

	getStorageUsage: async () => {
		return downloadManager.getStorageUsage();
	},
}));
