import { Flex, IconButton } from "@chakra-ui/react";

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
import ResponseChatMobileAndTablet from "../components/Response/ResponseChatMobileAndTablet";
import useDevice from "../hooks/useDevice";
import { useHistory } from "react-router-dom";
import { CrossIcon, MessageIcon } from "../icons";

const ResponseLayout = ({ component: Component }: { component: any }) => {
  const { loading, response, isOpenMessage, handleOpenMessage, handleCloseMessage } = useResponseContext();
  const history = useHistory();
  const device = useDevice()
  const isTabletAndMobile = device === 'tablet' || device === 'mobile'
  const isComplianceItemPage = history.location.pathname.split('/')[1] === "compliance-item"

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
          h={["calc(100vh - 126px)", "calc(100vh - 80px)"]}
          mt={["65px", 0]}
          pt={["25px", 0]}
          zIndex={4}
        >
          <ShareModal />
          <ReasponseHeader />
          {isComplianceItemPage && isTabletAndMobile &&
            <IconButton
              onClick={() => isOpenMessage ? handleCloseMessage() : handleOpenMessage()}
              _hover={{ opacity: 0.7 }}
              mr="2px"
              bg="responseLayout.iconBg"
              h="52px"
              w="52px"
              alignItems="center"
              color="white"
              aria-label="Message"
              icon={isOpenMessage ?
                <CrossIcon ml="5px" h="21px" w="22px" stroke="white" /> :
                <MessageIcon h="21px" w="22px" stroke="white" />
              }
              position='fixed'
              bottom={['75px', '22px']}
              right='16px'
              zIndex={5}
              flexShrink={0}
              rounded="20px"
            />}
          <Flex w="full" h="full" px="25px">
            <Flex
              flexDirection="column"
              minH={["calc(100vh - 200px)", "calc(100vh - 200px)"]}
              maxH={["none", "calc(100vh - 200px)"]}
              w="full"
              h="full"
              pb="25px"
              pt={["40px", "0px"]}
            >
              <Component />
            </Flex>
            {device === "desktop" && <ResponseChat />}
          </Flex>
          {isOpenMessage && isTabletAndMobile &&
            <ResponseChatMobileAndTablet />}
        </Flex>
        <ResponseLeftNavigationMobile />
      </Flex>
    </Flex>
  );
};

export const ResponseLayoutStyles = {
  responseLayout : {
    iconBg: "#1E1E38"
  }
}

const ResponseLayoutWithContext = (props) => (
  <ResponseProvider {...props}>
    <ResponseLayout {...props} />
  </ResponseProvider>
);

export default ResponseLayoutWithContext;
