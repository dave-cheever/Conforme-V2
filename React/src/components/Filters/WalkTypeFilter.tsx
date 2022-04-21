import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import StatusSelector from '../StatusSelector';

const WalkTypeFilter = () => {
  const { filtersValues, setFilters, auditStatuses } = useFiltersContext();
  const value = useMemo(
    () => filtersValues.status?.value,
    [filtersValues],
  ) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ status: value });
  };

  return (
    <Box w="full">
      <StatusSelector
        handleChange={handleChange}
        selected={value}
        status={auditStatuses}
      />
    </Box>
  );
};

export default WalkTypeFilter;
