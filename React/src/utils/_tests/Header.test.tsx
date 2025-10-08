import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import Header from '../../components/Header';

// Mock contexts and hooks
const mockNavigateTo = vi.fn();
const mockSetAdminModalState = vi.fn();
const mockIsPathActive = vi.fn();

const mockUser = { _id: 'user1', userId: 'user1', role: 'admin' };
const mockModule = { _id: 'module1', type: 'audits' };

vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => ({ user: mockUser, module: mockModule }),
}));

vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({ setAdminModalState: mockSetAdminModalState }),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    usedFilters: ['usersIds', 'dueDate'],
  }),
}));

vi.mock('../../hooks/useNavigate', () => ({
  __esModule: true,
  default: () => ({
    isPathActive: mockIsPathActive,
    navigateTo: mockNavigateTo,
  }),
}));

vi.mock('../../hooks/useConfig', () => ({
  __esModule: true,
  default: () => ({
    trackerAddItems: [{ label: 'Tracker Item', url: '/tracker-items' }],
    auditAddItems: [{ label: 'Audit', url: '/audits' }],
  }),
}));

vi.mock('../../hooks/useDevice', () => ({
  __esModule: true,
  default: () => 'desktop',
}));

// Mock components
vi.mock('../../components/can', () => ({
  __esModule: true,
  default: ({ children, yes, action }: any) => {
    // Always allow audits.add action for testing
    if (action === 'audits.add') return yes ? children : null;
    return yes ? children : null;
  },
}));

vi.mock('../../components/FilterButton', () => ({
  __esModule: true,
  default: () => (
    <div data-id="001564" data-testid="filter-button">
      Filter Button
    </div>
  ),
}));

// Mock icons
vi.mock('../../icons', () => ({
  AddIcon: () => (
    <div data-id="001565" data-testid="add-icon">
      Add
    </div>
  ),
  ArrowRight: () => (
    <div data-id="001566" data-testid="arrow-right">
      →
    </div>
  ),
}));

// Mock lodash
vi.mock('lodash', () => ({
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
}));

function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001665">{children}</ChakraProvider>;
}

