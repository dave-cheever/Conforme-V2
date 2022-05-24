import { Box, Button, Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import FiltersPanelItem from './FiltersPanelItem';

const FiltersPanel = () => {
  const {
    filtersValues,
    usedFilters,
    showFiltersPanel,
    setShowFiltersPanel,
    cleanFilters,
  } = useFiltersContext();
  if (!showFiltersPanel) return null;

  return (
    <Box
      bg="filterPanel.bg"
      borderBottomStartRadius={['0px', '20px']}
      boxShadow="md"
      flexShrink={0}
      h="100vh"
      overflow="auto"
      position={['relative', 'absolute', 'relative']}
      right="0"
      w={['full', '320px']}
      zIndex="10"
    >
      <Flex align="center" h="65px" justify="space-between" px="4">
        <Box color="brand.darkGrey" fontSize="16px" fontWeight="700">
          Filter items by
        </Box>
      </Flex>
      <Flex flexDir="column" h="calc(100vh - 120px)" overflow="hidden" px="4">
        {Object.entries(filtersValues).map(([name, value]) => {
          if (usedFilters.includes(name) && !value?.hideFromPanel)
            return <FiltersPanelItem filter={value} key={name} name={name} />;

          return null;
        })}
      </Flex>
      <Flex
        align="center"
        bg="white"
        boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.15)', 'none']}
        h="55px"
        justify="center"
        py={2}
        w={['full', '290px']}
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
          colorScheme="purpleHeart"
          fontSize="14px"
          h="35px"
          ml="10px"
          onClick={() => setShowFiltersPanel(false)}
          w={['40%', '115px']}
        >
          Done
        </Button>
      </Flex>
    </Box>
  );
};

export default FiltersPanel;

export const filtersPanelStyles = {
  filterPanel: {
    bg: 'white',
    resetButtonBg: '#F0F2F5',
    resetButtonColor: '#818197',
    checkboxLabelColor: '#818197',
    searchBoxBordercolor: '#81819750',
  },
};
