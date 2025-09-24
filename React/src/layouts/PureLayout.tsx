import { Flex } from '@chakra-ui/react';

function PureLayout({ component: Component }: { component: any }) {
  return (
    <Flex data-id="000186">
      <Component data-id="000187" />
    </Flex>
  );
}

export default PureLayout;
