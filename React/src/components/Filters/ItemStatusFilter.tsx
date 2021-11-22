import React, { useMemo } from "react"
import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";
import { complianceItemStatuses } from "../../hooks/useFiltersUtils";

const ItemStatusFilter = () => {
  const {
    filtersValues,
    setFilters,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.itemStatus?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup onChange={newValue => setFilters({ itemStatus: newValue })} value={value}>
      <Stack ml='4' direction="column" overflow='auto' h='calc(100vh - 230px)'>
        {Object.entries(complianceItemStatuses).map(([key, label]) =>
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

export default ItemStatusFilter;