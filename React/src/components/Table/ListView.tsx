import React, { useCallback } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import Pagination from '../UI/Pagination/Pagination';
import TableHeader from './Header/TableHeader';
import TableHeaderElement from './Header/TableHeaderElement';
import ListViewRow from './Rows/ListViewRow';
import { PAGINATION_PAGE_SIZE_OPTIONS } from '../../bootstrap/config';

export interface ColumnConfig {
  label: React.ReactNode;
  sortKey: string;
  width: string;
  hideSortIcon?: boolean;
  disableSort?: boolean;
  tooltip?: string;
  dataId?: string;
  ml?: string;
  disabled?: boolean;
  render?: (row: any) => React.ReactNode;
}

function ListView({
  data,
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
  columns,
  dataType,
  onRowClick,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  readonly data: Array<any>;
  readonly sortOrder: 'asc' | 'desc';
  readonly sortType: string;
  readonly setSortType: (key: string) => void;
  readonly setSortOrder: (order: 'asc' | 'desc') => void;
  readonly columns: ColumnConfig[];
  readonly dataType: string;
  readonly onRowClick: (row: any) => void;
  readonly currentPage?: number;
  readonly pageSize?: (typeof PAGINATION_PAGE_SIZE_OPTIONS)[number];
  readonly total?: number;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: (typeof PAGINATION_PAGE_SIZE_OPTIONS)[number]) => void;
}) {
  const handleSort = useCallback(
    (sortKey: string) => {
      setSortType(sortKey);
      setSortOrder(sortOrder === 'asc' && sortType === sortKey ? 'desc' : 'asc');
    },
    [setSortType, setSortOrder, sortOrder, sortType],
  );

  // Helper function to render empty state
  if (data?.length === 0) {
    return (
      <Flex alignItems="center" data-id={'empty-list-view'} fontSize="18px" fontStyle="italic" h="200px" justifyContent="center" w="full">
        No {dataType} found. Try adjusting the filters.
      </Flex>
    );
  }

  return (
    <Box bg="container.bg" data-id="000306" display="flex" flexDir="column" h="full" position="relative" w="full">
      <Box bg="container.bg" data-id="000307" flexShrink={0} position="relative" w="full">
        <TableHeader data-id="000308">
          {columns
            .filter((column) => column.disabled !== true)
            .map((column, index) => (
              <TableHeaderElement
                data-id={column.dataId}
                key={`${column.sortKey}-${index}`}
                label={column.label}
                ml={column.ml}
                onClick={column.disableSort ? undefined : () => handleSort(column.sortKey)}
                showSortingIcon={sortType === column.sortKey}
                sortOrder={sortType === column.sortKey ? sortOrder : undefined}
                tooltip={column.tooltip}
                w={column.width}
              />
            ))}
        </TableHeader>
      </Box>
      <Box data-id="000316" flex="1" overflowY="auto" w="full">
        <Flex data-id="003087" flexDir="column" w="full">
          {data?.map((row, index) => (
            <ListViewRow
              columns={columns}
              data-id="000317"
              data-testid={`row-${index + 1}`}
              key={row._id}
              onRowClick={onRowClick}
              row={row}
            />
          ))}
        </Flex>
      </Box>
      <Pagination
        data-id="003088"
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange} 
      />
    </Box>
  );
}

// Memoize ListView to prevent unnecessary re-renders when props haven't changed
export default React.memo(ListView);

export const listViewStyles = {
  container: {
    bg: '#F7FAFC',
  },
  header: {
    bg: '#EDF2F7',
    fontColor: '#2D3748',
    arrowColorEnabled: '#282F36',
    arrowColorDisabled: '#282F36',
  },
  row: {
    bg: '#FFFFFF',
    borderColor: '#CBD5E0',
    color: '#2D3748',
    hoverBg: '#F5F7FA',
  },
};
