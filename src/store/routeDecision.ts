export type RouteDestination =
	| "/onboarding/language"
	| "/(auth)/phone"
	| "/onboarding/welcome"
	| "/(tabs)";

interface RouteParams {
	hasLanguage: boolean;
	isAuthenticated: boolean;
	onboardingComplete: boolean;
}

export function getRouteDestination(params: RouteParams): RouteDestination {
	if (!params.hasLanguage) {
		return "/onboarding/language";
	}
	if (!params.isAuthenticated) {
		return "/(auth)/phone";
	}
	if (!params.onboardingComplete) {
		return "/onboarding/welcome";
	}
	return "/(tabs)";
}
