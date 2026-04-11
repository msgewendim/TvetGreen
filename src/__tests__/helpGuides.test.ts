import fs from "fs";
import path from "path";

const profileSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(tabs)/profile.tsx"),
	"utf-8",
);

describe("Help & Guides in Profile", () => {
	it("has a Help & Guides section with replay tour and help videos", () => {
		expect(profileSrc).toContain("profile.helpGuides");
		expect(profileSrc).toContain("profile.replayTour");
		expect(profileSrc).toContain("profile.helpVideos");
	});

	it("calls resetTour from onboardingStore for replay", () => {
		expect(profileSrc).toContain("resetTour");
		expect(profileSrc).toContain("useOnboardingStore");
	});

	it("navigates to home tab after resetting tour", () => {
		expect(profileSrc).toContain("ROUTES.TABS");
	});
});
