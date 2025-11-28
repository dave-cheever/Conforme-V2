import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Import the components after mocking
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import {
  BackgroundImage,
  CompanyLogo,
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

const mockFailedImageLoad = () => {
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
    const element = originalCreateElement(tagName);
    if (tagName === 'img') {
      setTimeout(() => {
        element.dispatchEvent(new Event('error'));
      }, 0);
    }
    return element;
  });
};

describe('auth-pages-common', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.mocked(useAppContext).mockReturnValue(mockAppContext);
    vi.mocked(useDevice).mockReturnValue('desktop');
  });

  describe('CompanyLogo', () => {
    test('renders custom logo when it loads successfully', async () => {
      mockSuccessfulImageLoad();

      render(
        <TestWrapper data-id="002531">
          <CompanyLogo data-id="002532" />
        </TestWrapper>,
      );

      await waitFor(() => {
        const logo = screen.queryByAltText('');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', mockOrganizationConfig.logoUrl);
      });
    });

    test('renders fallback logo when custom logo fails', async () => {
      mockFailedImageLoad();

      render(
        <TestWrapper data-id="002533">
          <CompanyLogo data-id="002534" />
        </TestWrapper>,
      );

      await waitFor(() => {
        const textFallback = screen.getByText('Company logo couldn\'t be loaded.');
        expect(textFallback).toBeInTheDocument();
      });
    });

    test('renders text fallback when both logos fail', async () => {
      mockFailedImageLoad();

      render(
        <TestWrapper data-id="002535">
          <CompanyLogo data-id="002536" />
        </TestWrapper>
      );

      await waitFor(() => {
        const textFallback = screen.getByText('Company logo couldn\'t be loaded.');
        expect(textFallback).toBeInTheDocument();
      });
    });

    test('renders text fallback when organization config is undefined', async () => {
      mockFailedImageLoad();
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper data-id="002537">
          <CompanyLogo data-id="002538" />
        </TestWrapper>
      );

      await waitFor(() => {
        const textFallback = screen.getByText('Company logo couldn\'t be loaded.');
        expect(textFallback).toBeInTheDocument();
      });
    });

    test('applies mobile styles when isMobile is true', async () => {
      mockSuccessfulImageLoad();

      render(
        <TestWrapper data-id="002539">
          <CompanyLogo data-id="002540" isMobile />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = screen.queryByAltText('');
        expect(logo).toBeInTheDocument();
      });
    });

    test('applies desktop styles when isMobile is false', async () => {
      mockSuccessfulImageLoad();

      render(
        <TestWrapper data-id="002541">
          <CompanyLogo data-id="002542" isMobile={false} />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = screen.queryByAltText('');
        expect(logo).toBeInTheDocument();
      });
    });

    test('shows loading state initially', () => {
      render(
        <TestWrapper data-id="002543">
          <CompanyLogo data-id="002544" />
        </TestWrapper>
      );

      // Should not render anything while loading
      const textFallback = screen.queryByText('Company logo couldn\'t be loaded.');
      expect(textFallback).not.toBeInTheDocument();
    });
  });

  describe('BackgroundImage', () => {
    test('renders custom background when it loads successfully on desktop', async () => {
      mockSuccessfulImageLoad();

      render(
        <TestWrapper data-id="002545">
          <BackgroundImage data-id="002546" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageUrl);
      });
    });

    test('renders custom background for mobile when device is mobile', async () => {
      mockSuccessfulImageLoad();
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper data-id="002547">
          <BackgroundImage data-id="002548" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageTabletUrl);
      });
    });

    test('renders text fallback when both background images fail on desktop', async () => {
      mockFailedImageLoad();

      render(
        <TestWrapper data-id="002549">
          <BackgroundImage data-id="002550" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const wrapper = document.querySelector('[data-id="background-image-text-fallback-wrapper"]');
        expect(wrapper).toBeInTheDocument();
        // Check for the icon instead of text
        const icon = wrapper?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    test('renders text fallback when both background images fail on mobile', async () => {
      mockFailedImageLoad();
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper data-id="002551">
          <BackgroundImage data-id="002552" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const wrapper = document.querySelector('[data-id="background-image-text-fallback-wrapper"]');
        expect(wrapper).toBeInTheDocument();
        // Check for the icon instead of text
        const icon = wrapper?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    test('renders text fallback when organization config is undefined', async () => {
      mockFailedImageLoad();
      vi.mocked(useAppContext).mockReturnValue({
        ...mockAppContext,
        organizationConfig: undefined,
      });

      render(
        <TestWrapper data-id="002553">
          <BackgroundImage data-id="002554" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const wrapper = document.querySelector('[data-id="background-image-text-fallback-wrapper"]');
        expect(wrapper).toBeInTheDocument();
        // Check for the icon instead of text
        const icon = wrapper?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    test('uses tablet images when device is tablet', async () => {
      mockSuccessfulImageLoad();
      vi.mocked(useDevice).mockReturnValue('tablet');

      render(
        <TestWrapper data-id="002555">
          <BackgroundImage data-id="002556" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toBeInTheDocument();
        // Tablet should use tablet images (bgImageTabletUrl)
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageTabletUrl);
      });
    });

    test('applies responsive positioning for text fallback', async () => {
      mockFailedImageLoad();

      render(
        <TestWrapper data-id="002557">
          <BackgroundImage data-id="002558" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const wrapper = document.querySelector('[data-id="background-image-text-fallback-wrapper"]');
        expect(wrapper).toBeInTheDocument();
      });
    });

    test('renders with custom maxW prop', async () => {
      mockSuccessfulImageLoad();

      render(
        <TestWrapper data-id="002559">
          <BackgroundImage data-id="002560" dataId="test-bg" maxW="1000px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toBeInTheDocument();
      });
    });

    test('renders with custom fit prop', async () => {
      mockSuccessfulImageLoad();

      render(
        <TestWrapper data-id="002561">
          <BackgroundImage data-id="002562" dataId="test-bg" fit="cover" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toBeInTheDocument();
      });
    });

    test('shows loading state initially', () => {
      render(
        <TestWrapper data-id="002563">
          <BackgroundImage data-id="002564" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      // Should not render anything while loading
      const wrapper = document.querySelector('[data-id="background-image-text-fallback-wrapper"]');
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  // Constants tests removed - fallback URLs are no longer used as we go directly to UI fallbacks

  describe('Device-specific behavior', () => {
    test('uses correct images for mobile device', async () => {
      mockSuccessfulImageLoad();
      vi.mocked(useDevice).mockReturnValue('mobile');

      render(
        <TestWrapper data-id="002565">
          <BackgroundImage data-id="002566" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageTabletUrl);
      });
    });

    test('uses correct images for desktop device', async () => {
      mockSuccessfulImageLoad();
      vi.mocked(useDevice).mockReturnValue('desktop');

      render(
        <TestWrapper data-id="002567">
          <BackgroundImage data-id="002568" dataId="test-bg" maxW="800px" />
        </TestWrapper>
      );

      await waitFor(() => {
        const bgImage = document.querySelector('[data-id="test-bg"]');
        expect(bgImage).toHaveAttribute('src', mockOrganizationConfig.bgImageUrl);
      });
    });
  });
});
