import { Divider, Flex } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { ChevronRight } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

const AuditLeftNavigationMobile = () => {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();

  return (
    <Flex
      align="center"
      bg="white"
      bottom="0px"
      boxShadow="0px 0px 80px rgba(49, 50, 51, 0.15)"
      color="auditLeftNavigation.color"
      direction="column"
      display={['block', 'none', 'none']}
      fontWeight="400"
      h="60px"
      justifyContent="space-between"
      p="10px"
      position="fixed"
      w="full"
      zIndex={12}
    >
      <Flex align="center" flexDirection="row" h="full">
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/audits')}
        >
          <ChevronRight ml={2} transform="Rotate(180deg)" />
          <Divider ml={3} orientation="vertical" />
        </Flex>
        <Flex justify="space-between" w="full">
          <Flex w="full">
            {auditNavigationTabs.map(({ label, icon, url }) => (
              <AuditLeftTabItem icon={icon} isDesktop={false} isMobile key={url} label={label} url={url} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AuditLeftNavigationMobile;
