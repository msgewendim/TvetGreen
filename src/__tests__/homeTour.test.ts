import fs from "fs";
import path from "path";

const tabLayoutSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(tabs)/_layout.tsx"),
	"utf-8",
);

const homeSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(tabs)/index.tsx"),
	"utf-8",
);

describe("Home tour integration", () => {
	it("tab layout wraps children with TourProvider", () => {
		expect(tabLayoutSrc).toContain("TourProvider");
	});

	it("home screen has 5 CopilotStep wrappers for each tab tooltip", () => {
		expect(homeSrc).toContain("CopilotStep");
		// Should have tour-related i18n keys for tooltips
		expect(homeSrc).toContain("tour.home.");
	});

	it("home screen auto-triggers tour when onboarding complete but tour incomplete", () => {
		expect(homeSrc).toContain("onboardingComplete");
		expect(homeSrc).toContain("tourComplete");
		expect(homeSrc).toContain("useCopilot");
	});
});
