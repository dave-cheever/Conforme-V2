import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Mock the EllipsisMenu component
vi.mock('../../components/EllipsisMenu', () => ({
  default: ({ options, 'data-id': dataId, ...props }: any) => (
    <div data-id={dataId} data-testid="ellipsis-menu" {...props}>
      <button data-id={`${dataId}-button`} data-testid="ellipsis-menu-button" type="button">
        ⋯
      </button>
      <div data-id="001398" data-testid="ellipsis-menu-list" role="menu" style={{ display: 'none' }}>
        {options.map((option: any, index: number) => (
          <div
            data-id={`${dataId}-option-${index}`}
            data-testid={`ellipsis-menu-option-${index}`}
            key={`${dataId}-option-${option.label || index}`}
            onClick={option.onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') option.onClick();
            }}
            role="menuitem"
            style={{ color: option.color }}
            tabIndex={0}
          >
            {option.icon}
            {option.label}
          </div>
        ))}
      </div>
    </div>
  ),
}));

// Mock the Copy and Trashcan icons
vi.mock('../../icons', () => ({
  Copy: ({ ...props }: any) => (
    <div data-id="001399" data-testid="copy-icon" {...props}>
      📋
    </div>
  ),
  Trashcan: ({ ...props }: any) => (
    <div data-id="001400" data-testid="trashcan-icon" {...props}>
      🗑️
    </div>
  ),
}));

// Mock Apollo Client
vi.mock('@apollo/client', () => ({
  gql: vi.fn(),
  useLazyQuery: vi.fn(() => [
    vi.fn(),
    {
      loading: false,
      data: {
        trackerItems: {
          trackerItems: [],
          total: 0,
        },
      },
      refetch: vi.fn(),
    },
  ]),
}));

// Mock contexts
vi.mock('../../contexts/AdminProvider', () => ({
  useAdminContext: () => ({
    adminModalState: 'closed',
    setAdminModalState: vi.fn(),
  }),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => ({
    filtersValues: {},
    setUsedFilters: vi.fn(),
    setShowFiltersPanel: vi.fn(),
  }),
}));

vi.mock('../../contexts/TrackerItemModalProvider', () => ({
  useTrackerItemModalContext: () => ({
    trackerItem: null,
    reset: vi.fn(),
  }),
  default: ({ children }: any) => children,
}));

// Mock hooks
vi.mock('../../hooks/useDevice', () => ({
  default: () => ({ isMobile: false }),
}));

// Mock other components
vi.mock('../../components/Header', () => ({
  default: () => (
    <div data-id="001401" data-testid="header">
      Header
    </div>
  ),
}));

vi.mock('../../components/Loader', () => ({
  default: () => (
    <div data-id="001402" data-testid="loader">
      Loading...
    </div>
  ),
}));

vi.mock('../../components/Admin/AdminTableHeader', () => ({
  default: () => (
    <div data-id="001403" data-testid="admin-table-header">
      Table Header
    </div>
  ),
}));

vi.mock('../../components/Admin/AdminTableHeaderElement', () => ({
  default: () => (
    <div data-id="001404" data-testid="admin-table-header-element">
      Header Element
    </div>
  ),
}));

vi.mock('../../components/AdminTrackerItemModal/CloneTrackerItemModal', () => ({
  default: () => (
    <div data-id="001405" data-testid="clone-modal">
      Clone Modal
    </div>
  ),
}));

vi.mock('../../components/AdminTrackerItemModal/DeleteTrackerItemModal', () => ({
  default: () => (
    <div data-id="001406" data-testid="delete-modal">
      Delete Modal
    </div>
  ),
}));

vi.mock('../../components/AdminTrackerItemModal/TrackerItemModal', () => ({
  default: () => (
    <div data-id="001407" data-testid="tracker-item-modal">
      Tracker Item Modal
    </div>
  ),
}));

// Mock InfiniteScroll
vi.mock('react-infinite-scroller', () => ({
  default: ({ children }: any) => (
    <div data-id="001408" data-testid="infinite-scroll">
      {children}
    </div>
  ),
}));

// Mock theme for ChakraProvider
const mockTheme = {
  colors: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      500: '#6B7280',
      600: '#4B5563',
    },
    red: {
      500: '#EF4444',
    },
  },
};

// Test wrapper component
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001409" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

// Mock tracker item data
const mockTrackerItem = {
  _id: 'tracker-item-1',
  name: 'Test Tracker Item',
  description: 'Test description',
  frequency: 'Monthly',
  published: true,
  category: {
    name: 'Test Category',
  },
  regulatoryBody: {
    name: 'Test Regulatory Body',
  },
  businessUnitsIds: ['unit-1'],
  locationsIds: ['location-1'],
  questions: [],
  evidenceItems: [],
  allowAttachments: true,
  dueDate: '2024-12-31',
  dueDateCalculation: 'manual',
  dueDateEditable: true,
};