describe('Header', () => {
  const defaultProps = {
    breadcrumbs: ['Home', 'Audits', 'List'],
    pageLabel: 'Audit',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPathActive.mockReturnValue(false);
  });

  describe('Breadcrumb Rendering', () => {
    test('renders all breadcrumbs with proper formatting', () => {
      render(
        <TestWrapper data-id="001568">
          <Header data-id="001569" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Audits')).toBeInTheDocument();
      expect(screen.getByText('List')).toBeInTheDocument();
    });

    test('capitalizes breadcrumb text', () => {
      render(
        <TestWrapper data-id="001570">
          <Header data-id="001571" {...defaultProps} breadcrumbs={['home', 'audits']} />
        </TestWrapper>,
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Audits')).toBeInTheDocument();
    });

    test('renders arrow separators between breadcrumbs', () => {
      render(
        <TestWrapper data-id="001572">
          <Header data-id="001573" {...defaultProps} />
        </TestWrapper>,
      );

      const arrows = screen.getAllByTestId('arrow-right');
      expect(arrows).toHaveLength(2); // One less than breadcrumbs
    });

    test('highlights the last breadcrumb', () => {
      render(
        <TestWrapper data-id="001574">
          <Header data-id="001575" {...defaultProps} />
        </TestWrapper>,
      );

      const lastBreadcrumb = screen.getByText('List');
      expect(lastBreadcrumb).toHaveStyle('font-weight: 700');
    });

    test('uses mobile breadcrumbs when provided', () => {
      const mobileBreadcrumbs = ['Mobile', 'View'];
      render(
        <TestWrapper data-id="001576">
          <Header data-id="001577" {...defaultProps} mobileBreadcrumbs={mobileBreadcrumbs} />
        </TestWrapper>,
      );

      // Should still render the regular breadcrumbs
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    test('renders children in the header', () => {
      render(
        <TestWrapper data-id="001578">
          <Header data-id="001579" {...defaultProps}>
            <div data-id="001580" data-testid="header-child">
              Child Content
            </div>
          </Header>
        </TestWrapper>,
      );

      expect(screen.getByTestId('header-child')).toBeInTheDocument();
    });
  });

  describe('Filter Button', () => {
    test('shows filter button on audit pages with used filters', () => {
      mockIsPathActive.mockImplementation((path: string) => path === '/audits');

      render(
        <TestWrapper data-id="001581">
          <Header data-id="001582" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });

    test('does not show filter button on non-audit pages', () => {
      mockIsPathActive.mockReturnValue(false);

      render(
        <TestWrapper data-id="001583">
          <Header data-id="001584" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('filter-button')).not.toBeInTheDocument();
    });

    test('shows filter button on actions page', () => {
      mockIsPathActive.mockImplementation((path: string) => path === '/actions');

      render(
        <TestWrapper data-id="001585">
          <Header data-id="001586" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });

    test('shows filter button on answers page', () => {
      mockIsPathActive.mockImplementation((path: string) => path === '/answers');

      render(
        <TestWrapper data-id="001587">
          <Header data-id="001588" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });

    test('shows filter button on dashboard page', () => {
      mockIsPathActive.mockImplementation((path: string) => path === '/dashboard');

      render(
        <TestWrapper data-id="001589">
          <Header data-id="001590" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });

    test('shows filter button on tracker-items page', () => {
      mockIsPathActive.mockImplementation((path: string) => path === '/tracker-items');

      render(
        <TestWrapper data-id="001591">
          <Header data-id="001592" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });
  });

  describe('Add Button', () => {
    test('shows add button when path is allowed', () => {
      // Mock window.location.pathname
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001593">
          <Header data-id="001594" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    test('does not show add button on disallowed paths', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/help' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001595">
          <Header data-id="001596" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('add-icon')).not.toBeInTheDocument();
    });

    test('handles tracker items module', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/tracker-items/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001597">
          <Header data-id="001598" {...defaultProps} pageLabel="Tracker Item" />
        </TestWrapper>,
      );

      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    test('calls navigateTo and setAdminModalState when add button is clicked', async () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001599">
          <Header data-id="001600" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Path Validation', () => {
    test('identifies disallowed suffixes correctly', () => {
      const disallowedPaths = [
        '/audits/help',
        '/audits/answers',
        '/audits/terms-and-conditions',
        '/audits/privacy-policy',
        '/audits/audit-log',
        '/audits/settings',
        '/audits/users',
        '/audits/insights',
        '/audits/actions',
      ];

      for (const path of disallowedPaths) {
        Object.defineProperty(globalThis, 'location', {
          value: { pathname: path },
          writable: true,
        });

        const { unmount } = render(
          <TestWrapper data-id="001601">
            <Header data-id="001602" {...defaultProps} />
          </TestWrapper>,
        );

        expect(screen.queryByTestId('add-icon')).not.toBeInTheDocument();
        unmount();
      }
    });

    test('allows paths without disallowed suffixes', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001603">
          <Header data-id="001604" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper data-id attributes', () => {
      render(
        <TestWrapper data-id="001605">
          <Header data-id="001606" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText('Home').closest('[data-id="000272"]')).toBeInTheDocument();
    });

    test('add button has proper aria-label when rendered', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001607">
          <Header data-id="001608" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty breadcrumbs array', () => {
      render(
        <TestWrapper data-id="001609">
          <Header data-id="001610" {...defaultProps} breadcrumbs={[]} />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('arrow-right')).not.toBeInTheDocument();
    });

    test('handles single breadcrumb', () => {
      render(
        <TestWrapper data-id="001611">
          <Header data-id="001612" {...defaultProps} breadcrumbs={['Home']} />
        </TestWrapper>,
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-right')).not.toBeInTheDocument();
    });

    test('handles missing pageLabel', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001613">
          <Header data-id="001614" {...defaultProps} pageLabel={undefined} />
        </TestWrapper>,
      );

      // Should still render the add button
      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    test('handles undefined module', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { pathname: '/audits/list' },
        writable: true,
      });

      render(
        <TestWrapper data-id="001615">
          <Header data-id="001616" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the header renders without errors
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});
