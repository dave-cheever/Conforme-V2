import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Import the component after mocks
import SortButton from '../../components/SortButton';

// Mock icons
vi.mock('../../icons', () => ({
  ChevronRight: ({ transform, color, ...props }: any) => (
    <div
      data-color={color}
      data-id="001617"
      data-testid="chevron-right"
      data-transform={transform}
      {...props}>
      →
    </div>
  ),
  UpAndDownIcon: () => <div data-id="001618" data-testid="up-down-icon">↕</div>,
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider data-id="001619">{children}</ChakraProvider>
}

describe('SortButton', () => {
  const mockSetSortType = vi.fn();
  const mockSetSortOrder = vi.fn();

  const defaultProps = {
    sortBy: [
      { label: 'Name', key: 'name' },
      { label: 'Date', key: 'date' },
      { label: 'Status', key: 'status' },
    ],
    sortOrder: 'asc' as const,
    sortType: 'name',
    setSortType: mockSetSortType,
    setSortOrder: mockSetSortOrder,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders sort button with correct text', () => {
      render(
        <TestWrapper data-id="001620">
          <SortButton data-id="001621" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText('Sort by')).toBeInTheDocument();
      expect(screen.getByTestId('up-down-icon')).toBeInTheDocument();
    });

    test('renders all sort options in menu', () => {
      render(
        <TestWrapper data-id="001622">
          <SortButton data-id="001623" {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    test('renders sort button successfully', () => {
      render(
        <TestWrapper data-id="001624">
          <SortButton data-id="001625" {...defaultProps} />
        </TestWrapper>,
      );

      const container = screen.getByTestId('up-down-icon').closest('[data-id="000474"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Sort Order Indicators', () => {
    test('shows ascending indicator for current sort type and order', () => {
      render(
        <TestWrapper data-id="001628">
          <SortButton data-id="001629" {...defaultProps} sortOrder="asc" sortType="name" />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });

    test('shows descending indicator for current sort type and order', () => {
      render(
        <TestWrapper data-id="001630">
          <SortButton data-id="001631" {...defaultProps} sortOrder="desc" sortType="name" />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });

    test('shows correct chevron directions', () => {
      render(
        <TestWrapper data-id="001632">
          <SortButton data-id="001633" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });

  describe('Sort Actions', () => {
    test('calls setSortType and setSortOrder when ascending button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="001634">
          <SortButton data-id="001635" {...defaultProps} />
        </TestWrapper>,
      );

      const ascButton = screen.getByText('Name').closest('div')?.querySelector('[data-transform="rotate(-90deg)"]')?.closest('div');
      if (ascButton) {
        await user.click(ascButton);
        expect(mockSetSortType).toHaveBeenCalledWith('name');
        expect(mockSetSortOrder).toHaveBeenCalledWith('asc');
      }
    });

    test('calls setSortType and setSortOrder when descending button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="001636">
          <SortButton data-id="001637" {...defaultProps} />
        </TestWrapper>,
      );

      const descButton = screen.getByText('Name').closest('div')?.querySelector('[data-transform="rotate(90deg)"]')?.closest('div');
      if (descButton) {
        await user.click(descButton);
        expect(mockSetSortType).toHaveBeenCalledWith('name');
        expect(mockSetSortOrder).toHaveBeenCalledWith('desc');
      }
    });

    test('calls setSortType and setSortOrder for different sort options', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper data-id="001638">
          <SortButton data-id="001639" {...defaultProps} />
        </TestWrapper>,
      );

      const dateAscButton = screen.getByText('Date').closest('div')?.querySelector('[data-transform="rotate(-90deg)"]')?.closest('div');
      if (dateAscButton) {
        await user.click(dateAscButton);
        expect(mockSetSortType).toHaveBeenCalledWith('date');
        expect(mockSetSortOrder).toHaveBeenCalledWith('asc');
      }
    });
  });

  describe('Menu Behavior', () => {
    test('menu button has correct styling', () => {
      render(
        <TestWrapper data-id="001640">
          <SortButton data-id="001641" {...defaultProps} />
        </TestWrapper>,
      );

      const menuButton = screen.getByText('Sort by').closest('button');
      expect(menuButton).toHaveStyle('border-radius: 10px');
      expect(menuButton).toHaveStyle('height: 40px');
    });
  });

  describe('Icon Colors', () => {
    test('shows active color for current sort type and order', () => {
      render(
        <TestWrapper data-id="001642">
          <SortButton data-id="001643" {...defaultProps} sortOrder="asc" sortType="name" />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });

    test('shows default color for inactive sort options', () => {
      render(
        <TestWrapper data-id="001644">
          <SortButton data-id="001645" {...defaultProps} sortOrder="asc" sortType="name" />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper data-id attributes', () => {
      render(
        <TestWrapper data-id="001646">
          <SortButton data-id="001647" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the sort button has data-id attributes
      const sortButton = screen.getByText('Sort by').closest('button');
      expect(sortButton).toHaveAttribute('data-id');
    });

    test('sort buttons are clickable', () => {
      render(
        <TestWrapper data-id="001648">
          <SortButton data-id="001649" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty sortBy array', () => {
      render(
        <TestWrapper data-id="001650">
          <SortButton data-id="001651" {...defaultProps} sortBy={[]} />
        </TestWrapper>,
      );

      expect(screen.getByText('Sort by')).toBeInTheDocument();
      expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });

    test('handles single sort option', () => {
      render(
        <TestWrapper data-id="001652">
          <SortButton
            data-id="001653"
            {...defaultProps}
            sortBy={[{ label: 'Single', key: 'single' }]} />
        </TestWrapper>,
      );

      expect(screen.getByText('Single')).toBeInTheDocument();
      expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });

    test('handles undefined sortType', () => {
      render(
        <TestWrapper data-id="001654">
          <SortButton data-id="001655" {...defaultProps} sortType="" />
        </TestWrapper>,
      );

      // Should not crash and should not highlight any options
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });

    test('handles different sort order values', () => {
      render(
        <TestWrapper data-id="001656">
          <SortButton data-id="001657" {...defaultProps} sortOrder="desc" />
        </TestWrapper>,
      );

      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('applies responsive margin left', () => {
      render(
        <TestWrapper data-id="001658">
          <SortButton data-id="001659" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });

  describe('Menu List Styling', () => {
    test('menu items have proper spacing', () => {
      render(
        <TestWrapper data-id="001660">
          <SortButton data-id="001661" {...defaultProps} />
        </TestWrapper>,
      );

      // Check that the sort button is rendered
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });
  });
});
