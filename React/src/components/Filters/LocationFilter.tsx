import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ILocation } from '../../interfaces/ILocation';
import LocationsSelector from '../LocationsSelector';

const LocationFilter = () => {
  const { filtersValues, setFilters, locations } = useFiltersContext();
  const value = useMemo(() => filtersValues.locationsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ locationsIds: value });
  };

  return (
    <Box w="full">
      <LocationsSelector handleChange={handleChange} locations={locations as ILocation[]} selected={value} />
    </Box>
  );
};

export default LocationFilter;
