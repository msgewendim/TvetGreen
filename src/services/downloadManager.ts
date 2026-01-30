import { File, Directory, Paths } from "expo-file-system";

const DOWNLOADS_DIR_NAME = "downloads";

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
	private downloadsDir: Directory;
	private activeDownloads = new Set<string>();

	constructor() {
		this.downloadsDir = new Directory(Paths.document, DOWNLOADS_DIR_NAME);
	}

	private ensureDirectory(): void {
		if (!this.downloadsDir.exists) {
			this.downloadsDir.create();
		}
	}

	private getFile(lessonId: string): File {
		return new File(this.downloadsDir, `${lessonId}.mp4`);
	}

	isDownloaded(lessonId: string): boolean {
		return this.getFile(lessonId).exists;
	}

	getLocalUri(lessonId: string): string | null {
		const file = this.getFile(lessonId);
		return file.exists ? file.uri : null;
	}

	async download(
		task: DownloadTask,
		_onProgress?: ProgressCallback,
	): Promise<string> {
		this.ensureDirectory();
		const file = this.getFile(task.lessonId);
		this.activeDownloads.add(task.lessonId);

		try {
			const downloadedFile = await File.downloadFileAsync(task.url, file);
			return downloadedFile.uri;
		} finally {
			this.activeDownloads.delete(task.lessonId);
		}
	}

	cancel(lessonId: string): void {
		// TODO: Implement cancellation when expo-file-system supports AbortSignal
		this.activeDownloads.delete(lessonId);
	}

	deleteDownload(lessonId: string): void {
		this.cancel(lessonId);
		const file = this.getFile(lessonId);
		if (file.exists) {
			file.delete();
		}
	}

	deleteCourseDownloads(lessonIds: string[]): void {
		for (const id of lessonIds) {
			this.deleteDownload(id);
		}
	}

	getStorageUsage(): { totalBytes: number; fileCount: number } {
		try {
			this.ensureDirectory();
			const files = this.downloadsDir.list();
			let totalBytes = 0;

			for (const item of files) {
				if (item instanceof File && item.exists) {
					totalBytes += item.size ?? 0;
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
