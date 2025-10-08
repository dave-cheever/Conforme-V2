import { Box, Flex, Text } from '@chakra-ui/react';

function TableHeader({ children, title, ...rest }: { readonly children: React.ReactNode; readonly title?: string }) {
  return (
    <Box
      borderBottom="1px solid #CBD5E0"
      borderTop="1px solid #CBD5E0"
      data-id="000334"
      {...rest}
      position="sticky"
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
        bg="header.bg"
        borderColor="row.borderColor"
        color="header.fontColor"
        data-id="000337"
        fontSize="14px"
        fontWeight="semibold"
      >
        {children}
      </Flex>
    </Box>
  );
}

export default TableHeader;
