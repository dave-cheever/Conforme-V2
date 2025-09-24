import { Box, Flex, Text } from '@chakra-ui/react';

function AdminTableHeader({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Box
      data-id="000334"
      bg="adminTableHeader.bg"
      top={0}
      width="100%"
      zIndex={1}>
      {title && (
        <Box data-id="000335" bg="white" borderTopRadius="20px" p="15px 25px">
          <Text data-id="000336" fontSize="smm" fontWeight="bold">
            {title}
          </Text>
        </Box>
      )}
      <Flex
        data-id="000337"
        bg="#EDF2F7"
        borderBottom="1px solid"
        borderColor="adminTableHeader.border"
        borderTopRadius={title ? undefined : '10px'}
        color="adminTableHeader.font"
        fontSize="14px"
        fontWeight="semibold"
        p="10px 10px">
        {children}
      </Flex>
    </Box>
  );
}

export default AdminTableHeader;

export const adminTableHeaderStyles = {
  adminTableHeader: {
    bg: '#f5f5f5',
    font: '#818197',
    border: '#F0F0F0',
  },
};
