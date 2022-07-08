import { useEffect } from 'react';

import { Box, Button, Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import FiltersPanelItem from './FiltersPanelItem';

const FiltersPanel = () => {
  const device = useDevice();
  const { filtersValues, usedFilters, showFiltersPanel, setShowFiltersPanel, cleanFilters } = useFiltersContext();

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
      flexDir="column"
      flexShrink={0}
      h="100vh"
      position={['relative', 'absolute']}
      right="0"
      w={['full', '320px']}
      zIndex="10"
    >
      <Flex align="center" h="65px" justify="space-between" px="4">
        <Box color="brand.darkGrey" fontSize="16px" fontWeight="700">
          Filter items by
        </Box>
      </Flex>
      <Flex flexDir="column" minH="calc(100vh - 180px)" overflowY="auto" px="4">
        {Object.entries(filtersValues).map(([name, value]) => {
          if (usedFilters.includes(name) && !value?.hideFromPanel) return <FiltersPanelItem filter={value} key={name} name={name} />;

          return null;
        })}
      </Flex>
      <Flex
        align="center"
        bg="transparent"
        bottom="0px"
        boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.15)', 'none']}
        h="70px"
        justify="center"
        position={['sticky', 'relative']}
        py={2}
        w="full"
        mt="auto"
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
    doneButtonBg: "#462AC4",
    doneButtonColor: "#ffffff",
    resetButtonBg: '#F0F2F5',
    resetButtonColor: '#818197',
    checkboxLabelColor: '#818197',
    searchBoxBordercolor: '#81819750',
  },
};
