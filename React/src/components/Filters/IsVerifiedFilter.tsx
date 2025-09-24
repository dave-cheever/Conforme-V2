import { useMemo } from 'react';

import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';

function IsVerifiedFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.isVerified?.value, [filtersValues]) as string;

  return (
    <RadioGroup
        data-id="000117"
        ml="4"
        onChange={(newValue) => setFilters({ isVerified: newValue })}
        value={value}>
      <Stack
        data-id="000118"
        direction="column"
        h="calc(100vh - 230px)"
        overflow="auto">
        <Radio data-id="000119" value="1">Yes</Radio>
        <Radio data-id="000120" value="0">No</Radio>
      </Stack>
    </RadioGroup>
  );
}

export default IsVerifiedFilter;
