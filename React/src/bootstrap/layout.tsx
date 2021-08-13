import { Flex, Box } from "@chakra-ui/react";

import NavigationLeft from "../components/NavigationLeft";
import NavigationTop from "../components/NavigationTop";

const Layout = ({ component: Component }: { component: any }) => {
  return (
    <Flex>
      <NavigationLeft />
      <Flex
        w="calc(100% - 240px)"
        direction="column"
        flexBasis="auto"
        flexGrow={1}
      >
        <NavigationTop />
        <Box h="calc(100vh - 80px)" overflow="none" bg="layout.bg">
          <Component />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
