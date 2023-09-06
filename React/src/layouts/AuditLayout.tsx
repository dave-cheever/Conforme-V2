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

function AuditLayout({ component: Component }: { component: any }) {
  const { loading, audit } = useAuditContext();
  const { isOpenMessage, handleCloseMessage, handleOpenMessage } = useChatContext();
  const device = useDevice();
  const isTabletAndMobile = device === 'tablet' || device === 'mobile';

  if (loading && !audit) {
    return (
      (<Flex data-id="10b4fc5a3e3e" h="100vh">
        <Loader center data-id="3a7e314af686" />
      </Flex>)
    );
  }

  return (
    (<Flex data-id="df533dbbdad0" h="full" minH="100vh" w="full">
      <ModuleSwitcher data-id="bb13a4b4bd36" />
      <AuditLeftNavigation data-id="cc2799666d30" />
      <AuditLeftNavigationTablet data-id="4679ecdef9fa" />
      <Flex
        data-id="2fed43da2fd5"
        direction="column"
        grow={1}
        w={['100%', 'calc(100% - 80px)', 'calc(100% - 290px)']}>
        <NavigationTop data-id="f38dfa2c86d8" />
        <Flex
          bg="layout.bg"
          data-id="6c2b00e9a7d2"
          flexDirection="column"
          h={['calc(100vh - 126px)', 'calc(100vh - 80px)']}
          mt={['65px', 0]}
          overflow="auto"
          pt={['25px', 0]}
          top={[0, '80px']}
          w="full">
          <ShareModal data-id="04c4adf2d30a" />
          <AuditHeader data-id="bdae25a05441" />
          {isTabletAndMobile && (
            <IconButton
              _hover={{ opacity: 0.7 }}
              alignItems="center"
              aria-label="Message"
              bg="responseLayout.iconBg"
              bottom={['75px', '22px']}
              color="white"
              data-id="24a573e516c0"
              flexShrink={0}
              h="52px"
              icon={
                isOpenMessage ? <CrossIcon data-id="1509eb91498d" h="21px" ml="5px" stroke="white" w="22px" /> : <MessageIcon data-id="9612328441ca" h="21px" stroke="white" w="22px" />
              }
              mr="2px"
              onClick={() => (isOpenMessage ? handleCloseMessage() : handleOpenMessage())}
              position="fixed"
              right="16px"
              rounded="20px"
              w="52px"
              zIndex={5} />
          )}
          <Flex data-id="ec4e724490d8" flexGrow={1} px="25px" w="full">
            <Flex
              data-id="2be747ce7424"
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 190px)']}
              pb="25px"
              w={['full', 'full', 'calc(100% - 300px)']}>
              <Component data-id="162c0d00cd1f" />
            </Flex>
            {device === 'desktop' && <Chat component="audit" data-id="1cff7db127e9" />}
          </Flex>
          {isOpenMessage && isTabletAndMobile && <ChatMobileAndTablet component="audit" data-id="fe39658476bd" />}
        </Flex>
        <AuditLeftNavigationMobile data-id="f87067e48442" />
      </Flex>
    </Flex>)
  );
}

function AuditWithContext(props) {
  return <AuditProvider data-id="961e1e8853a6" {...props}>
    <ShareProvider data-id="8fa03651f49b">
      <ChatProvider component="audit" data-id="dc3f74a8e3a3">
        <AuditLayout data-id="8ac286791a03" {...props} />
      </ChatProvider>
    </ShareProvider>
  </AuditProvider>
}

export default AuditWithContext;
