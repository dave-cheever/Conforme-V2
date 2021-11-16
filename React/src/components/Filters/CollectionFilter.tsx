import React, { useMemo } from "react"
import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";
import { collections } from "../../hooks/useFiltersUtils";

const CollectionFilter = () => {
  const {
    filtersValues,
    setFilters,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.category?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup onChange={newValue => setFilters({ collection: newValue })} value={value}>
      <Stack ml='4' direction="column">
        {Object.entries(collections).map(([key, label]) =>
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
            key={key}
            value={key}
          >
            <Text>{label as string}</Text>
          </Checkbox>)}
      </Stack>
    </CheckboxGroup>
  );
};

export default CollectionFilter;