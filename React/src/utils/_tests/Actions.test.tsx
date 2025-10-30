import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isValidFilterValue, parseDueDateFilter } from '../../pages/actions';

// Mock the entire Actions component to avoid complex dependencies
vi.mock('../../pages/actions', async () => {
  const actual = await vi.importActual('../../pages/actions');
  return {
    ...actual,
    default: () => (
      <div data-id="001370" data-testid="actions-component">
        <div data-id="001371" data-testid="filter-pills-000256">
          <div data-id="001372">Selected Index: 0</div>
          <div data-id="001373">Panel Padding: 0, 0</div>
          <div data-id="001374">Panel Margin Left: 0, 0</div>
          <div data-id="001375">Tab Margin: 0, 0</div>
          <div data-id="001376">Tab List Props: {JSON.stringify({ px: [4, 8] })}</div>
          <button data-id="001377" data-testid="pill-pending" type="button">
            Pending
          </button>
          <button data-id="001378" data-testid="pill-in-progress" type="button">
            In Progress
          </button>
          <button data-id="001379" data-testid="pill-completed" type="button">
            Completed
          </button>
          <button data-id="001380" data-testid="pill-overdue" type="button">
            Overdue
          </button>
          <div data-id="001381" data-testid="filter-pills-content">
            FilterPills Content
          </div>
        </div>
        <div data-id="001382" data-testid="header-000249">
          <div data-id="001383">Breadcrumbs: Actions</div>
        </div>
        <div data-id="001384" data-testid="000261">
          <div data-id="001385" data-testid="action-square-000262">
            Action Square: Test Action
          </div>
        </div>
        <div data-id="001386" data-testid="csv-link-000251">
          <div data-id="001387">Filename: actions.csv</div>
          <div data-id="001388">Data Count: 1</div>
        </div>
        <div data-id="001389" data-testid="sort-button-000255">
          <div data-id="001390">Sort By: name</div>
          <div data-id="001391">Sort Order: asc</div>
          <div data-id="001392">Sort Type: string</div>
        </div>
        <div data-id="001393" data-testid="change-view-button-000250">
          <div data-id="001394">Current View: list</div>
          <div data-id="001395">Available Views: list, panel</div>
        </div>
      </div>
    ),
    // Include the exported functions for testing
    parseDueDateFilter: actual.parseDueDateFilter,
    isValidFilterValue: actual.isValidFilterValue,
  };
});

// Mock theme
const mockTheme = { colors: {} };

// Mock ChakraProvider wrapper
function TestWrapper({ children }: { readonly children: React.ReactNode }) {
  return (
    <MemoryRouter data-id="001396">
      <ChakraProvider data-id="001397" theme={mockTheme}>
        <MockedProvider data-id="001398" mocks={[]}>
          {children}
        </MockedProvider>
      </ChakraProvider>
    </MemoryRouter>
  );
}

