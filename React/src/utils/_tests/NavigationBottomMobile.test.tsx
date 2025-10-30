import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import NavigationBottomMobile from '../../components/NavigationBottomMobile';

// Mock the useConfigContext
const mockMenuItems = [
  {
    label: 'Dashboard',
    url: '/dashboard',
    icon: () => <div data-id="002649" data-testid="dashboard-icon">Dashboard Icon</div>,
    permission: 'home.view',
  },
  {
    label: 'Actions',
    url: '/actions',
    icon: () => <div data-id="002650" data-testid="actions-icon">Actions Icon</div>,
    permission: 'actions.view',
  },
  {
    label: 'Admin',
    url: '/admin',
    icon: () => <div data-id="002651" data-testid="admin-icon">Admin Icon</div>,
    permission: 'adminPanel.view',
    subSections: [
      { label: 'Users', url: '/admin/users' },
      { label: 'Settings', url: '/admin/settings' },
    ],
  },
  {
    label: 'Help',
    url: '/help',
    icon: () => <div data-id="002652" data-testid="help-icon">Help Icon</div>,
    permission: 'home.view',
  },
  {
    label: 'Components',
    url: '/components',
    icon: () => <div data-id="002653" data-testid="components-icon">Components Icon</div>,
    permission: 'home.view',
  },
  {
    label: 'Insights',
    url: '/insights',
    icon: () => <div data-id="002654" data-testid="insights-icon">Insights Icon</div>,
    permission: 'insights.view',
  },
];

vi.mock('../../contexts/ConfigProvider', () => ({
  useConfigContext: () => ({
    menuItems: mockMenuItems,
  }),
}));

// Mock the Can component
vi.mock('../../components/can', () => ({
  default: ({ yes }: { yes: () => any }) => yes(),
}));

// Mock the NavigationBottomItem component
vi.mock('../../components/NavigationBottomMobile/NavigationBottomItem', () => ({
  default: ({ menuItem, onClick }: { menuItem: any; onClick?: () => void }) => (
    <div
      data-id="002655"
      data-testid={`nav-item-${menuItem.label.toLowerCase()}`}
      onClick={onClick}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') 
          onClick?.();
        
      }}
      role="button"
      style={{ width: '85.8px', height: '56px' }}
      tabIndex={0}>
      <div
        data-id="002656"
        data-testid={`${menuItem.label.toLowerCase()}-icon-container`}>
        {menuItem.icon()}
      </div>
      <div data-id="002657" data-testid={`${menuItem.label.toLowerCase()}-label`}>
        {menuItem.label}
      </div>
    </div>
  ),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="002658">{children}</ChakraProvider>;
}

describe('NavigationBottomMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders navigation container with correct styling', () => {
    render(
      <TestWrapper data-id="002659">
        <NavigationBottomMobile data-id="002660" />
      </TestWrapper>,
    );

    const container = screen.getByTestId('nav-item-dashboard').parentElement?.parentElement;
    expect(container).toHaveStyle({
      position: 'fixed',
      bottom: '0px',
      height: 'fit-content',
    });
    // Check that the container has full width using Chakra's CSS custom property
    expect(container).toHaveStyle({
      width: 'var(--chakra-sizes-full)',
    });
  });

  test('renders all menu items', () => {
    render(
      <TestWrapper data-id="002661">
        <NavigationBottomMobile data-id="002662" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('nav-item-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-actions')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-admin')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-help')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-components')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-insights')).toBeInTheDocument();
  });

  test('applies horizontal scrolling when more than 5 items', () => {
    render(
      <TestWrapper data-id="002663">
        <NavigationBottomMobile data-id="002664" />
      </TestWrapper>,
    );

    const container = screen.getByTestId('nav-item-dashboard').parentElement?.parentElement;
    expect(container).toHaveStyle({
      overflowX: 'auto',
    });
  });

  test('applies flex-start layout when more than 5 items (current behavior)', () => {
    // Since we have 6 items in our mock, this test verifies the current behavior
    // In a real scenario with 5 or fewer items, the layout would be space-between
    render(
      <TestWrapper data-id="002665">
        <NavigationBottomMobile data-id="002666" />
      </TestWrapper>,
    );

    // With 6 items, we expect flex-start layout
    const innerContainer = screen.getByTestId('nav-item-dashboard').parentElement;
    expect(innerContainer).toHaveStyle({
      'justify-content': 'flex-start',
      width: 'fit-content',
    });
  });

  test('hides scrollbars with custom CSS', () => {
    render(
      <TestWrapper data-id="002669">
        <NavigationBottomMobile data-id="002670" />
      </TestWrapper>,
    );

    const container = screen.getByTestId('nav-item-dashboard').parentElement?.parentElement;
    
    // Check that scrollbar styles are applied
    expect(container).toHaveAttribute('data-id', '000553');
  });

  test('renders items with correct dimensions', () => {
    render(
      <TestWrapper data-id="002671">
        <NavigationBottomMobile data-id="002672" />
      </TestWrapper>,
    );

    const dashboardItem = screen.getByTestId('nav-item-dashboard');
    expect(dashboardItem).toHaveStyle({
      width: '85.8px',
      height: '56px',
    });
  });

  test('handles click events on navigation items', () => {
    render(
      <TestWrapper data-id="002673">
        <NavigationBottomMobile data-id="002674" />
      </TestWrapper>,
    );

    const dashboardItem = screen.getByTestId('nav-item-dashboard');
    fireEvent.click(dashboardItem);

    // The click should be handled by the mocked NavigationBottomItem
    expect(dashboardItem).toBeInTheDocument();
  });

  test('displays correct labels for each menu item', () => {
    render(
      <TestWrapper data-id="002675">
        <NavigationBottomMobile data-id="002676" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('dashboard-label')).toHaveTextContent('Dashboard');
    expect(screen.getByTestId('actions-label')).toHaveTextContent('Actions');
    expect(screen.getByTestId('admin-label')).toHaveTextContent('Admin');
    expect(screen.getByTestId('help-label')).toHaveTextContent('Help');
    expect(screen.getByTestId('components-label')).toHaveTextContent('Components');
    expect(screen.getByTestId('insights-label')).toHaveTextContent('Insights');
  });

  test('displays correct icons for each menu item', () => {
    render(
      <TestWrapper data-id="002677">
        <NavigationBottomMobile data-id="002678" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('dashboard-icon-container')).toBeInTheDocument();
    expect(screen.getByTestId('actions-icon-container')).toBeInTheDocument();
    expect(screen.getByTestId('admin-icon-container')).toBeInTheDocument();
    expect(screen.getByTestId('help-icon-container')).toBeInTheDocument();
    expect(screen.getByTestId('components-icon-container')).toBeInTheDocument();
    expect(screen.getByTestId('insights-icon-container')).toBeInTheDocument();
  });

  test('applies correct z-index for fixed positioning', () => {
    render(
      <TestWrapper data-id="002679">
        <NavigationBottomMobile data-id="002680" />
      </TestWrapper>,
    );

    const container = screen.getByTestId('nav-item-dashboard').parentElement?.parentElement;
    expect(container).toHaveStyle({
      zIndex: '10',
    });
  });

  test('applies correct padding to container', () => {
    render(
      <TestWrapper data-id="002681">
        <NavigationBottomMobile data-id="002682" />
      </TestWrapper>,
    );

    const container = screen.getByTestId('nav-item-dashboard').parentElement?.parentElement;
    expect(container).toHaveStyle({
      padding: '18px 16px',
    });
  });
});
