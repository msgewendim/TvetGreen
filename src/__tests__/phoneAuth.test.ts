import fs from "fs";
import path from "path";

const phoneSrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(auth)/phone.tsx"),
	"utf-8",
);

const verifySrc = fs.readFileSync(
	path.resolve(__dirname, "../../app/(auth)/verify.tsx"),
	"utf-8",
);

describe("Phone screen", () => {
	it("defaults to Ethiopia (ET), not Uganda (UG)", () => {
		expect(phoneSrc).toContain('defaultCountry="ET"');
		expect(phoneSrc).not.toContain('defaultCountry="UG"');
	});

	it("uses t() for all user-facing text — no hardcoded English strings", () => {
		expect(phoneSrc).not.toContain('"Welcome to TvetGreen"');
		expect(phoneSrc).not.toContain('"Enter your phone number to get started"');
		expect(phoneSrc).not.toContain('"Send Verification Code"');
		expect(phoneSrc).not.toContain('"We\'ll send you a one-time verification code via SMS."');
		expect(phoneSrc).not.toContain('"Invalid Number"');
		expect(phoneSrc).toContain("t(");
	});
});

describe("Verify screen", () => {
	it("uses t() for all user-facing text — no hardcoded English strings", () => {
		expect(verifySrc).not.toContain('"Verify Your Number"');
		expect(verifySrc).not.toContain('"Enter the 6-digit code sent to"');
		expect(verifySrc).not.toContain('"Verify"');
		expect(verifySrc).not.toContain('"Resend Code"');
		expect(verifySrc).not.toContain('"Invalid Code"');
		expect(verifySrc).not.toContain('"Verification Failed"');
		expect(verifySrc).not.toContain('"Code Sent"');
		expect(verifySrc).toContain("t(");
	});

	it("shows WhatsApp support link after 2 failed resend attempts", () => {
		// The verify screen should track resend attempts and show fallback
		expect(verifySrc).toContain("resendAttempts");
		expect(verifySrc).toContain("whatsapp");
	});

	it("navigates to /onboarding/welcome after successful verify, not /(tabs)", () => {
		expect(verifySrc).toContain("/onboarding/welcome");
		expect(verifySrc).not.toMatch(/router\.replace\(["']\/\(tabs\)["']\)/);
	});
});
