import React from 'react';

import { Box, Flex } from '@chakra-ui/react';

const AdminTableHeader = ({ children }) => (
  <Box bg="adminTableHeader.bg" pos="sticky" top={0} width="100%" zIndex={1}>
    <Flex
      bg="white"
      borderBottom="1px solid"
      borderColor="adminTableHeader.border"
      borderTopRadius="20px"
      color="adminTableHeader.font"
      fontSize="11px"
      fontWeight="semi_medium"
      p="15px 25px"
    >
      {children}
    </Flex>
  </Box>
);

export default AdminTableHeader;

export const adminTableHeaderStyles = {
  adminTableHeader: {
    bg: '#E5E5E5',
    font: '#818197',
    border: '#F0F0F0',
  },
};
