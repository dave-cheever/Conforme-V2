import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Input, InputGroup, Stack, Text } from "@chakra-ui/react";

import { MinusIcon, SearchIcon } from "../icons";
import { ILocation } from "../interfaces/ILocation";
import LocationsSelectorList from "./LocationsSelectorList";

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
  const areAllSelected = useMemo(() => filteredLocations?.every(({ _id }) => selected.includes(_id)), [filteredLocations, selected]);

  useEffect(() => {
    let filteredLocations: ILocation[] = [];
    if (disabled) {
      filteredLocations = locations?.filter(({ _id }) => selected.includes(_id));
    } else {
      filteredLocations = locations?.filter(({ name }) =>
        name.toLowerCase().includes(searchText.toLowerCase()));
    }
    setFilteredLocations(filteredLocations);
  }, [locations, selectedType, searchText, disabled, selected]);

  const toggleAll = useCallback((event) => {
    const currentViewIds = filteredLocations.map(({ _id }) => _id);
    if (event.target.checked) {
      // Add all filtered locations to selection
      const value = Array.from(new Set([...selected, ...currentViewIds]));
      handleChange({ target: { name: 'locationsIds', value } });
    } else {
      // Remove all filtered locations from selection
      const value = selected.filter(_id => !currentViewIds.includes(_id));
      handleChange({ target: { name: 'locationsIds', value } });
    }
  }, [filteredLocations, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  if (disabled) {
    return (
      <LocationsSelectorList
        filteredLocations={filteredLocations}
        selected={selected}
        disabled={disabled}
        handleChange={handleChange}
      />
    );
  }

  return (
    <Stack w='full'>
      <Stack w='full' pb={3} overflow='auto'>
        <>
          <Box py='5px'>
            <InputGroup>
              <Input
                borderWidth='1px'
                borderColor='filterPanel.searchBoxBordercolor'
                h='40px'
                w='full'
                pl={10}
                color='locationsSelector.search.label'
                placeholder='Search'
                fontSize="smm"
                value={searchText}
                onChange={({ target: { value } }) => setSearchText(value)}
              />
              <SearchIcon alt="Search" h="15px" w='15x' position="absolute" bottom="13px" left="14px" stroke="locationsSelector.search.icon" />
            </InputGroup>
          </Box>
          {note &&
            <Text fontSize='12px' color='locationsSelector.note' opacity='0.3' fontStyle='italic' pl="12px">
              {note}
            </Text>
          }
          {filteredLocations?.length > 0 && (
            <Checkbox
              py="20px"
              isChecked={areAllSelected}
              onChange={toggleAll}
              icon={<MinusIcon />}
              css={{
                ".chakra-checkbox__control": {
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  background: "white",
                  borderWidth: "1px",
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
              borderColor="locationsSelector.checkbox.border"
              colorScheme="locationsSelector.checkbox"
            >
              <Text fontSize="14px" color="filterPanel.checkboxLabelColor">Select all</Text>
            </Checkbox>
          )}
          <LocationsSelectorList
            filteredLocations={filteredLocations}
            selected={selected}
            disabled={disabled}
            handleChange={handleChange}
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
      label: '818197'
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
      }
    },
  },
}
