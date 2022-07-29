import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import BusinessUnitsSelector from '../BusinessUnitsSelector';

const BusinessUnitFilter = () => {
  const { module } = useAppContext();
  const { filtersValues, setFilters, businessUnits, areas } = useFiltersContext();
  const value = useMemo(
    () => (module?.type === 'tracker' ? filtersValues.businessUnitsIds?.value : filtersValues.areasIds?.value),
    [filtersValues, module],
  ) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters(module?.type === 'tracker' ? { businessUnitsIds: value } : { areasIds: value });
  };

  return (
    <Box w="full">
      <BusinessUnitsSelector
        businessUnits={module?.type === 'tracker' ? (businessUnits as IBusinessUnit[]) : (areas as IBusinessUnit[])}
        handleChange={handleChange}
        selected={value}
      />
    </Box>
  );
};

export default BusinessUnitFilter;
