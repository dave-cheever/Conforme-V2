import { Flex } from '@chakra-ui/react';

function PureLayout({ component: Component }: { component: any }) {
  return <Flex data-id="5e16529b41f0">
    <Component data-id="4f2350244b6b" />
  </Flex>
}

export default PureLayout;
