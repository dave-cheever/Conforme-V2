import { Flex } from '@chakra-ui/react';

function InsightCount({ count, onClick }) {
  return (
    <Flex
      data-id="030925-61da36"
      alignItems="center"
      cursor="pointer"
      h="calc(100% - 1px)"
      justifyContent="center"
      ml=".75rem"
      mt="1px"
      onClick={onClick}
      px={3}
      py={1}>
      {count || 0}
    </Flex>
  );
}

export default InsightCount;
