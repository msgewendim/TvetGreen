import fs from "fs";
import path from "path";

const welcomeSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/onboarding/welcome.tsx"),
	"utf-8",
);

describe("Welcome carousel", () => {
	it("has 3 slides about learning, offline, and progress — no voice slide", () => {
		expect(welcomeSrc).toContain('"slide1"');
		expect(welcomeSrc).toContain('"slide2"');
		expect(welcomeSrc).toContain('"slide3"');
		expect(welcomeSrc).not.toContain('"slide4"');
		expect(welcomeSrc).toContain("onboarding.welcome.");
		expect(welcomeSrc).not.toContain("Voice-Guided");
		expect(welcomeSrc).not.toContain("voiceDescription");
		expect(welcomeSrc).not.toContain("audioEnabled");
	});

	it("navigates to ONBOARDING_COMPLETE, not TABS or ONBOARDING_LANGUAGE", () => {
		expect(welcomeSrc).toContain("ROUTES.ONBOARDING_COMPLETE");
		expect(welcomeSrc).not.toContain("ROUTES.TABS");
		expect(welcomeSrc).not.toContain("ROUTES.ONBOARDING_LANGUAGE");
	});
});

const completeSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/onboarding/complete.tsx"),
	"utf-8",
);

describe("Completion screen", () => {
	it("calls completeOnboarding and navigates to TABS", () => {
		expect(completeSrc).toContain("completeOnboarding");
		expect(completeSrc).toContain("ROUTES.TABS");
	});

	it("auto-transitions with a timeout (no button required)", () => {
		expect(completeSrc).toContain("setTimeout");
	});
});
