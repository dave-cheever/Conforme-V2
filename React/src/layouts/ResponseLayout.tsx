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
      <Flex data-id="000221" h="100vh">
        <Loader data-id="000222" center />
      </Flex>
    );
  }

  return (
    <Flex data-id="000223" h="full" minH="100vh" w="full">
      <ResponseLeftNavigation data-id="000224" />
      <ResponseLeftNavigationTablet data-id="000225" />
      <Flex
        data-id="000226"
        direction="column"
        grow={1}
        w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}>
        <NavigationTop data-id="000227" />
        <Flex
          data-id="000228"
          flexDirection="column"
          flexGrow={1}
          mt={['72px', 0]}
          overflow="auto"
          pt={[6, 0]}
          top={[0, '80px']}
          w="full">
          <ShareModal data-id="000229" />
          <ReasponseHeader data-id="000230" />
          {isTabletAndMobile && (
            <IconButton
              data-id="000231"
              _hover={{ opacity: 0.7 }}
              alignItems="center"
              aria-label="Message"
              bg="responseLayout.iconBg"
              bottom={['75px', '22px']}
              color="white"
              flexShrink={0}
              h="52px"
              icon={
                isOpenMessage ? <CrossIcon data-id="000232" h="21px" ml="5px" stroke="white" w="22px" /> : <MessageIcon data-id="000233" h="21px" stroke="white" w="22px" />
              }
              mr="2px"
              onClick={() => (isOpenMessage ? handleCloseMessage() : handleOpenMessage())}
              position="fixed"
              right="16px"
              rounded="20px"
              w="52px"
              zIndex={5} />
          )}
          <Flex data-id="000234" flexGrow={1} px={[2, 6]} w="full">
            <Flex
              data-id="000235"
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 210px)']}
              pb={[20, 4]}
              w={['full', 'full', 'calc(100% - 320px)']}>
              <Component data-id="000236" />
            </Flex>
            {device === 'desktop' && <Chat data-id="000237" component="response" />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && <ChatMobileAndTablet data-id="000238" component="response" />}
        </Flex>
        <ResponseLeftNavigationMobile data-id="000239" />
      </Flex>
    </Flex>
  );
}

export const responseLayoutStyles = {
  responseLayout: {
    iconBg: '#1E1E38',
  },
};

function ResponseLayoutWithContext(props) {
  return (
    <ResponseProvider data-id="000240" {...props}>
      <ShareProvider data-id="000241">
        <ChatProvider data-id="000242" component="response">
          <ResponseLayout data-id="000243" {...props} />
        </ChatProvider>
      </ShareProvider>
    </ResponseProvider>
  );
}

export default ResponseLayoutWithContext;
