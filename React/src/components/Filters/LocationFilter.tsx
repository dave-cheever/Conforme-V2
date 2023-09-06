import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ILocation } from '../../interfaces/ILocation';
import LocationsSelector from '../LocationsSelector';

function LocationFilter() {
  const { filtersValues, setFilters, locations } = useFiltersContext();
  const value = useMemo(() => filtersValues.locationsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ locationsIds: value });
  };

  return (
    (<Box data-id="4afb6381cabe" w="full">
      <LocationsSelector
        data-id="97329fcbd40e"
        handleChange={handleChange}
        locations={locations as ILocation[]}
        selected={value} />
    </Box>)
  );
}

export default LocationFilter;
