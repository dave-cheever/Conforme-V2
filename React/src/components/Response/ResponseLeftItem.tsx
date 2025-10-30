import { Box, Flex, Text } from '@chakra-ui/react';

function ResponseLeftItem({ heading, value }: { heading: string; value: string }) {
  return (
    <Flex
      align="flex-start"
      data-id="000296"
      flexDir="column"
      h="50px"
      mt={2}>
      <Box color="responseLeftNavigation.color"  data-id="000297" fontSize="14px" opacity="64%">
         {heading}
       </Box>
      <Text
        data-id="000298"
        fontSize="12px"
        noOfLines={1}
        textOverflow="ellipsis">
        {value || '-'}
      </Text>
    </Flex>
  );
}

export default ResponseLeftItem;

export const ResponseLeftItemStyles = {
  responseLeftNavigation: {
    color: '#ffffff',
  },
};
