import { Box, Flex, Text } from '@chakra-ui/react';

function ResponseLeftItem({ heading, value }: { heading: string; value: string }) {
  return (
    <Flex
      data-id="030925-5b054f"
      align="flex-start"
      flexDir="column"
      h="50px"
      mt={2}>
     <Box data-id="030925-262b87"  color="responseLeftNavigation.color" fontSize="16px" opacity="64%">
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
