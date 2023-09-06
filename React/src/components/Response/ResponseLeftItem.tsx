import { Box, Flex, Text } from '@chakra-ui/react';

function ResponseLeftItem({ heading, value }: { heading: string; value: string }) {
  return <Flex
    align="flex-start"
    data-id="d8074ffba067"
    flexDir="column"
    h="50px"
    mt={2}>
    <Box data-id="fd7376fdeb2f" fontSize="11px" opacity={0.5}>
      {heading}
    </Box>
    <Text
      data-id="6f05679e98f5"
      fontSize="14px"
      noOfLines={1}
      textOverflow="ellipsis">
      {value || '-'}
    </Text>
  </Flex>
}

export default ResponseLeftItem;
