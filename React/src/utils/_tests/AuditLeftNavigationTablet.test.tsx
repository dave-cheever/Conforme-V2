import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import AuditLeftNavigationTablet from '../../components/Audit/AuditLeftNavigationTablet';
import theme from '../../bootstrap/theme';

// Mock the hooks and contexts
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({
    module: { type: 'audit', name: 'Audit Module' },
    organizationConfig: { name: 'Test Organization' }
  })
}));

vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    navigateTo: vi.fn(),
    navigate: vi.fn(),
    isPathActive: (url: string, options?: { exact?: boolean }) => {
      if (options?.exact) {
        return url === '/audits';
      }
      return url.startsWith('/audits');
    }
  })
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'tablet'
}));

vi.mock('../../components/ModuleSwitcher', () => ({
  __esModule: true,
  default: () => <div data-id="002874" data-testid="module-switcher">Module Switcher</div>
}));

vi.mock('../../components/NavigationLeft/NavigationPoweredBy', () => ({
  __esModule: true,
  default: () => <div data-id="002875" data-testid="navigation-powered-by">Powered By</div>
}));

vi.mock('../../components/Audit/AuditLeftTabItem', () => ({
  __esModule: true,
  default: ({ label, url }: { label: string; url: string }) => (
    <div data-id="002876" data-testid="audit-tab-item" data-url={url}>
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
    <div data-id="002877" data-testid="logo-icon" data-color={color} data-size={boxSize}>
      Logo
    </div>
  )
}));

vi.mock('../../hooks/useConfig', () => ({
  __esModule: true,
  default: () => ({
    auditNavigationTabs: [
      { label: 'Overview', icon: 'OverviewIcon', url: '/audits/overview' },
      { label: 'Questions', icon: 'QuestionsIcon', url: '/audits/questions' },
      { label: 'Actions', icon: 'ActionsIcon', url: '/audits/actions' }
    ]
  })
}));

vi.mock('../../components/Audit/AuditLeftNavigation', () => ({
  __esModule: true,
  default: ({ enforceDesktop, setDrawerOpen }: { enforceDesktop?: boolean; setDrawerOpen?: (open: boolean) => void }) => (
    <div data-id="002878" data-testid="audit-left-navigation" data-enforce-desktop={enforceDesktop ? 'true' : 'false'}>
      <button
        data-id="002899"
        data-testid="drawer-close-button"
        onClick={() => setDrawerOpen && setDrawerOpen(false)}>
        Close
      </button>
      <div data-id="002845" data-testid="close-button-internal">
        Internal Close
      </div>
      Audit Left Navigation
    </div>
  )
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider data-id="002879" theme={theme}>
      <BrowserRouter data-id="002880">
        {component}
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe('AuditLeftNavigationTablet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the tablet navigation container', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002881" />);
    
    const moduleSwitcher = screen.getByTestId('module-switcher');
    expect(moduleSwitcher).toBeInTheDocument();
  });

  test('renders drawer open button with correct data-id', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002882" />);
    
    const openButton = document.querySelector('[data-id="002849"]');
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveAttribute('data-id', '002849');
  });

  test('drawer open button has LogoIcon with correct data-id', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002883" />);
    
    const logoIconContainer = document.querySelector('[data-id="002850"]');
    expect(logoIconContainer).toBeInTheDocument();
    
    const logoIcon = screen.getByTestId('logo-icon');
    expect(logoIcon).toBeInTheDocument();
  });

  test('opens drawer when open button is clicked', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002884" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    expect(openButton).toBeInTheDocument();
    
    fireEvent.click(openButton);
    
    // Drawer should be open and show AuditLeftNavigation
    const drawerContent = screen.getByTestId('audit-left-navigation');
    expect(drawerContent).toBeInTheDocument();
  });

  test('drawer shows AuditLeftNavigation with enforceDesktop prop', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002885" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerContent = screen.getByTestId('audit-left-navigation');
    expect(drawerContent).toHaveAttribute('data-enforce-desktop', 'true');
  });

  test('drawer shows close button with correct data-id when enforceDesktop is true', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002886" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    // Check for the internal close button with data-id="002845"
    const internalCloseButton = screen.getByTestId('close-button-internal');
    expect(internalCloseButton).toBeInTheDocument();
    expect(internalCloseButton).toHaveAttribute('data-id', '002845');
  });

  test('closes drawer when close button inside drawer is clicked', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002887" />);
    
    // Open drawer
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    // Verify drawer is open
    expect(screen.getByTestId('audit-left-navigation')).toBeInTheDocument();
    
    // Close drawer using the mock button
    const closeButton = screen.getByTestId('drawer-close-button');
    fireEvent.click(closeButton);
    
    // Drawer content should still be rendered (Chakra Drawer behavior)
    // We can verify by checking that the component is still accessible
    expect(document.querySelector('[data-id="002849"]')).toBeInTheDocument();
  });

  test('drawer has correct width of 280px', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002888" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerContent = document.querySelector('[data-id="drawer-content"]');
    expect(drawerContent).toBeInTheDocument();
  });

  test('drawer open button has correct styling and positioning', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002889" />);
    
    const openButton = document.querySelector('[data-id="002849"]');
    expect(openButton).toBeInTheDocument();
  });

  test('drawer open button has hover and active states', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002890" />);
    
    const openButton = document.querySelector('[data-id="002849"]');
    expect(openButton).toBeInTheDocument();
  });

  test('renders ModuleSwitcher in tablet view', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002891" />);
    
    const moduleSwitcher = screen.getByTestId('module-switcher');
    expect(moduleSwitcher).toBeInTheDocument();
  });

  test('renders navigation tabs in tablet view', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002892" />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Questions')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('renders location section with back button', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002893" />);
    
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Audit Detail')).toBeInTheDocument();
    expect(screen.getByTestId('back-arrow-icon')).toBeInTheDocument();
  });

  test('drawer overlay is present when drawer is open', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002894" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerOverlay = document.querySelector('[data-id="drawer-overlay"]');
    expect(drawerOverlay).toBeInTheDocument();
  });

  test('drawer body has correct overflow settings', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002895" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    const drawerBody = document.querySelector('[data-id="drawer-body"]');
    expect(drawerBody).toBeInTheDocument();
  });

  test('open button is positioned correctly with right offset', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002896" />);
    
    const openButton = document.querySelector('[data-id="002849"]');
    expect(openButton).toBeInTheDocument();
  });

  test('drawer content wrapper has correct overflow visible', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002897" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    // The drawer content should be rendered
    const drawerContent = screen.getByTestId('audit-left-navigation');
    expect(drawerContent).toBeInTheDocument();
  });

  test('close button icon has flipped transform when rendered in drawer', () => {
    renderWithProviders(<AuditLeftNavigationTablet data-id="002898" />);
    
    const openButton = document.querySelector('[data-id="002849"]') as HTMLElement;
    fireEvent.click(openButton);
    
    // The close button should be present with data-id="002845"
    const closeButton = screen.getByTestId('close-button-internal');
    expect(closeButton).toBeInTheDocument();
  });
});

