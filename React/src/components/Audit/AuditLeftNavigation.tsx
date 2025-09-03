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
        data-id="030925-614e29"
        bg="auditLeftNavigation.bg"
        color="auditLeftNavigation.color"
        direction="column"
        display={['none', 'none', 'flex']}
        fontWeight="400"
        justifyContent="space-between"
        overflow="auto"
        px={6}
        w="280px">
      <Flex data-id="030925-8564f8" flexDirection="column">
        <Box
          data-id="030925-4eaaef"
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          onClick={() => navigateTo('/')}>
          <Text
            data-id="030925-c3f6ec"
            color="navigationLeft.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold"
            w="full">
            {organizationConfig?.name}
          </Text>
        </Box>
        <Flex
          data-id="030925-64bc33"
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/')}>
          <ChevronRight data-id="030925-b6d456" mr={2} transform="Rotate(180deg)" />
          Back
        </Flex>
        <Flex data-id="030925-09a543" flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem data-id="030925-ecdcc2" icon={icon} key={url} label={label} url={url} />
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
