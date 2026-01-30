import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { useLearningStore } from "@/src/store/learningStore";
import { useAuthStore } from "@/src/store/authStore";

const SYNC_QUEUE_KEY = "@sync_queue";
const LAST_SYNC_KEY = "@last_sync";

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
		await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
	}

	private async getQueue(): Promise<SyncQueueItem[]> {
		const json = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
		return json ? JSON.parse(json) : [];
	}

	private async clearQueue(): Promise<void> {
		await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
	}

	async sync(): Promise<boolean> {
		if (this.isSyncing) return false;
		this.isSyncing = true;

		try {
			const user = useAuthStore.getState().user;
			if (!user) return false;

			const { enrollments, lessonProgress } =
				useLearningStore.getState();

			await api.progress.sync({
				userId: user.id,
				enrollments,
				progress: lessonProgress,
			});

			await AsyncStorage.setItem(
				LAST_SYNC_KEY,
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
		return AsyncStorage.getItem(LAST_SYNC_KEY);
	}

	async hasPendingChanges(): Promise<boolean> {
		const queue = await this.getQueue();
		return queue.length > 0;
	}
}

export const syncService = new SyncService();
