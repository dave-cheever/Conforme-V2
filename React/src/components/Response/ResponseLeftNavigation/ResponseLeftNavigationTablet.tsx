import React from 'react';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { navigationTabs } from '../../../bootstrap/config';
import { useAppContext } from '../../../contexts/AppProvider';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import useNavigate from '../../../hooks/useNavigate';
import { ChevronRight, ConformeSmall } from '../../../icons';
import { getInitials } from '../../../utils/helpers';
import ResponseLeftTabItem from '../ResponseLeftTabItem';
import ResponseDetail from './ResponseDetail';

function ResponseLeftNavigationTablet() {
  const { navigateTo } = useNavigate();
  const { module } = useAppContext();

  const { response } = useResponseContext();

  return (
    (<Flex
      bg="responseLeftNavigation.bg"
      color="responseLeftNavigation.color"
      data-id="841e85744995"
      direction="column"
      display={['none', 'flex', 'none']}
      flexShrink={0}
      fontWeight="400"
      h="100vh"
      justifyContent="space-between"
      overflow="auto"
      px={6}
      w="80px">
      <Flex data-id="88302d6f08e0" flexDirection="column">
        <Box
          alignItems="center"
          cursor="pointer"
          data-id="a28089978662"
          display="flex"
          h="80px"
          justifyContent="center"
          onClick={() => navigateTo('/')}>
          <Text
            color="navigationLeft.organizationNameFontColor"
            data-id="a4ad19dce032"
            fontSize="16px"
            fontWeight="bold">
            {getInitials(module?.name)}
          </Text>
        </Box>
        <Flex
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="4b694932a864"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/tracker-items')}
          w="full">
          <ChevronRight data-id="27b926d03886" ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex data-id="bc759c69a4ae" flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem
              data-id="e954bed61f14"
              icon={icon}
              isDesktop={false}
              key={url}
              label={label}
              url={url} />
          ))}
        </Flex>
        <ResponseDetail data-id="39132f24248b" response={response} />
      </Flex>
      <Flex data-id="9783fe1ec9a0" display={['none', 'flex']}>
        <Icon as={ConformeSmall} data-id="f0ae53c1869b" h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>)
  );
}

export default ResponseLeftNavigationTablet;
