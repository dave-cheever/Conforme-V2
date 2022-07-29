import { Box, Flex, Text } from '@chakra-ui/react';

const AdminTableHeader = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <Box bg="adminTableHeader.bg" top={0} width="100%" zIndex={1}>
    {title && (
      <Box bg="white" borderTopRadius="20px" p="15px 25px">
        <Text fontSize="smm" fontWeight="bold">
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
