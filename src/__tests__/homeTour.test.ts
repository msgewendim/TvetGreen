import fs from "fs";
import path from "path";

const homeSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(tabs)/(home)/index.tsx"),
	"utf-8",
);

describe("Home tour integration", () => {
	it("home screen imports CopilotStep from react-native-copilot", () => {
		expect(homeSrc).toContain("CopilotStep");
	});

	it("home screen has tour.home i18n keys for step tooltips", () => {
		expect(homeSrc).toContain("tour.home.");
	});

	it("home screen uses useTour hook for auto-triggering", () => {
		expect(homeSrc).toContain("useTour");
		expect(homeSrc).toContain("startTour");
	});

	it("home screen checks onboarding/tour state to auto-trigger tour", () => {
		expect(homeSrc).toContain("useOnboardingStore");
		expect(homeSrc).toContain("tourComplete");
		expect(homeSrc).toContain("onboardingComplete");
	});

	it("wraps continue-learning section with CopilotStep", () => {
		expect(homeSrc).toContain("tour.home.continueLearning");
	});

	it("wraps courses list section with CopilotStep", () => {
		expect(homeSrc).toContain("tour.home.browse");
	});
});
