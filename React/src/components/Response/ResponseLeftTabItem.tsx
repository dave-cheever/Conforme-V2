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
    <Flex
        align="center"
        bg={isDesktop && active ? 'responseLeftTabItem.activeIconBg' : ""}
        borderRadius={'4px'}
        cursor="pointer"
        data-id="030925-bf5e87"
        mb={[0, 3]}
        mx={[3, 0]}
        onClick={redirectPage}
        padding={isDesktop ? '3px' : '2px 0'}
        w={active ? 'full' : 'fit-content'}>
      <Flex
        align="center"
        bg={active ? 'responseLeftTabItem.activeIconBg' : ''}
        borderRadius="8px"
        data-id="030925-485ccc"
        h="30px"
        justify="center"
        pl={1}
        w="30px"
      >
        <Icon
          as={icon}
          color="#ffffff"
          data-id="030925-574d18"
          h="21px"
          w="21px" />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          color={'responseLeftTabItem.activeTextColor'}
          data-id="030925-9c1177"
          flexGrow={1}
          fontSize={['11px', '14px']}
          ml={3}>
          {label}
        </Flex>
      )}
    </Flex>
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
