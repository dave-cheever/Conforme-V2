import { Flex, IconButton } from '@chakra-ui/react';

import AuditHeader from '../components/Audit/AuditHeader';
import AuditLeftNavigation from '../components/Audit/AuditLeftNavigation';
import AuditLeftNavigationMobile from '../components/Audit/AuditLeftNavigationMobile';
import AuditLeftNavigationTablet from '../components/Audit/AuditLeftNavigationTablet';
import Chat from '../components/Chat';
import ChatMobileAndTablet from '../components/ChatMobileAndTablet';
import Loader from '../components/Loader';
import NavigationTop from '../components/NavigationTop';
import ShareModal from '../components/ShareModal';
import AuditProvider, { useAuditContext } from '../contexts/AuditProvider';
import ChatProvider, { useChatContext } from '../contexts/ChatProvider';
import ShareProvider from '../contexts/ShareProvider';
import useDevice from '../hooks/useDevice';
import { CrossIcon, MessageIcon } from '../icons';

function AuditLayout({ component: Component }: { component: any }) {
  const { loading, audit } = useAuditContext();
  const { isOpenMessage, handleCloseMessage, handleOpenMessage } = useChatContext();
  const device = useDevice();
  const isTabletAndMobile = device === 'tablet' || device === 'mobile' ;

  if (loading && !audit) {
    return (
      <Flex data-id="000188" h="100vh">
        <Loader center data-id="000189" />
      </Flex>
    );
  }

  return (
    <Flex data-id="000190" h="full" minH="100vh" maxH="100vh" w="full">
      <AuditLeftNavigation data-id="000191" />
      <AuditLeftNavigationTablet data-id="000192" />
      <Flex
        data-id="000193"
        direction="column"
        grow={1}
        w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}
        overflow="hidden"
        h="100vh"
      >
        <NavigationTop data-id="000194" />
        <Flex
          data-id="000195"
          flexDirection="column"
          h="full"
          overflow="auto"
          pb={3}
          pt={['25px', 0]}
          w="full"
        >
          <ShareModal data-id="000196" />
          <AuditHeader data-id="000197" />
          {isTabletAndMobile && (
            <IconButton
              _hover={{ opacity: 0.7 }}
              alignItems="center"
              aria-label="Message"
              bg="responseLayout.iconBg"
              bottom={['108px', '22px']}
              color="white"
              data-id="000198"
              flexShrink={0}
              h="52px"
              icon={
                isOpenMessage ? <CrossIcon data-id="000199" h="21px" ml="5px" stroke="white" w="22px" /> : <MessageIcon data-id="000200" h="21px" stroke="white" w="22px" />
              }
              mr="2px"
              onClick={() => (isOpenMessage ? handleCloseMessage() : handleOpenMessage())}
              position="fixed"
              right="16px"
              rounded="20px"
              w="52px"
              zIndex={5} />
          )}
          <Flex data-id="000201" flexGrow={1}  px={[2, 6]} w="full">
            <Flex
              data-id="000202"
              flexDirection="column"
              h="full"
              rounded="10px"
              w={['full', 'full', 'calc(100% - 320px)']}>
              <Component data-id="000203" />
            </Flex>
            {device === 'desktop' && <Chat component="audit" data-id="000204" />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && <ChatMobileAndTablet component="audit" data-id="000205" />}
        </Flex>
        <AuditLeftNavigationMobile data-id="000206" />
      </Flex>
    </Flex>
  );
}

function AuditWithContext(props) {
  return (
    <AuditProvider data-id="000207" {...props}>
      <ShareProvider data-id="000208">
        <ChatProvider component="audit" data-id="000209">
          <AuditLayout data-id="000210" {...props} />
        </ChatProvider>
      </ShareProvider>
    </AuditProvider>
  );
}

export default AuditWithContext;
