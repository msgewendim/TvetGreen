import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/src/utils/storageKeys";

// Import translation files
import en from "./locales/en/translation.json";
import sw from "./locales/sw/translation.json";
import am from "./locales/am/translation.json";

// Supported languages
export const SUPPORTED_LANGUAGES = ["en", "sw", "am"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Language metadata for display
export const LANGUAGE_INFO = {
	en: {
		code: "en",
		name: "English",
		nativeName: "English",
		flag: "🇬🇧",
	},
	sw: {
		code: "sw",
		name: "Swahili",
		nativeName: "Kiswahili",
		flag: "🇰🇪",
	},
	am: {
		code: "am",
		name: "Amharic",
		nativeName: "አማርኛ",
		flag: "🇪🇹",
	},
} as const;

/**
 * Language detector that checks AsyncStorage first, then device locale
 */
const languageDetector = {
	type: "languageDetector" as const,
	async: true,
	detect: async (callback: (lang: string) => void) => {
		try {
			// Try to get saved language from storage
			const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);

			if (
				savedLanguage &&
				SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)
			) {
				return callback(savedLanguage);
			}

			// Fall back to device language
			const deviceLocale = Localization.getLocales()[0];
			const deviceLanguage = deviceLocale?.languageCode || "en";

			// Check if device language is supported
			if (SUPPORTED_LANGUAGES.includes(deviceLanguage as SupportedLanguage)) {
				return callback(deviceLanguage);
			}

			// Default to English
			return callback("en");
		} catch (error) {
			console.error("Error detecting language:", error);
			return callback("en");
		}
	},
	init: () => {},
	cacheUserLanguage: async (language: string) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
		} catch (error) {
			console.error("Error saving language preference:", error);
		}
	},
};

// Translation resources
const resources = {
	en: { translation: en },
	sw: { translation: sw },
	am: { translation: am },
};

// Initialize i18next
i18n
	.use(languageDetector as any)
	.use(initReactI18next)
	.init({
		compatibilityJSON: "v4", // Important for React Native
		resources,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false, // React already escapes values
		},
		react: {
			useSuspense: false, // Important for React Native
		},
		// Support for pluralization
		pluralSeparator: "_",
		// Context separator for variations
		contextSeparator: "_",
	});

export default i18n;
