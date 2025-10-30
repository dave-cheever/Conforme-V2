// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock suneditor-react to prevent module import issues
vi.mock('suneditor-react', () => ({
  default: vi.fn(() => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'sun-editor-mock' }, 'SunEditor Mock');
  })
}));

// Polyfill matchMedia for Chakra UI hooks in JSDOM
if (!globalThis.matchMedia) {
  // @ts-ignore
  globalThis.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
