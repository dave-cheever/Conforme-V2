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
    (<Box data-id="0983d36e4017" w="full">
      <Flex data-id="33b8ca8c4117" direction="column">
        <SectionHeader data-id="687ba8761d75" label="Select location" />
        <Flex
          data-id="29596c52e4b2"
          flexDir={['column', 'row']}
          justifyContent="space-between"
          mb="30px"
          w={['full', 'calc(100% - 80px)']}>
          <Flex data-id="a27b3451993e" flexDir="column" pt="3" w="full">
            <Text
              color="locationsFormModal.filterTextColor"
              data-id="5e9417483395"
              fontFamily="Helvetica"
              fontSize="ssm"
              fontWeight="bold"
              lineHeight="16px"
              mb="5px">
              Search location by name
            </Text>
            <InputGroup
              border="1px solid"
              borderColor="locationsFormModal.inputBorderColor"
              data-id="44bbd2e47cef"
              h="42px"
              rounded="10px">
              <InputLeftElement data-id="42154972d34d" pointerEvents="none">
                <SearchIcon color="locationsFormModal.searchIcon" data-id="b411877a6698" />
              </InputLeftElement>
              <Input
                color="locationsFormModal.searchBarText"
                data-id="ef88e8d6a2ae"
                fontSize="smm"
                lineHeight="18px"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                rounded="10px" />
            </InputGroup>
          </Flex>
        </Flex>
        <Flex data-id="70a2bb8cb712" mb="30px">
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
                color: checkedLocationIds.length === locations.length ? '#282F36' : '#818197',
              },
            }}
            data-id="053be4377303"
            icon={checkedLocationIds.length === locations.length ? <CheckIcon data-id="94cbc8d299bb" stroke="white" strokeWidth="1.5" /> : <MinusIcon data-id="41a7168865a8" />}
            isChecked={checkedLocationIds.length > 0}
            key="all"
            onChange={() => handleAllCheckBoxSelectedLocations()}
            value="all">
            Select all
          </Checkbox>
        </Flex>
        <CheckboxGroup
          colorScheme="green"
          data-id="5c55c9539878"
          onChange={(e: any) => handleCheckBoxGroupChange(e)}
          value={checkedLocationIds || []}>
          <VStack alignItems="flex-start" data-id="fe25bdf7b2e0">
            {filteredLocations.map((location, index) => (
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
                    color: checkedLocationIds?.includes(location._id!) ? '#282F36' : '#818197',
                  },
                }}
                data-id="0c3463219379"
                icon={<CheckIcon data-id="488b2d635995" stroke="white" strokeWidth="1.5" />}
                key={index}
                value={location._id}>
                {location.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Box>)
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
