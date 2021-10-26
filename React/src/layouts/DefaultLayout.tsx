import { Flex, Box } from "@chakra-ui/react";

import NavigationLeft from "../components/NavigationLeft/NavigationLeft";
import NavigationTop from "../components/NavigationTop";

const DefaultLayout = ({ component: Component }: { component: any }) => {
  return (
    <Flex minH='100vh'>
      <NavigationLeft />
      <Flex
        w="calc(100% - 240px)"
        direction="column"
        flexBasis="auto"
        flexGrow={1}
      >
        <NavigationTop />
        <Box h="full" overflow="none" bg="layout.bg">
          <Component />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DefaultLayout;
