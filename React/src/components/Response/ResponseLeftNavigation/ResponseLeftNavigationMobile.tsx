import React from 'react';

import { Divider, Flex } from '@chakra-ui/react';

import { navigationTabs } from '../../../bootstrap/config';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import useNavigate from '../../../hooks/useNavigate';
import { Home } from '../../../icons';
import ResponseLeftTabItem from '../ResponseLeftTabItem';
import ResponseDetail from './ResponseDetail';

function ResponseLeftNavigationMobile() {
  const { navigateTo } = useNavigate();

  const { response } = useResponseContext();

  return (
    <Flex
        align="center"
        bg="#110b30"
        bottom="0px"
        boxShadow="0px 0px 80px rgba(49, 50, 51, 0.15)"
        color="responseLeftNavigation.color"
        data-id="030925-f5564f"
        direction="column"
        display={['block', 'none', 'none']}
        fontWeight="400"
        h="60px"
        justifyContent="space-between"
        p="10px"
        position="fixed"
        w="full"
        zIndex={12}>
      <Flex align="center" data-id="030925-cbc57a" flexDirection="row" h="full">
        <Flex
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="030925-007b49"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/tracker-items')}>
          <Home data-id="030925-7c3e9a" ml={2} stroke="#ffffff" />
          <Divider data-id="030925-84b11d" ml={3} orientation="vertical" />
        </Flex>
        <Flex data-id="030925-923c75" justify="space-between" w="full">
          <Flex data-id="030925-1a3238" w="full">
            {navigationTabs.map(({ label, icon, url }) => (
              <ResponseLeftTabItem
                data-id="030925-004d1c"
                icon={icon}
                isDesktop={false}
                isMobile
                key={url}
                label={label}
                url={url} />
            ))}
          </Flex>
          <ResponseDetail data-id="030925-973587" response={response} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ResponseLeftNavigationMobile;
