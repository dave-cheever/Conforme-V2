import React, { useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from '@chakra-ui/react';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { CheckIcon, MinusIcon } from '../../icons';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import SectionHeader from './SectionHeader';

function LocationsForm() {
  const { locations, trackerItem, setValue, trigger } = useTrackerItemModalContext();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredLocations, setFilteredLocations] = useState<IBusinessUnit[]>([]);
  const [checkedLocationIds, setCheckedLocationIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedLocationIds(trackerItem?.locationsIds || []);
  }, [locations]);

  useEffect(() => {
    const filtered: any = locations.filter((location) => location.name?.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredLocations(filtered);
  }, [locations, searchText]);

  const handleCheckBoxGroupChange = (value) => {
    setCheckedLocationIds([...value]);
    setValue('locationsIds', value);
    trigger('locationsIds');
  };

  const handleAllCheckBoxSelectedLocations = () => {
    let localCheckedLocationsIds: string[] = [];
    if (checkedLocationIds.length !== locations.length) localCheckedLocationsIds = locations.map((location) => location._id!);

    setCheckedLocationIds(localCheckedLocationsIds);
    setValue('locationsIds', localCheckedLocationsIds);
    trigger('locationsIds');
  };

  return (
    <Box data-id="030925-52d811" w="full">
      <Flex data-id="030925-6701a1" direction="column">
        <SectionHeader data-id="030925-b6e9e5" label="Select location" />
        <Flex
          data-id="030925-ec91c5"
          flexDir={['column', 'row']}
          justifyContent="space-between"
          mb="30px"
          w={['full', 'calc(100% - 80px)']}>
          <Flex data-id="030925-9febe8" flexDir="column" pt="3" w="full">
            <Text
              data-id="030925-f64880"
              color="locationsFormModal.filterTextColor"
              fontFamily="Helvetica"
              fontSize="ssm"
              fontWeight="bold"
              lineHeight="16px"
              mb="5px">
              Search location by name
            </Text>
            <InputGroup
              data-id="030925-8fe443"
              border="1px solid"
              borderColor="locationsFormModal.inputBorderColor"
              h="42px"
              rounded="10px">
              <InputLeftElement data-id="030925-f16401" pointerEvents="none">
                <SearchIcon data-id="030925-843e47" color="locationsFormModal.searchIcon" />
              </InputLeftElement>
              <Input
                data-id="030925-ed6373"
                color="locationsFormModal.searchBarText"
                fontSize="smm"
                lineHeight="18px"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                rounded="10px" />
            </InputGroup>
          </Flex>
        </Flex>
        <Flex data-id="030925-8e0e4d" mb="30px">
          <Checkbox
            data-id="030925-5ee267"
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
                color: checkedLocationIds.length === locations.length ? '#282F36' : '#818197',
              },
            }}
            icon={checkedLocationIds.length === locations.length ? <CheckIcon data-id="030925-e5473c" stroke="white" strokeWidth="1.5" /> : <MinusIcon data-id="030925-3aebb6" />}
            isChecked={checkedLocationIds.length > 0}
            key="all"
            onChange={() => handleAllCheckBoxSelectedLocations()}
            value="all">
            Select all
          </Checkbox>
        </Flex>
        <CheckboxGroup
          data-id="030925-658dd6"
          colorScheme="green"
          onChange={(e: any) => handleCheckBoxGroupChange(e)}
          value={checkedLocationIds || []}>
          <VStack data-id="030925-871f95" alignItems="flex-start">
            {filteredLocations.map((location, index) => (
              <Checkbox
                data-id="030925-050ca3"
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
                    color: checkedLocationIds?.includes(location._id!) ? '#282F36' : '#818197',
                  },
                }}
                icon={<CheckIcon data-id="030925-fc3e4b" stroke="white" strokeWidth="1.5" />}
                key={index}
                value={location._id}>
                {location.name}
              </Checkbox>
            ))}
          </VStack>
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
    selectBorderColor: '#CBD5E0',
    inputBorderColor: '#CBD5E0',
    checkbox: {
      unchecked: {
        border: '#CBCCCD',
      },
    },
  },
};
