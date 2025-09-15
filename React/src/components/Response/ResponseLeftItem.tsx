import { Box, Flex, Text } from '@chakra-ui/react';

function ResponseLeftItem({ heading, value }: { heading: string; value: string }) {
  return (
    <Flex
      align="flex-start"
      data-id="030925-5b054f"
      flexDir="column"
      h="50px"
      mt={2}>
     <Box color="responseLeftNavigation.color"  data-id="030925-262b87" fontSize="16px" opacity="64%">
        {heading}
      </Box>
      <Text
        data-id="030925-1d38c6"
        fontSize="16px"
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
