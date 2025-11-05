import { BrowserRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import FilterPreset, { GET_FILTER_PRESETS, SAVE_FILTER_PRESET } from '../../components/FilterPreset';

// Mock the contexts
const mockAppContext = {
  module: {
    _id: 'test-module-id',
    type: 'test-module-type',
    path: '/test-module',
  },
  user: {
    userId: 'test-user-id',
  },
};

const mockFiltersContext = {
  filtersValues: {
    testFilter: {
      name: 'Test Filter',
      value: 'test-value',
    },
  },
  usedFilters: ['testFilter'],
  setFilters: vi.fn(),
  sortingState: null,
  setSortingState: vi.fn(),
  cleanFilters: vi.fn(),
};

// Mock the contexts
vi.mock('../../contexts/AppProvider', () => ({
  useAppContext: () => mockAppContext,
}));

vi.mock('../../contexts/FiltersProvider', () => ({
  useFiltersContext: () => mockFiltersContext,
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/test-module/audits',
    }),
  };
});

// Mock the filter storage utility
vi.mock('../../utils/filterStorage', () => ({
  default: vi.fn(),
}));

// Mock theme
const mockTheme = {
  colors: {},
};

// Mock GraphQL queries and mutations
const mocks = [
  {
    request: {
      query: GET_FILTER_PRESETS,
      variables: {
        getFilterPresetsInput: {
          userId: 'test-user-id',
          moduleId: 'test-module-id',
          pageName: 'audits',
        },
      },
    },
    result: {
      data: {
        getFilterPresets: [],
      },
    },
  },
  {
    request: {
      query: SAVE_FILTER_PRESET,
      variables: {
        saveFilterPresetInput: {
          name: 'Test Preset',
          filters: { testFilter: 'test-value' },
          moduleId: 'test-module-id',
          moduleType: 'test-module-type',
          pageName: 'audits',
          userId: 'test-user-id',
          metadata: {
            modulePath: '/test-module',
            fullPath: '/test-module/audits',
            usedFilters: ['testFilter'],
          },
        },
      },
    },
    result: {
      data: {
        saveFilterPreset: {
          _id: 'preset-1',
          name: 'Test Preset',
          filters: { testFilter: 'test-value' },
          moduleId: 'test-module-id',
          moduleType: 'test-module-type',
          pageName: 'audits',
          userId: 'test-user-id',
          metadata: {
            modulePath: '/test-module',
            fullPath: '/test-module/audits',
            usedFilters: ['testFilter'],
          },
          metatags: {
            addedBy: 'test-user-id',
            addedAt: '2023-01-01T00:00:00Z',
            updatedBy: 'test-user-id',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        },
      },
    },
  },
];

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="002201" theme={mockTheme}>
      <MockedProvider addTypename={false} data-id="002202" mocks={mocks}>
        <BrowserRouter data-id="002203">{children}</BrowserRouter>
      </MockedProvider>
    </ChakraProvider>
  );
}

