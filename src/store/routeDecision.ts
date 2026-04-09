import { ROUTES } from "@/src/utils/appRoutes";

export type RouteDestination =
	| typeof ROUTES.ONBOARDING_LANGUAGE
	| typeof ROUTES.AUTH_PHONE
	| typeof ROUTES.ONBOARDING_WELCOME
	| typeof ROUTES.TABS;

interface RouteParams {
	hasLanguage: boolean;
	isAuthenticated: boolean;
	onboardingComplete: boolean;
}

export function getRouteDestination(params: RouteParams): RouteDestination {
	if (!params.hasLanguage) {
		return ROUTES.ONBOARDING_LANGUAGE;
	}
	if (!params.isAuthenticated) {
		return ROUTES.AUTH_PHONE;
	}
	if (!params.onboardingComplete) {
		return ROUTES.ONBOARDING_WELCOME;
	}
	return ROUTES.TABS;
}
