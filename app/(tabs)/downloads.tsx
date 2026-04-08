import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Divider, List, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	StorageCard,
	QueuedDownloadCard,
	type QueuedDownload,
} from "@/src/components/downloads";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useDownloadStore } from "@/src/store/downloadStore";
import { useLearningStore } from "@/src/store/learningStore";
import { Download } from "lucide-react-native";
import { colors, spacing } from "@/design-system";

export default function DownloadsScreen() {
	const { t } = useLanguage();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const downloadedLessons = useDownloadStore((s) => s.downloadedLessons);
	const activeDownloads = useDownloadStore((s) => s.activeDownloads);
	const deleteCourseDownloads = useDownloadStore((s) => s.deleteCourseDownloads);
	const loadDownloads = useDownloadStore((s) => s.loadDownloads);

	const courses = useLearningStore((s) => s.courses);
	const lessons = useLearningStore((s) => s.lessons);
	const getCourseProgress = useLearningStore((s) => s.getCourseProgress);
	const getLessonsForCourse = useLearningStore((s) => s.getLessonsForCourse);

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
		const courseLessons = getLessonsForCourse(courseId);
		const totalSize = courseDls.reduce((sum, d) => sum + d.fileSize, 0);

		return {
			id: courseId,
			title: course?.title ?? "Unknown Course",
			size: formatBytes(totalSize),
			progress: getCourseProgress(courseId),
			totalLessons: courseLessons.length,
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
		const courseLessons = getLessonsForCourse(courseId);
		const firstIncomplete = courseLessons.find((l) => !l.isCompleted);
		const target = firstIncomplete ?? courseLessons[0];
		if (target) {
			router.push(`/video/${courseId}/${target.id}`);
		}
	};

	const hasDownloads = downloadedCourses.length > 0 || queuedDownloads.length > 0;

	return (
		<ScrollView
			style={[styles.container, { paddingTop: insets.top + spacing.md }]}
			contentContainerStyle={styles.content}
		>
			<Text variant="headlineMedium" style={styles.title}>
				{t("navigation.downloads")}
			</Text>

			<StorageCard
				storageUsed={storageUsed}
				storageTotal={storageTotal}
				coursesCount={downloadedCourses.length}
				onSettingsPress={() => {}}
			/>

			{!hasDownloads && (
				<View style={styles.emptyContainer}>
					<Download size={48} color={colors.text.tertiary} />
					<Text variant="titleMedium" style={styles.emptyTitle}>
						No Downloads Yet
					</Text>
					<Text variant="bodyMedium" style={styles.emptyDescription}>
						Download courses to watch offline without internet.
					</Text>
					<Button
						mode="contained"
						onPress={() => router.push("/(tabs)")}
						style={styles.emptyButton}
					>
						Browse Courses
					</Button>
				</View>
			)}

			{downloadedCourses.length > 0 && (
				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						{t("downloads.downloaded")}
					</Text>
					{downloadedCourses.map((course, index) => (
						<View key={course.id}>
							<List.Item
								title={course.title}
								description={`${course.totalLessons} lessons · ${course.size}`}
								onPress={() => handlePlay(course.id)}
								onLongPress={() => handleDeleteCourse(course.id, course.title)}
								left={(props) => <List.Icon {...props} icon="download" />}
							/>
							{index < downloadedCourses.length - 1 && <Divider />}
						</View>
					))}
				</View>
			)}

			{queuedDownloads.length > 0 && (
				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						{t("downloads.queued")}
					</Text>
					{queuedDownloads.map((download) => (
						<QueuedDownloadCard key={download.id} download={download} />
					))}
				</View>
			)}
		</ScrollView>
	);
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	content: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing["2xl"],
	},
	title: {
		color: colors.text.primary,
		marginBottom: spacing.lg,
	},
	section: {
		marginTop: spacing.lg,
	},
	sectionTitle: {
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	emptyContainer: {
		alignItems: "center",
		paddingVertical: spacing["3xl"],
	},
	emptyTitle: {
		color: colors.text.primary,
		marginTop: spacing.md,
	},
	emptyDescription: {
		color: colors.text.secondary,
		textAlign: "center",
		marginTop: spacing.xs,
		marginBottom: spacing.lg,
	},
	emptyButton: {
		marginTop: spacing.sm,
	},
});
