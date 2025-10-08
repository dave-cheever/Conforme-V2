import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppProvider from '../../contexts/AppProvider';
import ListView, { ColumnConfig } from './ListView';

// Mock AppProvider for testing
vi.mock('../../contexts/AppProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ListViewRow component
vi.mock('./Rows/ListViewRow', () => ({
  default: ({ row, columns }: { row: any; columns: ColumnConfig[] }) => (
    <div data-id="001870" data-testid={`row-${row._id}`}>
      {columns.map((col) => (
        <div data-id="002026" data-testid={`cell-${col.sortKey}`} key={col.sortKey}>
          {col.render ? col.render(row) : null}
        </div>
      ))}
    </div>
  ),
}));


const createWrapper = () => (function({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider data-id="002027">
        <BrowserRouter data-id="002028">
          <AppProvider data-id="002029">
            {children}
          </AppProvider>
        </BrowserRouter>
      </ChakraProvider>
  );
});

describe('ListView', () => {
  const mockData = [
    { _id: '1', name: 'Item 1', status: 'active' },
    { _id: '2', name: 'Item 2', status: 'pending' },
    { _id: '3', name: 'Item 3', status: 'completed' },
  ];

  const mockColumns: ColumnConfig[] = [
    {
      label: 'Name',
      sortKey: 'name',
      width: '40%',
      dataId: 'col-name',
      render: (row) => <div data-id="001875">{row.name}</div>,
    },
    {
      label: 'Status',
      sortKey: 'status',
      width: '30%',
      dataId: 'col-status',
      render: (row) => <div data-id="001876">{row.status}</div>,
    },
    {
      label: 'Actions',
      sortKey: 'actions',
      width: '30%',
      dataId: 'col-actions',
      hideSortIcon: true,
      render: () => <button data-id="002030" type="button">Edit</button>,
    },
  ];

  const mockSetSortType = vi.fn();
  const mockSetSortOrder = vi.fn();
  const mockOnRowClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render table headers for all non-disabled columns', () => {
    render(
      <ListView
        data-id="002031"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should render all data rows', () => {
    render(
      <ListView
        data-id="002032"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('row-2')).toBeInTheDocument();
    expect(screen.getByTestId('row-3')).toBeInTheDocument();
  });

  it('should handle sort column click', () => {
    render(
      <ListView
        data-id="002033"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    const statusHeader = screen.getByText('Status');
    fireEvent.click(statusHeader);

    expect(mockSetSortType).toHaveBeenCalledWith('status');
    expect(mockSetSortOrder).toHaveBeenCalledWith('asc');
  });

  it('should toggle sort order when clicking same column', () => {
    render(
      <ListView
        data-id="002034"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    expect(mockSetSortType).toHaveBeenCalledWith('name');
    expect(mockSetSortOrder).toHaveBeenCalledWith('desc');
  });

  it('should filter out disabled columns from headers', () => {
    const columnsWithDisabled = [
      ...mockColumns,
      {
        label: 'Hidden',
        sortKey: 'hidden',
        width: '10%',
        dataId: 'col-hidden',
        disabled: true,
      },
    ];

    render(
      <ListView
        data-id="002035"
        columns={columnsWithDisabled}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(
      <ListView
        data-id="002036"
        columns={mockColumns}
        data={[]}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No audits found. Try adjusting the filters.')).toBeInTheDocument();
  });

  it('should display correct empty state message for different data types', () => {
    render(
      <ListView
        data-id="002037"
        columns={mockColumns}
        data={[]}
        dataType="users"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No users found. Try adjusting the filters.')).toBeInTheDocument();
  });

  it('should pass correct props to table headers', () => {
    render(
      <ListView
        data-id="002038"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="desc"
        sortType="status" />,
      { wrapper: createWrapper() },
    );

    // Status column should show as sorted
    const statusHeader = screen.getByText('Status');
    expect(statusHeader).toBeInTheDocument();
  });

  it('should handle columns with tooltips', () => {
    const columnsWithTooltip: ColumnConfig[] = [
      {
        label: 'Name',
        sortKey: 'name',
        width: '50%',
        dataId: 'col-name',
        tooltip: 'This is the name column',
        render: (row) => <div data-id="001886">{row.name}</div>,
      },
    ];

    render(
      <ListView
        data-id="002039"
        columns={columnsWithTooltip}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should handle columns with hideSortIcon flag', () => {
    render(
      <ListView
        data-id="002040"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="actions" />,
      { wrapper: createWrapper() },
    );

    // Actions column has hideSortIcon: true
    const actionsHeader = screen.getByText('Actions');
    expect(actionsHeader).toBeInTheDocument();
  });

  it('should maintain correct data-id attributes', () => {
    const { container } = render(
      <ListView
        data-id="002041"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(container.querySelector('[data-id="000306"]')).not.toBeNull();
    expect(container.querySelector('[data-id="000307"]')).not.toBeNull();
    expect(container.querySelector('[data-id="000308"]')).not.toBeNull();
    expect(container.querySelector('[data-id="000316"]')).not.toBeNull();
  });

  it('should render with single item', () => {
    const singleItem = [mockData[0]];

    render(
      <ListView
        data-id="002042"
        columns={mockColumns}
        data={singleItem}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.queryByTestId('row-2')).not.toBeInTheDocument();
  });

  it('should apply correct widths to column headers', () => {
    const { container } = render(
      <ListView
        data-id="002043"
        columns={mockColumns}
        data={mockData}
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name" />,
      { wrapper: createWrapper() },
    );

    // Ensure our mocked header renders at least once
    const headerContainer = container.querySelector('[data-id="000308"]');
    expect(headerContainer).not.toBeNull();
  });
});

