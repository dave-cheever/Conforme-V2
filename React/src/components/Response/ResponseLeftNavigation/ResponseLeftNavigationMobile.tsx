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
    (<Flex
      align="center"
      bg="white"
      bottom="0px"
      boxShadow="0px 0px 80px rgba(49, 50, 51, 0.15)"
      color="responseLeftNavigation.color"
      data-id="78551cd0fc71"
      direction="column"
      display={['block', 'none', 'none']}
      fontWeight="400"
      h="60px"
      justifyContent="space-between"
      p="10px"
      position="fixed"
      w="full"
      zIndex={12}>
      <Flex align="center" data-id="684034ef88fb" flexDirection="row" h="full">
        <Flex
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="440a2a2a1fb7"
          fontSize="14px"
          h="30px"
          mr={3}
          onClick={() => navigateTo('/tracker-items')}>
          <Home data-id="173f3b3a634a" ml={2} stroke="responseLeftNavigation.goBackColor" />
          <Divider data-id="a74a9309aec2" ml={3} orientation="vertical" />
        </Flex>
        <Flex data-id="a3f02aee8759" justify="space-between" w="full">
          <Flex data-id="a8af41a46d0c" w="full">
            {navigationTabs.map(({ label, icon, url }) => (
              <ResponseLeftTabItem
                data-id="b59969166992"
                icon={icon}
                isDesktop={false}
                isMobile
                key={url}
                label={label}
                url={url} />
            ))}
          </Flex>
          <ResponseDetail data-id="382c655c4b03" response={response} />
        </Flex>
      </Flex>
    </Flex>)
  );
};

export default ResponseLeftNavigationMobile;
