import { Box, Flex, Text } from '@chakra-ui/react';

function AdminTableHeader({ children, title }: { children: React.ReactNode; title?: string }) {
  return <Box
    bg="adminTableHeader.bg"
    data-id="ac4e728345d1"
    top={0}
    width="100%"
    zIndex={1}>
    {title && (
      <Box bg="white" borderTopRadius="20px" data-id="251a500f8a0d" p="15px 25px">
        <Text data-id="f9605e58fa4c" fontSize="smm" fontWeight="bold">
          {title}
        </Text>
      </Box>
    )}
    <Flex
      bg="white"
      borderBottom="1px solid"
      borderColor="adminTableHeader.border"
      borderTopRadius={title ? undefined : '20px'}
      color="adminTableHeader.font"
      data-id="596c88f2df6e"
      fontSize="11px"
      fontWeight="semi_medium"
      p="15px 25px">
      {children}
    </Flex>
  </Box>
}

export default AdminTableHeader;

export const adminTableHeaderStyles = {
  adminTableHeader: {
    bg: '#E5E5E5',
    font: '#818197',
    border: '#F0F0F0',
  },
};
