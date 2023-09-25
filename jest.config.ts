import type { Config } from 'jest';

const config: Config = {
  bail: 1,
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;
