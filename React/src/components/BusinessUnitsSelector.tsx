import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Flex, Input, Stack, Text } from "@chakra-ui/react";

import { Magnifier } from "../icons";
import { IBusinessUnit } from "../interfaces/IBusinessUnit";
import BusinessUnitsSelectorList from "./BusinessUnitsSelectorList";

interface IBusinessUnitsSelector {
  businessUnits: IBusinessUnit[];
  selected: string[];
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelector = ({
  businessUnits,
  selected,
  note,
  disabled,
  handleChange,
}: IBusinessUnitsSelector) => {
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState<IBusinessUnit[]>([]);
  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const areAllSelected = useMemo(() => filteredBusinessUnits.every(({ _id }) => selected.includes(_id)), [filteredBusinessUnits, selected]);

  useEffect(() => {
    let filteredBusinessUnits: IBusinessUnit[] = [];
    if (disabled) {
      filteredBusinessUnits = businessUnits.filter(({ _id }) => selected.includes(_id));
    } else {
      filteredBusinessUnits = businessUnits.filter(({ type, name }) =>
        (!selectedType || type === selectedType) && name.toLowerCase().includes(searchText.toLowerCase()));
    }
    setFilteredBusinessUnits(filteredBusinessUnits);
  }, [businessUnits, selectedType, searchText, disabled, selected]);

  // filteredBusinessUnits.sort( (a, b) => compare(a.name, b.name));

  const toggleAll = useCallback((event) => {
    const currentViewIds = filteredBusinessUnits.map(({ _id }) => _id);
    if (event.target.checked) {
      // Add all filtered business units to selection
      const value = Array.from(new Set([...selected, ...currentViewIds]));
      handleChange({ target: { name: 'businessUnitsIds', value } });
    } else {
      // Remove all filtered business units from selection
      const value = selected.filter(_id => !currentViewIds.includes(_id));
      handleChange({ target: { name: 'businessUnitsIds', value } });
    }
  }, [filteredBusinessUnits, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  if (disabled) {
    return (
      <BusinessUnitsSelectorList
        filteredBusinessUnits={filteredBusinessUnits}
        selected={selected}
        disabled={disabled}
        handleChange={handleChange}
      />
    );
  }

  return (
    <Stack w='full' spacing={4} pl={[0, 0, 3]}>
      <Stack w='full' spacing={2} pb={3} overflow='auto'>
        <Box w='full' mt='-12px'>
          {/* <Dropdown
            name='type'
            label='Select type'
            value={selectedType}
            options={[
              { value: "", label: "Show all" },
              { value: "Hospital", label: "Show hospitals only" },
              { value: "Corporate", label: "Show corporate only" }
            ]}
            onChange={({ target: { value } }) => setSelectedType(value)}
            style={{ width: 'full' }}
          /> */}
        </Box>
        <>
          <Box pt='5px'>
            <Flex py={2} align='center' justify="space-between" mb="-32px">
              <Box color="businessUnitsSelector.label" fontWeight="bold" fontSize={11} position="relative" left="19px" zIndex={3}>
                Search business units
              </Box>
              <Magnifier
                position='relative'
                top='12px'
                right={4}
                h='16px'
                w='16px'
                alt='Search'
                zIndex={3}
              />
            </Flex>
            <Input
              borderWidth='2px'
              borderRadius="8px"
              borderColor='businessUnitsSelector.border.normal'
              h='55px'
              pt='15px'
              mb={0}
              zIndex={2}
              value={searchText}
              onChange={({ target: { value } }) => setSearchText(value)}
              _focus={{ color: 'businessUnitsSelector.border.focus' }}
            />
          </Box>
          {note &&
            <Text fontSize='12px' color='businessUnitsSelector.note' opacity='0.3' fontStyle='italic'>
              {note}
            </Text>
          }
          {filteredBusinessUnits.length > 0 && (
            <Checkbox
              isChecked={areAllSelected}
              onChange={toggleAll}
              css={{
                ".chakra-checkbox__control": {
                  borderRadius: "50%",
                  borderWidth: '2px',
                  width: "21px",
                  height: "21px",
                }
              }}
              borderColor="businessUnitsSelector.checkbox.border"
              colorScheme="businessUnitsSelector.checkbox"
            >
              <Flex align='center' h='50px' fontSize='13px'>
                Select all
              </Flex>
            </Checkbox>
          )}
          <BusinessUnitsSelectorList
            filteredBusinessUnits={filteredBusinessUnits}
            selected={selected}
            disabled={disabled}
            handleChange={handleChange}
          />
        </>
      </Stack>
    </Stack>
  );
};

export default BusinessUnitsSelector;
