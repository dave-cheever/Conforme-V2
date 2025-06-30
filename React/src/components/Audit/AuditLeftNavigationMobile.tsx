import { Divider, Flex } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { Home } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

function AuditLeftNavigationMobile() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();

  return (
    (<Flex
      align="center"
      bg="#110b30"
      bottom="0px"
      boxShadow="0px 0px 80px rgba(49, 50, 51, 0.15)"
      color="auditLeftNavigation.color"
      data-id="305560fa5087"
      direction="column"
      display={['block', 'none', 'none']}
      fontWeight="400"
      h="60px"
      justifyContent="space-between"
      p="10px"
      position="fixed"
      w="full"
      zIndex={12}>
      <Flex align="center" data-id="0db0481f2be2" flexDirection="row" h="full">
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="a49182a9c460"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/audits')}>
          <Flex
            align="center"
            borderRadius="8px"
            data-id="515b2057aece"
            h="30px"
            justify="center"
            w="30px">
            <Home data-id="c14888d69334" stroke="#ffffff" />
          </Flex>
          <Divider data-id="cf550ea43ce3" ml={3} orientation="vertical" />
        </Flex>
        <Flex data-id="d89b64a620f2" w="full">
          <Flex data-id="5ea608f3e8bd" justify="space-between" w="full">
            {auditNavigationTabs.map(({ label, icon, url }) => (
              <AuditLeftTabItem
                data-id="bec1862365fa"
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
    </Flex>)
  );
}

export default AuditLeftNavigationMobile;