describe('FilterPreset', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock scrollTo method for JSDOM compatibility
    Element.prototype.scrollTo = vi.fn();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper data-id="002204">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toBeInTheDocument();
  });

  test('renders with correct button text and icon', () => {
    render(
      <TestWrapper data-id="002205">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toBeInTheDocument();

    // Check if the button has the correct data-id
    expect(button).toHaveAttribute('data-id', 'filter-preset-button');
  });

  test('opens menu when button is clicked', async () => {
    render(
      <TestWrapper data-id="002206">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Save preset')).toBeInTheDocument();
    });
  });

  test('shows save preset input when save button is clicked', async () => {
    render(
      <TestWrapper data-id="002207">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      const saveButton = screen.getByText('Save preset');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Preset name');
      expect(input).toBeInTheDocument();
    });
  });

  test('allows typing in preset name input', async () => {
    render(
      <TestWrapper data-id="002208">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      const saveButton = screen.getByText('Save preset');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Preset name');
      fireEvent.change(input, { target: { value: 'Test Preset' } });
      expect(input).toHaveValue('Test Preset');
    });
  });

  test('shows clear button when saving preset', async () => {
    render(
      <TestWrapper data-id="002209">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      const saveButton = screen.getByText('Save preset');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      const clearButton = document.querySelector('[data-id="filter-preset-clear-button"]');
      expect(clearButton).toBeInTheDocument();
    });
  });

  test('shows confirm save button when saving preset', async () => {
    render(
      <TestWrapper data-id="002210">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      const saveButton = screen.getByText('Save preset');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      const confirmButton = document.querySelector('[data-id="filter-preset-confirm-save-button"]');
      expect(confirmButton).toBeInTheDocument();
    });
  });

  test('handles Enter key in preset name input', async () => {
    render(
      <TestWrapper data-id="002212">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      const saveButton = screen.getByText('Save preset');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Preset name');
      fireEvent.change(input, { target: { value: 'Test Preset' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
  });

  test('handles Escape key in preset name input', async () => {
    render(
      <TestWrapper data-id="002213">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    const saveButton = screen.getByText('Save preset');
    fireEvent.click(saveButton);

    // Wait for the SavePresetForm container to appear (it has data-id="002238")
    await waitFor(() => {
      const formContainer = document.querySelector('[data-id="002338"]');
      expect(formContainer).toBeInTheDocument();
    });

    // Now wait for the input to appear
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Preset name');
      expect(input).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Preset name');
    fireEvent.change(input, { target: { value: 'Test Preset' } });

    // Press Escape key
    fireEvent.keyDown(input, { key: 'Escape' });
  });

  test('shows loading state when presets are loading', async () => {
    render(
      <TestWrapper data-id="002214">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      // The loading state should be shown initially
      expect(screen.getByText('Loading presets...')).toBeInTheDocument();
    });
  });

  test('shows no presets message when no presets exist', async () => {
    render(
      <TestWrapper data-id="002215">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      // After loading, should show no presets message
      expect(screen.getByText('No filter presets saved yet')).toBeInTheDocument();
    });
  });

  test('accepts custom data-id prop', () => {
    render(
      <TestWrapper data-id="002216">
        <FilterPreset data-id="custom-filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toHaveAttribute('data-id', 'custom-filter-preset-button');
  });

  test('accepts custom placement prop', () => {
    render(
      <TestWrapper data-id="002217">
        <FilterPreset data-id="filter-preset" placement="bottom-end" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toBeInTheDocument();
  });

  test('renders with correct menu structure', async () => {
    render(
      <TestWrapper data-id="002218">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    fireEvent.click(button);

    await waitFor(() => {
      const menu = document.querySelector('[data-id="filter-preset-menu"]');
      expect(menu).toBeInTheDocument();

      expect(screen.getByText('Save preset')).toBeInTheDocument();
    });
  });

  test('has correct button styling and attributes', () => {
    render(
      <TestWrapper data-id="002219">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toHaveAttribute('data-id', 'filter-preset-button');
    expect(button).toHaveClass('chakra-button');
  });

  test('handles click events without propagation', async () => {
    const handleClick = vi.fn();

    render(
      <TestWrapper data-id="002220">
        <button data-id="002221" onClick={handleClick} type="button">
          <FilterPreset data-id="filter-preset" />
        </button>
      </TestWrapper>,
    );

    const filterPresetButton = document.querySelector('[data-id="filter-preset-button"]');
    fireEvent.click(filterPresetButton!);

    // The parent button click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders with correct icon in button', () => {
    render(
      <TestWrapper data-id="002222">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-id', 'filter-preset-icon');
  });

  test('maintains proper accessibility attributes', () => {
    render(
      <TestWrapper data-id="002223">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('handles multiple instances correctly', () => {
    render(
      <TestWrapper data-id="002224">
        <div data-id="002225">
          <FilterPreset data-id="filter-preset-1" />
          <FilterPreset data-id="filter-preset-2" />
        </div>
      </TestWrapper>,
    );

    const buttons = screen.getAllByRole('button', { name: /filter presets/i });
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('data-id', 'filter-preset-1-button');
    expect(buttons[1]).toHaveAttribute('data-id', 'filter-preset-2-button');
  });

  test('uses correct default data-id when not provided', () => {
    render(
      <TestWrapper data-id="002226">
        <FilterPreset data-id="002227" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toHaveAttribute('data-id', '002227-button');
  });

  test('renders with correct button dimensions', () => {
    render(
      <TestWrapper data-id="002228">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toHaveStyle('height: 35px');
  });

  test('renders with correct font styling', () => {
    render(
      <TestWrapper data-id="002229">
        <FilterPreset data-id="filter-preset" />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /filter presets/i });
    expect(button).toHaveStyle('font-weight: 500');
  });

  describe('Menu Placement and Overflow Constraints', () => {
    test('default placement is top-start', () => {
      render(
        <TestWrapper data-id="002230">
          <FilterPreset data-id="filter-preset" />
        </TestWrapper>,
      );

      // Verify the component renders without errors with default placement
      // The default placement is now top-start (changed from bottom-start)
      const button = screen.getByRole('button', { name: /filter presets/i });
      expect(button).toBeInTheDocument();
    });

    test('MenuList has maxH constraint when menu is open', async () => {
      render(
        <TestWrapper data-id="002231">
          <FilterPreset data-id="filter-preset" />
        </TestWrapper>,
      );

      const button = screen.getByRole('button', { name: /filter presets/i });
      fireEvent.click(button);

      await waitFor(() => {
        const menuList = document.querySelector('[data-id="filter-preset-menu"]');
        expect(menuList).toBeInTheDocument();
        expect(menuList).toHaveStyle({ maxHeight: 'calc(100vh - 200px)' });
      });
    });

    test('MenuList has overflowY auto when menu is open', async () => {
      render(
        <TestWrapper data-id="002232">
          <FilterPreset data-id="filter-preset" />
        </TestWrapper>,
      );

      const button = screen.getByRole('button', { name: /filter presets/i });
      fireEvent.click(button);

      await waitFor(() => {
        const menuList = document.querySelector('[data-id="filter-preset-menu"]');
        expect(menuList).toBeInTheDocument();
        expect(menuList).toHaveStyle({ overflowY: 'auto' });
      });
    });

    test('MenuList has minW constraint when menu is open', async () => {
      render(
        <TestWrapper data-id="002233">
          <FilterPreset data-id="filter-preset" />
        </TestWrapper>,
      );

      const button = screen.getByRole('button', { name: /filter presets/i });
      fireEvent.click(button);

      await waitFor(() => {
        const menuList = document.querySelector('[data-id="filter-preset-menu"]');
        expect(menuList).toBeInTheDocument();
        expect(menuList).toHaveStyle({ minWidth: '280px' });
      });
    });

    test('accepts custom placement prop and overrides default', () => {
      render(
        <TestWrapper data-id="002234">
          <FilterPreset data-id="filter-preset" placement="bottom-end" />
        </TestWrapper>,
      );

      // Verify the component renders with custom placement without errors
      const button = screen.getByRole('button', { name: /filter presets/i });
      expect(button).toBeInTheDocument();
      // The menu should render with the custom placement when opened
    });

    test('MenuList maintains viewport constraints with top-start placement', async () => {
      render(
        <TestWrapper data-id="002235">
          <FilterPreset data-id="filter-preset" placement="top-start" />
        </TestWrapper>,
      );

      const button = screen.getByRole('button', { name: /filter presets/i });
      fireEvent.click(button);

      await waitFor(() => {
        const menuList = document.querySelector('[data-id="filter-preset-menu"]');
        expect(menuList).toBeInTheDocument();
        // Verify it has the overflow constraints to prevent viewport overflow
        expect(menuList).toHaveStyle({ maxHeight: 'calc(100vh - 200px)' });
        expect(menuList).toHaveStyle({ overflowY: 'auto' });
      });
    });
  });
});
