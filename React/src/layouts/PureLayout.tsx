import { Flex } from '@chakra-ui/react';

const PureLayout = ({ component: Component }: { component: any }) => (
  <Flex>
    <Component />
  </Flex>
);

export default PureLayout;
