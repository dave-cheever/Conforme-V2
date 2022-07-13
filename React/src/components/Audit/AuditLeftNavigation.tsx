import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { ChevronRight, Conforme } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

const AuditLeftNavigation = () => {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  const { organizationConfig } = useAppContext();

  return (
    <Flex
      bg="auditLeftNavigation.bg"
      color="auditLeftNavigation.color"
      direction="column"
      display={['none', 'none', 'flex']}
      fontWeight="400"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="240px"
    >
      <Flex flexDirection="column">
        <Box alignItems="center" cursor="pointer" display="flex" h="80px" onClick={() => navigateTo('/')}>
          <Text color="navigationLeft.organizationNameFontColor" fontSize="16px" fontWeight="bold" w="80px">
            {organizationConfig?.name}
          </Text>
        </Box>
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="30px"
          onClick={() => navigateTo('/')}
        >
          <ChevronRight mr={2} transform="Rotate(180deg)" />
          Back
        </Flex>
        <Flex flexDirection="column" mb={2}>
          {auditNavigationTabs.map(({ label, icon, url }) => (
            <AuditLeftTabItem icon={icon} key={url} label={label} url={url} />
          ))}
        </Flex>
      </Flex>
      <Flex>
        <Icon as={Conforme} h="35px" mb="20px" w="103px" />
      </Flex>
    </Flex>
  );
};

export default AuditLeftNavigation;

export const auditLeftNavigationStyles = {
  auditLeftNavigation: {
    bg: '#E5E5E5',
    goBackColor: '#818197',
    color: '#282F36',
    building: '#2B3236',
    copy: '#FF9A00',
    avatar: '#462AC4',
    auditDetailActiveColor: '#F0F0F0',
    organizationNameFontColor: '#282F36',
  },
};
