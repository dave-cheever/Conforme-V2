import { useMemo } from 'react';

import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';

const IsVerifiedFilter = () => {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.isVerified?.value, [filtersValues]) as string;

  return (
    (<RadioGroup
      data-id="e058d418b9f6"
      ml="4"
      onChange={(newValue) => setFilters({ isVerified: newValue })}
      value={value}>
      <Stack
        data-id="acfa5cc1089c"
        direction="column"
        h="calc(100vh - 230px)"
        overflow="auto">
        <Radio data-id="9ffc8228fd99" value="1">Yes</Radio>
        <Radio data-id="9d7cf3ae2d6a" value="0">No</Radio>
      </Stack>
    </RadioGroup>)
  );
};

export default IsVerifiedFilter;
