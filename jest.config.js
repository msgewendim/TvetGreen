const { getWebPreset } = require('jest-expo/config/getPlatformPreset');

const preset = getWebPreset();

// Ensure @/design-system resolves before the generic @/* pattern
const { '^@/(.*)$': genericAlias, ...restMappers } = preset.moduleNameMapper || {};

module.exports = {
  ...preset,
  moduleNameMapper: {
    // Specific aliases first
    '^@/design-system$': '<rootDir>/src/design-system',
    '^@/design-system/(.*)$': '<rootDir>/src/design-system/$1',
    // Other mappers from preset (excluding the generic @/* which goes last)
    ...restMappers,
    // Generic alias last
    ...(genericAlias ? { '^@/(.*)$': genericAlias } : {}),
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/e2e/**/*.spec.{ts,tsx}',
  ],
};
