import { Flex } from '@chakra-ui/react';

function InsightCount({ count, onClick }) {
  return <Flex
    alignItems="center"
    cursor="pointer"
    data-id="518389a9e0fc"
    h="calc(100% - 1px)"
    justifyContent="center"
    ml=".75rem"
    mt="1px"
    onClick={onClick}
    px={3}
    py={1}>
    {count || 0}
  </Flex>
}

export default InsightCount;
