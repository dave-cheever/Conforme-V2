import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Import the components after mocking
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import {
  BackgroundImage,
  CompanyLogo,
  FALLBACK_BG_DESKTOP_URL,
  FALLBACK_BG_MOBILE_URL,
  FALLBACK_COMPANY_LOGO_URL,
} from '../auth-pages-common';

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

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => vi.fn(),
  };
});

// Test wrapper component
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002530">{children}</ChakraProvider>;
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
  email: 'john@example.com',
  role: 'user' as const,
  imgUrl: 'https://example.com/avatar.png',
  lastLogin: new Date(),
  userCreated: new Date(),
};

const mockAppContext = {
  organizationConfig: mockOrganizationConfig,
  user: mockUser,
  roles: {
    reader: { normal: [], restricted: {} },
    admin: { normal: [], restricted: {} },
    user: { normal: [], restricted: {} },
  },
  setRoles: vi.fn(),
  settings: [],
  setSettings: vi.fn(),
  setOrganizationConfig: vi.fn(),
  module: undefined,
  setModule: vi.fn(),
  setUser: vi.fn(),
};

describe('auth-pages-common', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppContext).mockReturnValue(mockAppContext);
    vi.mocked(useDevice).mockReturnValue('desktop');
  });

  describe('CompanyLogo', () => {
    test('renders with fallback URL when organization logo is not available', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper data-id="002531">
          <CompanyLogo data-id="002532" />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toHaveAttribute('src', FALLBACK_COMPANY_LOGO_URL);
    });

    test('renders with fallback URL when organization logo URL is empty', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: {
          ...mockOrganizationConfig,
          logoUrl: '',
        },
      });

      render(
        <TestWrapper data-id="002533">
          <CompanyLogo data-id="002534" />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toHaveAttribute('src', FALLBACK_COMPANY_LOGO_URL);
    });

    test('applies mobile styles when isMobile is true', () => {
      render(
        <TestWrapper data-id="002535">
          <CompanyLogo data-id="002536" isMobile />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toHaveStyle({
        height: '48px',
        width: '180px',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
      });
    });

    test('applies desktop styles when isMobile is false', () => {
      render(
        <TestWrapper data-id="002537">
          <CompanyLogo data-id="002538" isMobile={false} />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toHaveStyle({
        width: '200px',
        top: '40px',
        left: '-20px',
        transform: 'none',
      });
    });
  });

  describe('BackgroundImage', () => {
    test('renders with fallback URL when organization background is not available', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper data-id="002539">
          <BackgroundImage data-id="002540" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      const bgImage = document.querySelector('[data-id="test-bg"]');
      expect(bgImage).toHaveAttribute('src', FALLBACK_BG_DESKTOP_URL);
    });

    test('renders with fallback URL for mobile when organization background is not available', () => {
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper data-id="002541">
          <BackgroundImage data-id="002542" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      const bgImage = document.querySelector('[data-id="test-bg"]');
      expect(bgImage).toHaveAttribute('src', FALLBACK_BG_MOBILE_URL);
    });

    test('renders with custom dataId', () => {
      render(
        <TestWrapper data-id="002543">
          <BackgroundImage data-id="002544" dataId="custom-bg" maxW="800px" />
        </TestWrapper>
      );

      const bgImage = document.querySelector('[data-id="custom-bg"]');
      expect(bgImage).toBeInTheDocument();
    });
  });

  describe('Constants', () => {
    test('exports fallback URLs', () => {
      expect(FALLBACK_BG_DESKTOP_URL).toBeDefined();
      expect(FALLBACK_BG_MOBILE_URL).toBeDefined();
      expect(FALLBACK_COMPANY_LOGO_URL).toBeDefined();
    });
  });
});
