import { Flex, Box } from "@chakra-ui/react";
import NavigationBottomMobile from "../components/NavigationBottomMobile";

import NavigationLeft from "../components/NavigationLeft/NavigationLeft";
import NavigationTop from "../components/NavigationTop";
import useDevice from "../hooks/useDevice";

const DefaultLayout = ({ component: Component }: { component: any }) => {
  const device = useDevice();
  
  return (
    <Flex minH='100vh'>
      <NavigationLeft />
      <Flex
        direction="column"
        flexBasis="auto"
        flexGrow={1}
      >
        <NavigationTop />
        <Box h={["calc(100vh - 140px)", "full"]} mt={["80px", 0]} overflow="none" bg="layout.bg">
          <Component />
        </Box>
        {device === "mobile" && <NavigationBottomMobile />}
      </Flex>
    </Flex>
  );
};

export default DefaultLayout;
