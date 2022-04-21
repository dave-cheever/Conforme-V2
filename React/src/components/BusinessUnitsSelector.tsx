import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Checkbox,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { Magnifier, MinusIcon } from '../icons';
import { IBusinessUnit } from '../interfaces/IBusinessUnit';
import BusinessUnitsSelectorList from './BusinessUnitsSelectorList';

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
  const { module } = useAppContext();
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState<
    IBusinessUnit[]
  >([]);

  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const areAllSelected = useMemo(
    () => filteredBusinessUnits?.every(({ _id }) => selected?.includes(_id)),
    [filteredBusinessUnits, selected],
  );

  useEffect(() => {
    let filteredBusinessUnits: IBusinessUnit[] = businessUnits || [];
    if (searchText !== '') {
      filteredBusinessUnits = filteredBusinessUnits?.filter(({ name }) =>
        name.includes(searchText),
      );
    }
    if (disabled) {
      filteredBusinessUnits = filteredBusinessUnits?.filter(({ _id }) =>
        selected.includes(_id),
      );
    }
    setFilteredBusinessUnits(filteredBusinessUnits);
  }, [businessUnits, selectedType, searchText, disabled, selected]);

  // filteredBusinessUnits.sort( (a, b) => compare(a.name, b.name));

  const toggleAll = useCallback(
    (event) => {
      const currentViewIds = filteredBusinessUnits.map(({ _id }) => _id);
      if (event.target.checked) {
        // Add all filtered business units to selection
        const value = Array.from(new Set([...selected, ...currentViewIds]));
        handleChange({
          target: {
            name: module?.type === 'tracker' ? 'businessUnitsIds' : 'areasIds',
            value,
          },
        });
      } else {
        // Remove all filtered business units from selection
        const value = selected?.filter((_id) => !currentViewIds.includes(_id));
        handleChange({
          target: {
            name: module?.type === 'tracker' ? 'businessUnitsIds' : 'areasIds',
            value,
          },
        });
      }
    },

    [filteredBusinessUnits, selected],
  );

  if (disabled) {
    return (
      <BusinessUnitsSelectorList
        disabled={disabled}
        filteredBusinessUnits={filteredBusinessUnits}
        handleChange={handleChange}
        selected={selected}
      />
    );
  }

  return (
    <Stack w="full">
      <Stack overflow="auto" pb={3} w="full">
        <Box mt="-12px" w="full">
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
          <Box py="5px">
            <InputGroup>
              <Input
                borderColor="filterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="brand.darkGrey"
                fontSize="14px"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={8}
                placeholder={
                  module?.type === 'tracker'
                    ? 'Search business units'
                    : 'Search areas'
                }
                value={searchText}
                w="full"
              />
              <Magnifier
                bottom="13px"
                h="12px"
                left="14px"
                position="absolute"
                w="12x"
              />
            </InputGroup>
          </Box>
          {note && (
            <Text
              color="businessUnitsSelector.note"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3"
            >
              {note}
            </Text>
          )}
          {filteredBusinessUnits?.length > 0 && (
            <Checkbox
              borderColor="businessUnitsSelector.checkbox.border"
              colorScheme="businessUnitsSelector.checkbox"
              css={{
                '.chakra-checkbox__control': {
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderWidth: '1px',
                  borderColor: '#81819750',
                  '&[data-checked]': {
                    background: '#462AC4',
                    borderColor: '#462AC4',
                    '&[data-hover]': {
                      background: '#462AC4',
                      borderColor: '#462AC4',
                    },
                  },
                },
              }}
              icon={<MinusIcon />}
              isChecked={areAllSelected}
              onChange={toggleAll}
            >
              <Text color="filterPanel.checkboxLabelColor" fontSize="14px">
                Select all
              </Text>
            </Checkbox>
          )}
          <BusinessUnitsSelectorList
            disabled={disabled}
            filteredBusinessUnits={filteredBusinessUnits}
            handleChange={handleChange}
            selected={selected}
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
      },
    },
  },
};
