import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Checkbox,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';

import { MinusIcon, SearchIcon } from '../icons';
import StatusSelectorList from './StatusSelectorList';

interface ISitesSelector {
  status: string[];
  selected: string[];
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const StatusSelector = ({
  status,
  selected,
  note,
  disabled,
  handleChange,
}: ISitesSelector) => {
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const areAllSelected = useMemo(
    () => filteredStatuses?.every((value) => selected.includes(value)),
    [filteredStatuses, selected],
  );

  useEffect(() => {
    let filteredStatuses: string[] = [];
    if (disabled)
      filteredStatuses = status?.filter((value) => selected.includes(value));
    else {
      filteredStatuses = status?.filter((value) =>
        value.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    setFilteredStatuses(filteredStatuses);
  }, [status, selectedType, searchText, disabled, selected]);

  const toggleAll = useCallback(
    (event) => {
      const currentViewIds = filteredStatuses.map((value) => value);
      if (event.target.checked) {
        // Add all filtered locations to selection
        const value = Array.from(new Set([...selected, ...currentViewIds]));
        handleChange({ target: { name: 'status', value } });
      } else {
        // Remove all filtered locations from selection
        const value = selected.filter(
          (value) => !currentViewIds.includes(value),
        );
        handleChange({ target: { name: 'status', value } });
      }
    },

    [filteredStatuses, selected],
  );

  if (disabled) {
    return (
      <StatusSelectorList
        disabled={disabled}
        filteredStatuses={filteredStatuses}
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
                borderColor="auditFilterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="statusSelector.search.label"
                fontSize="smm"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={10}
                placeholder="Search statuses"
                value={searchText}
                w="full"
              />
              <SearchIcon
                bottom="13px"
                h="15px"
                left="14px"
                position="absolute"
                stroke="statusSelector.search.icon"
                w="15x"
              />
            </InputGroup>
          </Box>
          {note && (
            <Text
              color="statusSelector.note"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3"
              pl="12px"
            >
              {note}
            </Text>
          )}
          {filteredStatuses?.length > 0 && (
            <Checkbox
              borderColor="statusSelector.checkbox.border"
              colorScheme="statusSelector.checkbox"
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
              <Text color="auditFilterPanel.checkboxLabelColor" fontSize="14px">
                Select all
              </Text>
            </Checkbox>
          )}
          <StatusSelectorList
            disabled={disabled}
            filteredStatuses={filteredStatuses}
            handleChange={handleChange}
            selected={selected}
          />
        </>
      </Stack>
    </Stack>
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
