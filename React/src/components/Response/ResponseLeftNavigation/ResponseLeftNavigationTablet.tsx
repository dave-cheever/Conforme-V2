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

const ResponseLeftNavigationTablet = () => {
  const { navigateTo } = useNavigate();
  const { module } = useAppContext();

  const { response } = useResponseContext();

  return (
    <Flex
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
      w="80px"
    >
      <Flex flexDirection="column">
        <Box alignItems="center" cursor="pointer" display="flex" h="80px" justifyContent="center" onClick={() => navigateTo('/')}>
          <Text color="navigationLeft.organizationNameFontColor" fontSize="16px" fontWeight="bold">
            {getInitials(module?.name)}
          </Text>
        </Box>
        <Flex
          align="center"
          color="responseLeftNavigation.goBackColor"
          cursor="pointer"
          fontSize="14px"
          h="30px"
          mb="20px"
          onClick={() => navigateTo('/compliance-items')}
          w="full"
        >
          <ChevronRight ml={2} transform="Rotate(180deg)" />
        </Flex>
        <Flex flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem icon={icon} isDesktop={false} key={url} label={label} url={url} />
          ))}
        </Flex>
        <ResponseDetail response={response} />
      </Flex>
      <Flex display={['none', 'flex']}>
        <Icon as={ConformeSmall} h="30px" mb="20px" w="27px" />
      </Flex>
    </Flex>
  );
};

export default ResponseLeftNavigationTablet;
