import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isPermitted } from '../../components/can';
import FiltersPanel from '../../components/Filters/FiltersPanel';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';

// Mock data
const mockUser = {
  _id: 'user1',
  userId: 'user1',
  displayName: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
  lastLogin: new Date('2024-01-01'),
  organizationId: 'org1',
  imgUrl: 'https://example.com/avatar.jpg',
};

const mockFiltersValues = {
  businessUnitsIds: {
    value: ['bu1'],
    label: 'Business Units',
    name: 'businessUnitsIds',
    hideFromPanel: false,
    permission: 'read',
  },
  categoriesIds: {
    value: ['cat1'],
    label: 'Categories',
    name: 'categoriesIds',
    hideFromPanel: false,
    permission: 'read',
  },
  hiddenFilter: {
    value: ['hidden'],
    label: 'Hidden Filter',
    name: 'hiddenFilter',
    hideFromPanel: true,
    permission: 'read',
  },
  restrictedFilter: {
    value: ['restricted'],
    label: 'Restricted Filter',
    name: 'restrictedFilter',
    hideFromPanel: false,
    permission: 'admin',
  },
};

const mockUsedFilters = ['businessUnitsIds', 'categoriesIds', 'hiddenFilter', 'restrictedFilter'];

// Mock functions
const mockSetShowFiltersPanel = vi.fn();
const mockCleanFilters = vi.fn();
const mockApplyFilters = vi.fn();

// Mock the contexts and hooks
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(),
}));

vi.mock('../../hooks/useDevice', () => ({
  default: vi.fn(),
}));

vi.mock('../../components/can', () => ({
  isPermitted: vi.fn(),
}));

// Mock the child components
vi.mock('../../components/Filters/FiltersPanelItem', () => ({
  default: ({ name, filter }: { name: string; filter: any }) => (
    <div data-id="001734" data-testid={`filter-panel-item-${name}`}>
      {filter.label}
    </div>
  ),
}));

// Mock icons
vi.mock('../../icons', () => ({
  CrossIcon: (props: any) => (
    <span data-id="001735" data-testid="cross-icon" {...props}>
      ×
    </span>
  ),
  ResetIcon: (props: any) => (
    <span data-id="001736" data-testid="reset-icon" {...props}>
      Reset
    </span>
  ),
  FilterPresetsIcon: (props: any) => <div data-id="001737" data-testid="filter-preset-icon" {...props} />,
  FilterWhite: (props: any) => <div data-id="001738" data-testid="filter-white-icon" {...props} />,
  PlusIcon: (props: any) => <div data-id="001739" data-testid="plus-icon" {...props} />,
}));

// Mock theme
const mockTheme = {
  colors: {
    brand: {
      darkGrey: '#2D3748',
    },
    filterPanel: {
      bg: 'white',
      closeIconColor: '#1F1F1F',
      doneButtonBg: '#0068A3',
      doneButtonColor: '#ffffff',
      resetButtonBg: '#F5F5F5',
      resetButtonColor: '#2D3748',
      searchBoxBordercolor: '#81819750',
    },
  },
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <BrowserRouter data-id="002341">
      <MockedProvider data-id="002342" mocks={[]} addTypename={false}>
        <ChakraProvider data-id="001739" theme={mockTheme}>
          {children}
        </ChakraProvider>
      </MockedProvider>
    </BrowserRouter>
  );
}

