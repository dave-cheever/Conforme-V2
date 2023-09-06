import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useConfigContext } from '../../contexts/ConfigProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import useNavigate from '../../hooks/useNavigate';
import { Conforme, ConformeSmall } from '../../icons';
import { getInitials } from '../../utils/helpers';
import Can from '../can';
import NavigationLeftItem from './NavigationLeftItem';
import NavigationLeftItemTablet from './NavigationLeftItemTablet';

function NavigationLeft() {
  const location = useLocation();
  const { navigateTo, isPathActive } = useNavigate();
  const { cleanFilters, showFiltersPanel } = useFiltersContext();
  const { module } = useAppContext();
  const { menuItems } = useConfigContext();
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const device = useDevice();

  useEffect(() => {
    if (!(isPathActive('/', { exact: true }) || isPathActive('/items'))) cleanFilters();
  }, [location.pathname]);

  return (
    (<Box
      bg="navigationLeft.bg"
      data-id="47c28dc91b51"
      display={['none', 'block', 'block']}
      fontWeight="semibold"
      h="100vh"
      w={showFiltersPanel ? ['0px', '80px', '80px'] : ['0px', '80px', '240px']}>
      <Box
        alignItems="center"
        cursor="pointer"
        data-id="d2ece50108d9"
        display="flex"
        h="80px"
        onClick={() => navigateTo('/')}>
        <Text
          color="navigationLeft.organizationNameFontColor"
          data-id="1517b24beb4a"
          fontSize="16px"
          fontWeight="bold"
          ml="24px"
          w="full">
          {showFiltersPanel || device === 'tablet' ? getInitials(module?.name) : module?.name}
        </Text>
      </Box>
      <Flex
        data-id="10cc9b2fcd5f"
        direction="column"
        h="calc(100% - 80px)"
        justify="space-between"
        overflowX={device === 'desktop' ? 'hidden' : 'unset'}
        overflowY={device === 'desktop' ? 'auto' : 'unset'}
        pt={['0px', '10px']}>
        <Box data-id="f2d5871013ad">
          {menuItems.map((menuItem: any, i) => (
            <Can
              action={menuItem.permission}
              data-id="29d2a3cc89b6"
              key={`menu${i}`}
              // eslint-disable-next-line react/no-unstable-nested-components
              yes={() => {
                if (device === 'desktop') return <NavigationLeftItem data-id="e93f85db199f" menuItem={menuItem} />;

                if (device === 'tablet') {
                  return (
                    (<NavigationLeftItemTablet
                      data-id="9199347cf0aa"
                      filtersOpen={filtersOpen}
                      menuItem={menuItem}
                      setFiltersOpen={setFiltersOpen}
                      setSubsectionOpen={setSubsectionOpen}
                      subsectionOpen={subsectionOpen} />)
                  );
                }
                return <Box data-id="6283424152e0" />;
              }} />
          ))}
        </Box>
        {device === 'desktop' && (
          <Icon
            as={showFiltersPanel ? ConformeSmall : Conforme}
            data-id="5eff0a6971bc"
            h="30px"
            mb="20px"
            ml="20px"
            mt={2}
            w={showFiltersPanel ? '27px' : '103px'} />
        )}
        {device === 'tablet' && <Icon
          as={ConformeSmall}
          data-id="0a66b63f6b9d"
          h="30px"
          mb="20px"
          ml="20px"
          w="27px" />}
      </Flex>
    </Box>)
  );
}

export default NavigationLeft;

export const navigationLeftStyles = {
  navigationLeft: {
    bg: '#E5E5E5',
    organizationNameFontColor: '#282F36',
  },
};
