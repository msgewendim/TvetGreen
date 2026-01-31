import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
	ScreenLayout,
	Header,
	ModernCourseCard,
	EmptyState,
	commonStyles,
	colors,
	spacing,
	typography,
} from "@/design-system";
import {
	StorageCard,
	QueuedDownloadCard,
	type QueuedDownload,
} from "@/src/components/downloads";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useDownloadStore } from "@/src/store/downloadStore";
import { useLearningStore } from "@/src/store/learningStore";
import { Download } from "lucide-react-native";

export default function DownloadsScreen() {
	const { t } = useLanguage();
	const router = useRouter();

	const downloadedLessons = useDownloadStore((s) => s.downloadedLessons);
	const activeDownloads = useDownloadStore((s) => s.activeDownloads);
	const deleteCourseDownloads = useDownloadStore((s) => s.deleteCourseDownloads);
	const loadDownloads = useDownloadStore((s) => s.loadDownloads);

	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const getCourseProgress = useLearningStore((s) => s.getCourseProgress);
	const getLessonsByCourse = useLearningStore((s) => s.getLessonsByCourse);

	const [storageUsed, setStorageUsed] = useState(0);
	const [storageTotal] = useState(8.0);

	useEffect(() => {
		loadDownloads();
	}, [loadDownloads]);

	useEffect(() => {
		const { totalBytes } = useDownloadStore.getState().getStorageUsage();
		setStorageUsed(totalBytes / (1024 * 1024 * 1024));
	}, [downloadedLessons]);

	const courseIds = [...new Set(downloadedLessons.map((d) => d.courseId))];

	const downloadedCourses = courseIds.map((courseId) => {
		const course = courses.find((c) => c.id === courseId);
		const courseDls = downloadedLessons.filter((d) => d.courseId === courseId);
		const courseLessons = getLessonsByCourse(courseId);
		const totalSize = courseDls.reduce((sum, d) => sum + d.fileSize, 0);

		return {
			id: courseId,
			title: course?.title ?? "Unknown Course",
			category: course?.categoryId?.replace("category_", "") ?? "",
			size: formatBytes(totalSize),
			downloadDate: courseDls[0]?.downloadedAt
				? formatRelative(courseDls[0].downloadedAt)
				: "",
			progress: getCourseProgress(courseId),
			totalLessons: courseLessons.length,
			thumbnail: course?.thumbnail,
			instructor: course?.instructor?.name,
		};
	});

	const queuedDownloads: QueuedDownload[] = Array.from(
		activeDownloads.entries(),
	).map(([lessonId, progress]) => {
		const lesson = lessons.find((l) => l.id === lessonId);
		const course = courses.find((c) => c.id === lesson?.courseId);
		return {
			id: lessonId,
			title: lesson?.title ?? "Downloading...",
			category: course?.categoryId?.replace("category_", "") ?? "",
			size: formatBytes(progress.totalBytes),
			progress: Math.round(progress.progress * 100),
			estimatedTime: progress.progress > 0 ? "Downloading..." : "Starting...",
		};
	});

	const handleDeleteCourse = (courseId: string, courseTitle: string) => {
		Alert.alert(
			t("downloads.deleteDownload"),
			`Remove "${courseTitle}" from your device? You can re-download it later.`,
			[
				{ text: t("common.cancel"), style: "cancel" },
				{
					text: t("common.delete"),
					style: "destructive",
					onPress: () => deleteCourseDownloads(courseId),
				},
			],
		);
	};

	const handlePlay = (courseId: string) => {
		const courseLessons = getLessonsByCourse(courseId);
		const firstIncomplete = courseLessons.find((l) => !l.isCompleted);
		const target = firstIncomplete ?? courseLessons[0];
		if (target) {
			router.push(`/video/${courseId}/${target.id}`);
		}
	};

	const hasDownloads = downloadedCourses.length > 0 || queuedDownloads.length > 0;

	return (
		<ScreenLayout >
			<Header variant="minimal" title="Downloads" />

			{/* Compact Storage Bar */}
			<StorageCard
				storageUsed={storageUsed}
				storageTotal={storageTotal}
				coursesCount={downloadedCourses.length}
				onSettingsPress={() => {}}
			/>

			{!hasDownloads && (
				<View style={styles.emptyContainer}>
					<EmptyState
						icon={<Download size={48} color={colors.text.tertiary} />}
						title="No Downloads Yet"
						description="Download courses to watch offline without internet."
						action={{
							label: "Browse Courses",
							onPress: () => router.push("/(tabs)/courses"),
						}}
					/>
				</View>
			)}

			{downloadedCourses.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						{t("downloads.downloaded")}
					</Text>
					{downloadedCourses.map((course) => (
						<ModernCourseCard
							key={course.id}
							title={course.title}
							instructor={course.instructor}
							category={course.category}
							lessonsCount={course.totalLessons}
							progress={course.progress}
							size={course.size}
							downloadDate={course.downloadDate}
							thumbnailUrl={course.thumbnail}
							isOffline
							onPress={() => handlePlay(course.id)}
							onDelete={() => handleDeleteCourse(course.id, course.title)}
						/>
					))}
				</View>
			)}

			{queuedDownloads.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						{t("downloads.queued")}
					</Text>
					{queuedDownloads.map((download) => (
						<QueuedDownloadCard key={download.id} download={download} />
					))}
				</View>
			)}
		</ScreenLayout>
	);
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

function formatRelative(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const days = Math.floor(diff / 86400000);
	if (days === 0) return "Today";
	if (days === 1) return "Yesterday";
	return `${days} days ago`;
}

const styles = StyleSheet.create({
	section: commonStyles.section,
	sectionTitle: commonStyles.sectionTitle,
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: spacing["3xl"],
		paddingHorizontal: spacing.xl,
	},
});
