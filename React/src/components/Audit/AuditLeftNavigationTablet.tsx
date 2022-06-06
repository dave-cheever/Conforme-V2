import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, ConformeSmall } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

const AuditLeftNavigationTablet = () => {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  const { organizationConfig } = useAppContext();

  return (
    <Flex
      bg="auditLeftNavigation.bg"
      color="auditLeftNavigation.color"
      direction="column"
      display={['none', 'flex', 'none']}
      flexShrink={0}
      fontWeight="400"
      h="100vh"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="80px"
    >
      <Flex flexDirection="column">
        <Box alignItems="center" cursor="pointer" display="flex" h="80px" justifyContent="center" onClick={() => navigateTo('/')}>
          <Text color="auditLeftNavigation.organizationNameFontColor" fontSize="16px" fontWeight="bold">
            {organizationConfig?.name.charAt(0)}
          </Text>
        </Box>
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/audits')}
          w="full"
        >
          <ChevronRight ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem icon={icon} isDesktop={false} key={url} label={label} url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex display={['none', 'flex']}>
        <Icon as={ConformeSmall} h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>
  );
};

export default AuditLeftNavigationTablet;
