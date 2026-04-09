/**
 * Centralized AsyncStorage keys.
 * All stores and services must import keys from here.
 */
export const STORAGE_KEYS = {
	// Learning progress
	LESSON_PROGRESS: "@lesson_progress",

	// Downloads
	DOWNLOADED_LESSONS: "@downloaded_lessons",

	// Language
	LANGUAGE: "@tvetgreen_language",

	// Onboarding
	LANGUAGE_CHOSEN: "@tvetgreen_language_chosen",
	ONBOARDING_COMPLETE: "@onboarding_complete",
	TOUR_COMPLETE: "@tour_complete",

	// Feature flags
	FEATURE_FLAGS: "@feature_flags",

	// Sync
	SYNC_QUEUE: "@sync_queue",
	LAST_SYNC: "@last_sync",
} as const;
