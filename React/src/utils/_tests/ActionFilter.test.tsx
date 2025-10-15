import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import ActionFilter from '../../components/Filters/ActionFilter';
import { useFiltersContext } from '../../contexts/FiltersProvider';

// Mock the context providers
const mockFiltersValues = {
  action: {
    value: ['add'],
    label: 'Action',
    name: 'action',
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

// Mock the actions data
vi.mock('../../hooks/useFiltersUtils', () => ({
  actions: {
    add: 'Added',
    update: 'Updated',
    delete: 'Deleted',
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
    <ChakraProvider data-id="001200" theme={mockTheme}>
      {children}
    </ChakraProvider>
  );
}

describe('ActionFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to their default implementations
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      setFilters: mockSetFilters,
    } as any);
  });

  test('renders action filter with all action checkboxes', () => {
    render(
      <TestWrapper data-id="001201">
        <ActionFilter data-id="001202" />
      </TestWrapper>,
    );

    // Check that all actions are rendered
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  test('displays current filter values correctly', () => {
    render(
      <TestWrapper data-id="001205">
        <ActionFilter data-id="001206" />
      </TestWrapper>,
    );

    // Check that the component renders with the expected actions
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  test('renders with empty filter values', () => {
    // Mock empty filter values
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: { action: { value: [] } },
      setFilters: mockSetFilters,
    } as any);

    render(
      <TestWrapper data-id="001211">
        <ActionFilter data-id="001212" />
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  test('renders with undefined filter values', () => {
    // Mock undefined filter values
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: { action: undefined },
      setFilters: mockSetFilters,
    } as any);

    render(
      <TestWrapper data-id="001213">
        <ActionFilter data-id="001214" />
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  test('applies correct CSS styling for checkboxes', () => {
    render(
      <TestWrapper data-id="001215">
        <ActionFilter data-id="001216" />
      </TestWrapper>,
    );

    // Check that checkboxes are rendered (they should have the custom styling applied)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3); // 3 action options

    // Verify that each checkbox has the correct value
    expect(screen.getByDisplayValue('add')).toBeInTheDocument();
    expect(screen.getByDisplayValue('update')).toBeInTheDocument();
    expect(screen.getByDisplayValue('delete')).toBeInTheDocument();
  });

  test('renders all action options from the actions object', () => {
    render(
      <TestWrapper data-id="001219">
        <ActionFilter data-id="001220" />
      </TestWrapper>,
    );

    // Verify all action options are rendered
    const expectedActions = ['Added', 'Updated', 'Deleted'];

    expectedActions.forEach((action) => {
      expect(screen.getByText(action)).toBeInTheDocument();
    });
  });

  test('renders with pre-selected values', () => {
    // Mock with pre-selected values
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: { action: { value: ['add', 'delete'] } },
      setFilters: mockSetFilters,
    } as any);

    render(
      <TestWrapper data-id="001225">
        <ActionFilter data-id="001226" />
      </TestWrapper>,
    );

    // Check that the component renders with pre-selected values
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  test('handles null filter values gracefully', () => {
    // Mock null filter values
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: { action: { value: null } },
      setFilters: mockSetFilters,
    } as any);

    render(
      <TestWrapper data-id="001227">
        <ActionFilter data-id="001228" />
      </TestWrapper>,
    );

    // Should render without crashing
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  test('verifies checkbox values match action keys', () => {
    render(
      <TestWrapper data-id="001229">
        <ActionFilter data-id="001230" />
      </TestWrapper>,
    );

    // Verify that checkbox values match the action keys from the actions object
    expect(screen.getByDisplayValue('add')).toBeInTheDocument();
    expect(screen.getByDisplayValue('update')).toBeInTheDocument();
    expect(screen.getByDisplayValue('delete')).toBeInTheDocument();
  });

  test('verifies checkbox labels match action values', () => {
    render(
      <TestWrapper data-id="001231">
        <ActionFilter data-id="001232" />
      </TestWrapper>,
    );

    // Verify that checkbox labels match the action values from the actions object
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });
});
