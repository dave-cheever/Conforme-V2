import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import StatusSelector from '../StatusSelector';

function StatusFilter() {
  const { filtersValues, setFilters, auditStatuses } = useFiltersContext();
  const value = useMemo(() => filtersValues.status?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ status: value });
  };

  return (
    <Box data-id="030925-22a600" w="full">
      <StatusSelector
        data-id="030925-c864dd"
        handleChange={handleChange}
        selected={value}
        status={auditStatuses} />
    </Box>
  );
}

export default StatusFilter;
