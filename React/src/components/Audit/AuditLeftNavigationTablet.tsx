import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, ConformeSmall } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

function AuditLeftNavigationTablet() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  const { organizationConfig } = useAppContext();

  return (
    <Flex
        data-id="030925-5e20fb"
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
        w="80px">
      <Flex data-id="030925-94a27d" flexDirection="column">
        <Box
          data-id="030925-efd3d0"
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          justifyContent="center"
          onClick={() => navigateTo('/')}>
          <Text
            data-id="030925-6dbfe0"
            color="auditLeftNavigation.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold">
            {organizationConfig?.name.charAt(0)}
          </Text>
        </Box>
        <Flex
          data-id="030925-7195cf"
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/audits')}
          w="full">
          <ChevronRight data-id="030925-062f01" ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex data-id="030925-d0e825" flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem
              data-id="030925-397d05"
              icon={icon}
              isDesktop={false}
              key={url}
              label={label}
              url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex data-id="030925-89b19e" display={['none', 'flex']}>
        <Icon data-id="030925-ca7fc7" as={ConformeSmall} h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigationTablet;
