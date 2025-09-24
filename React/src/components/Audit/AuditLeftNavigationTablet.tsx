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
        data-id="000193"
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
      <Flex data-id="000194" flexDirection="column">
        <Box
          data-id="000195"
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          justifyContent="center"
          onClick={() => navigateTo('/')}>
          <Text
            data-id="000196"
            color="auditLeftNavigation.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold">
            {organizationConfig?.name.charAt(0)}
          </Text>
        </Box>
        <Flex
          data-id="000197"
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
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
              isDesktop={false}
              key={url}
              label={label}
              url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex data-id="000201" display={['none', 'flex']}>
        <Icon data-id="000202" as={ConformeSmall} h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigationTablet;
