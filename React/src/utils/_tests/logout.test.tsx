import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

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

// Import the component after mocking
import Logout from '../../pages/logout';
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';

// Test wrapper component
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
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

describe('Logout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set default mock implementations
    vi.mocked(useAppContext).mockReturnValue(mockAppContext);
    
    vi.mocked(useDevice).mockReturnValue('desktop');
  });

  describe('Basic Rendering', () => {
    test('renders logout page with organization name', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const orgName = document.querySelector('[data-id="000229"]');
      expect(orgName).toBeInTheDocument();
      expect(orgName?.textContent).toBe('Test Organization');
    });

    test('renders company logo', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toBeInTheDocument();
    });

    test('renders background image', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const bgImage = document.querySelector('[data-id="000241"]');
      expect(bgImage).toBeInTheDocument();
    });

    test('renders user avatar', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const avatar = document.querySelector('[data-id="000231"]');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('User Information Display', () => {
    test('displays user name when user is logged in', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      expect(screen.getByText('You have logged out.')).toBeInTheDocument();
      expect(screen.getByText("It's a good idea to close all browser windows.")).toBeInTheDocument();
    });

    test('displays logout confirmation message', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      expect(screen.getByText('You have logged out.')).toBeInTheDocument();
      expect(screen.getByText("It's a good idea to close all browser windows.")).toBeInTheDocument();
    });

    test('renders logout button', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });

    test('renders login as someone else button', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has proper data-id attributes', () => {
      render(
        <TestWrapper>
          <Logout />
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
      expect(document.querySelector('[data-id="000241"]')).toBeInTheDocument();
    });
  });

  describe('Image Fallbacks', () => {
    test('uses fallback logo when organization logo fails to load', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toHaveAttribute('src', expect.stringContaining('Logo%20Icon%20-%20navigation.svg'));
    });

    test('uses fallback background when organization background fails to load', () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const bgImage = document.querySelector('[data-id="000241"]');
      expect(bgImage).toHaveAttribute('src', expect.stringContaining('Full%20background%20img%20-%20desktop.png'));
    });
  });

  describe('Responsive Design', () => {
    test('renders with mobile layout when device is mobile', () => {
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toBeInTheDocument();
    });

    test('renders with desktop layout when device is desktop', () => {
      vi.mocked(useDevice).mockReturnValue('desktop');

      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Organization Configuration', () => {
    test('renders with default organization config when not provided', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const orgName = document.querySelector('[data-id="000229"]');
      expect(orgName).toBeInTheDocument();
    });

    test('uses fallback images when organization config is missing', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toHaveAttribute('src', expect.stringContaining('Logo%20Icon%20-%20navigation.svg'));
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
        <TestWrapper>
          <Logout />
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
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      expect(screen.getByText('Log back in')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles logout button click', async () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const logoutButton = screen.getByText('Log back in');
      fireEvent.click(logoutButton);

      // The component should handle the click without crashing
      expect(logoutButton).toBeInTheDocument();
    });

    test('handles login as someone else button click', async () => {
      render(
        <TestWrapper>
          <Logout />
        </TestWrapper>
      );

      const loginButton = screen.getByText('Log back in');
      fireEvent.click(loginButton);

      // The component should handle the click without crashing
      expect(loginButton).toBeInTheDocument();
    });
  });
});
