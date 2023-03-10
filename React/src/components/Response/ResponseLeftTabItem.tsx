import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Flex, Icon } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

const ResponseLeftTabItem = ({ label, icon, url, isDesktop = true, isMobile = false }) => {
  const history = useHistory();
  const { navigateTo, isPathActive } = useNavigate();
  const { id }: { id: string } = useParams();

  const active = isPathActive(`/tracker-item/${id}${url}`, { exact: true });

  const redirectPage = () => {
    navigateTo(`/tracker-item/${id}${url}${history.location.search}`);
  };

  return (
    (<Flex
      align="center"
      cursor="pointer"
      data-id="6fdf85811bfa"
      mb={[0, 3]}
      mx={[3, 0]}
      onClick={redirectPage}
      w={active ? 'full' : 'fit-content'}>
      <Flex
        align="center"
        bg={active ? 'responseLeftTabItem.activeIconBg' : 'responseLeftTabItem.iconBg'}
        borderRadius="8px"
        data-id="c9c5d1603db9"
        h="30px"
        justify="center"
        w="30px">
        <Icon
          as={icon}
          color={active ? 'responseLeftTabItem.activeIconColor' : 'responseLeftTabItem.iconColor'}
          data-id="ddadd3902183" />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          color={active ? ['responseLeftTabItem.textColor', 'responseLeftTabItem.activeTextColor'] : 'responseLeftTabItem.textColor'}
          data-id="27ac7e816e47"
          flexGrow={1}
          fontSize={['11px', '14px']}
          ml={3}>
          {label}
        </Flex>
      )}
    </Flex>)
  );
};

export default ResponseLeftTabItem;

export const responseLeftTabItemStyles = {
  responseLeftTabItem: {
    iconBg: '#FFFFFF',
    activeIconBg: '#462AC4',
    activeTextColor: '#1F1F1F',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
  },
};
