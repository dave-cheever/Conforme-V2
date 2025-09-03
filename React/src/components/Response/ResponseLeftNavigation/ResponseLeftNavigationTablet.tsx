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
    <Flex
        data-id="030925-fe18a0"
        bg="responseLeftNavigation.bg"
        color="responseLeftNavigation.color"
        direction="column"
        display={['none', 'flex', 'none']}
        flexShrink={0}
        fontWeight="400"
        h="100vh"
        justifyContent="space-between"
        overflow="auto"
        px={6}
        w="80px">
      <Flex data-id="030925-d389f7" flexDirection="column">
        <Box
          data-id="030925-2a1f39"
          alignItems="center"
          cursor="pointer"
          display="flex"
          h="80px"
          justifyContent="center"
          onClick={() => navigateTo('/')}>
          <Text
            data-id="030925-605a83"
            color="navigationLeft.organizationNameFontColor"
            fontSize="16px"
            fontWeight="bold">
            {getInitials(module?.name)}
          </Text>
        </Box>
        <Flex
          data-id="030925-7c20ce"
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/tracker-items')}
          w="full">
          <ChevronRight data-id="030925-58b3ce" ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex data-id="030925-1bcd52" flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem
              data-id="030925-06a4ce"
              icon={icon}
              isDesktop={false}
              key={url}
              label={label}
              url={url} />
          ))}
        </Flex>
        <ResponseDetail data-id="030925-0dd9d6" response={response} />
      </Flex>
      <Flex data-id="030925-bc2f00" display={['none', 'flex']}>
        <Icon data-id="030925-61b20b" as={ConformeSmall} h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>
  );
}

export default ResponseLeftNavigationTablet;
