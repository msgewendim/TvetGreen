import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { useLearningStore } from "@/src/store/learningStore";
import { useAuthStore } from "@/src/store/authStore";
import { STORAGE_KEYS } from "@/src/utils/storageKeys";

interface SyncQueueItem {
	type: "enrollment" | "progress";
	data: Record<string, unknown>;
	timestamp: string;
}

class SyncService {
	private isSyncing = false;

	async addToQueue(item: SyncQueueItem): Promise<void> {
		const queue = await this.getQueue();
		queue.push(item);
		await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
	}

	private async getQueue(): Promise<SyncQueueItem[]> {
		const json = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
		return json ? JSON.parse(json) : [];
	}

	private async clearQueue(): Promise<void> {
		await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
	}

	async sync(): Promise<boolean> {
		if (this.isSyncing) return false;
		this.isSyncing = true;

		try {
			const user = useAuthStore.getState().user;
			if (!user) return false;

			const { enrollments, lessonProgress } = useLearningStore.getState();

			await api.progress.sync({
				userId: user.id,
				enrollments,
				progress: lessonProgress,
			});

			await AsyncStorage.setItem(
				STORAGE_KEYS.LAST_SYNC,
				new Date().toISOString(),
			);
			await this.clearQueue();

			return true;
		} catch (error) {
			console.error("Sync failed:", error);
			return false;
		} finally {
			this.isSyncing = false;
		}
	}

	async getLastSyncTime(): Promise<string | null> {
		return AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
	}

	async hasPendingChanges(): Promise<boolean> {
		const queue = await this.getQueue();
		return queue.length > 0;
	}
}

export const syncService = new SyncService();
