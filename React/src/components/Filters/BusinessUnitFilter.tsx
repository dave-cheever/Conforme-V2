import React, { useMemo } from "react";
import { Box } from "@chakra-ui/react";

import BusinessUnitsSelector from "../BusinessUnitsSelector";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import { IBusinessUnit } from "../../interfaces/IBusinessUnit";

const BusinessUnitFilter = () => {
  const {
    filtersValues,
    setFilters,
    businessUnits,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.businessUnitsIds?.value, [filtersValues]) as string[];

  const handleChange = ({ target: { value } }) => {
    setFilters( {businessUnitsIds: value });
  };

  return (
    <Box w='270px'>
      <BusinessUnitsSelector
        businessUnits={businessUnits as IBusinessUnit[]}
        selected={value}
        handleChange={handleChange}
      />
    </Box>
  )
}

export default BusinessUnitFilter;