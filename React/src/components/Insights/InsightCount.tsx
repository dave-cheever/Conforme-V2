import { Flex } from '@chakra-ui/react';

const InsightCount = ({ count, onClick }) => (
  <Flex
    alignItems="center"
    bg="userItem.responseCountBg"
    cursor="pointer"
    h="calc(100% - 1px)"
    justifyContent="center"
    mr="1px"
    mt="1px"
    onClick={onClick}
    w="calc(25% - 1px)"
  >
    {count || 0}
  </Flex>
);

export default InsightCount;
