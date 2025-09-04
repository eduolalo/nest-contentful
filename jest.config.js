module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(spec|integration\\.test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(@faker-js/faker)/)'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts}',
    '!**/*.d.ts',
    '!**/.eslintrc.js',
    '!**/node_modules/**',
    '!<rootDir>/**/*types.ts',
    '!<rootDir>/*.config.js',
    '!<rootDir>/*.setup.js',
    '!<rootDir>/coverage/**',
    '!<rootDir>/docs/**',
    '!<rootDir>/test/**',
    '!<rootDir>/dist/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
  moduleNameMapper: {
    '@factories/(.*)': '<rootDir>/../src/database/factories/$1',
    '@database/(.*)': '<rootDir>/../src/database/$1',
    '@mocks/(.*)': '<rootDir>/../test/__mocks__/$1',
    '@modules/(.*)': '<rootDir>/../src/modules/$1',
    '@config/(.*)': '<rootDir>/../src/config/$1',
  },
};
