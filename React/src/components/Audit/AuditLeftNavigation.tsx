import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, Conforme } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

function AuditLeftNavigation() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  const { organizationConfig } = useAppContext();

  return (
    (<Flex
      bg="auditLeftNavigation.bg"
      color="auditLeftNavigation.color"
      data-id="90a85cc26cc5"
      direction="column"
      display={['none', 'none', 'flex']}
      fontWeight="400"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="240px">
      <Flex data-id="a51f6f137003" flexDirection="column">
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="eee215561ed3"
          display="flex"
          h="80px"
          onClick={() => navigateTo('/')}>
          <Text
            color="navigationLeft.organizationNameFontColor"
            data-id="9356c63f39ea"
            fontSize="16px"
            fontWeight="bold"
            w="80px">
            {organizationConfig?.name}
          </Text>
        </Box>
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="f20c66d1b11a"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/')}>
          <ChevronRight data-id="5bb4cae944a1" mr={2} transform="Rotate(180deg)" />
          Back
        </Flex>
        <Flex data-id="125a197fae5c" flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem data-id="bd3dba38cd8e" icon={icon} key={url} label={label} url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex data-id="8a82975c2ffb">
        <Icon as={Conforme} data-id="a77cf243d2f3" h="35px" mb="20px" w="103px" />
      </Flex>
    </Flex>)
  );
}

export default AuditLeftNavigation;

export const auditLeftNavigationStyles = {
  auditLeftNavigation: {
    bg: '#f5f5f5',
    goBackColor: '#818197',
    color: '#282F36',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    auditDetailActiveColor: '#F0F0F0',
    organizationNameFontColor: '#282F36',
  },
};
