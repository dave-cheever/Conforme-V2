import React from 'react';

import { Divider, Flex } from '@chakra-ui/react';

import { navigationTabs } from '../../../bootstrap/config';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import useNavigate from '../../../hooks/useNavigate';
import { Home } from '../../../icons';
import ResponseLeftTabItem from '../ResponseLeftTabItem';
import ResponseDetail from './ResponseDetail';

const ResponseLeftNavigationMobile = () => {
  const { navigateTo } = useNavigate();

  const { response } = useResponseContext();

  return (
    <Flex
      align="center"
      bg="white"
      bottom="0px"
      boxShadow="0px 0px 80px rgba(49, 50, 51, 0.15)"
      color="responseLeftNavigation.color"
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
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/compliance-items')}
        >
          <Home ml={2} stroke="responseLeftNavigation.goBackColor" />
          <Divider ml={3} orientation="vertical" />
        </Flex>
        <Flex justify="space-between" w="full">
          <Flex w="full">
            {navigationTabs.map(({ label, icon, url }) => (
              <ResponseLeftTabItem
                icon={icon}
                isDesktop={false}
                isMobile
                key={url}
                label={label}
                url={url}
              />
            ))}
          </Flex>
          <ResponseDetail response={response} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ResponseLeftNavigationMobile;
