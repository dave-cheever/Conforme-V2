import { Flex } from "@chakra-ui/react";

const PureLayout = ({ component: Component }: { component: any }) => {
  return <Flex>
    <Component />
  </Flex>;
};

export default PureLayout;
