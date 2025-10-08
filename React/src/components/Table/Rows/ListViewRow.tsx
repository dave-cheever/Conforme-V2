import { Box, Flex } from '@chakra-ui/react';

import { ColumnConfig } from '../ListView';

function ListViewRow({ row, columns, onRowClick }: { readonly row: any; readonly columns: ColumnConfig[]; readonly onRowClick: (row: any) => void }) {
  const handleClick = () => {
    if (row?.metatags?.removedBy) return;
    onRowClick(row);
  };

  return (
    <Box
      _hover={{ bg: "row.hoverBg" }}
      bg="row.bg"
      borderBottomColor="row.borderColor"
      borderBottomWidth="1px"
      color="row.color"
      cursor={row?.metatags?.removedBy ? 'default' : 'pointer'}
      data-id="000216"
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

export default ListViewRow;
