const { getWebPreset } = require("jest-expo/config/getPlatformPreset");

module.exports = {
	...getWebPreset(),
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"app/**/*.{ts,tsx}",
		"hooks/**/*.{ts,tsx}",
		"!**/*.d.ts",
	],
	testMatch: ["**/__tests__/**/*.test.{ts,tsx}", "**/e2e/**/*.spec.{ts,tsx}"],
	moduleNameMapper: {
		"^@/design-system$": "<rootDir>/src/design-system",
		"^@/design-system/(.*)$": "<rootDir>/src/design-system/$1",
		"^@/(.*)$": "<rootDir>/$1",
	},
};
