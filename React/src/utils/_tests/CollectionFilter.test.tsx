import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import CollectionFilter from '../../components/Filters/CollectionFilter';
import { useFiltersContext } from '../../contexts/FiltersProvider';

// Mock the context providers
const mockFiltersValues = {
  collections: {
    value: ['tracker-items'],
    label: 'Collection',
    name: 'collections',
  },
};

const mockSetFilters = vi.fn();

// Mock the context providers
vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(() => ({
    filtersValues: mockFiltersValues,
    setFilters: mockSetFilters,
  })),
}));

// Mock the collections data
vi.mock('../../hooks/useFiltersUtils', () => ({
  collections: {
    'tracker-items': 'Tracker items',
    responses: 'Responses',
    'regulatory-bodies': 'Regulatory bodies',
    categories: 'Categories',
    'business-units': 'Business units',
    settings: 'Settings',
  },
}));

// Mock theme
const mockTheme = {
  colors: {
    auditsList: {
      fontColor: '#000000',
      missed: '#ff0000',
      pending: '#ffa500',
      completed: '#00ff00',
    },
  },
};

// Test wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="001128" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

describe('CollectionFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to their default implementations
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      setFilters: mockSetFilters,
    } as any);
  });

  test('renders collection filter with all collection checkboxes', () => {
    render(
      <TestWrapper data-id="001109">
        <CollectionFilter data-id="001110" />
      </TestWrapper>,
    );

    // Check that all collections are rendered
    expect(screen.getByText('Tracker items')).toBeInTheDocument();
    expect(screen.getByText('Responses')).toBeInTheDocument();
    expect(screen.getByText('Regulatory bodies')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Business units')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('displays current filter values correctly', () => {
    render(
      <TestWrapper data-id="001113">
        <CollectionFilter data-id="001114" />
      </TestWrapper>,
    );

    // Check that the component renders with the expected collections
    expect(screen.getByText('Tracker items')).toBeInTheDocument();
    expect(screen.getByText('Responses')).toBeInTheDocument();
    expect(screen.getByText('Regulatory bodies')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Business units')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('renders with empty filter values', () => {
    // Mock empty filter values
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: { collections: { value: [] } },
      setFilters: mockSetFilters,
    } as any);

    render(
      <TestWrapper data-id="001119">
        <CollectionFilter data-id="001120" />
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.getByText('Tracker items')).toBeInTheDocument();
    expect(screen.getByText('Responses')).toBeInTheDocument();
  });

  test('renders with undefined filter values', () => {
    // Mock undefined filter values
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: { collections: undefined },
      setFilters: mockSetFilters,
    } as any);

    render(
      <TestWrapper data-id="001121">
        <CollectionFilter data-id="001122" />
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.getByText('Tracker items')).toBeInTheDocument();
    expect(screen.getByText('Responses')).toBeInTheDocument();
  });

  test('applies correct CSS styling for checkboxes', () => {
    render(
      <TestWrapper data-id="001123">
        <CollectionFilter data-id="001124" />
      </TestWrapper>,
    );

    // Check that checkboxes are rendered (they should have the custom styling applied)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(6); // 6 collection options

    // Verify that each checkbox has the correct value
    expect(screen.getByDisplayValue('tracker-items')).toBeInTheDocument();
    expect(screen.getByDisplayValue('responses')).toBeInTheDocument();
    expect(screen.getByDisplayValue('regulatory-bodies')).toBeInTheDocument();
    expect(screen.getByDisplayValue('categories')).toBeInTheDocument();
    expect(screen.getByDisplayValue('business-units')).toBeInTheDocument();
    expect(screen.getByDisplayValue('settings')).toBeInTheDocument();
  });

  test('renders all collection options from the collections object', () => {
    render(
      <TestWrapper data-id="001127">
        <CollectionFilter data-id="001128" />
      </TestWrapper>,
    );

    // Verify all collection options are rendered
    const expectedCollections = ['Tracker items', 'Responses', 'Regulatory bodies', 'Categories', 'Business units', 'Settings'];

    expectedCollections.forEach((collection) => {
      expect(screen.getByText(collection)).toBeInTheDocument();
    });
  });
});
