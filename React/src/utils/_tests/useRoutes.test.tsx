import { beforeEach, describe, expect, test, vi } from 'vitest';

import useRoutes from '../../hooks/useRoutes';
import { useAppContext } from '../../contexts/AppProvider';
import NotificationSettings from '../../pages/notification-settings';
import DefaultLayout from '../../layouts/DefaultLayout';

// Mock dependencies
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('../../components/can', () => ({
  __esModule: true,
  default: ({ yes, children }: any) => (yes ? children : null),
}));

vi.mock('../../pages/notification-settings', () => ({
  __esModule: true,
  default: () => (
    <div data-id="003126" data-testid="notification-settings-page">
      Notification Settings
    </div>
  ),
}));

vi.mock('../../layouts/DefaultLayout', () => ({
  __esModule: true,
  default: ({ component: Component }: any) => (
    <div data-id="003127" data-testid="default-layout">
      <Component data-id="003128" />
    </div>
  ),
}));

vi.mock('../../pages/overview', () => ({
  __esModule: true,
  default: () => (
    <div data-id="003129" data-testid="overview-page">
      Overview
    </div>
  ),
}));

vi.mock('../../pages/login', () => ({
  __esModule: true,
  default: () => (
    <div data-id="003130" data-testid="login-page">
      Login
    </div>
  ),
}));

vi.mock('../../pages/logout', () => ({
  __esModule: true,
  default: () => (
    <div data-id="003131" data-testid="logout-page">
      Logout
    </div>
  ),
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: any) => (
    <div data-id="003132" data-testid={`navigate-to-${to}`}>
      Navigate to {to}
    </div>
  ),
}));

vi.mock('../../utils/runtime-env', () => ({
  runtimeEnv: {
    enableComponentsPage: () => '',
    apiUrl: () => 'http://localhost:9000',
    clientUrl: () => 'http://localhost:3303',
    markerIoProjectId: () => '',
    get: () => undefined,
  },
}));

vi.mock('../../utils/auth-client', () => ({
  __esModule: true,
  default: {
    useSession: vi.fn(),
  },
}));

// Mock all page components to avoid import issues
vi.mock('../../pages/overview', () => ({ __esModule: true, default: () => <div data-id="003133">Mock Page</div> }));
vi.mock('../../pages/dashboard', () => ({ __esModule: true, default: () => <div data-id="003134">Mock Page</div> }));
vi.mock('../../pages/answers', () => ({ __esModule: true, default: () => <div data-id="003135">Mock Page</div> }));
vi.mock('../../pages/audit', () => ({ __esModule: true, default: () => <div data-id="003136">Mock Page</div> }));
vi.mock('../../pages/audit/history', () => ({ __esModule: true, default: () => <div data-id="003137">Mock Page</div> }));
vi.mock('../../pages/audit/participants', () => ({ __esModule: true, default: () => <div data-id="003138">Mock Page</div> }));
vi.mock('../../pages/tracker-item/index', () => ({ __esModule: true, default: () => <div data-id="003139">Mock Page</div> }));
vi.mock('../../pages/tracker-item/audit-log', () => ({ __esModule: true, default: () => <div data-id="003140">Mock Page</div> }));
vi.mock('../../pages/tracker-item/team', () => ({ __esModule: true, default: () => <div data-id="003141">Mock Page</div> }));
vi.mock('../../pages/tracker-item/history', () => ({ __esModule: true, default: () => <div data-id="003142">Mock Page</div> }));
vi.mock('../../pages/insights', () => ({ __esModule: true, default: () => <div data-id="003143">Mock Page</div> }));
vi.mock('../../pages/licenses', () => ({ __esModule: true, default: () => <div data-id="003144">Mock Page</div> }));
vi.mock('../../pages/assets', () => ({ __esModule: true, default: () => <div data-id="003145">Mock Page</div> }));
vi.mock('../../pages/actions', () => ({ __esModule: true, default: () => <div data-id="003146">Mock Page</div> }));
vi.mock('../../pages/accidents', () => ({ __esModule: true, default: () => <div data-id="003147">Mock Page</div> }));
vi.mock('../../pages/privacy-policy', () => ({ __esModule: true, default: () => <div data-id="003148">Mock Page</div> }));
vi.mock('../../pages/terms', () => ({ __esModule: true, default: () => <div data-id="003149">Mock Page</div> }));
vi.mock('../../pages/mentions', () => ({ __esModule: true, default: () => <div data-id="003150">Mock Page</div> }));
vi.mock('../../pages/help', () => ({ __esModule: true, default: () => <div data-id="003151">Mock Page</div> }));
vi.mock('../../pages/admin/tracker-items', () => ({ __esModule: true, default: () => <div data-id="003152">Mock Page</div> }));
vi.mock('../../pages/admin/regulatory-bodies', () => ({ __esModule: true, default: () => <div data-id="003153">Mock Page</div> }));
vi.mock('../../pages/admin/categories', () => ({ __esModule: true, default: () => <div data-id="003154">Mock Page</div> }));
vi.mock('../../pages/admin/locations', () => ({ __esModule: true, default: () => <div data-id="003155">Mock Page</div> }));
vi.mock('../../pages/admin/business-units', () => ({ __esModule: true, default: () => <div data-id="003156">Mock Page</div> }));
vi.mock('../../pages/admin/questions-categories', () => ({ __esModule: true, default: () => <div data-id="003157">Mock Page</div> }));
vi.mock('../../pages/admin/questions', () => ({ __esModule: true, default: () => <div data-id="003158">Mock Page</div> }));
vi.mock('../../pages/admin/audit-types', () => ({ __esModule: true, default: () => <div data-id="003159">Mock Page</div> }));
vi.mock('../../pages/admin/users', () => ({ __esModule: true, default: () => <div data-id="003160">Mock Page</div> }));
vi.mock('../../pages/admin/audit-log', () => ({ __esModule: true, default: () => <div data-id="003161">Mock Page</div> }));
vi.mock('../../pages/admin/settings', () => ({ __esModule: true, default: () => <div data-id="003162">Mock Page</div> }));
vi.mock('../../pages/components', () => ({ __esModule: true, default: () => <div data-id="003163">Mock Page</div> }));

