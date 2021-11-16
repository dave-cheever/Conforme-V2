import React, { useMemo } from "react"
import { Stack, RadioGroup, Radio } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";

const IsVerifiedFilter = () => {
  const {
    filtersValues,
    setFilters,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.isVerified?.value, [filtersValues]) as string;

  return (
    <RadioGroup ml='4' onChange={newValue => setFilters({ isVerified: newValue })} value={value}>
      <Stack direction="column" overflow='auto' h='calc(100vh - 230px)'>
        <Radio value='1'>Yes</Radio>
        <Radio value='0'>No</Radio>
      </Stack>
    </RadioGroup>
  );
};

export default IsVerifiedFilter;