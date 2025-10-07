import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import FiltersPanelItem from '../../components/Filters/FiltersPanelItem';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import IFilter from '../../interfaces/IFilter';

// Mock data
const mockFilter: IFilter = {
  name: 'testFilter',
  value: ['option1', 'option2'],
  hideFromPanel: false,
  permission: 'read',
};

const mockFiltersValues = {
  testFilter: {
    name: 'testFilter',
    value: ['option1', 'option2'],
  },
  businessUnitsIds: {
    name: 'businessUnitsIds',
    value: ['bu1'],
  },
  categoriesIds: {
    name: 'categoriesIds',
    value: ['cat1'],
  },
  trackerItemsIds: {
    name: 'trackerItemsIds',
    value: ['ti1'],
  },
  dueDate: {
    name: 'dueDate',
    value: ['2024-01-01', '2024-12-31'],
  },
  createdDate: {
    name: 'createdDate',
    value: ['2024-01-01', '2024-12-31'],
  },
  locationsIds: {
    name: 'locationsIds',
    value: ['loc1'],
  },
  regulatoryBodiesIds: {
    name: 'regulatoryBodiesIds',
    value: ['rb1'],
  },
  usersIds: {
    name: 'usersIds',
    value: ['user1'],
  },
  Status: {
    name: 'Status',
    value: ['active'],
  },
  showArchived: {
    name: 'showArchived',
    value: false,
  },
};

// Mock functions
const mockSetFilters = vi.fn();

// Mock the context
vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(),
}));

// Mock child filter components
vi.mock('../../components/Filters/BusinessUnitFilter', () => ({
  default: () => <div data-id="001774" data-testid="business-unit-filter">Business Unit Filter</div>,
}));

vi.mock('../../components/Filters/CategoryFilter', () => ({
  default: () => <div data-id="001775" data-testid="category-filter">Category Filter</div>,
}));

vi.mock('../../components/Filters/TrackerItemFilter', () => ({
  default: () => <div data-id="001776" data-testid="tracker-item-filter">Tracker Item Filter</div>,
}));

vi.mock('../../components/Filters/DateFilter', () => ({
  default: ({ filterName }: { filterName: string }) => <div data-id="001777" data-testid={`date-filter-${filterName}`}>Date Filter: {filterName}</div>,
}));

vi.mock('../../components/Filters/LocationFilter', () => ({
  default: () => <div data-id="001778" data-testid="location-filter">Location Filter</div>,
}));

vi.mock('../../components/Filters/RegulatoryBodyFilter', () => ({
  default: () => <div data-id="001779" data-testid="regulatory-body-filter">Regulatory Body Filter</div>,
}));

vi.mock('../../components/Filters/UserFilter', () => ({
  default: () => <div data-id="001780" data-testid="user-filter">User Filter</div>,
}));

vi.mock('../../components/Filters/TrackerItemStatusFilter', () => ({
  default: ({ name }: { name: string }) => <div data-id="001781" data-testid={`tracker-item-status-filter-${name}`}>Tracker Item Status Filter: {name}</div>,
}));

vi.mock('../../components/Filters/StateChoiceFilter', () => ({
  default: ({ name }: { name: string }) => <div data-id="001782" data-testid={`state-choice-filter-${name}`}>State Choice Filter: {name}</div>,
}));

vi.mock('../../components/Filters/ShowArchivedFilter', () => ({
  default: () => <div data-id="001783" data-testid="show-archived-filter">Show Archived Filter</div>,
}));

// Mock icons
vi.mock('../../icons', () => ({
  ArrowDownSmall: ({ onClick, ...props }: any) => (
    <button
      data-id="001784"
      data-testid="arrow-down-small"
      onClick={onClick}
      type="button"
      {...props}>
      ↓
    </button>
  ),
  ArrowUpSmall: ({ onClick, ...props }: any) => (
    <button
      data-id="001785"
      data-testid="arrow-up-small"
      onClick={onClick}
      type="button"
      {...props}>
      ↑
    </button>
  ),
  ResetIcon: ({ onClick, ...props }: any) => (
    <button
      data-id="001786"
      data-testid="reset-icon"
      onClick={onClick}
      type="button"
      {...props}>
      Reset
    </button>
  ),
}));

// Mock theme
const mockTheme = {
  colors: {
    filtersPanelItem: {
      openBg: '#EDF2F7',
      closeBg: '#EDF2F7',
      fontColor: '#1A202C',
      countColor: 'white',
      countBg: '#2D3748',
    },
  },
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ChakraProvider data-id="001787" theme={mockTheme}>{children}</ChakraProvider>;
}

