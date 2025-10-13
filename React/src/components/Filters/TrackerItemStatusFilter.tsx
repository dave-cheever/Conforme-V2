import { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import updateLocalStorageFilter from '../../utils/filterStorage';
import FilterCheckBox from './FilterCheckBox';

const trackerItemStatusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
];

function TrackerItemStatusFilter({ name }: { name: string }) {
  const { filtersValues, setFilters } = useFiltersContext();
  const { user, module } = useAppContext();
  const value = useMemo(() => filtersValues[name]?.value, [filtersValues, name]) as string[];

  const handleChange = (newValue: string[]) => {
    if (user && module) updateLocalStorageFilter(module._id, name, 'Status', newValue, user.userId, setFilters);
    else setFilters({ [name]: newValue });
  };

  return (
    <CheckboxGroup data-id="000181" onChange={handleChange} value={value}>
      <Stack data-id="000182" direction="column">
        {trackerItemStatusOptions.map((option) => (
          <FilterCheckBox data-id="000183" key={option.value} label={option.label} value={option.value} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default TrackerItemStatusFilter;
