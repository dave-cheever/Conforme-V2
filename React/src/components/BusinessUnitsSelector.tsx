import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Input, InputGroup, Stack, Text } from "@chakra-ui/react";

import { Magnifier, MinusIcon } from "../icons";
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
  const areAllSelected = useMemo(() => filteredBusinessUnits?.every(({ _id }) => selected.includes(_id)), [filteredBusinessUnits, selected]);

  useEffect(() => {
    let filteredBusinessUnits: IBusinessUnit[] = [];
    if (disabled) {
      filteredBusinessUnits = businessUnits?.filter(({ _id }) => selected.includes(_id));
    } else {
      filteredBusinessUnits = businessUnits?.filter(({ type, name }) =>
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
    <Stack w='full'>
      <Stack w='full' pb={3} overflow='auto'>
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
          <Box py='5px'>
            <InputGroup>
              <Input
                borderWidth='1px'
                borderColor='filterPanel.searchBoxBordercolor'
                h='40px'
                w='full'
                pl={8}
                color='brand.darkGrey'
                placeholder='Search business units'
                fontSize="14px"
                value={searchText}
                onChange={({ target: { value } }) => setSearchText(value)}
              />
              <Magnifier alt="Search" h="12px" w='12x' position="absolute" bottom="13px" left="14px" />
            </InputGroup>
          </Box>
          {note &&
            <Text fontSize='12px' color='businessUnitsSelector.note' opacity='0.3' fontStyle='italic'>
              {note}
            </Text>
          }
          {filteredBusinessUnits?.length > 0 && (
            <Checkbox
              isChecked={areAllSelected}
              onChange={toggleAll}
              icon={<MinusIcon/>}
              css={{
                ".chakra-checkbox__control": {
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                background:"white",
                borderWidth:"1px",
                borderColor: "#81819750",
                "&[data-checked]": {
                    background: "#462AC4",
                    borderColor: "#462AC4",
                    "&[data-hover]": {
                    background: "#462AC4",
                    borderColor: "#462AC4"
                    }
                }
                }
              }}
              borderColor="businessUnitsSelector.checkbox.border"
              colorScheme="businessUnitsSelector.checkbox"
            >
              <Text fontSize="14px" color="filterPanel.checkboxLabelColor">Select all</Text>
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

export const businessUnitsSelectorStyles = {
  businessUnitsSelector: {
    label: '#777777',
    border: {
      normal: '#CBCCCD',
      focus: '#777777',
    },
    note: '#424B50',
    checkbox: {
      border: '#CBCCCD',
      500: '#462AC4',
    },
    list: {
      checkbox: {
        border: '#CBCCCD',
        500: '#462AC4',
      },
      font: {
        normal: '#777777',
        selected: '#FFFFFF',
      }
    },
  },
}
