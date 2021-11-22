import React, { useCallback, useMemo, useState } from "react"
import { Checkbox, CheckboxGroup, Input, InputGroup, Stack } from '@chakra-ui/react';

import { Magnifier } from "../../icons";
import { useFiltersContext } from "../../contexts/FiltersProvider";

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
    return complianceItems.filter(({ _id }) => _id && isSelected(_id));
  }, [complianceItems, isSelected]);

  const filteredComplianceItems = useMemo(() => {
    const nameMatch = (name: string) => name.toLowerCase().includes(search.toLowerCase());
    return complianceItems.filter(({ name, _id }) => _id && name && nameMatch(name) && !isSelected(_id));
  }, [complianceItems, search, isSelected]);

  return (
    <CheckboxGroup onChange={newValue => setFilters({ complianceItemsIds: newValue })} value={value}>
      <Stack m='4' direction="column" overflow='auto' h='calc(100vh - 230px)'>
        <InputGroup>
          <Input
            borderWidth='2px'
            borderColor='#F2F2F2'
            h='45px'
            w='full'
            pr={10}
            color='brand.darkGrey'
            placeholder='Search compliance item'
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <Magnifier alt="Search" h="16px" w='16px' position="absolute" bottom="14px" right="14px" opacity={0.2} />
        </InputGroup>
        {selectedComplianceItems.map(({ name, _id }) =>
          <Checkbox
            css={{
              ".chakra-checkbox__control": {
                borderRadius: "50%",
                width: "21px",
                height: "21px",
                "&[data-checked]": {
                  background: "#1C8586",
                  borderColor: "#1C8586",
                  "&[data-hover]": {
                    background: "#1C8586",
                    borderColor: "#1C8586"
                  }
                }
              }
            }}
            key={_id}
            value={_id}
          >
            {name}
          </Checkbox>)}
        {filteredComplianceItems.map(({ name, _id }) =>
          <Checkbox
            css={{
              ".chakra-checkbox__control": {
                borderRadius: "50%",
                width: "21px",
                height: "21px",
                "&[data-checked]": {
                  background: "#1C8586",
                  borderColor: "#1C8586",
                  "&[data-hover]": {
                    background: "#1C8586",
                    borderColor: "#1C8586"
                  }
                }
              }
            }}
            key={_id}
            value={_id}
          >
            {name}
          </Checkbox>)}
      </Stack>
    </CheckboxGroup>
  );
};

export default ComplianceItemFilter;
