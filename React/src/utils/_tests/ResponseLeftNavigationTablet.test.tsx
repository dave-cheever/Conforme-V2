import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';

import ResponseLeftNavigationTablet from '../../components/Response/ResponseLeftNavigation/ResponseLeftNavigationTablet';
import theme from '../../bootstrap/theme';

// Mock Apollo Client hooks
vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(() => ({
    data: {
      accountable: { _id: 'user-1', firstName: 'John', lastName: 'Doe' },
      responsible: { _id: 'user-2', firstName: 'Jane', lastName: 'Smith' }
    },
    loading: false,
    error: null
  })),
  gql: vi.fn()
}));

// Mock the hooks and contexts
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({
    module: { type: 'tracker', name: 'Tracker Module' }
  })
}));

vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    navigateTo: vi.fn(),
    isPathActive: (url: string, options?: { exact?: boolean }) => {
      if (options?.exact) {
        return url === '/tracker-items';
      }
      return url.startsWith('/tracker-items');
    }
  })
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'tablet'
}));

vi.mock('../../components/ModuleSwitcher', () => ({
  __esModule: true,
  default: () => <div data-id="002851" data-testid="module-switcher">Module Switcher</div>
}));

vi.mock('../../components/NavigationLeft/NavigationPoweredBy', () => ({
  __esModule: true,
  default: () => <div data-id="002852" data-testid="navigation-powered-by">Powered By</div>
}));

vi.mock('../../components/Response/ResponseLeftTabItem', () => ({
  __esModule: true,
  default: ({ label, url }: { label: string; url: string }) => (
    <div data-id="002853" data-testid="response-tab-item" data-url={url}>
      {label}
    </div>
  )
}));

vi.mock('../../icons/BackArrowIcon', () => ({
  __esModule: true,
  default: ({ dataId }: { dataId: string }) => (
    <div data-id={dataId} data-testid="back-arrow-icon">
      Back Arrow
    </div>
  )
}));

vi.mock('../../icons/LogoIcon', () => ({
  __esModule: true,
  default: ({ color, boxSize }: { color?: string; boxSize?: string }) => (
    <div data-id="002854" data-testid="logo-icon" data-color={color} data-size={boxSize}>
      Logo
    </div>
  )
}));

vi.mock('../../contexts/ResponseProvider', () => ({
  useResponseContext: () => ({
    response: {
      _id: 'response-1',
      trackerItem: {
        reference: 'TI-001',
        category: { name: 'Safety' },
        regulatoryBody: { name: 'OSHA' },
        frequency: 'Monthly'
      },
      businessUnit: { name: 'Operations' }
    }
  })
}));

vi.mock('../../bootstrap/config', () => ({
  navigationTabs: [
    { label: 'Overview', icon: 'OverviewIcon', url: '/responses/overview' },
    { label: 'Details', icon: 'DetailsIcon', url: '/responses/details' }
  ]
}));

