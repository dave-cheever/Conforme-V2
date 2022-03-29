import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Checkbox,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';

import { MinusIcon, SearchIcon } from '../icons';
import { ILocation } from '../interfaces/ILocation';
import LocationsSelectorList from './LocationsSelectorList';

interface ILocationsSelector {
  locations: ILocation[];
  selected: string[];
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const LocationsSelector = ({
  locations,
  selected,
  note,
  disabled,
  handleChange,
}: ILocationsSelector) => {
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const areAllSelected = useMemo(
    () => filteredLocations?.every(({ _id }) => selected.includes(_id)),
    [filteredLocations, selected],
  );

  useEffect(() => {
    let filteredLocations: ILocation[] = [];
    if (disabled) {
      filteredLocations = locations?.filter(({ _id }) =>
        selected.includes(_id),
      );
    } else {
      filteredLocations = locations?.filter(({ name }) =>
        name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    setFilteredLocations(filteredLocations);
  }, [locations, selectedType, searchText, disabled, selected]);

  const toggleAll = useCallback(
    (event) => {
      const currentViewIds = filteredLocations.map(({ _id }) => _id);
      if (event.target.checked) {
        // Add all filtered locations to selection
        const value = Array.from(new Set([...selected, ...currentViewIds]));
        handleChange({ target: { name: 'locationsIds', value } });
      } else {
        // Remove all filtered locations from selection
        const value = selected.filter((_id) => !currentViewIds.includes(_id));
        handleChange({ target: { name: 'locationsIds', value } });
      }
    },

    [filteredLocations, selected],
  );

  if (disabled) {
    return (
      <LocationsSelectorList
        disabled={disabled}
        filteredLocations={filteredLocations}
        handleChange={handleChange}
        selected={selected}
      />
    );
  }

  return (
    <Stack w="full">
      <Stack overflow="auto" pb={3} w="full">
        <>
          <Box py="5px">
            <InputGroup>
              <Input
                borderColor="filterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="locationsSelector.search.label"
                fontSize="smm"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={10}
                placeholder="Search"
                value={searchText}
                w="full"
              />
              <SearchIcon
                alt="Search"
                bottom="13px"
                h="15px"
                left="14px"
                position="absolute"
                stroke="locationsSelector.search.icon"
                w="15x"
              />
            </InputGroup>
          </Box>
          {note && (
            <Text
              color="locationsSelector.note"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3"
              pl="12px"
            >
              {note}
            </Text>
          )}
          {filteredLocations?.length > 0 && (
            <Checkbox
              borderColor="locationsSelector.checkbox.border"
              colorScheme="locationsSelector.checkbox"
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
              py="20px"
            >
              <Text color="filterPanel.checkboxLabelColor" fontSize="14px">
                Select all
              </Text>
            </Checkbox>
          )}
          <LocationsSelectorList
            disabled={disabled}
            filteredLocations={filteredLocations}
            handleChange={handleChange}
            selected={selected}
          />
        </>
      </Stack>
    </Stack>
  );
};

export default LocationsSelector;

export const locationsSelectorStyles = {
  locationsSelector: {
    label: '#777777',
    search: {
      icon: '818197',
      label: '818197',
    },
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
