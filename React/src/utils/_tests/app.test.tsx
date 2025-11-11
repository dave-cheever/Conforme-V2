import { ChakraProvider } from '@chakra-ui/react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import App from '../../bootstrap/app';

// Mock dependencies
const mockNavigate = vi.fn();
const mockSetUser = vi.fn();
const mockSetModule = vi.fn();

const mockModule = {
  _id: 'module1',
  name: 'Tracker Items',
  path: 'tracker-items',
  type: 'tracker',
  showInNavigation: true,
} as any;

const mockUser = {
  _id: 'user1',
  userId: 'user1',
  email: 'test@example.com',
} as any;

const mockOrganizationConfig = {
  modules: [mockModule],
  theme: {},
} as any;

const mockSession = {
  user: mockUser,
};

// Mock hooks
vi.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useInit', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useRoutes', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../contexts/AppProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAppContext: vi.fn(),
}));

vi.mock('../../contexts/ConfigProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/AdminProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../utils/runtime-env', () => ({
  runtimeEnv: {
    clientUrl: () => 'https://example.com',
  },
}));

vi.mock('../../utils/auth-client', () => ({
  __esModule: true,
  default: {
    useSession: vi.fn(),
  },
}));

import useAuth from '../../hooks/useAuth';
import useInit from '../../hooks/useInit';
import useNavigate from '../../hooks/useNavigate';
import useRoutes from '../../hooks/useRoutes';
import { useAppContext } from '../../contexts/AppProvider';
import authClient from '../../utils/auth-client';

// Mock hooks
vi.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useInit', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useRoutes', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../contexts/AppProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAppContext: vi.fn(),
}));

vi.mock('../../contexts/ConfigProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/AdminProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../utils/runtime-env', () => ({
  runtimeEnv: {
    clientUrl: () => 'https://example.com',
  },
}));

vi.mock('../../utils/auth-client', () => ({
  __esModule: true,
  default: {
    useSession: vi.fn(),
  },
}));

