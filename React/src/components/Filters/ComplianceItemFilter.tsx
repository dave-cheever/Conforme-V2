import React, { useCallback, useMemo, useState } from "react"
import { CheckboxGroup, Input, InputGroup, Stack } from '@chakra-ui/react';

import { Magnifier } from "../../icons";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import FilterCheckBox from "./FilterCheckBox";

const ComplianceItemFilter = () => {
  const {
    filtersValues,
    setFilters,
    complianceItems,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.complianceItemsIds?.value, [filtersValues]) as string[];
  const [search, setSearch] = useState<string>('');

  const isSelected = useCallback((_id: string) => value.includes(_id), [value]);

  const selectedComplianceItems = useMemo(() => {
    return complianceItems?.filter(({ _id }) => _id && isSelected(_id));
  }, [complianceItems, isSelected]);

  const filteredComplianceItems = useMemo(() => {
    const nameMatch = (name: string) => name.toLowerCase().includes(search.toLowerCase());
    return complianceItems?.filter(({ name, _id }) => _id && name && nameMatch(name) && !isSelected(_id));
  }, [complianceItems, search, isSelected]);

  return (
    
      <Stack direction="column" overflow='auto'>
        <InputGroup>
          <Input
            borderWidth='1px'
            borderColor='filterPanel.searchBoxBordercolor'
            h='40px'
            w='full'
            mb={3}
            pl={8}
            color='brand.darkGrey'
            placeholder='Search compliance item'
            value={search}
            fontSize="14px"
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <Magnifier alt="Search" h="12px" w='12x' position="absolute" bottom="25px" left="14px" />
        </InputGroup>
        <CheckboxGroup onChange={newValue => setFilters({ complianceItemsIds: newValue })} value={value}>
        {selectedComplianceItems?.map(({ name, _id }) => <FilterCheckBox label={name} key={_id} value={_id}/> )}
        {filteredComplianceItems?.map(({ name, _id }) => <FilterCheckBox label={name} key={_id} value={_id}/> )}
        </CheckboxGroup>
      </Stack>
  );
};

export default ComplianceItemFilter;
