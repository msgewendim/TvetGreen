import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WifiOff, RefreshCw } from "lucide-react-native";
import {
	ScreenLayout,
	Header,
	colors,
	spacing,
	typography,
	commonStyles,
} from "@/design-system";
import {
	StorageCard,
	DownloadedCourseCard,
	QueuedDownloadCard,
	type DownloadedCourse,
	type QueuedDownload,
} from "@/src/components/downloads";
import { useLanguage } from "@/src/hooks/useLanguage";

export default function DownloadsScreen() {
	const { t } = useLanguage();
	const [storageUsed] = useState(2.4); // GB
	const [storageTotal] = useState(8.0); // GB

	const downloadedCourses: DownloadedCourse[] = [
		{
			id: 1,
			title: "Sustainable Agriculture Basics",
			category: "Agriculture",
			size: "850 MB",
			downloadDate: "2 days ago",
			progress: 75,
			totalLessons: 12,
			completedLessons: 9,
			lastWatched: "Lesson 9: Composting Techniques",
		},
		{
			id: 2,
			title: "Home Building Fundamentals",
			category: "Construction",
			size: "1.2 GB",
			downloadDate: "5 days ago",
			progress: 25,
			totalLessons: 24,
			completedLessons: 6,
			lastWatched: "Lesson 6: Foundation Basics",
		},
		{
			id: 3,
			title: "Water Conservation Methods",
			category: "Agriculture",
			size: "620 MB",
			downloadDate: "1 week ago",
			progress: 100,
			totalLessons: 10,
			completedLessons: 10,
			lastWatched: "Course Completed",
		},
	];

	const queuedDownloads: QueuedDownload[] = [
		{
			id: 4,
			title: "Solar Panel Installation",
			category: "Green Energy",
			size: "1.5 GB",
			progress: 45,
			estimatedTime: "12 min remaining",
		},
		{
			id: 5,
			title: "Small Business Success",
			category: "Business",
			size: "980 MB",
			progress: 0,
			estimatedTime: "Waiting for WiFi",
		},
	];

	const handleDeleteCourse = (courseId: number, courseTitle: string) => {
		Alert.alert(
			t("downloads.deleteDownload"),
			`Remove "${courseTitle}" from your device? You can re-download it later.`,
			[
				{ text: t("common.cancel"), style: "cancel" },
				{
					text: t("common.delete"),
					style: "destructive",
					onPress: () => console.log("Delete course", courseId),
				},
			],
		);
	};

	return (
		<ScreenLayout headerExtendsToStatusBar>
			<Header
				title={t("navigation.downloads")}
				subtitle={t("downloads.offline")}
			/>

			<StorageCard
				storageUsed={storageUsed}
				storageTotal={storageTotal}
				coursesCount={downloadedCourses.length}
				onSettingsPress={() => { }}
			/>

			{/* Connection Status */}
			<View style={styles.connectionStatus}>
				<View style={styles.connectionIndicator}>
					<WifiOff size={20} color={colors.feedback.error} strokeWidth={2} />
					<Text style={styles.connectionText}>{t("downloads.offline")}</Text>
				</View>
			</View>

			{/* Downloaded Courses */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t("downloads.downloaded")}</Text>
				{downloadedCourses.map((course) => (
					<DownloadedCourseCard
						key={course.id}
						course={course}
						onPlay={() => { }}
						onDelete={handleDeleteCourse}
					/>
				))}
			</View>

			{/* Download Queue */}
			<View style={styles.section}>
				<View style={styles.queueHeader}>
					<Text style={styles.sectionTitle}>{t("downloads.queued")}</Text>
					<TouchableOpacity style={styles.refreshButton}>
						<RefreshCw size={20} color={colors.primary.main} strokeWidth={2} />
					</TouchableOpacity>
				</View>

				{queuedDownloads.map((download) => (
					<QueuedDownloadCard key={download.id} download={download} />
				))}
			</View>
		</ScreenLayout>
	);
}

const styles = StyleSheet.create({
	connectionStatus: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.md,
	},
	connectionIndicator: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.neutral[100],
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: spacing.radius.md,
		borderLeftWidth: 4,
		borderLeftColor: colors.feedback.error,
	},
	connectionText: {
		fontSize: typography.fontSize.sm,
		color: colors.text.primary,
		fontWeight: typography.fontWeight.medium,
		marginLeft: spacing.sm,
	},
	section: commonStyles.section,
	sectionTitle: commonStyles.sectionTitle,
	queueHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.md,
	},
	refreshButton: {
		padding: spacing.sm,
		borderRadius: spacing.radius.sm,
		backgroundColor: colors.primary.surface,
	},
});
