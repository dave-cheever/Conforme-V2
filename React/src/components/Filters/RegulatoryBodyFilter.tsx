import { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import updateLocalStorageFilter from '../../utils/filterStorage';
import FilterCheckBox from './FilterCheckBox';

function RegulatoryBodyFilter() {
  const { user, module } = useAppContext();
  const { filtersValues, setFilters, regulatoryBodies } = useFiltersContext();
  const value = useMemo(() => filtersValues.regulatoryBodiesIds?.value, [filtersValues]) as string[];

  const handleChange = (newValue: string[]) => {
    if(user && module)
      {updateLocalStorageFilter(
       module._id,
      'regulatoryBodiesIds',
      'Regulatory body',
      newValue,
      user?._id,
      setFilters,
    );}
  };

  return (
    <CheckboxGroup
      data-id="030925-20f10b"
      onChange={handleChange}
      value={value}
    >
      <Stack data-id="030925-008679" direction="column">
        {regulatoryBodies?.map(({ name, _id }) => (
          <FilterCheckBox data-id="030925-b28eba" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default RegulatoryBodyFilter;
