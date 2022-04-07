import { Flex } from '@chakra-ui/react';

import AuditHeader from '../components/Audit/AuditHeader';
import AuditLeftNavigation from '../components/Audit/AuditLeftNavigation';
import AuditLeftNavigationMobile from '../components/Audit/AuditLeftNavigationMobile';
import AuditLeftNavigationTablet from '../components/Audit/AuditLeftNavigationTablet';
import Loader from '../components/Loader';
import NavigationTop from '../components/NavigationTop';
import AuditProvider, { useAuditContext } from '../contexts/AuditProvider';
import useDevice from '../hooks/useDevice';

const AuditLayout = ({ component: Component }: { component: any }) => {
  const device = useDevice();
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
      <AuditLeftNavigation />
      <AuditLeftNavigationTablet />
      <Flex
        direction="column"
        w={['100%', 'calc(100% - 80px)', 'calc(100% - 240px)']}
      >
        <NavigationTop />
        <Flex
          bg="layout.bg"
          flexDirection="column"
          mt={['65px', 0]}
          overflow="auto"
          position="absolute"
          pt={['25px', 0]}
          top={[0, '80px']}
          w={['full', 'calc(100% - 80px)', 'calc(100% - 240px)']}
          zIndex={4}
        >
          <AuditHeader />
          <Flex h="full" px="25px" w="full">
            <Flex
              flexDirection="column"
              h="full"
              maxH={['none', 'calc(100vh - 200px)']}
              minH={['calc(100vh - 200px)', 'calc(100vh - 200px)']}
              pb="25px"
              w="full"
            >
              <Component />
            </Flex>
            {device === 'desktop' && <></>}
          </Flex>
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
