import { useMemo } from 'react';

import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';

function IsVerifiedFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.isVerified?.value, [filtersValues]) as string;

  return (
    <RadioGroup
        data-id="030925-76b0a9"
        ml="4"
        onChange={(newValue) => setFilters({ isVerified: newValue })}
        value={value}>
      <Stack
        data-id="030925-263c5e"
        direction="column"
        h="calc(100vh - 230px)"
        overflow="auto">
        <Radio data-id="030925-74b5e6" value="1">Yes</Radio>
        <Radio data-id="030925-84013c" value="0">No</Radio>
      </Stack>
    </RadioGroup>
  );
}

export default IsVerifiedFilter;
