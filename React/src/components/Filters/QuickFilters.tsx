import { useState } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import QuickFiltersItem from './QuickFiltersItem';

function QuickFilters({ w }: { w: string | number | {} }) {
  const { filtersValues, usedFilters } = useFiltersContext();

  const [activeFilters, setActiveFilters] = useState<boolean[]>(Object.entries(filtersValues).map(() => false) || []);

  const toggleActiveFilters = (index) => {
    setActiveFilters((prv) => prv.map((activeFilter, i) => (index === i ? !activeFilter : activeFilter)));
  };

  return (
    <Stack data-id="030925-71ae8a" w={w}>
      <Flex
        data-id="030925-ddd72f"
        align="baseline"
        direction="row"
        overflowX={activeFilters.includes(true) ? 'hidden' : 'auto'}
        overflowY="clip"
        wrap={['nowrap', 'wrap', 'wrap']}>
        {Object.entries(filtersValues).map(([name, value], index) => {
          if (usedFilters.includes(name) && !value?.hideFromPanel) {
            return (
              <QuickFiltersItem
                  data-id="030925-a79e74"
                  filter={value}
                  key={`quick-filter-${name}`}
                  name={name}
                  toggleActiveFilters={() => toggleActiveFilters(index - 1)} />
            );
          }
          return null;
        })}
      </Flex>
    </Stack>
  );
}

export default QuickFilters;
