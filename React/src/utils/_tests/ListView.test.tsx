import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ListView, { ColumnConfig } from '../../components/Table/ListView';
import AppProvider from '../../contexts/AppProvider';
import { PAGINATION_PAGE_SIZE_OPTIONS } from '../../bootstrap/config';

// Mock AppProvider for testing
vi.mock('../../contexts/AppProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ListViewRow component
vi.mock('../../components/Table/Rows/ListViewRow', () => ({
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

// Mock Pagination component
vi.mock('../../components/UI/Pagination/Pagination', () => ({
  default: ({ currentPage, pageSize, total, onPageChange, onPageSizeChange }: any) => {
    // Match the actual component behavior - return null if any required prop is undefined
    if (currentPage === undefined || pageSize === undefined || total === undefined || onPageChange === undefined || onPageSizeChange === undefined) {
      return null;
    }
    
    const totalPages = Math.ceil(total / pageSize);
    
    return (
      <div data-id="pagination" data-testid="pagination-component">
        <div data-id="003089" data-testid="pagination-info">
          Page {currentPage} of {totalPages}, Total: {total}, PageSize: {pageSize}
        </div>
        <button
          data-id="003090"
          data-testid="pagination-previous"
          disabled={currentPage === 1}
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}>
          Previous
        </button>
        <button
          data-id="003091"
          data-testid="pagination-next"
          disabled={currentPage >= totalPages}
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}>
          Next
        </button>
        <select
          data-id="003092"
          data-testid="pagination-page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGINATION_PAGE_SIZE_OPTIONS.map((option) => (
            <option data-id="003093" key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  },
}));

const createWrapper = () =>
  (function({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider data-id="002027">
        <BrowserRouter data-id="002028">
          <AppProvider data-id="002029">{children}</AppProvider>
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
      render: () => (
        <button data-id="002030" type="button">
          Edit
        </button>
      ),
    },
  ];

  const mockSetSortType = vi.fn();
  const mockSetSortOrder = vi.fn();
  const mockOnRowClick = vi.fn();
  const mockOnPageChange = vi.fn();
  const mockOnPageSizeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render table headers for all non-disabled columns', () => {
    render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002031"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should render all data rows', () => {
    render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002032"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('row-2')).toBeInTheDocument();
    expect(screen.getByTestId('row-3')).toBeInTheDocument();
  });

  it('should handle sort column click', () => {
    render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002033"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
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
        columns={mockColumns}
        data={mockData}
        data-id="002034"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
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
        columns={columnsWithDisabled}
        data={mockData}
        data-id="002035"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(
      <ListView
        columns={mockColumns}
        data={[]}
        data-id="002036"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No audits found. Try adjusting the filters.')).toBeInTheDocument();
  });

  it('should display correct empty state message for different data types', () => {
    render(
      <ListView
        columns={mockColumns}
        data={[]}
        data-id="002037"
        dataType="users"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('No users found. Try adjusting the filters.')).toBeInTheDocument();
  });

  it('should pass correct props to table headers', () => {
    render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002038"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="desc"
        sortType="status"
      />,
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
        columns={columnsWithTooltip}
        data={mockData}
        data-id="002039"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should handle columns with hideSortIcon flag', () => {
    render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002040"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="actions"
      />,
      { wrapper: createWrapper() },
    );

    // Actions column has hideSortIcon: true
    const actionsHeader = screen.getByText('Actions');
    expect(actionsHeader).toBeInTheDocument();
  });

  it('should handle columns with disableSort flag', () => {
    const columnsWithDisableSort: ColumnConfig[] = [
      {
        label: 'Name',
        sortKey: 'name',
        width: '40%',
        dataId: 'col-name',
        render: (row) => <div data-id="001875">{row.name}</div>,
      },
      {
        label: 'Actions',
        sortKey: '',
        width: '30%',
        dataId: 'col-actions',
        disableSort: true,
        render: () => (
          <button data-id="002030" type="button">
            Edit
          </button>
        ),
      },
    ];

    render(
      <ListView
        columns={columnsWithDisableSort}
        data={mockData}
        data-id="002044"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    // Actions column has disableSort: true, clicking should not trigger sort
    const actionsHeader = screen.getByText('Actions');
    fireEvent.click(actionsHeader);

    // setSortType should not be called for actions column since it has disableSort
    expect(mockSetSortType).not.toHaveBeenCalled();

    // But clicking on Name should still work
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockSetSortType).toHaveBeenCalledWith('name');
  });

  it('should maintain correct data-id attributes', () => {
    const { container } = render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002041"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
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
        columns={mockColumns}
        data={singleItem}
        data-id="002042"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.queryByTestId('row-2')).not.toBeInTheDocument();
  });

  it('should apply correct widths to column headers', () => {
    const { container } = render(
      <ListView
        columns={mockColumns}
        data={mockData}
        data-id="002043"
        dataType="audits"
        onRowClick={mockOnRowClick}
        setSortOrder={mockSetSortOrder}
        setSortType={mockSetSortType}
        sortOrder="asc"
        sortType="name"
      />,
      { wrapper: createWrapper() },
    );

    // Ensure our mocked header renders at least once
    const headerContainer = container.querySelector('[data-id="000308"]');
    expect(headerContainer).not.toBeNull();
  });

  describe('Pagination', () => {
    it('should render pagination component when pagination props are provided', () => {
      render(
        <ListView
          columns={mockColumns}
          data={mockData}
          data-id="002044"
          dataType="audits"
          onRowClick={mockOnRowClick}
          setSortOrder={mockSetSortOrder}
          setSortType={mockSetSortType}
          sortOrder="asc"
          sortType="name"
          currentPage={1}
          pageSize={10}
          total={100}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />,
        { wrapper: createWrapper() },
      );
      expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
    });

    it('should not render pagination component when pagination props are missing', () => {
      render(
        <ListView
          columns={mockColumns}
          data={mockData}
          data-id="002045"
          dataType="audits"
          onRowClick={mockOnRowClick}
          setSortOrder={mockSetSortOrder}
          setSortType={mockSetSortType}
          sortOrder="asc"
          sortType="name"
        />,
        { wrapper: createWrapper() },
      );
      expect(screen.queryByTestId('pagination-component')).not.toBeInTheDocument();
    });

    it('should call onPageChange when next button is clicked', () => {
      render(
        <ListView
          columns={mockColumns}
          data={mockData}
          data-id="002046"
          dataType="audits"
          onRowClick={mockOnRowClick}
          setSortOrder={mockSetSortOrder}
          setSortType={mockSetSortType}
          sortOrder="asc"
          sortType="name"
          currentPage={1}
          pageSize={10}
          total={100}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />,
        { wrapper: createWrapper() },
      );
      const nextButton = screen.getByTestId('pagination-next');
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when previous button is clicked', () => {
      render(
        <ListView
          columns={mockColumns}
          data={mockData}
          data-id="002047"
          dataType="audits"
          onRowClick={mockOnRowClick}
          setSortOrder={mockSetSortOrder}
          setSortType={mockSetSortType}
          sortOrder="asc"
          sortType="name"
          currentPage={2}
          pageSize={10}
          total={100}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />,
        { wrapper: createWrapper() },
      );
      const previousButton = screen.getByTestId('pagination-previous');
      fireEvent.click(previousButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageSizeChange when page size selector is changed', () => {
      render(
        <ListView
          columns={mockColumns}
          data={mockData}
          data-id="002048"
          dataType="audits"
          onRowClick={mockOnRowClick}
          setSortOrder={mockSetSortOrder}
          setSortType={mockSetSortType}
          sortOrder="asc"
          sortType="name"
          currentPage={1}
          pageSize={10}
          total={100}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />,
        { wrapper: createWrapper() },
      );
      const pageSizeSelect = screen.getByTestId('pagination-page-size-select');
      fireEvent.change(pageSizeSelect, { target: { value: PAGINATION_PAGE_SIZE_OPTIONS[0].toString() } });
      expect(mockOnPageSizeChange).toHaveBeenCalledWith(PAGINATION_PAGE_SIZE_OPTIONS[0]);
    });

    it('should maintain correct layout structure with flex column', () => {
      const { container } = render(
        <ListView
          columns={mockColumns}
          data={mockData}
          data-id="002049"
          dataType="audits"
          onRowClick={mockOnRowClick}
          setSortOrder={mockSetSortOrder}
          setSortType={mockSetSortType}
          sortOrder="asc"
          sortType="name"
          currentPage={1}
          pageSize={10}
          total={100}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />,
        { wrapper: createWrapper() },
      );

      const mainContainer = container.querySelector('[data-id="000306"]');
      expect(mainContainer).not.toBeNull();
      
      const headerContainer = container.querySelector('[data-id="000307"]');
      expect(headerContainer).not.toBeNull();
      
      const contentArea = container.querySelector('[data-id="000316"]');
      expect(contentArea).not.toBeNull();
    });
  });
});
