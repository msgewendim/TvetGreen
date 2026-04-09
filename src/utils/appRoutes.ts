/**
 * Centralized route constants for the app.
 * All navigation should use these instead of hardcoded path strings.
 */

// Tab routes
export const ROUTES = {
	TABS: "/(tabs)" as const,
	HOME: "/(tabs)" as const,

	// Course routes (inside tabs)
	COURSE_DETAIL: (courseId: string) => `/course/${courseId}` as const,
	VIDEO_PLAYER: (courseId: string, lessonId: string) =>
		`/video/${courseId}/${lessonId}` as const,

	// Auth routes
	AUTH_PHONE: "/(auth)/phone" as const,
	AUTH_VERIFY: "/(auth)/verify" as const,

	// Onboarding routes
	ONBOARDING_LANGUAGE: "/onboarding/language" as const,
	ONBOARDING_WELCOME: "/onboarding/welcome" as const,
	ONBOARDING_COMPLETE: "/onboarding/complete" as const,
} as const;
