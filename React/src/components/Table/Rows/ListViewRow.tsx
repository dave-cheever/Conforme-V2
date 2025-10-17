import React, { memo, useCallback } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { ColumnConfig } from '../ListView';

function ListViewRowComponent({ row, columns, onRowClick, 'data-testid': dataTestId }: { readonly row: any; readonly columns: ColumnConfig[]; readonly onRowClick: (row: any) => void; readonly 'data-testid'?: string }) {
  const handleClick = useCallback(() => {
    if (row?.metatags?.removedBy) return;
    onRowClick(row);
  }, [row, onRowClick]);

  return (
    <Box
      _hover={{ bg: "row.hoverBg" }}
      bg="row.bg"
      borderBottomColor="row.borderColor"
      borderBottomWidth="1px"
      color="row.color"
      cursor={row?.metatags?.removedBy ? 'default' : 'pointer'}
      data-id="000216"
      data-testid={dataTestId}
      onClick={handleClick}
      w="full"
    >
      <Flex align="center" data-id="000217" h={['full', '55px']} position="relative" w="full">
        {columns
          .filter((column) => column.disabled !== true)
          .map((column, index) => (
            <Flex data-id={column.dataId} key={`${column.sortKey}-${index}`} px={4} w={column.width}>
              {column.render ? column.render(row) : null}
            </Flex>
          ))}
      </Flex>
    </Box>
  );
}

const areEqual = (
  prev: Readonly<{ row: any; columns: ColumnConfig[]; onRowClick: (row: any) => void; 'data-testid'?: string }>,
  next: Readonly<{ row: any; columns: ColumnConfig[]; onRowClick: (row: any) => void; 'data-testid'?: string }>,
) => {
  return (
    prev.row === next.row &&
    prev.columns === next.columns &&
    prev.onRowClick === next.onRowClick &&
    prev['data-testid'] === next['data-testid']
  );
};

export default memo(ListViewRowComponent, areEqual);
