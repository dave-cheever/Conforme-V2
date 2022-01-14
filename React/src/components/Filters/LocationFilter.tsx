import React, { useMemo } from "react";
import { Box } from "@chakra-ui/react";

import LocationsSelector from "../LocationsSelector";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import { ILocation } from "../../interfaces/ILocation";

const LocationFilter = () => {
  const {
    filtersValues,
    setFilters,
    locations,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.locationsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters({ locationsIds: value });
  };

  return (
    <Box w='full'>
      <LocationsSelector
        locations={locations as ILocation[]}
        selected={value}
        handleChange={handleChange}
      />
    </Box>
  )
};

export default LocationFilter;