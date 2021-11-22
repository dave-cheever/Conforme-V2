import React, { useMemo } from "react"
import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";

const CategoryFilter = () => {
  const {
    filtersValues,
    setFilters,
    categories,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.categoriesIds?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup onChange={newValue => setFilters({ categoriesIds: newValue })} value={value}>
      <Stack ml='4' direction="column" overflow='auto' h='calc(100vh - 230px)' >
        {categories.map(({ name, _id }) =>
          <Checkbox
            css={{
              ".chakra-checkbox__control": {
                borderRadius: "50%",
                width: "21px",
                height: "21px",
                "&[data-checked]": {
                  background: "#1C8586",
                  borderColor: "#1C8586",
                  "&[data-hover]": {
                    background: "#1C8586",
                    borderColor: "#1C8586"
                  }
                }
              }
            }}
            key={_id}
            value={_id}
          >
            {name}
          </Checkbox>)}
      </Stack>
    </CheckboxGroup>
  );
};

export default CategoryFilter;