import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { debounce } from 'lodash';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { CheckIcon, MinusIcon } from '../../icons';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import SectionHeader from './SectionHeader';

function LocationsForm() {
  const { locations, trackerItem, setValue, trigger } = useTrackerItemModalContext();
  const [searchText, setSearchText] = useState<string>('');
  const [checkedLocationIds, setCheckedLocationIds] = useState<string[]>([]);

  // Ensure locations is typed as IBusinessUnit[]
  const typedLocations: IBusinessUnit[] = locations as IBusinessUnit[];

  useEffect(() => {
    setCheckedLocationIds(trackerItem?.locationsIds || []);
  }, [typedLocations]);

  // Debounced search handler
  const debouncedSetSearchText = useMemo(() => debounce((value) => setSearchText(value), 200), []);
  useEffect(() => () => debouncedSetSearchText.cancel(), [debouncedSetSearchText]);

  // Memoize filtered locations
  const filteredLocations: IBusinessUnit[] = useMemo(
    () => typedLocations.filter((location: IBusinessUnit) => location.name?.toLowerCase().includes(searchText.toLowerCase())),
    [typedLocations, searchText],
  );

  const handleCheckBoxGroupChange = (value: string[]) => {
    setCheckedLocationIds([...value]);
    setValue('locationsIds', value);
    trigger('locationsIds');
  };

  const handleAllCheckBoxSelectedLocations = () => {
    let localCheckedLocationsIds: string[] = [];
    if (checkedLocationIds.length !== typedLocations.length)
      localCheckedLocationsIds = typedLocations.map((location) => String(location._id));

    setCheckedLocationIds(localCheckedLocationsIds);
    setValue('locationsIds', localCheckedLocationsIds);
    trigger('locationsIds');
  };

  // Memoized row renderer for react-window
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const location: IBusinessUnit = filteredLocations[index];
      return (
        <div key={location._id} style={style}>
          <Checkbox
            borderColor="locationsFormModal.checkbox.unchecked.border"
            colorScheme="purpleHeart"
            css={{
              '.chakra-checkbox__control': {
                borderRadius: '20%',
                borderWidth: '1px',
                width: '21px',
                height: '21px',
                background: '#FFFFFF',
                '&[data-checked]': {
                  background: '#462AC4',
                  borderColor: '#462AC4',
                },
              },
              '.chakra-checkbox__label': {
                flexGrow: 1,
                marginLeft: '10px',
                fontWeight: 400,
                fontSize: '14px',
                color: checkedLocationIds.includes(String(location._id)) ? '#282F36' : '#818197',
              },
            }}
            data-id="5beea56ef91f"
            icon={<CheckIcon data-id="6ff98aa91917" stroke="white" strokeWidth="1.5" />}
            isChecked={checkedLocationIds.includes(String(location._id))}
            onChange={(e) => {
              const value = e.target.checked
                ? [...checkedLocationIds, String(location._id)]
                : checkedLocationIds.filter((id) => id !== String(location._id));
              handleCheckBoxGroupChange(value);
            }}
            value={String(location._id)}
          >
            {location.name}
          </Checkbox>
        </div>
      );
    },
    [filteredLocations, checkedLocationIds, handleCheckBoxGroupChange],
  );

  return (
    <Box data-id="f141c47ab1b0" w="full">
      <Flex data-id="c150a9a23760" direction="column">
        <SectionHeader data-id="9a2182481534" label="Select location" />
        <Flex data-id="cea8c3cc108e" flexDir={['column', 'row']} justifyContent="space-between" mb="30px" w={['full', 'calc(100% - 80px)']}>
          <Flex data-id="03d8d76ed893" flexDir="column" pt="3" w="full">
            <Text
              color="locationsFormModal.filterTextColor"
              data-id="3f2210756fb8"
              fontFamily="Helvetica"
              fontSize="ssm"
              fontWeight="bold"
              left="none"
              lineHeight="16px"
              mb="5px"
              zIndex={1}
            >
              Search location by name
            </Text>
            <InputGroup border="1px solid" borderColor="locationsFormModal.inputBorderColor" data-id="180ab2bd2761" h="42px" rounded="10px">
              <InputLeftElement data-id="79f326d1b662" pointerEvents="none">
                <SearchIcon color="locationsFormModal.searchIcon" data-id="95e2721aca0b" />
              </InputLeftElement>
              <Input
                color="locationsFormModal.searchBarText"
                data-id="4fbbe6ecdc21"
                fontSize="14px"
                onChange={(e) => debouncedSetSearchText(e.target.value)}
                placeholder="Search"
                rounded="10px"
              />
            </InputGroup>
          </Flex>
        </Flex>
        <Flex data-id="70481d1a51ef" mb="30px">
          <Checkbox
            borderColor="locationsFormModal.checkbox.unchecked.border"
            colorScheme="purpleHeart"
            css={{
              '.chakra-checkbox__control': {
                borderRadius: '20%',
                borderWidth: '1px',
                width: '21px',
                height: '21px',
                background: '#FFFFFF',
                '&[data-checked]': {
                  background: '#462AC4',
                  borderColor: '#462AC4',
                },
                '&[data-indeterminate]': {
                  background: '#462AC4',
                  borderColor: '#462AC4',
                },
              },
              '.chakra-checkbox__label': {
                flexGrow: 1,
                marginLeft: '10px',
                fontWeight: 400,
                fontSize: '14px',
                color: checkedLocationIds.length === typedLocations.length ? '#282F36' : '#818197',
              },
            }}
            data-id="97ebd4717bf9"
            icon={
              checkedLocationIds.length === typedLocations.length ? (
                <CheckIcon data-id="bd1bb2c1d250" stroke="white" strokeWidth="1.5" />
              ) : (
                <MinusIcon data-id="8e0dedd1b411" />
              )
            }
            isChecked={checkedLocationIds.length > 0}
            key="all"
            onChange={() => handleAllCheckBoxSelectedLocations()}
            value="all"
          >
            Select all
          </Checkbox>
        </Flex>
        {/* Virtualized list for locations */}
        <CheckboxGroup colorScheme="green" data-id="54ec979e4aa2" value={checkedLocationIds}>
          <List height={400} itemCount={filteredLocations.length} itemSize={40} width={'100%'}>
            {Row}
          </List>
        </CheckboxGroup>
      </Flex>
    </Box>
  );
}

export default LocationsForm;

export const locationsFormModalStyles = {
  locationsFormModal: {
    filterTextColor: '#2B3236',
    searchIcon: '#818197',
    searchBarText: '#818197',
    selectBg: '#FFFFFF',
    selectBorderColor: 'rgba(129, 129, 151, 0.4)',
    inputBorderColor: 'rgba(129, 129, 151, 0.4)',
    checkbox: {
      unchecked: {
        border: '#CBCCCD',
      },
    },
  },
};