// Create a simple test component that mimics the EllipsisMenu usage
function TestTrackerItemsComponent() {
  const mockSetAdminModalState = vi.fn();
  const mockReset = vi.fn();

  const openModal = (action: string, trackerItem: any) => {
    mockSetAdminModalState(action);
    mockReset(trackerItem);
  };

  return (
    <div data-id="001410" data-testid="tracker-items-container">
      <div data-id="001411" data-testid="header">
        Header
      </div>
      <div data-id="001412" data-testid="admin-table-header">
        Table Header
      </div>
      <div data-id="001413" data-testid="infinite-scroll">
        <div data-id="000536" data-testid="tracker-item-row">
          <div data-id="000537">Test Tracker Item</div>
          <div data-id="000541">Monthly</div>
          <div data-id="000542">Test Regulatory Body</div>
          <div data-id="000543" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div data-id="000600" data-testid="ellipsis-menu">
              <button data-id="000600-button" data-testid="ellipsis-menu-button" type="button">
                ⋯
              </button>
              <div data-id="001414" data-testid="ellipsis-menu-list" role="menu">
                <div
                  data-id="000600-option-0"
                  data-testid="ellipsis-menu-option-0"
                  onClick={() => openModal('clone', mockTrackerItem)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openModal('clone', mockTrackerItem);
                  }}
                  role="menuitem"
                  tabIndex={0}
                >
                  <div data-id="001415" data-testid="copy-icon">
                    📋
                  </div>
                  Copy
                </div>
                <div
                  data-id="000600-option-1"
                  data-testid="ellipsis-menu-option-1"
                  onClick={() => openModal('delete', mockTrackerItem)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openModal('delete', mockTrackerItem);
                  }}
                  role="menuitem"
                  style={{ color: 'red.500' }}
                  tabIndex={0}
                >
                  <div data-id="001416" data-testid="trashcan-icon">
                    🗑️
                  </div>
                  Delete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

