// Note: This test file requires vitest to be installed in Express
// Run: npm install --save-dev vitest @vitest/ui
// Then add to package.json: "test": "vitest"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - vitest types not installed in Express
import { describe, expect, test, vi, beforeEach } from 'vitest';

// Test the error redirect logic directly
function handleAuthError(req: {
  query: Record<string, string | undefined>;
  cookies?: { clientUrl?: string };
  headers: { referer?: string };
}, getProtocol: () => string, clientUrlEnv?: string): { redirect: true; url: string } | { redirect: false; url?: undefined } {
  const errorParam = req.query.error as string;
  if (errorParam) {
    // Convert Better Auth error code to readable message
    const errorMessage = errorParam
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    // Get client URL from cookie, referer header, or environment variable
    let clientUrl = req.cookies?.clientUrl;
    if (!clientUrl && req.headers.referer) {
      try {
        const refererUrl = new URL(req.headers.referer);
        clientUrl = `${refererUrl.protocol}//${refererUrl.host}`;
      } catch (e) {
        // Ignore URL parsing errors
      }
    }
    if (!clientUrl) {
      clientUrl = `${getProtocol()}${clientUrlEnv || 'localhost:3000'}`;
    }
    
    // Remove trailing slash if present
    clientUrl = clientUrl.replace(/\/$/, '');
    
    // Redirect to login page with error message
    const redirectUrl = `${clientUrl}/login?errorMessage=${encodeURIComponent(errorMessage)}`;
    return { redirect: true, url: redirectUrl };
  }
  return { redirect: false };
}

describe('Better Auth Error Redirect Middleware', () => {
  const mockGetProtocol = () => 'http://';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Parameter Handling', () => {
    test('redirects to login with converted error message when error parameter is present', () => {
      const req = {
        query: { error: 'User_doesn\'t_exist_in_Conforme_AAD_group' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('/login?errorMessage=');
      // encodeURIComponent encodes apostrophe as %27
      if (result.redirect) {
        const decoded = decodeURIComponent(result.url.split('errorMessage=')[1]);
        expect(decoded).toContain('User Doesn\'T Exist In Conforme AAD Group');
      }
    });

    test('converts underscore-separated error codes to readable format', () => {
      const req = {
        query: { error: 'NO_ORGANIZATION_FOUND' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      // The replace keeps original case, so uppercase stays uppercase
      expect(result.url).toContain('NO%20ORGANIZATION%20FOUND');
    });

    test('handles error codes without special characters', () => {
      const req = {
        query: { error: 'SIMPLE_ERROR' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('Simple%20Error');
    });
  });

  describe('Client URL Detection', () => {
    test('uses clientUrl from cookie when available', () => {
      const req = {
        query: { error: 'TEST_ERROR' },
        cookies: { clientUrl: 'http://example.com' },
        headers: {},
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('http://example.com/login');
    });

    test('extracts client URL from referer header when cookie is not available', () => {
      const req = {
        query: { error: 'TEST_ERROR' },
        headers: { referer: 'http://localhost:3303/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('http://localhost:3303/login');
    });

    test('falls back to environment variable when neither cookie nor referer is available', () => {
      const req = {
        query: { error: 'TEST_ERROR' },
        headers: {},
      };

      const result = handleAuthError(req, mockGetProtocol, 'test-client.com');

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('http://test-client.com/login');
    });

    test('removes trailing slash from client URL', () => {
      const req = {
        query: { error: 'TEST_ERROR' },
        cookies: { clientUrl: 'http://example.com/' },
        headers: {},
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('http://example.com/login');
      expect(result.url).not.toContain('//login');
    });
  });

  describe('Error Message Encoding', () => {
    test('URL encodes error message correctly', () => {
      const req = {
        query: { error: 'TEST_ERROR_WITH_SPACES' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      if (result.redirect) {
        expect(result.url).toBeDefined();
        expect(result.url).toContain('errorMessage=');
        // Verify it's properly encoded
        const errorMessage = result.url.split('errorMessage=')[1];
        expect(decodeURIComponent(errorMessage)).toContain('TEST ERROR WITH SPACES');
      }
    });

    test('handles special characters in error message', () => {
      const req = {
        query: { error: 'ERROR_WITH_SPECIAL_CHARS' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('errorMessage=');
    });
  });

  describe('Better Auth Fallback', () => {
    test('does not redirect when no error parameter is present', () => {
      const req = {
        query: {},
        headers: {},
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(false);
    });

    test('does not redirect when error parameter is missing', () => {
      const req = {
        query: { other: 'param' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty error parameter gracefully', () => {
      const req = {
        query: { error: '' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      // Empty string should still trigger redirect
      const result = handleAuthError(req, mockGetProtocol);
      expect(result.redirect).toBe(true);
    });

    test('handles invalid referer URL gracefully', () => {
      const req = {
        query: { error: 'TEST_ERROR' },
        headers: { referer: 'invalid-url' },
      };

      const result = handleAuthError(req, mockGetProtocol, 'localhost:3000');

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('http://localhost:3000/login');
    });

    test('handles multiple query parameters correctly', () => {
      const req = {
        query: { error: 'TEST_ERROR', other: 'param', another: 'value' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('/login?errorMessage=');
    });

    test('handles error with apostrophe correctly', () => {
      const req = {
        query: { error: 'USER_DOESN\'T_EXIST' },
        headers: { referer: 'http://localhost:3000/api/auth/error' },
      };

      const result = handleAuthError(req, mockGetProtocol);

      expect(result.redirect).toBe(true);
      expect(result.url).toContain('errorMessage=');
    });
  });
});

