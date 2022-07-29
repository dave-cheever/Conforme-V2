import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ILocation } from '../../interfaces/ILocation';
import LocationsSelector from '../LocationsSelector';

const LocationFilter = () => {
  const { module } = useAppContext();
  const { filtersValues, setFilters, locations, sites } = useFiltersContext();
  const value = useMemo(
    () => (module?.type === 'tracker' ? filtersValues.locationsIds?.value : filtersValues.sitesIds?.value),
    [filtersValues, module],
  ) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters(module?.type === 'tracker' ? { locationsIds: value } : { sitesIds: value });
  };

  return (
    <Box w="full">
      <LocationsSelector
        handleChange={handleChange}
        locations={module?.type === 'tracker' ? (locations as ILocation[]) : (sites as ILocation[])}
        selected={value}
      />
    </Box>
  );
};

export default LocationFilter;
