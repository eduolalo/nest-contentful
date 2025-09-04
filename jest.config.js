module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
  moduleNameMapper: {
    '@database/(.*)': '<rootDir>/../src/database/$1',
    '@modules/(.*)': '<rootDir>/../src/modules/$1',
    '@config/(.*)': '<rootDir>/../src/config/$1',
    '@mocks/(.*)': '<rootDir>/../test/__mocks__/$1',
  },
};
