import { Flex, IconButton } from '@chakra-ui/react';

import Loader from '../components/Loader';
import ModuleSwitcher from '../components/ModuleSwitcher';
import NavigationTop from '../components/NavigationTop';
import ResponseChat from '../components/Response/ResponseChat';
import ResponseChatMobileAndTablet from '../components/Response/ResponseChatMobileAndTablet';
import ReasponseHeader from '../components/Response/ResponseHeader/ResponseHeader';
import ResponseLeftNavigation from '../components/Response/ResponseLeftNavigation';
import ResponseLeftNavigationMobile from '../components/Response/ResponseLeftNavigation/ResponseLeftNavigationMobile';
import ResponseLeftNavigationTablet from '../components/Response/ResponseLeftNavigation/ResponseLeftNavigationTablet';
import ShareModal from '../components/ShareModal';
import ResponseProvider, {
  useResponseContext,
} from '../contexts/ResponseProvider';
import useDevice from '../hooks/useDevice';
import { CrossIcon, MessageIcon } from '../icons';

const ResponseLayout = ({ component: Component }: { component: any }) => {
  const {
    loading,
    response,
    isOpenMessage,
    handleOpenMessage,
    handleCloseMessage,
  } = useResponseContext();
  const device = useDevice();
  const isTabletAndMobile = device === 'tablet' || device === 'mobile';

  if (loading && !response) {
    return (
      <Flex h="100vh">
        <Loader center />
      </Flex>
    );
  }

  return (
    <Flex h="full" minH="100vh" w="full">
      <ModuleSwitcher />
      <ResponseLeftNavigation />
      <ResponseLeftNavigationTablet />
      <Flex
        direction="column"
        w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}
      >
        <NavigationTop />
        <Flex
          bg="layout.bg"
          flexDirection="column"
          h={['calc(100vh - 126px)', 'calc(100vh - 80px)']}
          mt={['65px', 0]}
          overflow="auto"
          position="absolute"
          pt={['25px', 0]}
          top={[0, '80px']}
          w={['full', 'calc(100% - 130px)', 'calc(100% - 290px)']}
          zIndex={4}
        >
          <ShareModal />
          <ReasponseHeader />
          {isTabletAndMobile && (
            <IconButton
              _hover={{ opacity: 0.7 }}
              alignItems="center"
              aria-label="Message"
              bg="responseLayout.iconBg"
              bottom={['75px', '22px']}
              color="white"
              flexShrink={0}
              h="52px"
              icon={
                isOpenMessage ? (
                  <CrossIcon h="21px" ml="5px" stroke="white" w="22px" />
                ) : (
                  <MessageIcon h="21px" stroke="white" w="22px" />
                )
              }
              mr="2px"
              onClick={() =>
                isOpenMessage ? handleCloseMessage() : handleOpenMessage()
              }
              position="fixed"
              right="16px"
              rounded="20px"
              w="52px"
              zIndex={5}
            />
          )}
          <Flex h="full" px="25px" w="full">
            <Flex
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 210px)']}
              minH={['calc(100vh - 200px)', 'calc(100vh - 210px)']}
              pb="25px"
              pt={['40px', '0px']}
              w="full"
            >
              <Component />
            </Flex>
            {device === 'desktop' && <ResponseChat />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && (
            <ResponseChatMobileAndTablet />
          )}
        </Flex>
        <ResponseLeftNavigationMobile />
      </Flex>
    </Flex>
  );
};

export const responseLayoutStyles = {
  responseLayout: {
    iconBg: '#1E1E38',
  },
};

const ResponseLayoutWithContext = (props) => (
  <ResponseProvider {...props}>
    <ResponseLayout {...props} />
  </ResponseProvider>
);

export default ResponseLayoutWithContext;
