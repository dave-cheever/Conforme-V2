import { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import updateLocalStorageFilter from '../../utils/filterStorage';
import FilterCheckBox from './FilterCheckBox';

function CategoryFilter() {
  const { user, module } = useAppContext();
  const { filtersValues, setFilters, categories } = useFiltersContext();
  const value = useMemo(() => filtersValues.categoriesIds?.value, [filtersValues]) as string[];

  const handleChange = (newValue: string[]) => {
    if(user && module)
      {updateLocalStorageFilter(
      module._id,
      'categoriesIds',
      'Category',
      newValue,
      user?._id,
      setFilters,
    );}
  };

  return (
    <CheckboxGroup data-id="030925-9ebdb8" onChange={handleChange} value={value}>
      <Stack data-id="030925-c36d9e" direction="column" overflow="auto">
        {categories?.map(({ name, _id }) => (
          <FilterCheckBox data-id="030925-7d43a7" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default CategoryFilter;
