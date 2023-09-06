import { useMemo } from "react";

import { HStack, Switch, Text } from "@chakra-ui/react"

import { useFiltersContext } from "../../contexts/FiltersProvider";

function ShowArchivedFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => (filtersValues.showArchived?.value), [filtersValues])

  return (
    (<HStack data-id="36fe848e1ca5" ml='2px' mt={2} spacing={2}>
      <Text
        color="archivedFilterStyles.checkboxLabelColor"
        data-id="0d34eaa2ad84"
        fontSize="14px">Show archived</Text>
      <Switch
        data-id="15985f98672e"
        id='archived-item'
        isChecked={value}
        onChange={(e) => setFilters({ showArchived: e.target.checked })} />
    </HStack>)
  );
}

export default ShowArchivedFilter;

export const showArchivedFilterStyles = {
  archivedFilterStyles: {
    checkboxLabelColor: '#818197',
  },
}
