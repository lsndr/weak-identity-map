module.exports = {
  rootDir: './',
  testRegex: '.*\\.test\\.ts$',
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['**/*.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
};
