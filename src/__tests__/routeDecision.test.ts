import { getRouteDestination } from "@/src/store/routeDecision";

describe("getRouteDestination", () => {
	it("routes to language picker when no language is set", () => {
		const route = getRouteDestination({
			hasLanguage: false,
			isAuthenticated: false,
			onboardingComplete: false,
		});

		expect(route).toBe("/onboarding/language");
	});

	it("routes to auth when language is set but user is not authenticated", () => {
		const route = getRouteDestination({
			hasLanguage: true,
			isAuthenticated: false,
			onboardingComplete: false,
		});

		expect(route).toBe("/(auth)/phone");
	});

	it("routes to welcome when authenticated but onboarding is incomplete", () => {
		const route = getRouteDestination({
			hasLanguage: true,
			isAuthenticated: true,
			onboardingComplete: false,
		});

		expect(route).toBe("/onboarding/welcome");
	});

	it("routes to tabs when authenticated and onboarding is complete", () => {
		const route = getRouteDestination({
			hasLanguage: true,
			isAuthenticated: true,
			onboardingComplete: true,
		});

		expect(route).toBe("/(tabs)");
	});

	it("language check takes priority over auth check", () => {
		// Even if somehow authenticated without language, go to language first
		const route = getRouteDestination({
			hasLanguage: false,
			isAuthenticated: true,
			onboardingComplete: false,
		});

		expect(route).toBe("/onboarding/language");
	});
});
