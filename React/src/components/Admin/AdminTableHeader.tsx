import { Box, Flex, Text } from '@chakra-ui/react';

function AdminTableHeader({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Box
      bg="adminTableHeader.bg"
      data-id="000334"
      top={0}
      width="100%"
      zIndex={1}>
      {title && (
        <Box bg="white" borderTopRadius="20px" data-id="000335" p="15px 25px">
          <Text data-id="000336" fontSize="smm" fontWeight="bold">
            {title}
          </Text>
        </Box>
      )}
      <Flex
        bg="#EDF2F7"
        borderBottom="1px solid"
        borderColor="adminTableHeader.border"
        borderTopRadius={title ? undefined : '10px'}
        color="adminTableHeader.font"
        data-id="000337"
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
