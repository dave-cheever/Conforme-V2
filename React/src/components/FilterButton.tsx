import { Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';
import { Filter } from '../icons';

function FilterButton({ insightsFilter = false }: { insightsFilter?: boolean }) {
  const { showFiltersPanel, setShowFiltersPanel, numberOfSelectedFilters } = useFiltersContext();

  return (
    (<Flex
      align="center"
      bg="header.filterBackgroundColor"
      borderRadius="10px"
      color="brand.primaryFont"
      cursor="pointer"
      data-id="2cfc5a698e6b"
      flexShrink={0}
      fontSize="sm"
      h="40px"
      justify="space-between"
      minW="120px"
      mr={!insightsFilter ? [6, 6, 4] : undefined}
      onClick={() => setShowFiltersPanel(!showFiltersPanel)}
      p={4}>
      <Flex
        color="white"
        data-id="bdbe7e115113"
        fontSize="smm"
        fontWeight="semi_medium">
        Filters
      </Flex>
      {numberOfSelectedFilters > 0 && (
        <Flex
          align="center"
          bg="header.selectedFilterColor"
          borderRadius="10px"
          color="white"
          data-id="351cbb907a96"
          fontSize="12px"
          fontWeight="400"
          h="20px"
          justify="center"
          lineHeight="14px"
          mx="2"
          w="27px">
          {numberOfSelectedFilters}
        </Flex>
      )}
      <Filter
        data-id="13a98323065c"
        h="18px"
        ml={3}
        transform={numberOfSelectedFilters > 0 ? 'rotate(180deg)' : ''} />
    </Flex>)
  );
}

export default FilterButton;
