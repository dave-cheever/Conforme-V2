import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import BusinessUnitsSelector from '../BusinessUnitsSelector';

const BusinessUnitFilter = () => {
  const { filtersValues, setFilters, businessUnits } = useFiltersContext();
  const value = useMemo(() => filtersValues.businessUnitsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ businessUnitsIds: value });
  };

  return (
    <Box w="full">
      <BusinessUnitsSelector businessUnits={businessUnits as IBusinessUnit[]} handleChange={handleChange} selected={value} />
    </Box>
  );
};

export default BusinessUnitFilter;
