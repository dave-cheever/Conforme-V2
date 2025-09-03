import { Divider, Flex } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { Home } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

function AuditLeftNavigationMobile() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();

  return (
    <Flex
        data-id="030925-082604"
        align="center"
        bg="#110b30"
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
        zIndex={12}>
      <Flex data-id="030925-83b248" align="center" flexDirection="row" h="full">
        <Flex
          data-id="030925-94244d"
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/audits')}>
          <Flex
            data-id="030925-7b2feb"
            align="center"
            borderRadius="8px"
            h="30px"
            justify="center"
            w="30px">
            <Home data-id="030925-de05b6" stroke="#ffffff" />
          </Flex>
          <Divider data-id="030925-0f7341" ml={3} orientation="vertical" />
        </Flex>
        <Flex data-id="030925-5ceec9" w="full">
          <Flex data-id="030925-acff94" justify="space-between" w="full">
            {auditNavigationTabs.map(({ label, icon, url }) => (
              <AuditLeftTabItem
                data-id="030925-386c9c"
                icon={icon}
                isDesktop={false}
                isMobile
                key={url}
                label={label}
                url={url} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigationMobile;
