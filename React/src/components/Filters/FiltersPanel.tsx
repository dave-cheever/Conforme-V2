import { useEffect, useRef } from 'react';

import { Box, Button, Flex, useOutsideClick } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import { CrossIcon } from '../../icons';
import { isPermitted } from '../can';
import FiltersPanelItem from './FiltersPanelItem';

const FiltersPanel = () => {
  const device = useDevice();
  const { user } = useAppContext();
  const { filtersValues, usedFilters, showFiltersPanel, setShowFiltersPanel, cleanFilters } = useFiltersContext();
  const panelRef = useRef(null);
  useOutsideClick({
    ref: panelRef,
    handler: () => setShowFiltersPanel(false),
  });
  useEffect(() => {
    if (showFiltersPanel && device === 'mobile') document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [device, showFiltersPanel]);

  if (!showFiltersPanel) return null;

  return (
    <Flex
      bg="filterPanel.bg"
      borderBottomStartRadius={['0px', '20px']}
      boxShadow="md"
      direction="column"
      h="100vh"
      position={['relative', 'absolute']}
      ref={panelRef}
      right="0"
      shrink={0}
      w={['full', '320px']}
      zIndex="10"
    >
      <Flex align="center" basis={['55px', '65px']} justify="space-between" px="4" shrink={0}>
        <Box color="brand.darkGrey" fontSize="16px" fontWeight="700">
          Filter items by
        </Box>
        <CrossIcon cursor="pointer" onClick={() => setShowFiltersPanel(false)} stroke="filterPanel.closeIconColor" />
      </Flex>
      <Flex direction="column" grow={1} overflowY="auto" px="4">
        {Object.entries(filtersValues).map(([name, value]) => {
          if (usedFilters.includes(name) && !value?.hideFromPanel && isPermitted({ user, action: value?.permission }))
            return <FiltersPanelItem filter={value} key={name} name={name} />;
          return null;
        })}
      </Flex>
      <Flex
        align="center"
        basis={['60px', '70px']}
        bg="filterPanel.bg"
        borderBottomStartRadius={['0px', '20px']}
        bottom={0}
        boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.15)', 'none']}
        justify="center"
        position={['sticky', 'relative']}
        shrink={0}
        w="full"
      >
        <Button
          _hover={{ opacity: 0.9 }}
          color="filterPanel.resetButtonColor"
          fontSize="14px"
          h="35px"
          onClick={cleanFilters}
          w={['40%', '115px']}
        >
          Reset all
        </Button>
        <Button
          _hover={{ opacity: 0.9 }}
          bg="filterPanel.doneButtonBg"
          color="filterPanel.doneButtonColor"
          fontSize="14px"
          h="35px"
          ml="10px"
          onClick={() => setShowFiltersPanel(false)}
          w={['40%', '115px']}
        >
          Done
        </Button>
      </Flex>
    </Flex>
  );
};

export default FiltersPanel;

export const filtersPanelStyles = {
  filterPanel: {
    bg: 'white',
    closeIconColor: '#000',
    doneButtonBg: '#462AC4',
    doneButtonColor: '#ffffff',
    resetButtonBg: '#F0F2F5',
    resetButtonColor: '#818197',
    searchBoxBordercolor: '#81819750',
  },
};
