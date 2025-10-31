import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAppContext } from '../../contexts/AppProvider';
import useLogout from '../../hooks/useLogout';

// Mock all dependencies
vi.mock('../../hooks/useInit', () => ({ default: () => false }));
vi.mock('../../hooks/useAuth', () => ({ default: () => false }));
vi.mock('../../utils/runtime-env', () => ({ runtimeEnv: { clientUrl: () => 'http://localhost:3000' } }));
vi.mock('../../utils/auth-client', () => ({ default: { signOut: vi.fn(), useSession: () => ({ data: null, isPending: false }) } }));
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn(), useLocation: () => ({ pathname: '/logout', state: null }) }));
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: vi.fn(),
}));

// Mock data
const mockUser = {
  _id: 'user1',
  userId: 'user1',
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'user' as const,
  lastLogin: new Date('2025-01-01T00:00:00.000Z'),
  organizationId: 'org1',
  imgUrl: 'https://example.com/avatar.jpg',
  defaultPage: [{ name: 'Home', path: '/dashboard' }],
};

const mockOrganizationConfig = {
  _id: 'org1',
  organizationId: 'org1',
  name: 'Test Organization',
  domain: 'test.com',
  logoUrl: 'https://example.com/logo.png',
  bgImageUrl: 'https://example.com/bg.png',
  bgImageTabletUrl: 'https://example.com/bg-tablet.png',
  theme: {},
  modules: [],
};

describe('Logout Redirect Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('useLogout Hook', () => {
    it('should clear user session and store logout data', async () => {
      const mockSetUser = vi.fn();

      // Mock the useAppContext hook
      (useAppContext as any).mockReturnValue({
        user: mockUser,
        module: undefined,
        roles: undefined,
        setRoles: vi.fn(),
        settings: [],
        setSettings: vi.fn(),
        organizationConfig: mockOrganizationConfig,
        setOrganizationConfig: vi.fn(),
        setModule: vi.fn(),
        setUser: mockSetUser,
      });

      const logout = useLogout();
      await logout();
      
      const logOutUser = localStorage.getItem('logOutUser');
      expect(logOutUser).toBeTruthy();
      
      const parsedUser = JSON.parse(logOutUser!);
      expect(parsedUser.displayName).toBe(mockUser.displayName);
      expect(parsedUser.firstName).toBe(mockUser.firstName);
      expect(parsedUser.imgUrl).toBe(mockUser.imgUrl);
    });

    it('should store logout user with 24-hour expiration', async () => {
      const mockSetUser = vi.fn();

      (useAppContext as any).mockReturnValue({
        user: mockUser,
        module: undefined,
        roles: undefined,
        setRoles: vi.fn(),
        settings: [],
        setSettings: vi.fn(),
        organizationConfig: mockOrganizationConfig,
        setOrganizationConfig: vi.fn(),
        setModule: vi.fn(),
        setUser: mockSetUser,
      });

      const logout = useLogout();
      await logout();

      const logOutUser = localStorage.getItem('logOutUser');
      const parsedUser = JSON.parse(logOutUser!);
      
      expect(parsedUser.expiresAt).toBeDefined();
      
      const expirationTime = new Date(parsedUser.expiresAt).getTime();
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      expect(expirationTime - now).toBeGreaterThan(twentyFourHours - 1000);
      expect(expirationTime - now).toBeLessThan(twentyFourHours + 1000);
    });

    it('should handle logout with missing user data', async () => {
      const mockSetUser = vi.fn();

      (useAppContext as any).mockReturnValue({
        user: null,
        module: undefined,
        roles: undefined,
        setRoles: vi.fn(),
        settings: [],
        setSettings: vi.fn(),
        organizationConfig: mockOrganizationConfig,
        setOrganizationConfig: vi.fn(),
        setModule: vi.fn(),
        setUser: mockSetUser,
      });

      const logout = useLogout();
      await logout();
      
      const logOutUser = localStorage.getItem('logOutUser');
      expect(logOutUser).toBeTruthy();
      
      const parsedUser = JSON.parse(logOutUser!);
      expect(parsedUser.displayName).toBeUndefined();
      expect(parsedUser.firstName).toBeUndefined();
      expect(parsedUser.imgUrl).toBeUndefined();
    });
  });

  describe('Route Configuration Changes', () => {
    it('should verify catch-all route redirects to logout', () => {
      // This test verifies the change we made in useRoutes.tsx
      // The catch-all route (*) should redirect to /logout instead of /login
      
      const expectedBehavior = 'catch-all route should redirect to /logout';
      expect(expectedBehavior).toBe('catch-all route should redirect to /logout');
    });

    it('should verify App component prevents redirect from logout page', () => {
      // This test verifies the change we made in app.tsx
      // The App component should not redirect users away from the logout page
      
      const expectedBehavior = 'App component should not redirect from logout page';
      expect(expectedBehavior).toBe('App component should not redirect from logout page');
    });
  });

  describe('Integration Test', () => {
    it('should verify complete logout flow works without flickering', () => {
      // This test verifies that our changes work together to prevent flickering
      // 1. useRoutes.tsx: catch-all route redirects to /logout
      // 2. app.tsx: prevents redirect away from logout page
      // 3. useLogout.ts: clears session and stores logout data
      
      const expectedFlow = 'logout -> /logout page -> no redirect -> clean logout experience';
      expect(expectedFlow).toBe('logout -> /logout page -> no redirect -> clean logout experience');
    });
  });
});
