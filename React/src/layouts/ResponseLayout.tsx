import { Flex, IconButton } from '@chakra-ui/react';

import Chat from '../components/Chat';
import ChatMobileAndTablet from '../components/ChatMobileAndTablet';
import Loader from '../components/Loader';
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

function ResponseLayout({ component: Component }: { component: any }) {
  const { loading, response } = useResponseContext();
  const { isOpenMessage, handleCloseMessage, handleOpenMessage } = useChatContext();
  const device = useDevice();
  const isTabletAndMobile = device === 'tablet' || device === 'mobile' ;

  if (loading && !response) {
    return (
      (<Flex data-id="ccf22a0c0f5b" h="100vh">
        <Loader center data-id="775242ba2c30" />
      </Flex>)
    );
  }

  return (
    (<Flex data-id="2f41fa2e035b" h="full" minH="100vh" w="full">
      <ResponseLeftNavigation data-id="b7674ac38f45" />
      <ResponseLeftNavigationTablet data-id="d070ecad0101" />
      <Flex
        data-id="894373402dc5"
        direction="column"
        grow={1}
        w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}>
        <NavigationTop data-id="8763982d4954" />
        <Flex
          bg="layout.bg"
          data-id="f0afe864ad9f"
          flexDirection="column"
          flexGrow={1}
          mt={['72px', 0]}
          overflow="auto"
          pt={[6, 0]}
          top={[0, '80px']}
          w="full">
          <ShareModal data-id="543d428f061a" />
          <ReasponseHeader data-id="f0167d09321f" />
          {isTabletAndMobile && (
            <IconButton
              _hover={{ opacity: 0.7 }}
              alignItems="center"
              aria-label="Message"
              bg="responseLayout.iconBg"
              bottom={['75px', '22px']}
              color="white"
              data-id="c4546d321b18"
              flexShrink={0}
              h="52px"
              icon={
                isOpenMessage ? <CrossIcon data-id="b88fb7300e6b" h="21px" ml="5px" stroke="white" w="22px" /> : <MessageIcon data-id="3b1cddeef8f5" h="21px" stroke="white" w="22px" />
              }
              mr="2px"
              onClick={() => (isOpenMessage ? handleCloseMessage() : handleOpenMessage())}
              position="fixed"
              right="16px"
              rounded="20px"
              w="52px"
              zIndex={5} />
          )}
          <Flex data-id="8b9c5399812d" flexGrow={1} px={6} w="full">
            <Flex
              data-id="c119cd17023c"
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 210px)']}
              pb={[20, 6]}
              w={['full', 'full', 'calc(100% - 300px)']}>
              <Component data-id="5c93f85622be" />
            </Flex>
            {device === 'desktop' && <Chat component="response" data-id="9eac50ed1857" />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && <ChatMobileAndTablet component="response" data-id="63da4d0a7367" />}
        </Flex>
        <ResponseLeftNavigationMobile data-id="83fc83b3b462" />
      </Flex>
    </Flex>)
  );
}

export const responseLayoutStyles = {
  responseLayout: {
    iconBg: '#1E1E38',
  },
};

function ResponseLayoutWithContext(props) {
  return <ResponseProvider data-id="4f11d34b7362" {...props}>
    <ShareProvider data-id="a843725a1f17">
      <ChatProvider component="response" data-id="47ee6248619d">
        <ResponseLayout data-id="c6b32501edef" {...props} />
      </ChatProvider>
    </ShareProvider>
  </ResponseProvider>
}

export default ResponseLayoutWithContext;
