import { Flex } from '@chakra-ui/react';

const PureLayout = ({ component: Component }: { component: any }) => (
  <Flex data-id="5e16529b41f0">
    <Component data-id="4f2350244b6b" />
  </Flex>
);

export default PureLayout;
