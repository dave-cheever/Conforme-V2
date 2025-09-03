import { useEffect, useState } from 'react';

import { Box, Input, InputGroup, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { SearchIcon } from '../icons';
import { ILocation } from '../interfaces/ILocation';
import LocationsSelectorList from './LocationsSelectorList';

interface ILocationsSelector {
  locations: ILocation[];
  selected: string[];
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

function LocationsSelector({ locations, selected, note, disabled, handleChange }: ILocationsSelector) {
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    let filteredLocations: ILocation[] = [];
    if (disabled) filteredLocations = locations?.filter(({ _id }) => selected.includes(_id));
    else filteredLocations = locations?.filter(({ name }) => name.toLowerCase().includes(searchText.toLowerCase()));

    setFilteredLocations(filteredLocations);
  }, [locations, selectedType, searchText, disabled, selected]);

  if (disabled) {
    return (
      <LocationsSelectorList
          data-id="030925-5a1708"
          disabled={disabled}
          filteredLocations={filteredLocations}
          handleChange={handleChange}
          selected={selected} />
    );
  }

  return (
    <Stack data-id="030925-0eb71d" w="full">
      <Stack data-id="030925-70c0f6" overflow="auto" pb={3} w="full">
        <>
          <Box data-id="030925-dd6175" py="5px">
            <InputGroup data-id="030925-2a0931">
              <Input
                data-id="030925-8c5584"
                borderColor="filterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="locationsSelector.search.label"
                fontSize="smm"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={10}
                placeholder={`Search ${pluralize(t('location'))}`}
                value={searchText}
                w="full" />
              <SearchIcon
                data-id="030925-6a2478"
                bottom="13px"
                h="15px"
                left="14px"
                position="absolute"
                stroke="locationsSelector.search.icon"
                w="15x" />
            </InputGroup>
          </Box>
          {note && (
            <Text
              data-id="030925-0d2d3f"
              color="locationsSelector.note"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3"
              pl="12px">
              {note}
            </Text>
          )}
          <LocationsSelectorList
            data-id="030925-490a3a"
            disabled={disabled}
            filteredLocations={filteredLocations}
            handleChange={handleChange}
            selected={selected} />
        </>
      </Stack>
    </Stack>
  );
}

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
