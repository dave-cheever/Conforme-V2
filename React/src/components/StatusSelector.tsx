import { useEffect, useState } from 'react';

import { Box, Input, InputGroup, Stack, Text } from '@chakra-ui/react';

import { SearchIcon } from '../icons';
import StatusSelectorList from './StatusSelectorList';

interface ISitesSelector {
  status: string[];
  selected: string[];
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const StatusSelector = ({ status, selected, note, disabled, handleChange }: ISitesSelector) => {
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    let filteredStatuses: string[] = [];
    if (disabled) filteredStatuses = status?.filter((value) => selected.includes(value));
    else filteredStatuses = status?.filter((value) => value.toLowerCase().includes(searchText.toLowerCase()));

    setFilteredStatuses(filteredStatuses);
  }, [status, selectedType, searchText, disabled, selected]);

  if (disabled)
    {return (
      <StatusSelectorList
        data-id="e275bb8bf43a"
        disabled={disabled}
        filteredStatuses={filteredStatuses}
        handleChange={handleChange}
        selected={selected} />
    );}

  return (
    (<Stack data-id="1217404c0340" w="full">
      <Stack data-id="1200141488d5" overflow="auto" pb={3} w="full">
        <>
          <Box data-id="5c6339f1b4db" py="5px">
            <InputGroup data-id="43ada85d5457">
              <Input
                borderColor="auditFilterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="statusSelector.search.label"
                data-id="b41f6b6b87e3"
                fontSize="smm"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={10}
                placeholder="Search statuses"
                value={searchText}
                w="full" />
              <SearchIcon
                bottom="13px"
                data-id="2f9f8cfc41c0"
                h="15px"
                left="14px"
                position="absolute"
                stroke="statusSelector.search.icon"
                w="15x" />
            </InputGroup>
          </Box>
          {note && (
            <Text
              color="statusSelector.note"
              data-id="6bb3bc946fd4"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3"
              pl="12px">
              {note}
            </Text>
          )}
          <StatusSelectorList
            data-id="d4d1702670e4"
            disabled={disabled}
            filteredStatuses={filteredStatuses}
            handleChange={handleChange}
            selected={selected} />
        </>
      </Stack>
    </Stack>)
  );
};

export default StatusSelector;

export const statusSelectorStyles = {
  statusSelector: {
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
