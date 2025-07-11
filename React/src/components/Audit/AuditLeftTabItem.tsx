import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Flex, Icon } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

function AuditLeftTabItem({ label, icon, url, isDesktop = true, isMobile = false }) {
  const location = useLocation();
  const { isPathActive, navigateTo } = useNavigate();
  const { id } = useParams();
  const active = useMemo(() => isPathActive(`/audits/${id}${url}`, { exact: true }), [id, url]);

  const redirectPage = () => {
    navigateTo(`/audits/${id}${url}${location.search}`);
  };

  return (
    <Flex
      align="center"
      bg={isDesktop && active ? 'auditLeftTabItem.activeIconBg' : ""}
      borderRadius={'4px'}
      cursor="pointer"
      data-id="62cbbf86e136"
      mb={[0, 3]}
      mx={[3, 0]}
      onClick={redirectPage}
      padding={isDesktop ? '3px' : '2px 0'}>
      <Flex
        align="center"
        bg={active ? 'auditLeftTabItem.activeIconBg' : ''}
        borderRadius="8px"
        data-id="ab6cc2193dd7"
        h="30px"
        justify="center"
        pl={2}
        w="30px">
        <Icon
          as={icon}
          h="19px"
          w="19px"
          data-id="467136ae8a4c"
          stroke="#ffffff" />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          color="#ffffff"
          data-id="fb182e49b7c3"
          flexGrow={1}
          fontSize={['11px', '14px']}
          ml={3}>
          {label}
        </Flex>
      )}
    </Flex>
  );
}

export default AuditLeftTabItem;

export const auditLeftTabItemStyles = {
  auditLeftTabItem: {
    iconBg: '#DDDDDD',
    activeIconBg: '#462AC4',
    activeTextColor: '#ffffff',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
    selectedLabelBg: '#1e1836',
  },
};
