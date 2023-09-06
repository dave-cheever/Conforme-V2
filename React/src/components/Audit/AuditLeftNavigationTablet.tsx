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
    (<Flex
      bg="auditLeftNavigation.bg"
      color="auditLeftNavigation.color"
      data-id="33f490301d15"
      direction="column"
      display={['none', 'flex', 'none']}
      flexShrink={0}
      fontWeight="400"
      h="100vh"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="80px">
      <Flex data-id="b86166dbdaeb" flexDirection="column">
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="0340e3feaf5e"
          display="flex"
          h="80px"
          justifyContent="center"
          onClick={() => navigateTo('/')}>
          <Text
            color="auditLeftNavigation.organizationNameFontColor"
            data-id="04d94596cb0d"
            fontSize="16px"
            fontWeight="bold">
            {organizationConfig?.name.charAt(0)}
          </Text>
        </Box>
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="fda1a84462e4"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/audits')}
          w="full">
          <ChevronRight data-id="0e9f54b27d0a" ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex data-id="c59903fbc731" flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem
              data-id="e5155854b3dd"
              icon={icon}
              isDesktop={false}
              key={url}
              label={label}
              url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex data-id="2250a5eaa6ef" display={['none', 'flex']}>
        <Icon as={ConformeSmall} data-id="a768d173a420" h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>)
  );
}

export default AuditLeftNavigationTablet;
