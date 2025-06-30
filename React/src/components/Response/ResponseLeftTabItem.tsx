import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Flex, Icon } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';

function ResponseLeftTabItem({ label, icon, url, isDesktop = true, isMobile = false }) {
  const location = useLocation();
  const { navigateTo, isPathActive } = useNavigate();
  const { id } = useParams();

  const active = isPathActive(`/tracker-item/${id}${url}`, { exact: true });

  const redirectPage = () => {
    navigateTo(`/tracker-item/${id}${url}${location.search}`);
  };

  return (
    (<Flex
      align="center"
      bg={isDesktop && active ? 'responseLeftTabItem.activeIconBg' : ""}
      borderRadius={'4px'}
      cursor="pointer"
      data-id="6fdf85811bfa"
      mb={[0, 3]}
      mx={[3, 0]}
      onClick={redirectPage}
      padding={isDesktop ? '3px' : '2px 0'}
      w={active ? 'full' : 'fit-content'}>
      <Flex
        align="center"
        bg={active ? 'responseLeftTabItem.activeIconBg' : ''}
        borderRadius="8px"
        data-id="c9c5d1603db9"
        h="30px"
        justify="center"
        w="30px">
        <Icon
          as={icon}
          color="#ffffff"
          data-id="ddadd3902183" />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          color={'responseLeftTabItem.activeTextColor'}
          data-id="27ac7e816e47"
          flexGrow={1}
          fontSize={['11px', '14px']}
          ml={3}>
          {label}
        </Flex>
      )}
    </Flex>)
  );
}

export default ResponseLeftTabItem;

export const responseLeftTabItemStyles = {
  responseLeftTabItem: {
    activeIconBg: '#462AC4',
    activeTextColor: '#ffffff',
    textColor: '#818197',
    activeIconColor: 'white',
    iconColor: '#818197',
  },
};
