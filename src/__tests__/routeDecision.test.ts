import { getRouteDestination } from "@/src/store/routeDecision";
import { ROUTES } from "@/src/utils/appRoutes";

describe("getRouteDestination", () => {
	it("routes to language picker when no language is set", () => {
		const route = getRouteDestination({
			hasLanguage: false,
			isAuthenticated: false,
			onboardingComplete: false,
		});

		expect(route).toBe(ROUTES.ONBOARDING_LANGUAGE);
	});

	it("routes to auth when language is set but user is not authenticated", () => {
		const route = getRouteDestination({
			hasLanguage: true,
			isAuthenticated: false,
			onboardingComplete: false,
		});

		expect(route).toBe(ROUTES.AUTH_PHONE);
	});

	it("routes to welcome when authenticated but onboarding is incomplete", () => {
		const route = getRouteDestination({
			hasLanguage: true,
			isAuthenticated: true,
			onboardingComplete: false,
		});

		expect(route).toBe(ROUTES.ONBOARDING_WELCOME);
	});

	it("routes to tabs when authenticated and onboarding is complete", () => {
		const route = getRouteDestination({
			hasLanguage: true,
			isAuthenticated: true,
			onboardingComplete: true,
		});

		expect(route).toBe(ROUTES.TABS);
	});

	it("language check takes priority over auth check", () => {
		const route = getRouteDestination({
			hasLanguage: false,
			isAuthenticated: true,
			onboardingComplete: false,
		});

		expect(route).toBe(ROUTES.ONBOARDING_LANGUAGE);
	});
});
