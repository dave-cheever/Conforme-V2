import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import CategoryFilter from '../../components/Filters/CategoryFilter';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import updateLocalStorageFilter from '../filterStorage';

// Mock the contexts
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

const mockModule = {
  _id: 'module1',
  name: 'Test Module',
  organizationId: 'org1',
  type: 'audits' as const,
  defaultFilters: {},
  path: '/some-path',
  showInNavigation: true,
  icon: 'icon',
  translations: {},
  customQuestionsInDashboard: false,
};

const mockCategories = [
  { _id: 'cat1', name: 'Category 1' },
  { _id: 'cat2', name: 'Category 2' },
  { _id: 'cat3', name: 'Category 3' },
];

const mockFiltersValues = {
  categoriesIds: {
    value: ['cat1'],
    label: 'Category',
    name: 'categoriesIds',
  },
};

const mockSetFilters = vi.fn();

// Mock the context providers
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: vi.fn(() => ({
    user: mockUser,
    module: mockModule,
  })),
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: vi.fn(() => ({
    filtersValues: mockFiltersValues,
    setFilters: mockSetFilters,
    categories: mockCategories,
  })),
}));

// Mock the filterStorage utility
vi.mock('../../utils/filterStorage', () => ({
  default: vi.fn(),
}));

// Mock the FilterCheckBox component
vi.mock('../../components/Filters/FilterCheckBox', () => ({
  default: ({ label, value }: { label: string; value: string }) => (
    <div data-id="001105" data-testid={`checkbox-${value}`}>
      <input data-id="001106" type="checkbox" value={value} />
      <label data-id="001107" htmlFor={`checkbox-${value}`}>
        {label}
      </label>
    </div>
  ),
}));

// Mock the CheckboxGroup component to capture its onChange prop
const mockCheckboxGroupOnChange = vi.fn();
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    CheckboxGroup: ({ children, onChange, ...props }: any) => {
      // Store the onChange function so we can call it in tests
      if (onChange) mockCheckboxGroupOnChange.mockImplementation(onChange);
      return (
        <div data-id="001129" data-testid="checkbox-group" {...props}>
          {children}
        </div>
      );
    },
  };
});

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

describe('CategoryFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckboxGroupOnChange.mockClear();
    // Reset mocks to their default implementations
    vi.mocked(useAppContext).mockReturnValue({
      user: mockUser,
      module: mockModule,
    } as any);
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      setFilters: mockSetFilters,
      categories: mockCategories,
    } as any);
  });

  test('renders category filter with checkboxes', () => {
    render(
      <TestWrapper data-id="001109">
        <CategoryFilter data-id="001110" />
      </TestWrapper>,
    );

    // Check that all categories are rendered
    expect(screen.getByTestId('checkbox-cat1')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-cat2')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-cat3')).toBeInTheDocument();

    // Check that category labels are displayed
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Category 3')).toBeInTheDocument();
  });

  test('renders with empty categories array', () => {
    // Mock empty categories
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      setFilters: mockSetFilters,
      categories: [],
    } as any);

    render(
      <TestWrapper data-id="001111">
        <CategoryFilter data-id="001112" />
      </TestWrapper>,
    );

    // Should render without crashing and without category checkboxes
    expect(screen.queryByTestId('checkbox-cat1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox-cat2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox-cat3')).not.toBeInTheDocument();
  });

  test('renders with undefined categories', () => {
    // Mock undefined categories
    vi.mocked(useFiltersContext).mockReturnValue({
      filtersValues: mockFiltersValues,
      setFilters: mockSetFilters,
      categories: undefined as any,
    } as any);

    render(
      <TestWrapper data-id="001113">
        <CategoryFilter data-id="001114" />
      </TestWrapper>,
    );

    // Should render without crashing and without category checkboxes
    expect(screen.queryByTestId('checkbox-cat1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox-cat2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox-cat3')).not.toBeInTheDocument();
  });

  test('handles change when user or module is missing', () => {
    // Mock missing user
    vi.mocked(useAppContext).mockReturnValue({
      user: null as any,
      module: mockModule,
    } as any);

    render(
      <TestWrapper data-id="001115">
        <CategoryFilter data-id="001116" />
      </TestWrapper>,
    );

    // Should not call updateLocalStorageFilter when user is missing
    expect(vi.mocked(updateLocalStorageFilter)).not.toHaveBeenCalled();
  });

  test('handles change when module is missing', () => {
    // Mock missing module
    vi.mocked(useAppContext).mockReturnValue({
      user: mockUser,
      module: undefined,
    } as any);

    render(
      <TestWrapper data-id="001117">
        <CategoryFilter data-id="001118" />
      </TestWrapper>,
    );

    // Should not call updateLocalStorageFilter when module is missing
    expect(vi.mocked(updateLocalStorageFilter)).not.toHaveBeenCalled();
  });

  test('displays current filter values correctly', () => {
    render(
      <TestWrapper data-id="001119">
        <CategoryFilter data-id="001120" />
      </TestWrapper>,
    );

    // Check that the component renders with the expected categories
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Category 3')).toBeInTheDocument();
  });

  test('calls updateLocalStorageFilter when checkbox is changed and user and module exist', () => {
    render(
      <TestWrapper data-id="001121">
        <CategoryFilter data-id="001122" />
      </TestWrapper>,
    );

    // Simulate the CheckboxGroup onChange event with new values
    mockCheckboxGroupOnChange(['cat1', 'cat2']);

    // Verify that updateLocalStorageFilter was called with correct parameters
    expect(vi.mocked(updateLocalStorageFilter)).toHaveBeenCalledWith(
      'module1',
      'categoriesIds',
      'Category',
      ['cat1', 'cat2'],
      'user1',
      mockSetFilters,
    );
  });

  test('handles checkbox change when user and module are present', () => {
    render(
      <TestWrapper data-id="001123">
        <CategoryFilter data-id="001124" />
      </TestWrapper>,
    );

    // Simulate the CheckboxGroup onChange event
    mockCheckboxGroupOnChange(['cat3']);

    // Verify that updateLocalStorageFilter was called
    expect(vi.mocked(updateLocalStorageFilter)).toHaveBeenCalledWith(
      'module1',
      'categoriesIds',
      'Category',
      ['cat3'],
      'user1',
      mockSetFilters,
    );
  });
});
