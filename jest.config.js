/** @type {import('jest').Config} */
export default {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  preset: 'ts-jest',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
