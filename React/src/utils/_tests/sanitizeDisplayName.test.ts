import { describe, expect, test } from 'vitest';

import sanitizeDisplayName from '../sanitizeDisplayName';

describe('sanitizeDisplayName utility', () => {
  // Test data arrays to eliminate duplication
  const parenthesesTestCases = [
    ['John Doe (Manager)', 'John Doe Manager'],
    ['Jane Smith (Admin)', 'Jane Smith Admin'],
    ['(Manager) John Doe', 'Manager John Doe'],
  ];

  const specialCharsTestCases = [
    ['John@Doe#123', 'John Doe 123'],
    ['Jane$Smith&Co.', 'Jane Smith Co.'],
    ['Test!@#$%^&*()_+', 'Test'],
  ];

  const allowedCharsTestCases = [
    ["O'Connor-Smith", "O'Connor-Smith"],
    ['Jean-Pierre 123', 'Jean-Pierre 123'],
    ['Mary Jane Watson', 'Mary Jane Watson'],
  ];

  const unicodeTestCases = [
    ['José María', 'José María'],
    ['François', 'François'],
  ];

  const spaceCollapseTestCases = [
    ['John    Doe', 'John Doe'],
    ['  Jane   Smith  ', 'Jane Smith'],
    ['Test\t\n\rName', 'Test Name'],
  ];

  const trimTestCases = [
    ['  John Doe  ', 'John Doe'],
    ['\tJane Smith\n', 'Jane Smith'],
  ];

  const emptyStringTestCases = [
    ['', ''],
    ['   ', ''],
  ];

  const complexTestCases = [
    ["Dr. John O'Connor-Smith (MD) & Associates", "Dr. John O'Connor-Smith MD Associates"],
    ['José María (CEO) - Company Inc.', 'José María CEO - Company Inc.'],
    ['Test@#$%^&*()_+Name!@#', 'Test Name'],
  ];

  const emojiTestCases = [
    ['John 😀 Doe', 'John Doe'],
    ['Jane ★ Smith', 'Jane Smith'],
    ['Test → Name', 'Test Name'],
  ];

  const mixedCaseTestCases = [
    ['John123Doe', 'John123Doe'],
    ['Jane-Smith2', 'Jane-Smith2'],
    ['Test123 Name456', 'Test123 Name456'],
  ];

  // Parameterized tests to eliminate duplication
  test.each(parenthesesTestCases)('removes parentheses from "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(specialCharsTestCases)('removes special characters from "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(allowedCharsTestCases)('preserves allowed characters in "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(unicodeTestCases)('normalizes unicode characters in "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(spaceCollapseTestCases)('collapses spaces in "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(trimTestCases)('trims whitespace from "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test('handles null input', () => {
    expect(sanitizeDisplayName(null)).toBe('');
  });

  test.each(emptyStringTestCases)('handles empty string "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(complexTestCases)('handles complex real-world example "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(emojiTestCases)('removes emojis from "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });

  test.each(mixedCaseTestCases)('handles mixed case and numbers in "%s"', (input, expected) => {
    expect(sanitizeDisplayName(input)).toBe(expected);
  });
});
