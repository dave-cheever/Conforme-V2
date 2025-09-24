import { useMemo } from "react";

import { HStack, Switch, Text } from "@chakra-ui/react"

import { useFiltersContext } from "../../contexts/FiltersProvider";

function ShowArchivedFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => (filtersValues.showArchived?.value), [filtersValues])

  return (
    <HStack data-id="000152" ml='2px' mt={2} spacing={2}>
      <Text
        data-id="000153"
        color="archivedFilterStyles.checkboxLabelColor"
        fontSize="14px">Show archived</Text>
      <Switch
        data-id="000154"
        id='archived-item'
        isChecked={value}
        onChange={(e) => setFilters({ showArchived: e.target.checked })} />
    </HStack>
  );
}

export default ShowArchivedFilter;

export const showArchivedFilterStyles = {
  archivedFilterStyles: {
    checkboxLabelColor: '#818197',
  },
}
