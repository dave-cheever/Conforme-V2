import React, { useMemo } from "react"
import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";
import FilterCheckBox from "./FilterCheckBox";

const RegulatoryBodyFilter = () => {
  const {
    filtersValues,
    setFilters,
    regulatoryBodies,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.regulatoryBodiesIds?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup onChange={newValue => setFilters({ regulatoryBodiesIds: newValue })} value={value}>
      <Stack direction="column">
        {regulatoryBodies?.map(({ name, _id }) => <FilterCheckBox label={name} key={_id} value={_id}/> )}

      </Stack>
    </CheckboxGroup>
  );
};

export default RegulatoryBodyFilter;