import { useMemo } from 'react';

import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import IFilters from '../../interfaces/IFilters';

const IsVerifiedFilter = () => {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(
    () => filtersValues.isVerified?.value,
    [filtersValues],
  ) as string;

  return (
    <RadioGroup
      ml="4"
      onChange={(newValue) => setFilters({ isVerified: newValue })}
      value={value}
    >
      <Stack direction="column" h="calc(100vh - 230px)" overflow="auto">
        <Radio value="1">Yes</Radio>
        <Radio value="0">No</Radio>
      </Stack>
    </RadioGroup>
  );
};

export default IsVerifiedFilter;
