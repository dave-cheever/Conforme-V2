import React, { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { complianceItemStatuses } from '../../hooks/useFiltersUtils';
import FilterCheckBox from './FilterCheckBox';

const ItemStatusFilter = () => {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(
    () => filtersValues.itemStatus?.value,
    [filtersValues],
  ) as string[];

  return (
    <CheckboxGroup
      onChange={(newValue) => setFilters({ itemStatus: newValue })}
      value={value}
    >
      <Stack direction="column" overflow="auto">
        {Object.entries(complianceItemStatuses).map(([key, label]) => (
          <FilterCheckBox key={key} label={label} value={key} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
};

export default ItemStatusFilter;
