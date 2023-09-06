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
      (<LocationsSelectorList
        data-id="e50cefb10d8e"
        disabled={disabled}
        filteredLocations={filteredLocations}
        handleChange={handleChange}
        selected={selected} />)
    );
  }

  return (
    (<Stack data-id="2798f55781a8" w="full">
      <Stack data-id="fa526862eff8" overflow="auto" pb={3} w="full">
        <>
          <Box data-id="a738225c5add" py="5px">
            <InputGroup data-id="ac32100516cd">
              <Input
                borderColor="filterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="locationsSelector.search.label"
                data-id="3137cec14067"
                fontSize="smm"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={10}
                placeholder={`Search ${pluralize(t('site'))}`}
                value={searchText}
                w="full" />
              <SearchIcon
                bottom="13px"
                data-id="6b3aab528bbe"
                h="15px"
                left="14px"
                position="absolute"
                stroke="locationsSelector.search.icon"
                w="15x" />
            </InputGroup>
          </Box>
          {note && (
            <Text
              color="locationsSelector.note"
              data-id="a5042f3a8102"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3"
              pl="12px">
              {note}
            </Text>
          )}
          <LocationsSelectorList
            data-id="ab1cb99ccff7"
            disabled={disabled}
            filteredLocations={filteredLocations}
            handleChange={handleChange}
            selected={selected} />
        </>
      </Stack>
    </Stack>)
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
