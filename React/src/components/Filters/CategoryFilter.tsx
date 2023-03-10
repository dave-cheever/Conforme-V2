import { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import FilterCheckBox from './FilterCheckBox';

const CategoryFilter = () => {
  const { filtersValues, setFilters, categories } = useFiltersContext();
  const value = useMemo(() => filtersValues.categoriesIds?.value, [filtersValues]) as string[];

  return (
    (<CheckboxGroup
      data-id="545882419ed3"
      onChange={(newValue) => setFilters({ categoriesIds: newValue })}
      value={value}>
      <Stack data-id="848fdcadf2af" direction="column" overflow="auto">
        {categories?.map(({ name, _id }) => (
          <FilterCheckBox data-id="cf6609d88b47" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>)
  );
};

export default CategoryFilter;
