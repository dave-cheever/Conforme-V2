import React, { useCallback, useMemo, useState } from 'react';

import { CheckboxGroup, Input, InputGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { Magnifier } from '../../icons';
import FilterCheckBox from './FilterCheckBox';

const ComplianceItemFilter = () => {
  const { filtersValues, setFilters, complianceItems } = useFiltersContext();
  const value = useMemo(
    () => filtersValues.complianceItemsIds?.value,
    [filtersValues],
  ) as string[];
  const [search, setSearch] = useState<string>('');

  const isSelected = useCallback((_id: string) => value.includes(_id), [value]);

  const selectedComplianceItems = useMemo(
    () => complianceItems?.filter(({ _id }) => _id && isSelected(_id)),
    [complianceItems, isSelected],
  );

  const filteredComplianceItems = useMemo(() => {
    const nameMatch = (name: string) =>
      name.toLowerCase().includes(search.toLowerCase());
    return complianceItems?.filter(
      ({ name, _id }) => _id && name && nameMatch(name) && !isSelected(_id),
    );
  }, [complianceItems, search, isSelected]);

  return (
    <Stack direction="column" overflow="auto">
      <InputGroup>
        <Input
          borderColor="filterPanel.searchBoxBordercolor"
          borderWidth="1px"
          color="brand.darkGrey"
          fontSize="14px"
          h="40px"
          mb={3}
          onChange={({ target: { value } }) => setSearch(value)}
          pl={8}
          placeholder="Search compliance item"
          value={search}
          w="full"
        />
        <Magnifier
          alt="Search"
          bottom="25px"
          h="12px"
          left="14px"
          position="absolute"
          w="12x"
        />
      </InputGroup>
      <CheckboxGroup
        onChange={(newValue) => setFilters({ complianceItemsIds: newValue })}
        value={value}
      >
        {selectedComplianceItems?.map(({ name, _id }) => (
          <FilterCheckBox key={_id} label={name} value={_id} />
        ))}
        {filteredComplianceItems?.map(({ name, _id }) => (
          <FilterCheckBox key={_id} label={name} value={_id} />
        ))}
      </CheckboxGroup>
    </Stack>
  );
};

export default ComplianceItemFilter;