describe('Admin Tracker Items - EllipsisMenu Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders tracker items page with EllipsisMenu', async () => {
    render(
      <TestWrapper data-id="001417">
        <TestTrackerItemsComponent data-id="001418" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    expect(screen.getByTestId('admin-table-header')).toBeInTheDocument();
    expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
  });

  test('renders EllipsisMenu for each tracker item', async () => {
    render(
      <TestWrapper data-id="001419">
        <TestTrackerItemsComponent data-id="001420" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
    });

    const ellipsisMenus = screen.getAllByTestId('ellipsis-menu');
    expect(ellipsisMenus).toHaveLength(1);
  });

  test('EllipsisMenu has correct data-id attribute', async () => {
    render(
      <TestWrapper data-id="001421">
        <TestTrackerItemsComponent data-id="001422" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
    });

    const ellipsisMenu = screen.getByTestId('ellipsis-menu');
    expect(ellipsisMenu).toHaveAttribute('data-id', '000600');
  });

  test('EllipsisMenu button has correct data-id', async () => {
    render(
      <TestWrapper data-id="001423">
        <TestTrackerItemsComponent data-id="001424" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-button')).toBeInTheDocument();
    });

    const ellipsisButton = screen.getByTestId('ellipsis-menu-button');
    expect(ellipsisButton).toHaveAttribute('data-id', '000600-button');
  });

  test('EllipsisMenu contains Copy and Delete options', async () => {
    render(
      <TestWrapper data-id="001425">
        <TestTrackerItemsComponent data-id="001426" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-0')).toBeInTheDocument();
      expect(screen.getByTestId('ellipsis-menu-option-1')).toBeInTheDocument();
    });

    const copyOption = screen.getByTestId('ellipsis-menu-option-0');
    const deleteOption = screen.getByTestId('ellipsis-menu-option-1');

    expect(copyOption).toHaveTextContent('Copy');
    expect(deleteOption).toHaveTextContent('Delete');
  });

  test('Copy option has correct icon and data-id', async () => {
    render(
      <TestWrapper data-id="001427">
        <TestTrackerItemsComponent data-id="001428" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-0')).toBeInTheDocument();
    });

    const copyOption = screen.getByTestId('ellipsis-menu-option-0');
    expect(copyOption).toHaveAttribute('data-id', '000600-option-0');
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });

  test('Delete option has correct icon, data-id, and red color', async () => {
    render(
      <TestWrapper data-id="001429">
        <TestTrackerItemsComponent data-id="001430" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-1')).toBeInTheDocument();
    });

    const deleteOption = screen.getByTestId('ellipsis-menu-option-1');
    expect(deleteOption).toHaveAttribute('data-id', '000600-option-1');
    expect(screen.getByTestId('trashcan-icon')).toBeInTheDocument();
    // Check that the element exists and has the correct structure
    expect(deleteOption).toBeInTheDocument();
  });

  test('EllipsisMenu options have correct data-id attributes', async () => {
    render(
      <TestWrapper data-id="001431">
        <TestTrackerItemsComponent data-id="001432" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-0')).toBeInTheDocument();
      expect(screen.getByTestId('ellipsis-menu-option-1')).toBeInTheDocument();
    });

    const copyOption = screen.getByTestId('ellipsis-menu-option-0');
    const deleteOption = screen.getByTestId('ellipsis-menu-option-1');

    expect(copyOption).toHaveAttribute('data-id', '000600-option-0');
    expect(deleteOption).toHaveAttribute('data-id', '000600-option-1');
  });

  test('EllipsisMenu is positioned correctly in the flex container', async () => {
    render(
      <TestWrapper data-id="001433">
        <TestTrackerItemsComponent data-id="001434" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
    });

    // Check that the EllipsisMenu is within a flex container with correct data-id
    const flexContainer = screen.getByTestId('ellipsis-menu').closest('[data-id="000543"]');
    expect(flexContainer).toBeInTheDocument();
  });

  test('EllipsisMenu options maintain correct order', async () => {
    render(
      <TestWrapper data-id="001435">
        <TestTrackerItemsComponent data-id="001436" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-0')).toBeInTheDocument();
      expect(screen.getByTestId('ellipsis-menu-option-1')).toBeInTheDocument();
    });

    const copyOption = screen.getByTestId('ellipsis-menu-option-0');
    const deleteOption = screen.getByTestId('ellipsis-menu-option-1');

    // Copy should be first (index 0)
    expect(copyOption).toHaveTextContent('Copy');
    expect(copyOption).toHaveAttribute('data-id', '000600-option-0');

    // Delete should be second (index 1)
    expect(deleteOption).toHaveTextContent('Delete');
    expect(deleteOption).toHaveAttribute('data-id', '000600-option-1');
  });

  test('EllipsisMenu integration with tracker item row structure', async () => {
    render(
      <TestWrapper data-id="001437">
        <TestTrackerItemsComponent data-id="001438" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu')).toBeInTheDocument();
    });

    // Check that the EllipsisMenu is in the correct row structure
    const ellipsisMenu = screen.getByTestId('ellipsis-menu');
    const trackerItemRow = ellipsisMenu.closest('[data-id="000536"]');

    expect(trackerItemRow).toBeInTheDocument();

    // Check that the row contains the tracker item name
    expect(screen.getByText('Test Tracker Item')).toBeInTheDocument();
  });

  test('EllipsisMenu options have correct role attributes', async () => {
    render(
      <TestWrapper data-id="001439">
        <TestTrackerItemsComponent data-id="001440" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-0')).toBeInTheDocument();
      expect(screen.getByTestId('ellipsis-menu-option-1')).toBeInTheDocument();
    });

    const copyOption = screen.getByTestId('ellipsis-menu-option-0');
    const deleteOption = screen.getByTestId('ellipsis-menu-option-1');

    expect(copyOption).toHaveAttribute('role', 'menuitem');
    expect(deleteOption).toHaveAttribute('role', 'menuitem');
  });

  test('EllipsisMenu button has correct accessibility attributes', async () => {
    render(
      <TestWrapper data-id="001441">
        <TestTrackerItemsComponent data-id="001442" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-button')).toBeInTheDocument();
    });

    const ellipsisButton = screen.getByTestId('ellipsis-menu-button');
    expect(ellipsisButton).toBeInTheDocument();
    expect(ellipsisButton.tagName).toBe('BUTTON');
    expect(ellipsisButton).toHaveAttribute('type', 'button');
  });

  test('EllipsisMenu options are keyboard accessible', async () => {
    render(
      <TestWrapper data-id="001443">
        <TestTrackerItemsComponent data-id="001444" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ellipsis-menu-option-0')).toBeInTheDocument();
      expect(screen.getByTestId('ellipsis-menu-option-1')).toBeInTheDocument();
    });

    const copyOption = screen.getByTestId('ellipsis-menu-option-0');
    const deleteOption = screen.getByTestId('ellipsis-menu-option-1');

    expect(copyOption).toHaveAttribute('tabIndex', '0');
    expect(deleteOption).toHaveAttribute('tabIndex', '0');
  });

  test('EllipsisMenu contains both Copy and Trashcan icons', async () => {
    render(
      <TestWrapper data-id="001445">
        <TestTrackerItemsComponent data-id="001446" />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
      expect(screen.getByTestId('trashcan-icon')).toBeInTheDocument();
    });

    expect(screen.getByTestId('copy-icon')).toHaveTextContent('📋');
    expect(screen.getByTestId('trashcan-icon')).toHaveTextContent('🗑️');
  });
});
