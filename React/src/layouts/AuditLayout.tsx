import { Flex, IconButton } from '@chakra-ui/react';

import AuditHeader from '../components/Audit/AuditHeader';
import AuditLeftNavigation from '../components/Audit/AuditLeftNavigation';
import AuditLeftNavigationMobile from '../components/Audit/AuditLeftNavigationMobile';
import AuditLeftNavigationTablet from '../components/Audit/AuditLeftNavigationTablet';
import Chat from '../components/Chat';
import ChatMobileAndTablet from '../components/ChatMobileAndTablet';
import Loader from '../components/Loader';
import ModuleSwitcher from '../components/ModuleSwitcher';
import NavigationTop from '../components/NavigationTop';
import ShareModal from '../components/ShareModal';
import AuditProvider, { useAuditContext } from '../contexts/AuditProvider';
import ChatProvider, { useChatContext } from '../contexts/ChatProvider';
import ShareProvider from '../contexts/ShareProvider';
import useDevice from '../hooks/useDevice';
import { CrossIcon, MessageIcon } from '../icons';

const AuditLayout = ({ component: Component }: { component: any }) => {
  const { loading, audit } = useAuditContext();
  const { isOpenMessage, handleCloseMessage, handleOpenMessage } = useChatContext();
  const device = useDevice();
  const isTabletAndMobile = device === 'tablet' || device === 'mobile';

  if (loading && !audit) {
    return (
      <Flex h="100vh">
        <Loader center />
      </Flex>
    );
  }

  return (
    <Flex h="full" minH="100vh" w="full">
      <ModuleSwitcher />
      <AuditLeftNavigation />
      <AuditLeftNavigationTablet />
      <Flex direction="column" grow={1} w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}>
        <NavigationTop />
        <Flex
          bg="layout.bg"
          flexDirection="column"
          h={['calc(100vh - 126px)', 'calc(100vh - 80px)']}
          mt={['65px', 0]}
          overflow="auto"
          pt={['25px', 0]}
          top={[0, '80px']}
          w="full"
        >
          <ShareModal />
          <AuditHeader />
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
          <Flex flexGrow={1} px="25px" w="full">
            <Flex
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 190px)']}
              pb="25px"
              w={['full', 'full', 'calc(100% - 300px)']}
            >
              <Component />
            </Flex>
            {device === 'desktop' && <Chat component="audit" />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && <ChatMobileAndTablet component="audit" />}
        </Flex>
        <AuditLeftNavigationMobile />
      </Flex>
    </Flex>
  );
};

const AuditWithContext = (props) => (
  <AuditProvider {...props}>
    <ShareProvider>
      <ChatProvider component="audit">
        <AuditLayout {...props} />
      </ChatProvider>
    </ShareProvider>
  </AuditProvider>
);

export default AuditWithContext;