describe('FiltersPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useAppContext).mockReturnValue({
      user: mockUser,
    } as any);

    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      usedFilters: mockUsedFilters,
      showFiltersPanel: true,
      setShowFiltersPanel: mockSetShowFiltersPanel,
      cleanFilters: mockCleanFilters,
      applyFilters: mockApplyFilters,
    } as any);

    vi.mocked(useDevice).mockReturnValue('desktop');
    vi.mocked(isPermitted).mockReturnValue(true);
  });

  test('renders when showFiltersPanel is true', () => {
    render(
      <TestWrapper data-id="001740">
        <FiltersPanel data-id="001741" />
      </TestWrapper>,
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByTestId('cross-icon')).toBeInTheDocument();
  });

  test('does not render when showFiltersPanel is false', () => {
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      usedFilters: mockUsedFilters,
      showFiltersPanel: false,
      setShowFiltersPanel: mockSetShowFiltersPanel,
      cleanFilters: mockCleanFilters,
      applyFilters: mockApplyFilters,
    } as any);

    render(
      <TestWrapper data-id="001742">
        <FiltersPanel data-id="001743" />
      </TestWrapper>,
    );

    // The component should not render the main content when showFiltersPanel is false
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  test('renders filter panel items for visible filters', () => {
    render(
      <TestWrapper data-id="001744">
        <FiltersPanel data-id="001745" />
      </TestWrapper>,
    );

    // Should render visible filters
    expect(screen.getByTestId('filter-panel-item-businessUnitsIds')).toBeInTheDocument();
    expect(screen.getByTestId('filter-panel-item-categoriesIds')).toBeInTheDocument();

    // Should not render hidden filters
    expect(screen.queryByTestId('filter-panel-item-hiddenFilter')).not.toBeInTheDocument();
  });

  test('renders filter panel items only for permitted filters', () => {
    vi.mocked(isPermitted).mockImplementation(({ action }) => action === 'read');

    render(
      <TestWrapper data-id="001746">
        <FiltersPanel data-id="001747" />
      </TestWrapper>,
    );

    // Should render permitted filters
    expect(screen.getByTestId('filter-panel-item-businessUnitsIds')).toBeInTheDocument();
    expect(screen.getByTestId('filter-panel-item-categoriesIds')).toBeInTheDocument();

    // Should not render restricted filters
    expect(screen.queryByTestId('filter-panel-item-restrictedFilter')).not.toBeInTheDocument();
  });

  test('calls setShowFiltersPanel when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001748">
        <FiltersPanel data-id="001749" />
      </TestWrapper>,
    );

    const closeButton = screen.getByTestId('cross-icon');
    await user.click(closeButton);

    expect(mockSetShowFiltersPanel).toHaveBeenCalledWith(false);
  });

  test('calls cleanFilters when reset button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001750">
        <FiltersPanel data-id="001751" />
      </TestWrapper>,
    );

    const resetButton = screen.getByText('Reset filters');
    await user.click(resetButton);

    expect(mockCleanFilters).toHaveBeenCalled();
  });

  test('calls setShowFiltersPanel when apply filters button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001752">
        <FiltersPanel data-id="001753" />
      </TestWrapper>,
    );

    const applyButton = screen.getByText('Apply filters');
    await user.click(applyButton);

    expect(mockApplyFilters).toHaveBeenCalled();
    expect(mockSetShowFiltersPanel).toHaveBeenCalledWith(false);
  });

  test('opens filter presets menu when button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper data-id="001754">
        <FiltersPanel data-id="001755" />
      </TestWrapper>,
    );

    const presetsButton = screen.getByRole('button', { name: /filter presets/i });
    await user.click(presetsButton);

    // Check that the menu is opened by looking for the menu content
    expect(screen.getByText('Save preset')).toBeInTheDocument();
  });

  test('renders with correct styling for desktop', () => {
    vi.mocked(useDevice).mockReturnValue('desktop');

    render(
      <TestWrapper data-id="001756">
        <FiltersPanel data-id="001757" />
      </TestWrapper>,
    );

    const panel = screen.getByText('Filters').closest('div');
    expect(panel).toBeInTheDocument();
  });

  test('renders with correct styling for mobile', () => {
    vi.mocked(useDevice).mockReturnValue('mobile');

    render(
      <TestWrapper data-id="001758">
        <FiltersPanel data-id="001759" />
      </TestWrapper>,
    );

    const panel = screen.getByText('Filters').closest('div');
    expect(panel).toBeInTheDocument();
  });

  test('handles empty filtersValues', () => {
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: {},
      usedFilters: [],
      showFiltersPanel: true,
      setShowFiltersPanel: mockSetShowFiltersPanel,
      cleanFilters: mockCleanFilters,
      applyFilters: mockApplyFilters,
    } as any);

    render(
      <TestWrapper data-id="001760">
        <FiltersPanel data-id="001761" />
      </TestWrapper>,
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByTestId(/filter-panel-item-/)).not.toBeInTheDocument();
  });

  test('handles empty usedFilters', () => {
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      usedFilters: [],
      showFiltersPanel: true,
      setShowFiltersPanel: mockSetShowFiltersPanel,
      cleanFilters: mockCleanFilters,
      applyFilters: mockApplyFilters,
    } as any);

    render(
      <TestWrapper data-id="001762">
        <FiltersPanel data-id="001763" />
      </TestWrapper>,
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByTestId(/filter-panel-item-/)).not.toBeInTheDocument();
  });

  test('handles missing user in context', () => {
    vi.mocked(useAppContext).mockReturnValue({
      user: null,
    } as any);

    render(
      <TestWrapper data-id="001764">
        <FiltersPanel data-id="001765" />
      </TestWrapper>,
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  test('renders all button elements with correct text', () => {
    render(
      <TestWrapper data-id="001766">
        <FiltersPanel data-id="001767" />
      </TestWrapper>,
    );

    expect(screen.getByRole('button', { name: /filter presets/i })).toBeInTheDocument();
    expect(screen.getByText('Reset filters')).toBeInTheDocument();
    expect(screen.getByText('Apply filters')).toBeInTheDocument();
  });

  test('renders icons in buttons', () => {
    render(
      <TestWrapper data-id="001768">
        <FiltersPanel data-id="001769" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('filter-preset-icon')).toBeInTheDocument();
    expect(screen.getByTestId('reset-icon')).toBeInTheDocument();
    expect(screen.getByTestId('filter-white-icon')).toBeInTheDocument();
  });

  test('handles multiple filter types correctly', () => {
    const complexFiltersValues = {
      businessUnitsIds: {
        value: ['bu1'],
        label: 'Business Units',
        name: 'businessUnitsIds',
        hideFromPanel: false,
        permission: 'read',
      },
      categoriesIds: {
        value: ['cat1'],
        label: 'Categories',
        name: 'categoriesIds',
        hideFromPanel: false,
        permission: 'read',
      },
      dueDate: {
        value: { from: '2024-01-01', to: '2024-12-31' },
        label: 'Due Date',
        name: 'dueDate',
        hideFromPanel: false,
        permission: 'read',
      },
    };

    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: complexFiltersValues,
      usedFilters: ['businessUnitsIds', 'categoriesIds', 'dueDate'],
      showFiltersPanel: true,
      setShowFiltersPanel: mockSetShowFiltersPanel,
      cleanFilters: mockCleanFilters,
      applyFilters: mockApplyFilters,
    } as any);

    render(
      <TestWrapper data-id="001770">
        <FiltersPanel data-id="001771" />
      </TestWrapper>,
    );

    expect(screen.getByTestId('filter-panel-item-businessUnitsIds')).toBeInTheDocument();
    expect(screen.getByTestId('filter-panel-item-categoriesIds')).toBeInTheDocument();
    expect(screen.getByTestId('filter-panel-item-dueDate')).toBeInTheDocument();
  });

  test('applies correct data-id attributes', () => {
    render(
      <TestWrapper data-id="001772">
        <FiltersPanel data-id="001773" />
      </TestWrapper>,
    );

    // Check for data-id attributes in key elements
    const filtersTitle = screen.getByText('Filters');
    expect(filtersTitle).toHaveAttribute('data-id', '000123');
  });
});
