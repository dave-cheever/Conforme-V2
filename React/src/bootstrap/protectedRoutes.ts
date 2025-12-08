/**
 * List of protected route patterns used to determine if a route should be considered
 * a valid protected route (and thus not redirect to overview on page refresh).
 * 
 * These patterns are checked using `location.pathname.includes()` to match routes.
 * Admin routes are handled separately as they always contain '/admin/' in the path.
 */

export const PROTECTED_ROUTE_PATTERNS = [
  '/dashboard',
  '/answers',
  '/audits/',
  '/tracker-item/',
  '/insights',
  '/actions',
  '/accidents',
  '/assets',
  '/licenses',
  '/mentions',
  '/help',
  '/components',
  '/notification-settings',
  '/privacy-policy',
  '/terms-and-conditions',
] as const;

/**
 * Checks if a given pathname matches any of the protected route patterns.
 * Admin routes (containing '/admin/') are always considered protected.
 * 
 * @param pathname - The pathname to check (e.g., '/tracker-items/dashboard')
 * @returns True if the pathname matches a protected route pattern
 */
export const isProtectedRoute = (pathname: string): boolean => {
  // Admin routes are always protected
  if (pathname.includes('/admin/')) {
    return true;
  }
  
  // Check against protected route patterns
  return PROTECTED_ROUTE_PATTERNS.some((pattern) => pathname.includes(pattern));
};

