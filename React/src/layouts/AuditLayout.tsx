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
      <Flex direction="column" flexGrow={1}>
        <NavigationTop />
        <Flex
          bg="layout.bg"
          direction="column"
          mt={['65px', 0]}
          overflow="auto"
          w="full"
        >
          <AuditHeader />
          <Flex
            h={['calc(100vh - 140px)', 'calc(100vh - 195px)']}
            pb="25px"
            px={6}
          >
            <Component />
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
