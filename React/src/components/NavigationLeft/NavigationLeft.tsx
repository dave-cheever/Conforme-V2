import { useState } from 'react';

import { Box, Flex, useMediaQuery } from '@chakra-ui/react';

import { useConfigContext } from '../../contexts/ConfigProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import Can from '../can';
import ModuleSwitcher from '../ModuleSwitcher';
import NavigationLeftItem from './NavigationLeftItem';
import NavigationLeftItemTablet from './NavigationLeftItemTablet';

function NavigationLeft() {
  const [isTabletWidth] = useMediaQuery('(min-width: 748px) and (max-width: 1279px)');
  const {showFiltersPanel } = useFiltersContext();
  const { menuItems } = useConfigContext();
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const device = useDevice();

  return (
    <Box
        bg="navigationLeft.bg"
        data-id="030925-19e809"
        display={['none', 'block', 'block']}
        fontWeight="semibold"
        h="100vh"
        w={(showFiltersPanel || isTabletWidth) ? ['0px', '80px', '80px'] : ['0px', '80px', '280px']}>
      <Box
        alignItems="center"
        cursor="pointer"
        data-id="030925-b7dff8"
        display="flex"
        h="80px"
        justifyContent="center"
      >
        <ModuleSwitcher data-id="030925-f38047" />
      </Box>
      <Flex
        data-id="030925-163a4e"
        direction="column"
        gap={"25px"}
        h="calc(100% - 80px)"
        justify="space-between"
        overflowX={device === 'desktop' ? 'hidden' : 'unset'}
        overflowY={device === 'desktop' ? 'auto' : 'unset'}
        pb={"18px"}
        pl={"14px"}
        pr={"14px"}
        pt={"18px"}
      >
        <Box data-id="030925-938875">
          {menuItems.map((menuItem: any, i) => (
            <Can
              action={menuItem.permission}
              data-id="030925-e975ad"
              key={`menu${i}`}
              // eslint-disable-next-line react/no-unstable-nested-components
              yes={() => {
                if (device === 'desktop') return <NavigationLeftItem data-id="030925-f70cb6" menuItem={menuItem} />;

                if (device === 'tablet') {
                  return (
                    <NavigationLeftItemTablet
                        data-id="030925-f697d3"
                        filtersOpen={filtersOpen}
                        menuItem={menuItem}
                        setFiltersOpen={setFiltersOpen}
                        setSubsectionOpen={setSubsectionOpen}
                        subsectionOpen={subsectionOpen} />
                  );
                }
                return <Box data-id="030925-68cf6a" />;
              }} />
          ))}
        </Box>

      </Flex>
    </Box>
  );
}

export default NavigationLeft;

export const navigationLeftStyles = {
  navigationLeft: {
    bg: '#110B30',
    vigationLeft: {
      bg: '#f5f5f5',
    },
  },
}
