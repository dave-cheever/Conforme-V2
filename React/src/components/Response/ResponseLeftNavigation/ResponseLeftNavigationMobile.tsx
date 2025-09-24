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
        data-id="000863"
        align="center"
        bg="#110b30"
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
        zIndex={12}>
      <Flex data-id="000864" align="center" flexDirection="row" h="full">
        <Flex
          data-id="000865"
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/tracker-items')}>
          <Home data-id="000866" ml={2} stroke="#ffffff" />
          <Divider data-id="000867" ml={3} orientation="vertical" />
        </Flex>
        <Flex data-id="000868" justify="space-between" w="full">
          <Flex data-id="000869" w="full">
            {navigationTabs.map(({ label, icon, url }) => (
              <ResponseLeftTabItem
                data-id="000870"
                icon={icon}
                isDesktop={false}
                isMobile
                key={url}
                label={label}
                url={url} />
            ))}
          </Flex>
          <ResponseDetail data-id="000871" response={response} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ResponseLeftNavigationMobile;
