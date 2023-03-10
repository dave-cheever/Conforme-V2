import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import StatusSelector from '../StatusSelector';

const WalkTypeFilter = () => {
  const { filtersValues, setFilters, auditStatuses } = useFiltersContext();
  const value = useMemo(() => filtersValues.status?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ status: value });
  };

  return (
    (<Box data-id="51f8a7566b07" w="full">
      <StatusSelector
        data-id="44ff26542869"
        handleChange={handleChange}
        selected={value}
        status={auditStatuses} />
    </Box>)
  );
};

export default WalkTypeFilter;
