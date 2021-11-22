import React, { useMemo } from "react"
import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";

const RegulatoryBodyFilter = () => {
  const {
    filtersValues,
    setFilters,
    regulatoryBodies,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.regulatoryBodiesIds?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup onChange={newValue => setFilters({ regulatoryBodiesIds: newValue })} value={value}>
      <Stack ml='4' direction="column" overflow='auto' h='calc(100vh - 230px)'>
        {regulatoryBodies.map(({ name, _id }) =>
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

export default RegulatoryBodyFilter;