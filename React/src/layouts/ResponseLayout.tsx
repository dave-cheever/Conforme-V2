import { Flex, IconButton } from '@chakra-ui/react';

import Chat from '../components/Chat';
import ChatMobileAndTablet from '../components/ChatMobileAndTablet';
import Loader from '../components/Loader';
import ModuleSwitcher from '../components/ModuleSwitcher';
import NavigationTop from '../components/NavigationTop';
import ReasponseHeader from '../components/Response/ResponseHeader/ResponseHeader';
import ResponseLeftNavigation from '../components/Response/ResponseLeftNavigation';
import ResponseLeftNavigationMobile from '../components/Response/ResponseLeftNavigation/ResponseLeftNavigationMobile';
import ResponseLeftNavigationTablet from '../components/Response/ResponseLeftNavigation/ResponseLeftNavigationTablet';
import ShareModal from '../components/ShareModal';
import ChatProvider, { useChatContext } from '../contexts/ChatProvider';
import ResponseProvider, { useResponseContext } from '../contexts/ResponseProvider';
import ShareProvider from '../contexts/ShareProvider';
import useDevice from '../hooks/useDevice';
import { CrossIcon, MessageIcon } from '../icons';

const ResponseLayout = ({ component: Component }: { component: any }) => {
  const { loading, response } = useResponseContext();
  const { isOpenMessage, handleCloseMessage, handleOpenMessage } = useChatContext();
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
      <Flex direction="column" grow={1} w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}>
        <NavigationTop />
        <Flex bg="layout.bg" flexDirection="column" flexGrow={1} mt={['72px', 0]} overflow="auto" pt={[6, 0]} top={[0, '80px']} w="full">
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
                isOpenMessage ? <CrossIcon h="21px" ml="5px" stroke="white" w="22px" /> : <MessageIcon h="21px" stroke="white" w="22px" />
              }
              mr="2px"
              onClick={() => (isOpenMessage ? handleCloseMessage() : handleOpenMessage())}
              position="fixed"
              right="16px"
              rounded="20px"
              w="52px"
              zIndex={5}
            />
          )}
          <Flex flexGrow={1} px={6} w="full">
            <Flex
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 210px)']}
              pb={[20, 6]}
              w={['full', 'full', 'calc(100% - 300px)']}
            >
              <Component />
            </Flex>
            {device === 'desktop' && <Chat component="response" />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && <ChatMobileAndTablet component="response" />}
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
    <ShareProvider>
      <ChatProvider component="response">
        <ResponseLayout {...props} />
      </ChatProvider>
    </ShareProvider>
  </ResponseProvider>
);

export default ResponseLayoutWithContext;
