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
        bg="auditLeftNavigation.bg"
        color="auditLeftNavigation.color"
        data-id="000193"
        direction="column"
        display={['none', 'flex', 'none']}
        flexShrink={0}
        fontWeight="400"
        h="100vh"
        justifyContent="space-between"
        overflow="auto"
        px={6}
        w="80px">
      <Flex data-id="000194" flexDirection="column">
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="000195"
          display="flex"
          h="80px"
          justifyContent="center"
          onClick={() => navigateTo('/')}>
          <Text
            color="auditLeftNavigation.organizationNameFontColor"
            data-id="000196"
            fontSize="16px"
            fontWeight="bold">
            {organizationConfig?.name.charAt(0)}
          </Text>
        </Box>
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="000197"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/audits')}
          w="full">
          <ChevronRight data-id="000198" ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex data-id="000199" flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem
              data-id="000200"
              icon={icon}
              key={url}
              label={label}
              url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex data-id="000201" display={['none', 'flex']}>
        <Icon as={ConformeSmall} data-id="000202" h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigationTablet;