describe('App Overview Page Redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Default mocks
    vi.mocked(useAuth).mockReturnValue(false); // Not loading
    vi.mocked(useInit).mockReturnValue(false); // Not loading
    vi.mocked(useNavigate).mockReturnValue({
      navigateTo: mockNavigate,
      isPathActive: vi.fn(),
      navigate: mockNavigate,
    } as any);
    vi.mocked(useRoutes).mockReturnValue([
      {
        path: '/overview',
        element: <div data-id="002979" data-testid="overview-page">Overview</div>,
      },
      {
        path: '/dashboard',
        element: <div data-id="002980" data-testid="dashboard-page">Dashboard</div>,
      },
    ] as any);
    vi.mocked(useAppContext).mockReturnValue({
      user: mockUser,
      organizationConfig: mockOrganizationConfig,
      module: mockModule,
      setUser: mockSetUser,
      setModule: mockSetModule,
    } as any);
    vi.mocked(authClient.useSession).mockReturnValue({
      data: mockSession,
      isPending: false,
    } as any);
  });

  describe('Redirect from login page', () => {
    test('redirects to /overview when coming from /login', async () => {
      render(
        <MemoryRouter data-id="002981" initialEntries={['/login']}>
          <ChakraProvider data-id="002982">
            <App data-id="002983" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });
    });

    test('redirects to /overview when coming from /tracker-items/login', async () => {
      render(
        <MemoryRouter data-id="002984" initialEntries={['/tracker-items/login']}>
          <ChakraProvider data-id="002985">
            <App data-id="002986" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });
    });

    test('redirects to /overview when coming from /module/login', async () => {
      render(
        <MemoryRouter data-id="002987" initialEntries={['/module/login']}>
          <ChakraProvider data-id="002988">
            <App data-id="002989" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });
    });
  });

  describe('Redirect from root paths', () => {
    test('redirects to /overview when landing on root path (/)', async () => {
      render(
        <MemoryRouter data-id="002990" initialEntries={['/']}>
          <ChakraProvider data-id="002991">
            <App data-id="002992" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });
    });

    test('redirects to /overview when landing on module root path', async () => {
      render(
        <MemoryRouter data-id="002993" initialEntries={['/tracker-items']}>
          <ChakraProvider data-id="002994">
            <App data-id="002995" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });
    });
  });

  describe('No redirect scenarios', () => {
    test('does not redirect when already on /overview', async () => {
      render(
        <MemoryRouter data-id="002996" initialEntries={['/overview']}>
          <ChakraProvider data-id="002997">
            <App data-id="002998" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        // Should not redirect when already on overview
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when on /logout', async () => {
      render(
        <MemoryRouter data-id="002999" initialEntries={['/logout']}>
          <ChakraProvider data-id="003000">
            <App data-id="003001" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when on /tracker-items/logout', async () => {
      render(
        <MemoryRouter data-id="003002" initialEntries={['/tracker-items/logout']}>
          <ChakraProvider data-id="003003">
            <App data-id="003004" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when user is not logged in', async () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: null,
        organizationConfig: mockOrganizationConfig,
        module: mockModule,
        setUser: mockSetUser,
        setModule: mockSetModule,
      } as any);

      render(
        <MemoryRouter data-id="003005" initialEntries={['/login']}>
          <ChakraProvider data-id="003006">
            <App data-id="003007" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when loading settings', async () => {
      vi.mocked(useInit).mockReturnValue(true); // Loading

      render(
        <MemoryRouter data-id="003008" initialEntries={['/login']}>
          <ChakraProvider data-id="003009">
            <App data-id="003010" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when loading user', async () => {
      vi.mocked(useAuth).mockReturnValue(true); // Loading

      render(
        <MemoryRouter data-id="003011" initialEntries={['/login']}>
          <ChakraProvider data-id="003012">
            <App data-id="003013" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when module is not available', async () => {
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        organizationConfig: mockOrganizationConfig,
        module: null,
        setUser: mockSetUser,
        setModule: mockSetModule,
      } as any);

      render(
        <MemoryRouter data-id="003014" initialEntries={['/login']}>
          <ChakraProvider data-id="003015">
            <App data-id="003016" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('does not redirect when manually navigating to other pages', async () => {
      render(
        <MemoryRouter data-id="003017" initialEntries={['/tracker-items/dashboard']}>
          <ChakraProvider data-id="003018">
            <App data-id="003019" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Redirect flag behavior', () => {
    test('redirects only once after login', async () => {
      const { rerender } = render(
        <MemoryRouter data-id="003020" initialEntries={['/login']}>
          <ChakraProvider data-id="003021">
            <App data-id="003022" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });

      // Simulate navigation to another page
      mockNavigate.mockClear();

      // Navigate to dashboard
      rerender(
        <MemoryRouter data-id="003023" initialEntries={['/tracker-items/dashboard']}>
          <ChakraProvider data-id="003024">
            <App data-id="003025" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        // Should not redirect again
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('resets redirect flag when user logs out', async () => {
      // First, login and redirect
      const { rerender } = render(
        <MemoryRouter data-id="003026" initialEntries={['/login']}>
          <ChakraProvider data-id="003027">
            <App data-id="003028" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });

      // User logs out
      vi.mocked(useAppContext).mockReturnValue({
        user: null,
        organizationConfig: mockOrganizationConfig,
        module: mockModule,
        setUser: mockSetUser,
        setModule: mockSetModule,
      } as any);

      mockNavigate.mockClear();

      rerender(
        <MemoryRouter data-id="003029" initialEntries={['/login']}>
          <ChakraProvider data-id="003030">
            <App data-id="003031" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        // Should not redirect when user is logged out
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      // User logs back in
      vi.mocked(useAppContext).mockReturnValue({
        user: mockUser,
        organizationConfig: mockOrganizationConfig,
        module: mockModule,
        setUser: mockSetUser,
        setModule: mockSetModule,
      } as any);

      rerender(
        <MemoryRouter data-id="003032" initialEntries={['/login']}>
          <ChakraProvider data-id="003033">
            <App data-id="003034" />
          </ChakraProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        // Should redirect again after re-login
        expect(mockNavigate).toHaveBeenCalledWith('/overview');
      });
    });
  });
});

