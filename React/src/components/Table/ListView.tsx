import { Box, Flex } from '@chakra-ui/react';

import TableHeader from './Header/TableHeader';
import TableHeaderElement from './Header/TableHeaderElement';
import ListViewRow from './Rows/ListViewRow';

export interface ColumnConfig {
  label: React.ReactNode;
  sortKey: string;
  width: string;
  hideSortIcon?: boolean;
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
}: {
  readonly data: Array<any>;
  readonly sortOrder: 'asc' | 'desc';
  readonly sortType: string;
  readonly setSortType: (key: string) => void;
  readonly setSortOrder: (order: 'asc' | 'desc') => void;
  readonly columns: ColumnConfig[];
  readonly dataType: string;
  readonly onRowClick: (row: any) => void;
}) {
  const handleSort = (sortKey: string) => {
    setSortType(sortKey);
    setSortOrder(sortOrder === 'asc' && sortType === sortKey ? 'desc' : 'asc');
  };

  // Helper function to render empty state
  if (data?.length === 0) {
    return (
        <Flex alignItems="center" data-id={"empty-list-view"} fontSize="18px" fontStyle="italic" h="200px" justifyContent="center" w="full">
            No {dataType} found. Try adjusting the filters.
        </Flex>
    );
  }

  return (
    <Box bg="container.bg" data-id="000306" h="full" overflow="auto" position="relative" w="full">
      <Box
        bg="container.bg"
        data-id="000307"
        h="fit-content"
        minH="full"
        position="relative"
        w="full"
      >
        <TableHeader data-id="000308">
          {columns
            .filter((column) => column.disabled !== true)
            .map((column, index) => (
              <TableHeaderElement
                data-id={column.dataId}
                key={`${column.sortKey}-${index}`}
                label={column.label}
                ml={column.ml}
                onClick={() => handleSort(column.sortKey)}
                showSortingIcon={sortType === column.sortKey}
                sortOrder={sortType === column.sortKey ? sortOrder : undefined}
                tooltip={column.tooltip}
                w={column.width}
              />
            ))}
        </TableHeader>
        <Flex data-id="000316" flexDir="column" pb={4} w="full">
          {data?.map((row) => <ListViewRow columns={columns} data-id="000317" key={row._id} onRowClick={onRowClick} row={row} />)}
        </Flex>
      </Box>
    </Box>
  );
}

export default ListView;

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
    color: "#2D3748",
    hoverBg: '#F5F7FA',
  },
};
