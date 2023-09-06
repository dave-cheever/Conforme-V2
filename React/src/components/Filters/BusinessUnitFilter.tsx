import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import BusinessUnitsSelector from '../BusinessUnitsSelector';

function BusinessUnitFilter() {
  const { filtersValues, setFilters, businessUnits } = useFiltersContext();
  const value = useMemo(() => filtersValues.businessUnitsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ businessUnitsIds: value });
  };

  return (
    (<Box data-id="43d1b58a06d7" w="full">
      <BusinessUnitsSelector
        businessUnits={businessUnits as IBusinessUnit[]}
        data-id="2f97a01dbbc9"
        handleChange={handleChange}
        selected={value} />
    </Box>)
  );
}

export default BusinessUnitFilter;
