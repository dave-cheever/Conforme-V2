import { ChakraProvider } from '@chakra-ui/react';
import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useAuthErrorHandling } from '../auth-pages-common';

// Mock useToast
const mockToast = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

// Mock toastFailed config
vi.mock('../../bootstrap/config', () => ({
  toastFailed: {
    status: 'error',
    duration: 5000,
    isClosable: true,
  },
}));

// Test component that uses the hook
function TestComponent() {
  useAuthErrorHandling();
  return <div data-id="002930" data-testid="test-component">Test</div>;
}

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002800">{children}</ChakraProvider>;
}

describe('useAuthErrorHandling', () => {
  const originalLocation = window.location;
  const mockReplaceState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
    mockReplaceState.mockClear();
    
    // Mock history.replaceState
    window.history.replaceState = mockReplaceState;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Error Message Parameter Handling', () => {
    test('displays toast when errorMessage parameter is present', () => {
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=User%20doesn%27t%20exist%20in%20Conforme%20AAD%20group',
          href: 'http://localhost:3000/login?errorMessage=User%20doesn%27t%20exist%20in%20Conforme%20AAD%20group',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002931">
          <TestComponent data-id="002932" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: "Couldn't sign in",
        description: "User doesn't exist in Conforme AAD group",
      });
    });

    test('decodes URL-encoded error message correctly', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=Organization%27s%20licence%20has%20expired',
          href: 'http://localhost:3000/login?errorMessage=Organization%27s%20licence%20has%20expired',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002933">
          <TestComponent data-id="002934" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Organization's licence has expired",
        }),
      );
    });

    test('cleans up URL parameters after displaying toast', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=Test%20Error',
          href: 'http://localhost:3000/login?errorMessage=Test%20Error',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002935">
          <TestComponent data-id="002936" />
        </TestWrapper>,
      );

      expect(mockReplaceState).toHaveBeenCalled();
      const callArgs = mockReplaceState.mock.calls[0];
      expect(callArgs[2]).toContain('http://localhost:3000/login');
      expect(callArgs[2]).not.toContain('errorMessage');
    });
  });

  describe('Better Auth Error Format Handling', () => {
    test('converts Better Auth error code to readable message', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?error=User_doesn\'t_exist_in_Conforme_AAD_group',
          href: 'http://localhost:3000/login?error=User_doesn\'t_exist_in_Conforme_AAD_group',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002937">
          <TestComponent data-id="002938" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "User Doesn't Exist In Conforme AAD Group",
        }),
      );
    });

    test('handles error code with underscores correctly', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?error=NO_ORGANIZATION_FOUND',
          href: 'http://localhost:3000/login?error=NO_ORGANIZATION_FOUND',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002939">
          <TestComponent data-id="002940" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'NO ORGANIZATION FOUND',
        }),
      );
    });

    test('prioritizes errorMessage over error parameter', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=Custom%20Message&error=User_doesn\'t_exist',
          href: 'http://localhost:3000/login?errorMessage=Custom%20Message&error=User_doesn\'t_exist',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002941">
          <TestComponent data-id="002942" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Custom Message',
        }),
      );
    });

    test('cleans up both errorMessage and error parameters', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?error=TEST_ERROR&errorMessage=Test',
          href: 'http://localhost:3000/login?error=TEST_ERROR&errorMessage=Test',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002943">
          <TestComponent data-id="002944" />
        </TestWrapper>,
      );

      expect(mockReplaceState).toHaveBeenCalled();
      const callArgs = mockReplaceState.mock.calls[0];
      expect(callArgs[2]).not.toContain('error=');
      expect(callArgs[2]).not.toContain('errorMessage=');
    });
  });

  describe('Hook Return Value', () => {
    test('returns errorMessage when errorMessage parameter exists', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=Test%20Error',
          href: 'http://localhost:3000/login?errorMessage=Test%20Error',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002945">
          <TestComponent data-id="002946" />
        </TestWrapper>,
      );

      // The hook returns the errorMessage
      // We verify it's being used by checking toast was called
      expect(mockToast).toHaveBeenCalled();
    });

    test('returns converted error when only error parameter exists', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?error=TEST_ERROR_CODE',
          href: 'http://localhost:3000/login?error=TEST_ERROR_CODE',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002947">
          <TestComponent data-id="002948" />
        </TestWrapper>,
      );

      // Verify toast was called with converted error
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'TEST ERROR CODE',
        }),
      );
    });

    test('returns null when no error parameters exist', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '',
          href: 'http://localhost:3000/login',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002949">
          <TestComponent data-id="002950" />
        </TestWrapper>,
      );

      expect(mockToast).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty errorMessage parameter', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=',
          href: 'http://localhost:3000/login?errorMessage=',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002951">
          <TestComponent data-id="002952" />
        </TestWrapper>,
      );

      // Empty string is truthy in JavaScript, so toast should be called
      // But the hook checks `if (message)`, which treats empty string as falsy
      // So an empty errorMessage might not trigger the toast
      // This test verifies the actual behavior - empty string doesn't show toast
      expect(mockToast).not.toHaveBeenCalled();
    });

    test('handles special characters in error message', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?errorMessage=Error%20with%20%26%20ampersand%20%3D%20equals',
          href: 'http://localhost:3000/login?errorMessage=Error%20with%20%26%20ampersand%20%3D%20equals',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002953">
          <TestComponent data-id="002954" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Error with & ampersand = equals',
        }),
      );
    });

    test('handles multiple query parameters correctly', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?param1=value1&errorMessage=Error%20Message&param2=value2',
          href: 'http://localhost:3000/login?param1=value1&errorMessage=Error%20Message&param2=value2',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002955">
          <TestComponent data-id="002956" />
        </TestWrapper>,
      );

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Error Message',
        }),
      );
    });

    test('does not display toast when no error parameters are present', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '?other=param',
          href: 'http://localhost:3000/login?other=param',
        },
        writable: true,
      });
      
      render(
        <TestWrapper data-id="002957">
          <TestComponent data-id="002958" />
        </TestWrapper>,
      );

      expect(mockToast).not.toHaveBeenCalled();
    });
  });
});

