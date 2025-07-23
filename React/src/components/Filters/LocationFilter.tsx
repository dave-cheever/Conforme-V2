import { useMemo } from 'react';

import { Box } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ILocation } from '../../interfaces/ILocation';
import updateLocalStorageFilter from '../../utils/filterStorage';
import LocationsSelector from '../LocationsSelector';

function LocationFilter() {
  const { user, module } = useAppContext();
  const { filtersValues, setFilters, locations } = useFiltersContext();
  const value = useMemo(() => filtersValues.locationsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    const newValues = Array.isArray(value) ? value : [value];
    if(user && module)
      {updateLocalStorageFilter(
       module._id,
      'locationsIds',
      'Location',
      newValues,
      user?._id,
      setFilters,
    );}
  };

  return (
    <Box data-id="4afb6381cabe" w="full">
      <LocationsSelector
        data-id="97329fcbd40e"
        handleChange={handleChange}
        locations={locations as ILocation[]}
        selected={value}
      />
    </Box>
  );
}

export default LocationFilter;
