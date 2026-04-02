import { ChevronDown, CircleCheck as CheckCircle } from "lucide-react-native";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { colors, spacing, typography } from "@/design-system";
import { useLanguage } from "@/src/hooks/useLanguage";

const { height } = Dimensions.get("window");

interface SubtitleLanguage {
	code: string;
	nameKey: string;
	flag: string;
}

interface VideoSettingsPanelProps {
	showSettings: boolean;
	playbackSpeed: number;
	selectedLanguage: string;
	showSubtitles: boolean;
	playbackSpeeds: number[];
	subtitleLanguages: SubtitleLanguage[];
	autoPlayNext?: boolean;
	selectedQuality?: string;
	onClose: () => void;
	onSpeedChange: (speed: number) => void;
	onLanguageChange: (language: string) => void;
	onToggleSubtitles: () => void;
	onToggleAutoPlay?: () => void;
	onQualityChange?: (quality: string) => void;
}

export function VideoSettingsPanel({
	showSettings,
	playbackSpeed,
	selectedLanguage,
	showSubtitles,
	playbackSpeeds,
	subtitleLanguages,
	autoPlayNext = true,
	selectedQuality = "auto",
	onClose,
	onSpeedChange,
	onLanguageChange,
	onToggleSubtitles,
	onToggleAutoPlay,
	onQualityChange,
}: VideoSettingsPanelProps) {
	const { t } = useLanguage();
	const qualities = ["auto", "1080p", "720p", "480p", "360p"];
	if (!showSettings) return null;

	return (
		<View style={styles.panel}>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>{t("video.videoSettings")}</Text>
					<TouchableOpacity onPress={onClose}>
						<ChevronDown
							size={24}
							color={colors.text.primary}
							strokeWidth={2}
						/>
					</TouchableOpacity>
				</View>

				{/* Playback Speed */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>{t("video.playbackSpeed")}</Text>
					<View style={styles.speedOptions}>
						{playbackSpeeds.map((speed) => (
							<TouchableOpacity
								key={speed}
								style={[
									styles.speedOption,
									playbackSpeed === speed && styles.speedOptionActive,
								]}
								onPress={() => onSpeedChange(speed)}
							>
								<Text
									style={[
										styles.speedOptionText,
										playbackSpeed === speed && styles.speedOptionTextActive,
									]}
								>
									{speed}x
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Subtitle Language */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>{t("video.subtitleLanguage")}</Text>
					{subtitleLanguages.map((lang) => (
						<TouchableOpacity
							key={lang.code}
							style={[
								styles.languageOption,
								selectedLanguage === lang.code && styles.languageOptionActive,
							]}
							onPress={() => onLanguageChange(lang.code)}
						>
							<Text style={styles.languageFlag}>{lang.flag}</Text>
							<Text
								style={[
									styles.languageText,
									selectedLanguage === lang.code && styles.languageTextActive,
								]}
							>
								{t(lang.nameKey)}
							</Text>
							{selectedLanguage === lang.code && (
								<CheckCircle
									size={20}
									color={colors.primary.main}
									strokeWidth={2}
								/>
							)}
						</TouchableOpacity>
					))}
				</View>

				{/* Subtitle Toggle */}
				<TouchableOpacity
					style={styles.subtitleToggle}
					onPress={onToggleSubtitles}
				>
					<Text style={styles.subtitleToggleText}>
						{showSubtitles ? t("video.hideSubtitles") : t("video.showSubtitles")}
					</Text>
					<View style={[styles.toggle, showSubtitles && styles.toggleActive]}>
						<View
							style={[
								styles.toggleThumb,
								showSubtitles && styles.toggleThumbActive,
							]}
						/>
					</View>
				</TouchableOpacity>

				{/* Video Quality — only rendered when a handler is provided */}
				{onQualityChange && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>{t("video.videoQuality")}</Text>
						<View style={styles.speedOptions}>
							{qualities.map((quality) => (
								<TouchableOpacity
									key={quality}
									style={[
										styles.speedOption,
										selectedQuality === quality && styles.speedOptionActive,
									]}
									onPress={() => onQualityChange(quality)}
								>
									<Text
										style={[
											styles.speedOptionText,
											selectedQuality === quality && styles.speedOptionTextActive,
										]}
									>
										{quality === "auto" ? "Auto" : quality}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}

				{/* Auto-play Next Lesson */}
				{onToggleAutoPlay && (
					<TouchableOpacity
						style={styles.subtitleToggle}
						onPress={onToggleAutoPlay}
					>
						<Text style={styles.subtitleToggleText}>{t("video.autoplayNext")}</Text>
						<View style={[styles.toggle, autoPlayNext && styles.toggleActive]}>
							<View
								style={[
									styles.toggleThumb,
									autoPlayNext && styles.toggleThumbActive,
								]}
							/>
						</View>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	panel: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(253, 245, 230, 0.98)",
		borderTopLeftRadius: spacing.radius.md,
		borderTopRightRadius: spacing.radius.md,
		maxHeight: height * 0.6,
	},
	content: {
		padding: spacing.lg,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.lg,
		paddingBottom: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.light,
	},
	title: {
		fontSize: typography.fontSize.xl,
		fontWeight: typography.fontWeight.bold,
		color: colors.text.primary,
	},
	section: {
		marginBottom: spacing.lg,
	},
	sectionTitle: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
		marginBottom: spacing.sm,
	},
	speedOptions: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
	},
	speedOption: {
		backgroundColor: colors.neutral[100],
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: spacing.radius.full,
		borderWidth: 2,
		borderColor: "transparent",
	},
	speedOptionActive: {
		backgroundColor: colors.primary.main,
		borderColor: colors.primary.main,
	},
	speedOptionText: {
		fontSize: typography.fontSize.sm,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	speedOptionTextActive: {
		color: colors.text.inverse,
	},
	languageOption: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.secondary,
		padding: spacing.sm,
		borderRadius: spacing.radius.sm,
		marginBottom: spacing.sm,
		borderWidth: 2,
		borderColor: "transparent",
	},
	languageOptionActive: {
		borderColor: colors.primary.main,
		backgroundColor: colors.primary.surface,
	},
	languageFlag: {
		fontSize: typography.fontSize.xl,
		marginRight: spacing.sm,
	},
	languageText: {
		fontSize: typography.fontSize.base,
		color: colors.text.primary,
		flex: 1,
	},
	languageTextActive: {
		fontWeight: typography.fontWeight.semibold,
		color: colors.primary.main,
	},
	subtitleToggle: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: colors.background.secondary,
		padding: spacing.md,
		borderRadius: spacing.radius.sm,
	},
	subtitleToggleText: {
		fontSize: typography.fontSize.base,
		fontWeight: typography.fontWeight.semibold,
		color: colors.text.primary,
	},
	toggle: {
		width: 50,
		height: 30,
		borderRadius: 15,
		backgroundColor: colors.neutral[300],
		justifyContent: "center",
		paddingHorizontal: 2,
	},
	toggleActive: {
		backgroundColor: colors.primary.main,
	},
	toggleThumb: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: colors.text.inverse,
		alignSelf: "flex-start",
	},
	toggleThumbActive: {
		alignSelf: "flex-end",
	},
});
