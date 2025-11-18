import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import type { SupportedLanguage } from "../i18n.config";
import { LANGUAGE_INFO, SUPPORTED_LANGUAGES } from "../i18n.config";

/**
 * Custom hook for language management
 * Provides easy access to current language, translation function, and language switching
 */
export function useLanguage() {
	const { t, i18n } = useTranslation();

	const currentLanguage = i18n.language as SupportedLanguage;

	/**
	 * Change the app language
	 * @param language - The language code to switch to
	 */
	const changeLanguage = useCallback(
		async (language: SupportedLanguage) => {
			try {
				await i18n.changeLanguage(language);
			} catch (error) {
				console.error("Error changing language:", error);
			}
		},
		[i18n],
	);

	/**
	 * Get information about a specific language
	 * @param language - The language code (defaults to current language)
	 */
	const getLanguageInfo = useCallback(
		(language?: SupportedLanguage) => {
			const lang = language || currentLanguage;
			return LANGUAGE_INFO[lang];
		},
		[currentLanguage],
	);

	/**
	 * Get all supported languages with their metadata
	 */
	const getAllLanguages = useCallback(() => {
		return SUPPORTED_LANGUAGES.map((lang) => LANGUAGE_INFO[lang]);
	}, []);

	/**
	 * Check if a language is currently active
	 * @param language - The language code to check
	 */
	const isLanguageActive = useCallback(
		(language: SupportedLanguage) => {
			return currentLanguage === language;
		},
		[currentLanguage],
	);

	return {
		// Translation function
		t,
		// Current language code
		currentLanguage,
		// Current language info (name, nativeName, flag)
		languageInfo: getLanguageInfo(),
		// All supported languages
		supportedLanguages: getAllLanguages(),
		// Change language function
		changeLanguage,
		// Get info for a specific language
		getLanguageInfo,
		// Check if language is active
		isLanguageActive,
		// i18n instance (for advanced usage)
		i18n,
	};
}
