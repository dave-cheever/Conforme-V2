import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Flex, Icon } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

const AuditLeftTabItem = ({
  label,
  icon,
  url,
  isDesktop = true,
  isMobile = false,
}) => {
  const history = useHistory();
  const { navigateTo } = useNavigate();
  const { id }: { id: string } = useParams();

  const active = useMemo(
    () => history.location.pathname === `/audits/${id}${url}`,
    [id, url, history],
  );

  const redirectPage = () => {
    navigateTo(`/audits/${id}${url}${history.location.search}`);
  };

  return (
    <Flex
      align="center"
      cursor="pointer"
      mb={[0, 3]}
      mx={[3, 0]}
      onClick={redirectPage}
      w={active ? 'full' : 'fit-content'}
    >
      <Flex
        align="center"
        bg={
          active ? 'auditLeftTabItem.activeIconBg' : 'auditLeftTabItem.iconBg'
        }
        borderRadius="8px"
        h="30px"
        justify="center"
        w="30px"
      >
        <Icon
          as={icon}
          color={
            active
              ? 'auditLeftTabItem.activeIconColor'
              : 'auditLeftTabItem.iconColor'
          }
        />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          color={
            active
              ? [
                  'auditLeftTabItem.textColor',
                  'auditLeftTabItem.activeTextColor',
                ]
              : 'auditLeftTabItem.textColor'
          }
          flexGrow={1}
          fontSize={['11px', '14px']}
          ml={3}
        >
          {label}
        </Flex>
      )}
    </Flex>
  );
};

export default AuditLeftTabItem;

export const auditLeftTabItemStyles = {
  auditLeftTabItem: {
    iconBg: '#FFFFFF',
    activeIconBg: '#462AC4',
    activeTextColor: '#1F1F1F',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
  },
};
