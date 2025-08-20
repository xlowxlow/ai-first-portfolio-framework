// Global test setup
global.console = {
  ...console,
  // Suppress console.log during tests unless VERBOSE_TESTS is set
  log: process.env.VERBOSE_TESTS ? console.log : jest.fn(),
  debug: process.env.VERBOSE_TESTS ? console.debug : jest.fn(),
  info: process.env.VERBOSE_TESTS ? console.info : jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Mock external dependencies that require network access
jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));