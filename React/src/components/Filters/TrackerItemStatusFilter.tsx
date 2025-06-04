import { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import FilterCheckBox from './FilterCheckBox';

const trackerItemStatusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
];

function TrackerItemStatusFilter({ name }: { name: string }) {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues[name]?.value, [filtersValues, name]) as string[];

  return (
    <CheckboxGroup data-id="tracker-item-status-filter-group" onChange={(newValue) => setFilters({ [name]: newValue })} value={value}>
      <Stack direction="column">
        {trackerItemStatusOptions.map((option) => (
          <FilterCheckBox key={option.value} label={option.label} value={option.value} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default TrackerItemStatusFilter;
