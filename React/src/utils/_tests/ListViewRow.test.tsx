import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ColumnConfig } from '../../components/Table/ListView';
import ListViewRow from '../../components/Table/Rows/ListViewRow';
import AppProvider from '../../contexts/AppProvider';

// Mock AppProvider for testing
vi.mock('../../../contexts/AppProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock hooks
vi.mock('../../../hooks/useNavigate', () => ({
  default: () => ({
    navigateTo: vi.fn(),
  }),
}));

// Mock cell components
vi.mock('../Cells/StatusCell', () => ({
  default: ({ status }: { status: string }) => (
    <div data-id="002007" data-testid="status-cell">
      {status}
    </div>
  ),
}));

vi.mock('../Cells/AvatarCell', () => ({
  default: ({ users }: { users: any[] }) => (
    <div data-id="002008" data-testid="avatar-cell">
      {users.length > 0 ? users[0].displayName : 'No users'}
    </div>
  ),
}));

const createWrapper = () =>
  (function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider data-id="002064">
        <BrowserRouter data-id="002065">
          <AppProvider data-id="002066">{children}</AppProvider>
        </BrowserRouter>
      </ChakraProvider>
    );
  });

describe('ListViewRow', () => {
  const mockRow = {
    _id: 'audit-1',
    dueDate: '2025-10-15',
    location: { name: 'Test Location' },
    status: 'pending',
    walkType: 'safety',
    auditor: { _id: 'user-1', displayName: 'John Doe', imgUrl: '' },
    reference: 'REF-001',
    completedDate: null,
    metatags: {},
  };

  const mockColumns: ColumnConfig[] = [
    {
      label: 'Due date',
      sortKey: 'dueDate',
      width: '10%',
      dataId: 'col-1',
      render: (row) => <div data-id="002012">{row.dueDate}</div>,
    },
    {
      label: 'Location',
      sortKey: 'location.name',
      width: '20%',
      dataId: 'col-2',
      render: (row) => <div data-id="002013">{row.location?.name ?? 'Virtual'}</div>,
    },
    {
      label: 'Status',
      sortKey: 'status',
      width: '15%',
      dataId: 'col-3',
      render: (row) => (
        <div data-id="002014" data-testid="status-cell">
          {row.status}
        </div>
      ),
    },
  ];

  const mockOnRowClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all non-disabled columns', () => {
    const { container } = render(<ListViewRow columns={mockColumns} data-id="002067" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    const columnElements = container.querySelectorAll('[data-id^="col-"]');
    expect(columnElements.length).toBe(3);
  });

  it('should filter out disabled columns', () => {
    const columnsWithDisabled: ColumnConfig[] = [
      ...mockColumns,
      {
        label: 'Disabled',
        sortKey: 'disabled',
        width: '10%',
        dataId: 'col-disabled',
        disabled: true,
        render: () => <div data-id="002016">Should not render</div>,
      },
    ];

    const { container } = render(<ListViewRow columns={columnsWithDisabled} data-id="002068" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    const disabledColumn = container.querySelector('[data-id="col-disabled"]');
    expect(disabledColumn).toBeNull();
  });

  it('should apply correct width to each column', () => {
    const { container } = render(<ListViewRow columns={mockColumns} data-id="002069" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    const columnElements = container.querySelectorAll('[data-id^="col-"]');
    expect(columnElements[0]).toHaveStyle({ width: '10%' });
    expect(columnElements[1]).toHaveStyle({ width: '20%' });
    expect(columnElements[2]).toHaveStyle({ width: '15%' });
  });

  it('should render column content using render function', () => {
    const { container } = render(<ListViewRow columns={mockColumns} data-id="002070" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    expect(container.textContent).toContain('2025-10-15');
    expect(container.textContent).toContain('Test Location');
    expect(container.textContent).toContain('pending');
  });

  it('should handle row with null location', () => {
    const rowWithoutLocation = { ...mockRow, location: null };
    const { container } = render(
      <ListViewRow columns={mockColumns} data-id="002071" onRowClick={mockOnRowClick} row={rowWithoutLocation} />,
      { wrapper: createWrapper() },
    );

    expect(container.textContent).toContain('Virtual');
  });

  it('should have pointer cursor when row is not removed', () => {
    const { container } = render(<ListViewRow columns={mockColumns} data-id="002072" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    const rowElement = container.querySelector('[data-id="000216"]');
    expect(rowElement).toHaveStyle({ cursor: 'pointer' });
  });

  it('should have default cursor when row is removed', () => {
    const removedRow = {
      ...mockRow,
      metatags: { removedBy: 'user-1' },
    };

    const { container } = render(<ListViewRow columns={mockColumns} data-id="002073" onRowClick={mockOnRowClick} row={removedRow} />, {
      wrapper: createWrapper(),
    });

    const rowElement = container.querySelector('[data-id="000216"]');
    expect(rowElement).toHaveStyle({ cursor: 'default' });
  });

  it('should render with empty columns array', () => {
    const { container } = render(<ListViewRow columns={[]} data-id="002074" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    const columnElements = container.querySelectorAll('[data-id^="col-"]');
    expect(columnElements.length).toBe(0);
  });

  it('should handle columns without render function', () => {
    const columnsWithoutRender: ColumnConfig[] = [
      {
        label: 'Test',
        sortKey: 'test',
        width: '10%',
        dataId: 'col-test',
      },
    ];

    const { container } = render(
      <ListViewRow columns={columnsWithoutRender} data-id="002075" onRowClick={mockOnRowClick} row={mockRow} />,
      { wrapper: createWrapper() },
    );

    const columnElement = container.querySelector('[data-id="col-test"]');
    expect(columnElement).not.toBeNull();
    expect(columnElement?.textContent).toBe('');
  });

  it('should maintain correct data-id attributes', () => {
    const { container } = render(<ListViewRow columns={mockColumns} data-id="002076" onRowClick={mockOnRowClick} row={mockRow} />, {
      wrapper: createWrapper(),
    });

    expect(container.querySelector('[data-id="000216"]')).not.toBeNull();
    expect(container.querySelector('[data-id="000217"]')).not.toBeNull();
    expect(container.querySelector('[data-id="col-1"]')).not.toBeNull();
    expect(container.querySelector('[data-id="col-2"]')).not.toBeNull();
    expect(container.querySelector('[data-id="col-3"]')).not.toBeNull();
  });
});
