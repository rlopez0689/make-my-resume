const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  automock: false,
  setupFiles: ["./setupJest.js"],
};

module.exports = createJestConfig(customJestConfig);
