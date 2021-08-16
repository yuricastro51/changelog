module.exports = {
	displayName: 'root-tests',
	testMatch: ['<rootDir>/src/**/*.spec.ts'],
	testEnvironment: 'node',
	clearMocks: true,
	collectCoverageFrom: ['**/src/**/*.ts', '!**/src/main/**'],
	preset: 'ts-jest',
};
