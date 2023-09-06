import React, { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import FilterCheckBox from './FilterCheckBox';

function RegulatoryBodyFilter() {
  const { filtersValues, setFilters, regulatoryBodies } = useFiltersContext();
  const value = useMemo(() => filtersValues.regulatoryBodiesIds?.value, [filtersValues]) as string[];

  return (
    (<CheckboxGroup
      data-id="eb075257aa01"
      onChange={(newValue) => setFilters({ regulatoryBodiesIds: newValue })}
      value={value}>
      <Stack data-id="708446ae9485" direction="column">
        {regulatoryBodies?.map(({ name, _id }) => (
          <FilterCheckBox data-id="a1ba55eceb97" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>)
  );
}

export default RegulatoryBodyFilter;
