// Jest setup file for CreativityCoder Platform

// Polyfill for Request/Response (required for Next.js 13+ API routes)
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Setup testing library
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "error";

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is deprecated")
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("componentWillReceiveProps") ||
        args[0].includes("componentWillMount"))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
});

// Setup global test utilities
global.testUtils = {
  // Mock API responses
  mockApiResponse: (data, status = 200) => {
    fetch.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
    });
  },

  // Mock API error
  mockApiError: (message = "API Error", status = 500) => {
    fetch.mockRejectedValueOnce(new Error(message));
  },

  // Wait for async operations
  waitFor: (callback, options = {}) => {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 1000;
      const interval = options.interval || 50;
      let attempts = 0;
      const maxAttempts = timeout / interval;

      const check = () => {
        attempts++;
        try {
          const result = callback();
          if (result) {
            resolve(result);
          } else if (attempts >= maxAttempts) {
            reject(new Error("Timeout waiting for condition"));
          } else {
            setTimeout(check, interval);
          }
        } catch (error) {
          if (attempts >= maxAttempts) {
            reject(error);
          } else {
            setTimeout(check, interval);
          }
        }
      };

      check();
    });
  },
};
