import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next-international
jest.mock('next-international/client', () => ({
  useI18n: jest.fn(() => ({
    t: (key) => key,
    locale: 'en',
  })),
  useChangeLocale: jest.fn(() => jest.fn()),
  useCurrentLocale: jest.fn(() => 'en'),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NODE_ENV = 'test';