import { Box, Flex, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { ChevronRight } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

function AuditLeftNavigation() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  const { organizationConfig } = useAppContext();

  return (
    <Flex
        data-id="000172"
        bg="auditLeftNavigation.bg"
        color="auditLeftNavigation.color"
        direction="column"
        display={['none', 'none', 'flex']}
        fontWeight="400"
        justifyContent="space-between"
        overflow="auto"
        px={6}
        w="280px">
      <Flex data-id="000173" flexDirection="column">
        <Box
          data-id="000174"
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          onClick={() => navigateTo('/')}>
          <Text
            data-id="000175"
            color="navigationLeft.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold"
            w="full">
            {organizationConfig?.name}
          </Text>
        </Box>
        <Flex
          data-id="000176"
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/')}>
          <ChevronRight data-id="000177" mr={2} transform="Rotate(180deg)" />
          Back
        </Flex>
        <Flex data-id="000178" flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem data-id="000179" icon={icon} key={url} label={label} url={url} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigation;

export const auditLeftNavigationStyles = {
  auditLeftNavigation: {
  bg: '#110B30',
    goBackColor: '#fff',
    color: '#ffffff',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    auditDetailActiveColor: '#F0F0F0',
    organizationNameFontColor: '#282F36',
  },
};