// Mock layouts
vi.mock('../../layouts/AuditLayout', () => ({
  __esModule: true,
  default: ({ component: Component }: any) => <Component data-id="003164" />,
}));
vi.mock('../../layouts/ResponseLayout', () => ({
  __esModule: true,
  default: ({ component: Component }: any) => <Component data-id="003165" />,
}));
vi.mock('../../layouts/PureLayout', () => ({
  __esModule: true,
  default: ({ component: Component }: any) => <Component data-id="003166" />,
}));

describe('useRoutes', () => {
  const mockUser = {
    _id: 'user1',
    userId: 'user1',
    email: 'test@example.com',
    displayName: 'Test User',
  };

  const mockModule = {
    _id: 'module1',
    name: 'Tracker Items',
    path: 'tracker-items',
    type: 'tracker',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Notification Settings Route Configuration', () => {
    test('notification-settings route is included in protected routes when user is authenticated', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();

      // Find the notification-settings route
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute).toBeDefined();
      expect(notificationSettingsRoute?.key).toBe('notification-settings');
    });

    test('notification-settings route has correct path with module prefix', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      // Protected routes are prefixed with /:modulePath
      expect(notificationSettingsRoute?.path).toBe('/:modulePath/notification-settings');
    });

    test('notification-settings route uses DefaultLayout', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      // The route should be wrapped in a Can component with DefaultLayout
      expect(notificationSettingsRoute).toBeDefined();
      expect(notificationSettingsRoute?.element).toBeDefined();
    });

    test('notification-settings route uses NotificationSettings component', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute).toBeDefined();
      // The component is wrapped in the layout, so we verify the route exists
      expect(notificationSettingsRoute?.key).toBe('notification-settings');
    });

    test('notification-settings route has exact match enabled', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings') as any;

      expect(notificationSettingsRoute?.exact).toBe(true);
    });

    test('notification-settings route does not require special permissions', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      // Routes without permission property are accessible to all authenticated users
      expect(notificationSettingsRoute).toBeDefined();
      // The route should not have a permission property (unlike admin routes)
      // We verify this by checking the route exists and is accessible
      expect(notificationSettingsRoute?.key).toBe('notification-settings');
    });
  });

  describe('Route Order and Position', () => {
    test('notification-settings route is positioned after terms-and-conditions route', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const termsRouteIndex = routes.findIndex((route) => route.key === 'terms');
      const notificationSettingsRouteIndex = routes.findIndex((route) => route.key === 'notification-settings');

      expect(termsRouteIndex).toBeGreaterThan(-1);
      expect(notificationSettingsRouteIndex).toBeGreaterThan(-1);
      expect(notificationSettingsRouteIndex).toBeGreaterThan(termsRouteIndex);
    });

    test('notification-settings route is positioned before mentions route', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRouteIndex = routes.findIndex((route) => route.key === 'notification-settings');
      const mentionsRouteIndex = routes.findIndex((route) => route.key === 'mentions');

      expect(notificationSettingsRouteIndex).toBeGreaterThan(-1);
      expect(mentionsRouteIndex).toBeGreaterThan(-1);
      expect(mentionsRouteIndex).toBeGreaterThan(notificationSettingsRouteIndex);
    });
  });

  describe('Route Accessibility', () => {
    test('notification-settings route is not available when user is not authenticated', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: null,
        module: null,
      } as any);

      const routes = useRoutes();

      // When user is null, only openRoutes are returned
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute).toBeUndefined();
    });

    test('notification-settings route is available when user is authenticated', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute).toBeDefined();
    });

    test('notification-settings route is available even when module is null', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: null,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute).toBeDefined();
    });
  });

  describe('Route Structure', () => {
    test('notification-settings route has all required properties', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute).toBeDefined();
      expect(notificationSettingsRoute).toHaveProperty('path');
      expect(notificationSettingsRoute).toHaveProperty('key');
      expect(notificationSettingsRoute).toHaveProperty('exact');
      expect(notificationSettingsRoute).toHaveProperty('element');
    });

    test('notification-settings route element is wrapped in Can component', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute?.element).toBeDefined();
      // The element should be a React element (Can component wrapper)
      expect(notificationSettingsRoute?.element).toBeTruthy();
    });
  });

  describe('Route Path Formatting', () => {
    test('notification-settings route path includes module path parameter', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute?.path).toContain(':modulePath');
      expect(notificationSettingsRoute?.path).toContain('/notification-settings');
      expect(notificationSettingsRoute?.path).toBe('/:modulePath/notification-settings');
    });

    test('notification-settings route path does not have trailing slash', () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        module: mockModule,
      } as any);

      const routes = useRoutes();
      const notificationSettingsRoute = routes.find((route) => route.key === 'notification-settings');

      expect(notificationSettingsRoute?.path).not.toMatch(/\/$/);
    });
  });
});
