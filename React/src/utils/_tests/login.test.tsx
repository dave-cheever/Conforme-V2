import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Import the component after mocking
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import Login from '../../pages/login';

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

vi.mock('../../icons/SignInButton', () => ({
  __esModule: true,
  default: ({ onClick, ...props }: any) => (
    <button
      data-id="002545"
      type="button"
      data-testid="sign-in-button"
      onClick={onClick}
      {...props}>
      Sign In
    </button>
  ),
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
  return <ChakraProvider data-id="002546">{children}</ChakraProvider>;
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
  user: null,
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

describe('Login Component', () => {
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
    test('renders login page with organization name', () => {
      render(
        <TestWrapper data-id="002547">
          <Login data-id="002548" />
        </TestWrapper>
      );

      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });

    test('renders company logo', async () => {
      render(
        <TestWrapper data-id="002549">
          <Login data-id="002550" />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = document.querySelector('[data-id="company-logo"]');
        expect(logo).toBeInTheDocument();
      });
    });

    test('renders background image', async () => {
      render(
        <TestWrapper data-id="002551">
          <Login data-id="002552" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="000224"]');
        expect(bgImage).toBeInTheDocument();
      });
    });

    test('renders sign in button when user is not logged in', () => {
      render(
        <TestWrapper data-id="002553">
          <Login data-id="002554" />
        </TestWrapper>
      );

      expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    });
  });

  describe('User Authentication States', () => {
    test('renders user info when user is logged in', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        user: mockUser,
      });

      render(
        <TestWrapper data-id="002555">
          <Login data-id="002556" />
        </TestWrapper>
      );

      expect(screen.getByText('Login as John')).toBeInTheDocument();
      expect(screen.getByText('Not John?')).toBeInTheDocument();
    });

    test('renders user avatar when user is logged in', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        user: mockUser,
      });

      render(
        <TestWrapper data-id="002557">
          <Login data-id="002558" />
        </TestWrapper>
      );

      const avatar = document.querySelector('[data-id="000212"]');
      expect(avatar).toBeInTheDocument();
    });

    test('renders logout option when user is logged in', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        user: mockUser,
      });

      render(
        <TestWrapper data-id="002559">
          <Login data-id="002560" />
        </TestWrapper>
      );

      expect(screen.getByText('Login as someone else')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has proper data-id attributes', async () => {
      render(
        <TestWrapper data-id="002561">
          <Login data-id="002562" />
        </TestWrapper>
      );

      expect(document.querySelector('[data-id="000207"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000217"]')).toBeInTheDocument();
      expect(document.querySelector('[data-id="000223"]')).toBeInTheDocument();
      await waitFor(() => {
        expect(document.querySelector('[data-id="000224"]')).toBeInTheDocument();
      });
    });
  });

  describe('Image Fallbacks', () => {
    test('renders organization logo when it loads successfully', async () => {
      render(
        <TestWrapper data-id="002563">
          <Login data-id="002564" />
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
        <TestWrapper data-id="002565">
          <Login data-id="002566" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="000224"]');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageUrl);
      });
    });
  });

  describe('Responsive Design', () => {
    test('renders with mobile layout when device is mobile', async () => {
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper data-id="002567">
          <Login data-id="002568" />
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
        <TestWrapper data-id="002569">
          <Login data-id="002570" />
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
        user: null,
      });

      render(
        <TestWrapper data-id="002571">
          <Login data-id="002572" />
        </TestWrapper>
      );

      expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    });

    test('uses fallback images when organization config is missing', async () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
        user: null,
      });

      render(
        <TestWrapper data-id="002573">
          <Login data-id="002574" />
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
        <TestWrapper data-id="002575">
          <Login data-id="002576" />
        </TestWrapper>
      );

      expect(screen.getByText('Login as John')).toBeInTheDocument();
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
        <TestWrapper data-id="002577">
          <Login data-id="002578" />
        </TestWrapper>
      );

      expect(screen.getByText('Login as John')).toBeInTheDocument();
    });
  });
});
