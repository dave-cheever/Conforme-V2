import { Flex } from "@chakra-ui/react";

import NavigationTop from "../components/NavigationTop";
import Loader from "../components/Loader";
import ResponseLeftNavigation from "../components/Response/ResponseLeftNavigation";
import ResponseProvider, {
  useResponseContext,
} from "../contexts/ResponseProvider";
import ResponseLeftNavigationTablet from "../components/Response/ResponseLeftNavigation/ResponseLeftNavigationTablet";
import ResponseLeftNavigationMobile from "../components/Response/ResponseLeftNavigation/ResponseLeftNavigationMobile";
import ShareModal from "../components/ShareModal";
import ReasponseHeader from "../components/Response/ResponseHeader/ResponseHeader";
import ResponseChat from "../components/Response/ResponseChat";

const ResponseLayout = ({ component: Component }: { component: any }) => {
  const { loading, response } = useResponseContext();

  if (loading && !response) {
    return (
      <Flex h="100vh">
        <Loader center={true} />
      </Flex>
    );
  }

  return (
    <Flex w="full" h="full" minH="100vh">
      <ResponseLeftNavigation />
      <ResponseLeftNavigationTablet />
      <Flex
        w={["100%", "calc(100% - 80px)", "calc(100% - 240px)"]}
        direction="column"
      >
        <NavigationTop />
        <Flex
          flexDirection="column"
          bg="layout.bg"
          position="absolute"
          top={[0, "80px"]}
          w={["full", "calc(100% - 80px)", "calc(100% - 240px)"]}
          overflow="auto"
          h={["calc(100vh - 140px)", "calc(100vh - 80px)"]}
          mt={["80px", 0]}
          zIndex={4}
        >
          <ShareModal />
          <ReasponseHeader />
          <Flex w="full" h="full" px="25px">
            <Flex
              flexDirection="column"
              mt={["20px", "0px"]}
              maxH={["calc(100vh - 300px)", "calc(100vh - 200px)"]}
              w="full"
              h="full"
              pb="25px"
            >
              <Component />
            </Flex>
            <ResponseChat />
          </Flex>
        </Flex>
        <ResponseLeftNavigationMobile />
      </Flex>
    </Flex>
  );
};

const ResponseLayoutWithContext = (props) => (
  <ResponseProvider {...props}>
    <ResponseLayout {...props} />
  </ResponseProvider>
);

export default ResponseLayoutWithContext;