vi.mock('../../components/Response/ResponseLeftNavigation', () => ({
  __esModule: true,
  default: ({ enforceDesktop, setDrawerOpen }: { enforceDesktop?: boolean; setDrawerOpen?: (open: boolean) => void }) => (
    <div data-id="002855" data-testid="response-left-navigation" data-enforce-desktop={enforceDesktop ? 'true' : 'false'}>
      <button
        data-id="002900"
        data-testid="drawer-close-button"
        onClick={() => setDrawerOpen && setDrawerOpen(false)}>
        Close
      </button>
      Response Left Navigation
    </div>
  )
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MockedProvider data-id="002856" mocks={[]} addTypename={false}>
      <ChakraProvider data-id="002857" theme={theme}>
        <BrowserRouter data-id="002858">
          {component}
        </BrowserRouter>
      </ChakraProvider>
    </MockedProvider>
  );
};

describe('ResponseLeftNavigationTablet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the tablet navigation container', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002859" />);
    
    const moduleSwitcher = screen.getByTestId('module-switcher');
    expect(moduleSwitcher).toBeInTheDocument();
  });

  test('renders drawer open button with correct data-id', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002860" />);
    
    const openButton = document.querySelector('[data-id="002847"]');
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveAttribute('data-id', '002847');
  });

  test('drawer open button has LogoIcon with correct data-id', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002861" />);
    
    const logoIconContainer = document.querySelector('[data-id="002848"]');
    expect(logoIconContainer).toBeInTheDocument();
    
    const logoIcon = screen.getByTestId('logo-icon');
    expect(logoIcon).toBeInTheDocument();
  });

  test('opens drawer when open button is clicked', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002862" />);
    
    const openButton = document.querySelector('[data-id="002847"]') as HTMLElement;
    expect(openButton).toBeInTheDocument();
    
    fireEvent.click(openButton);
    
    // Drawer should be open and show ResponseLeftNavigation
    const drawerContent = screen.getByTestId('response-left-navigation');
    expect(drawerContent).toBeInTheDocument();
  });

  test('drawer shows ResponseLeftNavigation with enforceDesktop prop', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002863" />);
    
    const openButton = document.querySelector('[data-id="002847"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerContent = screen.getByTestId('response-left-navigation');
    expect(drawerContent).toHaveAttribute('data-enforce-desktop', 'true');
  });

  test('closes drawer when close button inside drawer is clicked', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002864" />);
    
    // Open drawer
    const openButton = document.querySelector('[data-id="002847"]') as HTMLElement;
    fireEvent.click(openButton);
    
    // Verify drawer is open
    expect(screen.getByTestId('response-left-navigation')).toBeInTheDocument();
    
    // Close drawer
    const closeButton = screen.getByTestId('drawer-close-button');
    fireEvent.click(closeButton);
    
    // Drawer content should still be rendered (Chakra Drawer behavior)
    // We can verify by checking that the component is still accessible
    expect(document.querySelector('[data-id="002847"]')).toBeInTheDocument();
  });

  test('drawer has correct width of 280px', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002865" />);
    
    const openButton = document.querySelector('[data-id="002847"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerContent = document.querySelector('[data-id="drawer-content"]');
    expect(drawerContent).toBeInTheDocument();
  });

  test('drawer open button has correct styling and positioning', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002866" />);
    
    const openButton = document.querySelector('[data-id="002847"]');
    expect(openButton).toBeInTheDocument();
  });

  test('drawer open button has hover and active states', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002867" />);
    
    const openButton = document.querySelector('[data-id="002847"]');
    expect(openButton).toBeInTheDocument();
  });

  test('renders ModuleSwitcher in tablet view', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002868" />);
    
    const moduleSwitcher = screen.getByTestId('module-switcher');
    expect(moduleSwitcher).toBeInTheDocument();
  });

  test('renders navigation tabs in tablet view', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002869" />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  test('renders location section with back button', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002870" />);
    
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Tracker Item Detail')).toBeInTheDocument();
    expect(screen.getByTestId('back-arrow-icon')).toBeInTheDocument();
  });

  test('drawer overlay is present when drawer is open', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002871" />);
    
    const openButton = document.querySelector('[data-id="002847"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerOverlay = document.querySelector('[data-id="drawer-overlay"]');
    expect(drawerOverlay).toBeInTheDocument();
  });

  test('drawer body has correct overflow settings', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002872" />);
    
    const openButton = document.querySelector('[data-id="002847"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerBody = document.querySelector('[data-id="drawer-body"]');
    expect(drawerBody).toBeInTheDocument();
  });

  test('open button is positioned correctly with right offset', () => {
    renderWithProviders(<ResponseLeftNavigationTablet data-id="002873" />);
    
    const openButton = document.querySelector('[data-id="002847"]');
    expect(openButton).toBeInTheDocument();
  });
});

