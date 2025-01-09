/** @type {import('jest').Config} */
export default {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
