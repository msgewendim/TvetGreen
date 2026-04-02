/**
 * Video Settings Zustand Store
 *
 * Persists video player preferences (playback speed, subtitle settings)
 * to AsyncStorage so they survive navigation and app restarts.
 */

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VIDEO_SETTINGS_KEY = "@video_settings";

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const SUBTITLE_LANGUAGES = [
	{ code: "en", nameKey: "common.languageEnglish", flag: "🇬🇧" },
	{ code: "sw", nameKey: "common.languageSwahili", flag: "🇰🇪" },
	{ code: "am", nameKey: "common.languageAmharic", flag: "🇪🇹" },
];

interface PersistedVideoSettings {
	playbackSpeed?: unknown;
	showSubtitles?: unknown;
	subtitleLanguage?: unknown;
}

interface VideoSettingsState {
	playbackSpeed: number;
	showSubtitles: boolean;
	subtitleLanguage: string;
	isLoaded: boolean;

	loadSettings: () => Promise<void>;
	setPlaybackSpeed: (speed: number) => void;
	setSubtitleLanguage: (lang: string) => void;
	toggleSubtitles: () => void;
}

/**
 * Save settings to AsyncStorage with debouncing
 */
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

const saveToStorage = (data: {
	playbackSpeed: number;
	showSubtitles: boolean;
	subtitleLanguage: string;
}): void => {
	if (saveTimeout) clearTimeout(saveTimeout);

	saveTimeout = setTimeout(async () => {
		try {
			await AsyncStorage.setItem(VIDEO_SETTINGS_KEY, JSON.stringify(data));
		} catch (error) {
			console.error("Error saving video settings:", error);
		}
	}, 500);
};

const getSettingsSnapshot = (state: VideoSettingsState) => ({
	playbackSpeed: state.playbackSpeed,
	showSubtitles: state.showSubtitles,
	subtitleLanguage: state.subtitleLanguage,
});

export const useVideoSettingsStore = create<VideoSettingsState>((set, get) => ({
	playbackSpeed: 1,
	showSubtitles: false,
	subtitleLanguage: "en",
	isLoaded: false,

	loadSettings: async () => {
		try {
			const json = await AsyncStorage.getItem(VIDEO_SETTINGS_KEY);
			if (json) {
				const parsed: PersistedVideoSettings = JSON.parse(json);
				set({
					playbackSpeed:
						typeof parsed.playbackSpeed === "number" &&
						PLAYBACK_SPEEDS.includes(parsed.playbackSpeed)
							? parsed.playbackSpeed
							: 1,
					showSubtitles:
						typeof parsed.showSubtitles === "boolean"
							? parsed.showSubtitles
							: false,
					subtitleLanguage:
						typeof parsed.subtitleLanguage === "string" &&
						SUBTITLE_LANGUAGES.some((l) => l.code === parsed.subtitleLanguage)
							? parsed.subtitleLanguage
							: "en",
					isLoaded: true,
				});
			} else {
				set({ isLoaded: true });
			}
		} catch (error) {
			console.error("Error loading video settings:", error);
			set({ isLoaded: true });
		}
	},

	setPlaybackSpeed: (speed) => {
		set({ playbackSpeed: speed });
		saveToStorage(getSettingsSnapshot(get()));
	},

	setSubtitleLanguage: (lang) => {
		set({ subtitleLanguage: lang });
		saveToStorage(getSettingsSnapshot(get()));
	},

	toggleSubtitles: () => {
		set((state) => ({ showSubtitles: !state.showSubtitles }));
		saveToStorage(getSettingsSnapshot(get()));
	},
}));

export const initializeVideoSettings = async () => {
	await useVideoSettingsStore.getState().loadSettings();
};
