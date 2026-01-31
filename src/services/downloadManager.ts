import * as FileSystem from "expo-file-system/legacy";

const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;

export interface DownloadTask {
	lessonId: string;
	courseId: string;
	url: string;
	fileName: string;
}

export interface DownloadProgress {
	lessonId: string;
	totalBytes: number;
	downloadedBytes: number;
	progress: number;
}

type ProgressCallback = (progress: DownloadProgress) => void;

class DownloadManager {
	private activeDownloads = new Set<string>();

	private async ensureDirectory(): Promise<void> {
		const info = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
		if (!info.exists) {
			await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, {
				intermediates: true,
			});
		}
	}

	private getFilePath(lessonId: string): string {
		return `${DOWNLOADS_DIR}${lessonId}.mp4`;
	}

	async isDownloaded(lessonId: string): Promise<boolean> {
		const info = await FileSystem.getInfoAsync(this.getFilePath(lessonId));
		return info.exists;
	}

	async getLocalUri(lessonId: string): Promise<string | null> {
		const path = this.getFilePath(lessonId);
		const info = await FileSystem.getInfoAsync(path);
		return info.exists ? path : null;
	}

	async download(
		task: DownloadTask,
		onProgress?: ProgressCallback,
	): Promise<string> {
		await this.ensureDirectory();
		const filePath = this.getFilePath(task.lessonId);
		this.activeDownloads.add(task.lessonId);

		try {
			const downloadResumable = FileSystem.createDownloadResumable(
				task.url,
				filePath,
				{},
				onProgress
					? (downloadProgress) => {
							onProgress({
								lessonId: task.lessonId,
								totalBytes:
									downloadProgress.totalBytesExpectedToWrite,
								downloadedBytes:
									downloadProgress.totalBytesWritten,
								progress:
									downloadProgress.totalBytesExpectedToWrite >
									0
										? downloadProgress.totalBytesWritten /
											downloadProgress.totalBytesExpectedToWrite
										: 0,
							});
						}
					: undefined,
			);

			const result = await downloadResumable.downloadAsync();
			return result?.uri ?? filePath;
		} finally {
			this.activeDownloads.delete(task.lessonId);
		}
	}

	cancel(lessonId: string): void {
		this.activeDownloads.delete(lessonId);
	}

	async deleteDownload(lessonId: string): Promise<void> {
		this.cancel(lessonId);
		const path = this.getFilePath(lessonId);
		const info = await FileSystem.getInfoAsync(path);
		if (info.exists) {
			await FileSystem.deleteAsync(path);
		}
	}

	async deleteCourseDownloads(lessonIds: string[]): Promise<void> {
		for (const id of lessonIds) {
			await this.deleteDownload(id);
		}
	}

	async getStorageUsage(): Promise<{ totalBytes: number; fileCount: number }> {
		try {
			await this.ensureDirectory();
			const files = await FileSystem.readDirectoryAsync(DOWNLOADS_DIR);
			let totalBytes = 0;

			for (const fileName of files) {
				const info = await FileSystem.getInfoAsync(
					`${DOWNLOADS_DIR}${fileName}`,
				);
				if (info.exists && info.size) {
					totalBytes += info.size;
				}
			}

			return { totalBytes, fileCount: files.length };
		} catch {
			return { totalBytes: 0, fileCount: 0 };
		}
	}

	isDownloading(lessonId: string): boolean {
		return this.activeDownloads.has(lessonId);
	}
}

export const downloadManager = new DownloadManager();
