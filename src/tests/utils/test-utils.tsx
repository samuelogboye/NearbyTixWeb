import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Custom render with router wrapper
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

export function renderWithRouter(
  ui: ReactElement,
  { initialRoute = '/', ...renderOptions }: CustomRenderOptions = {}
) {
  window.history.pushState({}, 'Test page', initialRoute);

  function Wrapper({ children }: { children: ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mock localStorage
 */
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
})();

/**
 * Mock geolocation API
 */
export const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

/**
 * Setup global mocks
 */
export function setupGlobalMocks() {
  // Mock localStorage only if not in browser environment
  if (typeof window !== 'undefined' && !window.localStorage) {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  }

  // Mock geolocation only if not available
  if (typeof navigator !== 'undefined' && !navigator.geolocation) {
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });
  }

  // Mock window.location only if needed
  if (typeof window !== 'undefined' && !window.location.href) {
    delete (window as { location?: unknown }).location;
    window.location = {
      href: '',
      pathname: '/',
      search: '',
      hash: '',
    } as Location;
  }
}

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create mock file
 */
export function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const blob = new Blob(['a'.repeat(size)], { type });
  return new File([blob], name, { type });
}

/**
 * Suppress console errors in tests
 */
export function suppressConsoleError() {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
}