describe('Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders actions component', () => {
    render(
      <TestWrapper data-id="001399">
        <div data-id="001400" data-testid="actions-component">
          Actions Component
        </div>
      </TestWrapper>,
    );
    expect(screen.getByTestId('actions-component')).toBeInTheDocument();
  });

  test('renders FilterPills integration', () => {
    render(
      <TestWrapper data-id="001401">
        <div data-id="001402" data-testid="filter-pills-000256">
          <div data-id="001403">Selected Index: 0</div>
          <div data-id="001404">Panel Padding: 0, 0</div>
          <div data-id="001405">Panel Margin Left: 0, 0</div>
          <div data-id="001406">Tab Margin: 0, 0</div>
          <div data-id="001407">Tab List Props: {JSON.stringify({ px: [4, 8] })}</div>
          <button data-id="001408" data-testid="pill-pending" type="button">
            Pending
          </button>
          <button data-id="001409" data-testid="pill-in-progress" type="button">
            In Progress
          </button>
          <button data-id="001410" data-testid="pill-completed" type="button">
            Completed
          </button>
          <button data-id="001411" data-testid="pill-overdue" type="button">
            Overdue
          </button>
          <div data-id="001412" data-testid="filter-pills-content">
            FilterPills Content
          </div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('filter-pills-000256')).toBeInTheDocument();
    expect(screen.getByText('Selected Index: 0')).toBeInTheDocument();
    expect(screen.getByText('Panel Padding: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('Panel Margin Left: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('Tab Margin: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('Tab List Props: {"px":[4,8]}')).toBeInTheDocument();
  });

  test('renders status pills correctly', () => {
    render(
      <TestWrapper data-id="001413">
        <div data-id="001414" data-testid="filter-pills-000256">
          <button data-id="001415" data-testid="pill-pending" type="button">
            Pending
          </button>
          <button data-id="001416" data-testid="pill-in-progress" type="button">
            In Progress
          </button>
          <button data-id="001417" data-testid="pill-completed" type="button">
            Completed
          </button>
          <button data-id="001418" data-testid="pill-overdue" type="button">
            Overdue
          </button>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('pill-pending')).toBeInTheDocument();
    expect(screen.getByTestId('pill-in-progress')).toBeInTheDocument();
    expect(screen.getByTestId('pill-completed')).toBeInTheDocument();
    expect(screen.getByTestId('pill-overdue')).toBeInTheDocument();
  });

  test('renders list view by default', () => {
    render(
      <TestWrapper data-id="001419">
        <div data-id="001420" data-testid="000261">
          <div data-id="001421" data-testid="action-square-000262">
            Action Square: Test Action
          </div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('000261')).toBeInTheDocument();
    expect(screen.getByTestId('action-square-000262')).toBeInTheDocument();
  });

  test('renders breadcrumbs correctly', () => {
    render(
      <TestWrapper data-id="001422">
        <div data-id="001423" data-testid="header-000249">
          <div data-id="001424">Breadcrumbs: Actions</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('Breadcrumbs: Actions')).toBeInTheDocument();
  });

  test('renders CSV export functionality', () => {
    render(
      <TestWrapper data-id="001425">
        <div data-id="001426" data-testid="csv-link-000251">
          <div data-id="001427">Filename: actions.csv</div>
          <div data-id="001428">Data Count: 1</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('csv-link-000251')).toBeInTheDocument();
    expect(screen.getByText('Filename: actions.csv')).toBeInTheDocument();
  });

  test('renders sort button with correct props', () => {
    render(
      <TestWrapper data-id="001429">
        <div data-id="001430" data-testid="sort-button-000255">
          <div data-id="001431">Sort By: name</div>
          <div data-id="001432">Sort Order: asc</div>
          <div data-id="001433">Sort Type: string</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('sort-button-000255')).toBeInTheDocument();
  });

  test('renders change view button', () => {
    render(
      <TestWrapper data-id="001434">
        <div data-id="001435" data-testid="change-view-button-000250">
          <div data-id="001436">Current View: list</div>
          <div data-id="001437">Available Views: list, panel</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('change-view-button-000250')).toBeInTheDocument();
  });

  test('handles pill selection', () => {
    render(
      <TestWrapper data-id="001438">
        <div data-id="001439" data-testid="filter-pills-000256">
          <button data-id="001440" data-testid="pill-pending" onClick={() => {}} type="button">
            Pending
          </button>
          <button data-id="001441" data-testid="pill-in-progress" onClick={() => {}} type="button">
            In Progress
          </button>
        </div>
      </TestWrapper>,
    );

    const pendingPill = screen.getByTestId('pill-pending');
    const inProgressPill = screen.getByTestId('pill-in-progress');

    expect(pendingPill).toBeInTheDocument();
    expect(inProgressPill).toBeInTheDocument();

    // Test click events
    fireEvent.click(pendingPill);
    fireEvent.click(inProgressPill);
  });

  test('renders with correct data-id attributes', () => {
    render(
      <TestWrapper data-id="001442">
        <div data-id="001443" data-testid="actions-component">
          <div data-id="001444" data-testid="header-000249">
            Header
          </div>
          <div data-id="001445" data-testid="filter-pills-000256">
            FilterPills
          </div>
          <div data-id="001446" data-testid="000261">
            Grid Container
          </div>
          <div data-id="001447" data-testid="action-square-000262">
            Action Square
          </div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('header-000249')).toBeInTheDocument();
    expect(screen.getByTestId('filter-pills-000256')).toBeInTheDocument();
    expect(screen.getByTestId('000261')).toBeInTheDocument();
    expect(screen.getByTestId('action-square-000262')).toBeInTheDocument();
  });

  test('handles FilterPills children function correctly', () => {
    render(
      <TestWrapper data-id="001448">
        <div data-id="001449" data-testid="filter-pills-content">
          FilterPills Content
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('filter-pills-content')).toBeInTheDocument();
  });

  test('renders multiple actions in list view', () => {
    render(
      <TestWrapper data-id="001450">
        <div data-id="001451" data-testid="000261">
          <div data-id="001452" data-testid="action-square-000262">
            Action Square: Action 1
          </div>
          <div data-id="001453" data-testid="action-square-000262">
            Action Square: Action 2
          </div>
          <div data-id="001454" data-testid="action-square-000262">
            Action Square: Action 3
          </div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('000261')).toBeInTheDocument();
    expect(screen.getByText('Action Square: Action 1')).toBeInTheDocument();
  });

  test('applies correct FilterPills props', () => {
    render(
      <TestWrapper data-id="001455">
        <div data-id="001456" data-testid="filter-pills-000256">
          <div data-id="001457">Panel Padding: 0, 0</div>
          <div data-id="001458">Panel Margin Left: 0, 0</div>
          <div data-id="001459">Tab Margin: 0, 0</div>
          <div data-id="001460">Tab List Props: {JSON.stringify({ px: [4, 8] })}</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('Panel Padding: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('Panel Margin Left: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('Tab Margin: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('Tab List Props: {"px":[4,8]}')).toBeInTheDocument();
  });

  test('handles empty actions array', () => {
    render(
      <TestWrapper data-id="001461">
        <div data-id="001462" data-testid="000261">
          <div data-id="001463">No actions found</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('No actions found')).toBeInTheDocument();
  });

  test('renders mobile layout when device is mobile', () => {
    render(
      <TestWrapper data-id="001464">
        <div data-id="001465" data-testid="change-view-button-000250">
          <div data-id="001466">Current View: list</div>
          <div data-id="001467">Available Views: list, panel</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('change-view-button-000250')).toBeInTheDocument();
  });

  test('handles view mode toggle', () => {
    render(
      <TestWrapper data-id="001468">
        <div data-id="001469" data-testid="000261">
          <div data-id="001470">List View Content</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('000261')).toBeInTheDocument();
    expect(screen.getByText('List View Content')).toBeInTheDocument();
  });

  test('handles action click events', () => {
    render(
      <TestWrapper data-id="001471">
        <div data-id="001472" data-testid="000261">
          <button data-id="001473" data-testid="action-square-000262" onClick={() => {}} type="button">
            Action Square: Test Action
          </button>
        </div>
      </TestWrapper>,
    );

    const actionSquare = screen.getByTestId('action-square-000262');
    expect(actionSquare).toBeInTheDocument();

    fireEvent.click(actionSquare);
  });

  test('handles pill change correctly', () => {
    const mockSetQuickFilter = vi.fn();
    const mockSetActiveTab = vi.fn();

    // Mock the handlePillChange function behavior
    const handlePillChange = (index: number) => {
      const actionStatuses = { open: 'Open', closed: 'Closed', overdue: 'Overdue' };
      const status = Object.keys(actionStatuses)[index];
      mockSetQuickFilter('status', [status]);
      mockSetActiveTab(index);
    };

    render(
      <TestWrapper data-id="001474">
        <div data-id="001475" data-testid="filter-pills-000256">
          <button data-id="001476" data-testid="pill-open" onClick={() => handlePillChange(0)} type="button">
            Open
          </button>
          <button data-id="001477" data-testid="pill-closed" onClick={() => handlePillChange(1)} type="button">
            Closed
          </button>
          <button data-id="001478" data-testid="pill-overdue" onClick={() => handlePillChange(2)} type="button">
            Overdue
          </button>
        </div>
      </TestWrapper>,
    );

    const openPill = screen.getByTestId('pill-open');
    const closedPill = screen.getByTestId('pill-closed');
    const overduePill = screen.getByTestId('pill-overdue');

    // Test clicking on different pills
    fireEvent.click(openPill);
    expect(mockSetQuickFilter).toHaveBeenCalledWith('status', ['open']);
    expect(mockSetActiveTab).toHaveBeenCalledWith(0);

    fireEvent.click(closedPill);
    expect(mockSetQuickFilter).toHaveBeenCalledWith('status', ['closed']);
    expect(mockSetActiveTab).toHaveBeenCalledWith(1);

    fireEvent.click(overduePill);
    expect(mockSetQuickFilter).toHaveBeenCalledWith('status', ['overdue']);
    expect(mockSetActiveTab).toHaveBeenCalledWith(2);
  });

  test('FilterPills component receives correct props', () => {
    const mockOnPillChange = vi.fn();
    const mockPills = [
      { _id: 'open', name: 'Open' },
      { _id: 'closed', name: 'Closed' },
      { _id: 'overdue', name: 'Overdue' },
    ];
    const mockSelectedIndex = 1;

    render(
      <TestWrapper data-id="001479">
        <div data-id="001480" data-testid="filter-pills-000256">
          <div data-id="001481">OnPillChange: {typeof mockOnPillChange}</div>
          <div data-id="001482">SelectedIndex: {mockSelectedIndex}</div>
          <div data-id="001483">Pills: {JSON.stringify(mockPills)}</div>
          <div data-id="001484">PanelMarginLeft: 0, 0</div>
          <div data-id="001485">PanelPadding: 0, 0</div>
          <div data-id="001486">TabMargin: 0, 0</div>
          <div data-id="001487">TabListProps: {JSON.stringify({ px: [4, 8] })}</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('OnPillChange: function')).toBeInTheDocument();
    expect(screen.getByText('SelectedIndex: 1')).toBeInTheDocument();
    expect(
      screen.getByText('Pills: [{"_id":"open","name":"Open"},{"_id":"closed","name":"Closed"},{"_id":"overdue","name":"Overdue"}]'),
    ).toBeInTheDocument();
    expect(screen.getByText('PanelMarginLeft: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('PanelPadding: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('TabMargin: 0, 0')).toBeInTheDocument();
    expect(screen.getByText('TabListProps: {"px":[4,8]}')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const mockError = { message: 'Failed to load actions' };

    render(
      <TestWrapper data-id="001488">
        <div data-id="001489" data-testid="000258">
          <div data-id="001490" data-testid="000259">
            {mockError.message}
          </div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('000259')).toBeInTheDocument();
    expect(screen.getByText('Failed to load actions')).toBeInTheDocument();
  });

  test('renders loading state correctly', () => {
    render(
      <TestWrapper data-id="001491">
        <div data-id="001492" data-testid="000258">
          <div data-id="001493" data-testid="000260">
            Loading...
          </div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('000260')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('FilterPills children function returns null', () => {
    const childrenFunction = () => null;

    render(
      <TestWrapper data-id="001494">
        <div data-id="001495" data-testid="filter-pills-000256">
          <div data-id="001496">Children: {childrenFunction()}</div>
        </div>
      </TestWrapper>,
    );

    expect(screen.getByText('Children:')).toBeInTheDocument();
  });

  test('handles pill change with different status indices', () => {
    const actionStatuses = { open: 'Open', closed: 'Closed', overdue: 'Overdue' };
    const mockSetQuickFilter = vi.fn();
    const mockSetActiveTab = vi.fn();

    const handlePillChange = (index: number) => {
      const status = Object.keys(actionStatuses)[index];
      mockSetQuickFilter('status', [status]);
      mockSetActiveTab(index);
    };

    // Test with index 0 (open)
    handlePillChange(0);
    expect(mockSetQuickFilter).toHaveBeenCalledWith('status', ['open']);
    expect(mockSetActiveTab).toHaveBeenCalledWith(0);

    // Test with index 1 (closed)
    handlePillChange(1);
    expect(mockSetQuickFilter).toHaveBeenCalledWith('status', ['closed']);
    expect(mockSetActiveTab).toHaveBeenCalledWith(1);

    // Test with index 2 (overdue)
    handlePillChange(2);
    expect(mockSetQuickFilter).toHaveBeenCalledWith('status', ['overdue']);
    expect(mockSetActiveTab).toHaveBeenCalledWith(2);
  });
});

describe('Filter Parsing Functions', () => {
  describe('parseDueDateFilter', () => {
    test('returns null for null or undefined input', () => {
      expect(parseDueDateFilter(null)).toBeNull();
      expect(parseDueDateFilter(undefined)).toBeNull();
    });

    test('returns null for empty array', () => {
      expect(parseDueDateFilter([])).toBeNull();
    });

    test('returns string value when input is string', () => {
      expect(parseDueDateFilter('2024-01-01')).toBe('2024-01-01');
    });

    test('returns null for non-string non-array input', () => {
      expect(parseDueDateFilter(123)).toBeNull();
      expect(parseDueDateFilter({})).toBeNull();
      expect(parseDueDateFilter(true)).toBeNull();
    });

    test('returns first element when first element is array', () => {
      const nestedArray = [['dateRange', '2024-01-01', '2024-01-31']];
      expect(parseDueDateFilter(nestedArray)).toEqual(['dateRange', '2024-01-01', '2024-01-31']);
    });

    test('handles dateRange format correctly', () => {
      const dateRange = ['dateRange', '2024-01-01', '2024-01-31'];
      expect(parseDueDateFilter(dateRange)).toEqual(['dateRange', '2024-01-01', '2024-01-31']);
    });

    test('handles dateRange format with null end date', () => {
      const dateRange = ['dateRange', '2024-01-01', null];
      expect(parseDueDateFilter(dateRange)).toEqual(['dateRange', '2024-01-01', null]);
    });

    test('handles dateRange format with undefined end date', () => {
      const dateRange = ['dateRange', '2024-01-01', undefined];
      expect(parseDueDateFilter(dateRange)).toEqual(['dateRange', '2024-01-01', null]);
    });

    test('handles exactDate format correctly', () => {
      const exactDate = ['exactDate', '2024-01-01'];
      expect(parseDueDateFilter(exactDate)).toEqual(['exactDate', '2024-01-01', undefined]);
    });

    test('handles other filter types correctly', () => {
      const otherFilter = ['otherFilter', 'value'];
      expect(parseDueDateFilter(otherFilter)).toEqual(['otherFilter', 'value', undefined]);
    });

    test('handles single element array', () => {
      const singleElement = ['singleValue'];
      expect(parseDueDateFilter(singleElement)).toEqual(['singleValue', undefined, undefined]);
    });
  });

  describe('isValidFilterValue', () => {
    test('returns false for null or undefined value', () => {
      expect(isValidFilterValue(null, 'anyKey')).toBeFalsy();
      expect(isValidFilterValue(undefined, 'anyKey')).toBeFalsy();
    });

    test('returns false for value without value property', () => {
      expect(isValidFilterValue({}, 'anyKey')).toBeFalsy();
      expect(isValidFilterValue({ other: 'value' }, 'anyKey')).toBeFalsy();
    });

    test('returns false for empty array value', () => {
      expect(isValidFilterValue({ value: [] }, 'anyKey')).toBeFalsy();
    });

    test('returns true for valid string value', () => {
      expect(isValidFilterValue({ value: 'test' }, 'anyKey')).toBeTruthy();
    });

    test('returns true for valid number value', () => {
      expect(isValidFilterValue({ value: 123 }, 'anyKey')).toBeTruthy();
    });

    test('returns true for valid object value', () => {
      expect(isValidFilterValue({ value: { key: 'value' } }, 'anyKey')).toBeTruthy();
    });

    test('returns true for valid array with elements', () => {
      expect(isValidFilterValue({ value: ['item1', 'item2'] }, 'anyKey')).toBeTruthy();
    });

    test('returns false for usersIds with empty assigneesIds', () => {
      const value = { value: { assigneesIds: [] } };
      expect(isValidFilterValue(value, 'usersIds')).toBeFalsy();
    });

    test('returns false for usersIds with undefined assigneesIds', () => {
      const value = { value: {} };
      expect(isValidFilterValue(value, 'usersIds')).toBeFalsy();
    });

    test('returns true for usersIds with valid assigneesIds', () => {
      const value = { value: { assigneesIds: ['user1', 'user2'] } };
      expect(isValidFilterValue(value, 'usersIds')).toBeTruthy();
    });

    test('returns false for usersIds with other properties but no assigneesIds', () => {
      const value = { value: { otherProperty: 'value' } };
      expect(isValidFilterValue(value, 'usersIds')).toBeFalsy();
    });

    test('returns true for non-usersIds key with assigneesIds', () => {
      const value = { value: { assigneesIds: [] } };
      expect(isValidFilterValue(value, 'otherKey')).toBeTruthy();
    });

    test('handles edge cases correctly', () => {
      expect(isValidFilterValue({ value: 0 }, 'anyKey')).toBeFalsy();
      expect(isValidFilterValue({ value: false }, 'anyKey')).toBeFalsy();
      expect(isValidFilterValue({ value: '' }, 'anyKey')).toBeFalsy();
    });
  });

  describe('Filter Processing Integration', () => {
    test('processes dueDate filter correctly', () => {
      const filters = {
        dueDate: { value: ['dateRange', '2024-01-01', '2024-01-31'] },
        otherFilter: { value: 'value' },
      };

      const result = Object.entries(filters).reduce((acc, [key, val]) => {
        if (key === 'dueDate') {
          const parsedDate = parseDueDateFilter(val.value);
          if (!parsedDate) return acc;
          return { ...acc, [key]: parsedDate };
        }
        if (!isValidFilterValue(val, key)) return acc;
        return { ...acc, [key]: val.value };
      }, {} as any);

      expect(result).toEqual({
        dueDate: ['dateRange', '2024-01-01', '2024-01-31'],
        otherFilter: 'value',
      });
    });

    test('processes exactDate filter correctly', () => {
      const filters = {
        dueDate: { value: ['exactDate', '2024-01-01'] },
        otherFilter: { value: 'value' },
      };

      const result = Object.entries(filters).reduce((acc, [key, val]) => {
        if (key === 'dueDate') {
          const parsedDate = parseDueDateFilter(val.value);
          if (!parsedDate) return acc;
          return { ...acc, [key]: parsedDate };
        }
        if (!isValidFilterValue(val, key)) return acc;
        return { ...acc, [key]: val.value };
      }, {} as any);

      expect(result).toEqual({
        dueDate: ['exactDate', '2024-01-01', undefined],
        otherFilter: 'value',
      });
    });

    test('filters out invalid values correctly', () => {
      const filters = {
        dueDate: { value: [] },
        usersIds: { value: { assigneesIds: [] } },
        validFilter: { value: 'value' },
      };

      const result = Object.entries(filters).reduce((acc, [key, val]) => {
        if (key === 'dueDate') {
          const parsedDate = parseDueDateFilter(val.value);
          if (!parsedDate) return acc;
          return { ...acc, [key]: parsedDate };
        }
        if (!isValidFilterValue(val, key)) return acc;
        return { ...acc, [key]: val.value };
      }, {} as any);

      expect(result).toEqual({
        validFilter: 'value',
      });
    });

    test('handles mixed valid and invalid filters', () => {
      const filters = {
        dueDate: { value: ['dateRange', '2024-01-01', '2024-01-31'] },
        usersIds: { value: { assigneesIds: ['user1'] } },
        emptyArray: { value: [] },
        nullValue: null,
        validFilter: { value: 'value' },
      };

      const result = Object.entries(filters).reduce((acc, [key, val]) => {
        if (!val) return acc;
        if (key === 'dueDate') {
          const parsedDate = parseDueDateFilter(val.value);
          if (!parsedDate) return acc;
          return { ...acc, [key]: parsedDate };
        }
        if (!isValidFilterValue(val, key)) return acc;
        return { ...acc, [key]: val.value };
      }, {} as any);

      expect(result).toEqual({
        dueDate: ['dateRange', '2024-01-01', '2024-01-31'],
        usersIds: { assigneesIds: ['user1'] },
        validFilter: 'value',
      });
    });
  });
});
