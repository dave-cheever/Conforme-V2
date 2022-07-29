import { Flex } from '@chakra-ui/react';

import AuditHeader from '../components/Audit/AuditHeader';
import AuditLeftNavigation from '../components/Audit/AuditLeftNavigation';
import AuditLeftNavigationMobile from '../components/Audit/AuditLeftNavigationMobile';
import AuditLeftNavigationTablet from '../components/Audit/AuditLeftNavigationTablet';
import Loader from '../components/Loader';
import ModuleSwitcher from '../components/ModuleSwitcher';
import NavigationTop from '../components/NavigationTop';
import AuditProvider, { useAuditContext } from '../contexts/AuditProvider';

const AuditLayout = ({ component: Component }: { component: any }) => {
  const { loading, audit } = useAuditContext();

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
          {/* <ShareModal /> */}
          <AuditHeader />
          <Flex h="full" px="25px" w="full">
            <Flex
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 210px)']}
              minH={['none', 'calc(100vh - 210px)']}
              pb="25px"
              w="full"
            >
              <Component />
            </Flex>
            {/* {device === 'desktop' && <ResponseChat />} */}
          </Flex>
          {/* {isTabletAndMobile && <ResponseChatMobileAndTablet />} */}
        </Flex>
        <AuditLeftNavigationMobile />
      </Flex>
    </Flex>
  );
};

const AuditWithContext = (props) => (
  <AuditProvider {...props}>
    <AuditLayout {...props} />
  </AuditProvider>
);

export default AuditWithContext;
