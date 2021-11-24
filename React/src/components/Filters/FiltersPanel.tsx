import React from 'react';
import { Box, Flex, Button} from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import FiltersPanelItem from './FiltersPanelItem';

const FiltersPanel = () => {
  const {
    filtersValues,
    usedFilters,
    showFiltersPanel, setShowFiltersPanel,
    cleanFilters,
  } = useFiltersContext();

  if (!showFiltersPanel) {
    return null;
  }

  return (
    <Box overflow='auto' zIndex='10' h="100vh" w="290px" right="0" top="0" borderBottomStartRadius="20px" boxShadow="md" flexShrink={0} bg='filterPanel.bg'>
        <Flex justify='space-between' align='center' h='65px' px='4'>
          <Box color='brand.darkGrey' fontSize='16px' fontWeight='700'>Filters items</Box>
        </Flex>
        <Flex px="4" flexDir="column" h="calc(100vh - 115px)" overflow="auto">
          {Object.entries(filtersValues).map(([name, value]) => {
            if (usedFilters.includes(name)) {
              return (<FiltersPanelItem key={name} name={name} filter={value}/>)
            }
            return null
          })}
        </Flex>
      <Flex w="290px" align="center" h="50px" justify="center" position="absolute" bottom="0px" py={2}>
        <Button _hover={{ opacity: 0.9 }} color="filterPanel.resetButtonColor" fontSize="14px" h='35px' w='115px' onClick={cleanFilters}>Reset all</Button>
        <Button _hover={{ opacity: 0.9 }} colorScheme="purpleHeart" ml='10px' fontSize="14px" h='35px' w='115px' onClick={() => setShowFiltersPanel(false)}>Done</Button>
      </Flex>
    </Box>
  );
};

export default FiltersPanel;

export const filtersPanelStyles = {
  filterPanel:{
    bg: "#FFFFFF",
    resetButtonBg: "#F0F2F5",
    resetButtonColor: "#818197",
    checkboxLabelColor: "#818197",
    searchBoxBordercolor: "#81819750"
  },
}