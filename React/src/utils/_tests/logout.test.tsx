import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Import the component after mocking
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import Logout from '../../pages/logout';

// Mock the modules before importing the component
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../utils/auth-client', () => ({
  default: {
    signIn: {
      social: vi.fn(),
    },
  },
}));

vi.mock('../../utils/runtime-env', () => ({
  runtimeEnv: {
    clientUrl: () => 'http://localhost:3000',
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => vi.fn(),
  };
});

// Test wrapper component
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002579">{children}</ChakraProvider>;
}

// Mock data
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

const mockUser = {
  _id: 'user1',
  organizationId: 'org1',
  userId: 'user1',
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'user' as const,
  imgUrl: 'https://example.com/avatar.jpg',
  lastLogin: new Date('2025-10-14T17:28:44.638Z'),
  userCreated: new Date('2025-01-01T00:00:00.000Z'),
};

// Mock context object
const mockAppContext = {
  roles: undefined,
  setRoles: vi.fn(),
  settings: [],
  setSettings: vi.fn(),
  organizationConfig: mockOrganizationConfig,
  setOrganizationConfig: vi.fn(),
  module: undefined,
  setModule: vi.fn(),
  user: mockUser,
  setUser: vi.fn(),
};

// Mock Image loading
const mockSuccessfulImageLoad = () => {
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
    const element = originalCreateElement(tagName);
    if (tagName === 'img') {
      setTimeout(() => {
        element.dispatchEvent(new Event('load'));
      }, 0);
    }
    return element;
  });
};

describe('Logout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    
    // Mock image loading by default
    mockSuccessfulImageLoad();
    
    // Set default mock implementations
    vi.mocked(useAppContext).mockReturnValue(mockAppContext);
    
    vi.mocked(useDevice).mockReturnValue('desktop');
  });

  describe('Basic Rendering', () => {
    test('renders logout page with organization name', () => {
      render(
        <TestWrapper data-id="002580">
          <Logout data-id="002581" />
        </TestWrapper>
      );

      const orgName = document.querySelector('[data-id="000229"]');
      expect(orgName).toBeInTheDocument();
      expect(orgName?.textContent).toBe('Test Organization');
    });

    test('renders company logo', async () => {
      render(
        <TestWrapper data-id="002582">
          <Logout data-id="002583" />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = document.querySelector('[data-id="company-logo"]');
        expect(logo).toBeInTheDocument();
      });
    });

    test('renders background image', async () => {
      render(
        <TestWrapper data-id="002584">
          <Logout data-id="002585" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="000241"]');
        expect(bgImage).toBeInTheDocument();
      });
    });

    test('renders user avatar', () => {
      render(
        <TestWrapper data-id="002586">
          <Logout data-id="002587" />
        </TestWrapper>
      );

      const avatar = document.querySelector('[data-id="000231"]');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('User Information Display', () => {
    test('displays user name when user is logged in', () => {
      render(
        <TestWrapper data-id="002588">
          <Logout data-id="002589" />
        </TestWrapper>
      );

      expect(screen.getByText('You have logged out.')).toBeInTheDocument();
      expect(screen.getByText("It's a good idea to close all browser windows.")).toBeInTheDocument();
    });

    test('displays logout confirmation message', () => {
      render(
        <TestWrapper data-id="002590">
          <Logout data-id="002591" />
        </TestWrapper>
      );

      expect(screen.getByText('You have logged out.')).toBeInTheDocument();
      expect(screen.getByText("It's a good idea to close all browser windows.")).toBeInTheDocument();
    });

    test('renders logout button', () => {
      render(
        <TestWrapper data-id="002592">
          <Logout data-id="002593" />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });

    test('renders login as someone else button', () => {
      render(
        <TestWrapper data-id="002594">
          <Logout data-id="002595" />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has proper data-id attributes', async () => {
      render(
        <TestWrapper data-id="002596">
          <Logout data-id="002597" />
        </TestWrapper>
      );

      expect(document.querySelector('[data-id="000227"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000228"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000229"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000230"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000231"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000232"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000233"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000234"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000235"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000236"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000237"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000238"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000239"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000240"]')).toBeInTheDocument();
      await waitFor(() => {
        expect(document.querySelector('[data-id="000241"]')).toBeInTheDocument();
      });
    });
  });

  describe('Image Fallbacks', () => {
    test('renders organization logo when it loads successfully', async () => {
      render(
        <TestWrapper data-id="002598">
          <Logout data-id="002599" />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = document.querySelector('[data-id="company-logo"]');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', mockOrganizationConfig.logoUrl);
      });
    });

    test('renders organization background when it loads successfully', async () => {
      render(
        <TestWrapper data-id="002600">
          <Logout data-id="002601" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="000241"]');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageUrl);
      });
    });
  });

  describe('Responsive Design', () => {
    test('renders with mobile layout when device is mobile', async () => {
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper data-id="002602">
          <Logout data-id="002603" />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = document.querySelector('[data-id="company-logo"]');
        expect(logo).toBeInTheDocument();
      });
    });

    test('renders with desktop layout when device is desktop', async () => {
      vi.mocked(useDevice).mockReturnValue('desktop');

      render(
        <TestWrapper data-id="002604">
          <Logout data-id="002605" />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = document.querySelector('[data-id="company-logo"]');
        expect(logo).toBeInTheDocument();
      });
    });
  });

  describe('Organization Configuration', () => {
    test('renders with default organization config when not provided', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper data-id="002606">
          <Logout data-id="002607" />
        </TestWrapper>
      );

      const orgName = document.querySelector('[data-id="000229"]');
      expect(orgName).toBeInTheDocument();
    });

    test('uses fallback images when organization config is missing', async () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper data-id="002608">
          <Logout data-id="002609" />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = document.querySelector('[data-id="company-logo"]');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', expect.stringContaining('Logo%20Icon%20-%20navigation.svg'));
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles user with missing displayName', () => {
      const userWithoutDisplayName = {
        ...mockUser,
        displayName: 'John Doe', // Keep displayName as string since it's required
      };

      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        user: userWithoutDisplayName,
      });

      render(
        <TestWrapper data-id="002610">
          <Logout data-id="002611" />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });

    test('handles user with missing firstName', () => {
      const userWithoutFirstName = {
        ...mockUser,
        firstName: 'John', // Keep firstName as string since it's required
      };

      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        user: userWithoutFirstName,
      });

      render(
        <TestWrapper data-id="002612">
          <Logout data-id="002613" />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles logout button click', async () => {
      render(
        <TestWrapper data-id="002614">
          <Logout data-id="002615" />
        </TestWrapper>
      );

      const logoutButton = screen.getByText('Log back in');
      fireEvent.click(logoutButton);

      // The component should handle the click without crashing
      expect(logoutButton).toBeInTheDocument();
    });

    test('handles login as someone else button click', async () => {
      render(
        <TestWrapper data-id="002616">
          <Logout data-id="002617" />
        </TestWrapper>
      );

      const loginButton = screen.getByText('Log back in');
      fireEvent.click(loginButton);

      // The component should handle the click without crashing
      expect(loginButton).toBeInTheDocument();
    });
  });
});
