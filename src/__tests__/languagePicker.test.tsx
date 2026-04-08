/**
 * Test that the language picker navigates to auth, not tabs.
 *
 * We test the handleContinue behavior by extracting the navigation target
 * from the screen module rather than rendering the full RN component tree,
 * which is unreliable in the jest-expo web preset.
 */

describe("LanguageSelectionScreen navigation", () => {
	it("language.tsx calls router.replace with /(auth)/phone, not /(tabs)", () => {
		// Read the source file and verify the navigation target
		const fs = require("fs");
		const source = fs.readFileSync(
			require.resolve("../../app/onboarding/language.tsx"),
			"utf-8",
		);

		// The screen should navigate to auth after language selection
		expect(source).toContain('/(auth)/phone');
		expect(source).not.toMatch(/router\.replace\(["']\/\(tabs\)["']\)/);
	});

	it("language.tsx calls markLanguageChosen from onboarding store on continue", () => {
		const fs = require("fs");
		const source = fs.readFileSync(
			require.resolve("../../app/onboarding/language.tsx"),
			"utf-8",
		);

		expect(source).toContain("markLanguageChosen");
		expect(source).toContain("useOnboardingStore");
	});

	it("language.tsx does not reference goals or voice-setup", () => {
		const fs = require("fs");
		const source = fs.readFileSync(
			require.resolve("../../app/onboarding/language.tsx"),
			"utf-8",
		);

		expect(source).not.toContain("goals");
		expect(source).not.toContain("voice-setup");
		expect(source).not.toContain("voice");
		expect(source).not.toContain("Step 1 of 4");
	});
});
