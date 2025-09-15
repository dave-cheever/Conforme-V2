import { Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';
import { Filter } from '../icons';

function FilterButton({ insightsFilter = false }: { insightsFilter?: boolean }) {
  const { showFiltersPanel, setShowFiltersPanel, numberOfSelectedFilters } = useFiltersContext();

  return (
    <Flex
      align="center"
      bg="white"
      border="1px solid #CBD5E0"
      borderRadius="10px"
      color="brand.primaryFont"
      cursor="pointer"
      data-id="030925-ad71d8"
      flexShrink={0}
      fontSize="sm"
      h="40px"
      justify="space-between"
      minW="120px"
      mr={!insightsFilter ? [6, 6, 4] : undefined}
      onClick={() => setShowFiltersPanel(!showFiltersPanel)}
      px={4}
    >
      <Flex align="center" data-id="030925-571424" gap="2">
        <Filter data-id="030925-0c0248" h="18px" mt={"7px"} />
        <Flex
          color="black"
          data-id="030925-c1ccf7"
          fontSize="14px"
          fontWeight="semi_medium"
        >
          Filters
        </Flex>
      </Flex>
      {numberOfSelectedFilters > 0 && (
        <Flex
          align="center"
          bg="header.selectedFilterColor"
          borderRadius="md"
          color="white"
          data-id="030925-4d5dd2"
          fontSize="12px"
          fontWeight="400"
          h="20px"
          justify="center"
          lineHeight="14px"
          ml="2"
          w="20px"
        >
          {numberOfSelectedFilters}
        </Flex>
      )}
    </Flex>
  );
}

export default FilterButton;
