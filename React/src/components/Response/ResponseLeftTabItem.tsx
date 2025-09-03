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
        data-id="030925-bf5e87"
        align="center"
        bg={isDesktop && active ? 'responseLeftTabItem.activeIconBg' : ""}
        borderRadius={'4px'}
        cursor="pointer"
        mb={[0, 3]}
        mx={[3, 0]}
        onClick={redirectPage}
        padding={isDesktop ? '3px' : '2px 0'}
        w={active ? 'full' : 'fit-content'}>
      <Flex
        data-id="030925-485ccc"
        align="center"
        bg={active ? 'responseLeftTabItem.activeIconBg' : ''}
        borderRadius="8px"
        h="30px"
        justify="center"
        pl={1}
        w="30px"
      >
        <Icon
          data-id="030925-574d18"
          as={icon}
          color="#ffffff"
          h="21px"
          w="21px" />
      </Flex>
      {(isDesktop || (isMobile && active)) && (
        <Flex
          data-id="030925-9c1177"
          color={'responseLeftTabItem.activeTextColor'}
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
