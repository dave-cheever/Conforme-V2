import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import updateLocalStorageFilter from '../../utils/filterStorage';
import BusinessUnitsSelector from '../BusinessUnitsSelector';

function BusinessUnitFilter() {
  const { user, module } = useAppContext();
  const { filtersValues, setFilters, businessUnits } = useFiltersContext();
  const value = useMemo(() => filtersValues.businessUnitsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    const newValues = Array.isArray(value) ? value : [value];
    if(user && module)
    updateLocalStorageFilter(module._id, 'businessUnitsIds', 'Business unit', newValues, user?._id, setFilters);
  };

  return (
    <Box data-id="000661" w="full">
      <BusinessUnitsSelector
        data-id="000662"
        businessUnits={businessUnits as IBusinessUnit[]}
        handleChange={handleChange}
        selected={value}
      />
    </Box>
  );
}

export default BusinessUnitFilter;
