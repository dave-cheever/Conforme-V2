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
      cursor="pointer"
      data-id="62cbbf86e136"
      mb={[0, 3]}
      mx={[3, 0]}
      onClick={redirectPage}>
      <Flex
        align="center"
        bg={active ? 'auditLeftTabItem.selectedLabelBg' : 'auditLeftTabItem.iconBg'}
        borderRadius="8px"
        data-id="ab6cc2193dd7"
        h="30px"
        justify="center"
        w="30px">
        <Icon
          as={icon}
          color={active ? 'auditLeftTabItem.activeIconColor' : 'auditLeftTabItem.iconColor'}
          data-id="467136ae8a4c" />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          color={active ? ['auditLeftTabItem.textColor', 'auditLeftTabItem.activeTextColor'] : 'auditLeftTabItem.textColor'}
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
    activeTextColor: '#1F1F1F',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
    selectedLabelBg: '#1e1836',
  },
};