describe('FiltersPanelItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFiltersContext).mockReturnValue({
      setFilters: mockSetFilters,
      filtersValues: mockFiltersValues,
    } as any);
  });

  test('renders filter name correctly', () => {
    render(
      <TestWrapper data-id="001788">
        <FiltersPanelItem data-id="001789" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.getByText('testFilter')).toBeInTheDocument();
  });

  test('renders with closed state by default', () => {
    render(
      <TestWrapper data-id="001790">
        <FiltersPanelItem data-id="001791" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('arrow-down-small')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up-small')).not.toBeInTheDocument();
  });

  test('toggles open/closed state when clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001792">
        <FiltersPanelItem data-id="001793" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    const toggleButton = screen.getByTestId('arrow-down-small');
    await user.click(toggleButton);

    expect(screen.getByTestId('arrow-up-small')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-down-small')).not.toBeInTheDocument();
  });

  test('shows filter count when filter has values', () => {
    render(
      <TestWrapper data-id="001794">
        <FiltersPanelItem data-id="001795" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Array length
  });

  test('does not show filter count when filter has no values', () => {
    const emptyFilter = { ...mockFilter, value: [] };

    render(
      <TestWrapper data-id="001796">
        <FiltersPanelItem data-id="001797" filter={emptyFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  test('shows reset button when open and has values', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001798">
        <FiltersPanelItem data-id="001799" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    // Open the filter
    const toggleButton = screen.getByTestId('arrow-down-small');
    await user.click(toggleButton);

    expect(screen.getByTestId('reset-icon')).toBeInTheDocument();
  });

  test('does not show reset button when closed', () => {
    render(
      <TestWrapper data-id="001800">
        <FiltersPanelItem data-id="001801" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.queryByTestId('reset-icon')).not.toBeInTheDocument();
  });

  test('does not show reset button when no values', async () => {
    const user = userEvent.setup();
    const emptyFilter = { ...mockFilter, value: [] };

    // Mock the context to return empty values for this test
    vi.mocked(useFiltersContext).mockReturnValue({
      setFilters: mockSetFilters,
      filtersValues: {
        testFilter: {
          name: 'testFilter',
          value: [],
        },
      },
    } as any);

    render(
      <TestWrapper data-id="001802">
        <FiltersPanelItem data-id="001803" filter={emptyFilter} name="testFilter" />
      </TestWrapper>,
    );

    // Open the filter
    const toggleButton = screen.getByTestId('arrow-down-small');
    await user.click(toggleButton);

    expect(screen.queryByTestId('reset-icon')).not.toBeInTheDocument();
  });

  test('calls setFilters when reset button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001804">
        <FiltersPanelItem data-id="001805" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    // Open the filter
    const toggleButton = screen.getByTestId('arrow-down-small');
    await user.click(toggleButton);

    // Click reset
    const resetButton = screen.getByTestId('reset-icon');
    await user.click(resetButton);

    expect(mockSetFilters).toHaveBeenCalledWith({
      filters: {
        ...mockFiltersValues,
        testFilter: {
          name: 'testFilter',
          value: [],
        },
      },
    });
  });

  test('renders correct filter component for businessUnitsIds', () => {
    render(
      <TestWrapper data-id="001806">
        <FiltersPanelItem
          data-id="001807"
          filter={mockFiltersValues.businessUnitsIds}
          name="businessUnitsIds" />
      </TestWrapper>,
    );

    expect(screen.getByText('businessUnitsIds')).toBeInTheDocument();
  });

  test('renders correct filter component for categoriesIds', () => {
    render(
      <TestWrapper data-id="001808">
        <FiltersPanelItem
          data-id="001809"
          filter={mockFiltersValues.categoriesIds}
          name="categoriesIds" />
      </TestWrapper>,
    );

    expect(screen.getByText('categoriesIds')).toBeInTheDocument();
  });

  test('renders correct filter component for trackerItemsIds', () => {
    render(
      <TestWrapper data-id="001810">
        <FiltersPanelItem
          data-id="001811"
          filter={mockFiltersValues.trackerItemsIds}
          name="trackerItemsIds" />
      </TestWrapper>,
    );

    expect(screen.getByText('trackerItemsIds')).toBeInTheDocument();
  });

  test('renders correct filter component for dueDate', () => {
    render(
      <TestWrapper data-id="001812">
        <FiltersPanelItem data-id="001813" filter={mockFiltersValues.dueDate} name="dueDate" />
      </TestWrapper>,
    );

    expect(screen.getByText('dueDate')).toBeInTheDocument();
  });

  test('renders correct filter component for createdDate', () => {
    render(
      <TestWrapper data-id="001814">
        <FiltersPanelItem
          data-id="001815"
          filter={mockFiltersValues.createdDate}
          name="createdDate" />
      </TestWrapper>,
    );

    expect(screen.getByText('createdDate')).toBeInTheDocument();
  });

  test('renders correct filter component for locationsIds', () => {
    render(
      <TestWrapper data-id="001816">
        <FiltersPanelItem
          data-id="001817"
          filter={mockFiltersValues.locationsIds}
          name="locationsIds" />
      </TestWrapper>,
    );

    expect(screen.getByText('locationsIds')).toBeInTheDocument();
  });

  test('renders correct filter component for regulatoryBodiesIds', () => {
    render(
      <TestWrapper data-id="001818">
        <FiltersPanelItem
          data-id="001819"
          filter={mockFiltersValues.regulatoryBodiesIds}
          name="regulatoryBodiesIds" />
      </TestWrapper>,
    );

    expect(screen.getByText('regulatoryBodiesIds')).toBeInTheDocument();
  });

  test('renders correct filter component for usersIds', () => {
    render(
      <TestWrapper data-id="001820">
        <FiltersPanelItem data-id="001821" filter={mockFiltersValues.usersIds} name="usersIds" />
      </TestWrapper>,
    );

    expect(screen.getByText('usersIds')).toBeInTheDocument();
  });

  test('renders correct filter component for Status', () => {
    render(
      <TestWrapper data-id="001822">
        <FiltersPanelItem data-id="001823" filter={mockFiltersValues.Status} name="Status" />
      </TestWrapper>,
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('renders ShowArchivedFilter for showArchived', () => {
    render(
      <TestWrapper data-id="001824">
        <FiltersPanelItem
          data-id="001825"
          filter={mockFiltersValues.showArchived}
          name="showArchived" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('show-archived-filter')).toBeInTheDocument();
  });

  test('renders StateChoiceFilter for unknown filter types', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001826">
        <FiltersPanelItem data-id="001827" filter={mockFilter} name="unknownFilter" />
      </TestWrapper>,
    );

    // Open the filter to render the child component
    const toggleButton = screen.getByTestId('arrow-down-small');
    await user.click(toggleButton);

    expect(screen.getByTestId('state-choice-filter-unknownFilter')).toBeInTheDocument();
  });

  test('calculates filter count correctly for array values', () => {
    const arrayFilter = { ...mockFilter, value: ['item1', 'item2', 'item3'] };

    // Mock the context to return the array values
    vi.mocked(useFiltersContext).mockReturnValue({
      setFilters: mockSetFilters,
      filtersValues: {
        testFilter: {
          name: 'testFilter',
          value: ['item1', 'item2', 'item3'],
        },
      },
    } as any);

    render(
      <TestWrapper data-id="001828">
        <FiltersPanelItem data-id="001829" filter={arrayFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('calculates filter count correctly for object values', () => {
    const objectFilter = {
      ...mockFilter,
      value: ['date1', 'date2', 'date3'],
    };

    // Mock the context to return the object values
    vi.mocked(useFiltersContext).mockReturnValue({
      setFilters: mockSetFilters,
      filtersValues: {
        testFilter: {
          name: 'testFilter',
          value: ['date1', 'date2', 'date3'],
        },
      },
    } as any);

    render(
      <TestWrapper data-id="001830">
        <FiltersPanelItem data-id="001831" filter={objectFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('handles null filter value', () => {
    const nullFilter = { ...mockFilter, value: null };

    render(
      <TestWrapper data-id="001832">
        <FiltersPanelItem data-id="001833" filter={nullFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  test('handles undefined filter value', () => {
    const undefinedFilter = { ...mockFilter, value: undefined };

    render(
      <TestWrapper data-id="001834">
        <FiltersPanelItem data-id="001835" filter={undefinedFilter} name="testFilter" />
      </TestWrapper>,
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  test('handles missing filter in filtersValues', () => {
    vi.mocked(useFiltersContext).mockReturnValue({
      setFilters: mockSetFilters,
      filtersValues: {},
    } as any);

    render(
      <TestWrapper data-id="001836">
        <FiltersPanelItem data-id="001837" filter={mockFilter} name="missingFilter" />
      </TestWrapper>,
    );

    expect(screen.getByText('testFilter')).toBeInTheDocument();
  });

  test('renders with correct data-id attributes', () => {
    render(
      <TestWrapper data-id="001838">
        <FiltersPanelItem data-id="001839" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    // Check for data-id attributes in key elements
    const filterContainer = screen.getByText('testFilter').closest('div');
    expect(filterContainer).toBeInTheDocument();
  });

  test('handles complex nested object values', () => {
    const complexFilter = {
      ...mockFilter,
      value: ['cat1', 'cat2', 'active', '2024-01-01', '2024-12-31'],
    };

    // Mock the context to return the complex values
    vi.mocked(useFiltersContext).mockReturnValue({
      setFilters: mockSetFilters,
      filtersValues: {
        testFilter: {
          name: 'testFilter',
          value: ['cat1', 'cat2', 'active', '2024-01-01', '2024-12-31'],
        },
      },
    } as any);

    render(
      <TestWrapper data-id="001840">
        <FiltersPanelItem data-id="001841" filter={complexFilter} name="testFilter" />
      </TestWrapper>,
    );

    // Should calculate total count: 5
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('maintains state when toggling multiple times', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001842">
        <FiltersPanelItem data-id="001843" filter={mockFilter} name="testFilter" />
      </TestWrapper>,
    );

    const toggleButton = screen.getByTestId('arrow-down-small');

    // Toggle open
    await user.click(toggleButton);
    expect(screen.getByTestId('arrow-up-small')).toBeInTheDocument();

    // Toggle closed
    await user.click(screen.getByTestId('arrow-up-small'));
    expect(screen.getByTestId('arrow-down-small')).toBeInTheDocument();

    // Toggle open again
    await user.click(screen.getByTestId('arrow-down-small'));
    expect(screen.getByTestId('arrow-up-small')).toBeInTheDocument();
  });
});
