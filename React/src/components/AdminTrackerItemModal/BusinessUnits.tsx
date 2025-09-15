import React, { useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from '@chakra-ui/react';
import { t } from 'i18next';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { CheckIcon, MinusIcon } from '../../icons';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import SectionHeader from './SectionHeader';

function BusinessUnitsForm() {
  const { businessUnits, trackerItem, setValue, trigger } = useTrackerItemModalContext();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredBU, setFilteredBU] = useState<IBusinessUnit[]>([]);
  const [checkedBUIds, setCheckedBUIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedBUIds(trackerItem?.businessUnitsIds || []);
  }, [businessUnits]);

  const handleChange = (value) => {
    setCheckedBUIds([...value]);
    setValue('businessUnitsIds', value);
    trigger('businessUnitsIds');
  };

  useEffect(() => {
    const filtered: any = businessUnits.filter((businessUnit) => businessUnit.name?.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredBU(filtered);
  }, [businessUnits, searchText]);

  const handleAllCheckBoxSelectedBU = () => {
    let localCheckedBUIds: string[] = [];
    if (checkedBUIds.length !== businessUnits.length) localCheckedBUIds = businessUnits.map((BU) => BU._id!);

    setCheckedBUIds(localCheckedBUIds);
    setValue('businessUnitsIds', localCheckedBUIds);
    trigger('businessUnitsIds');
  };

  return (
    <Box data-id="030925-cb0302" w="full">
      <Flex data-id="030925-2cbcfa" direction="column">
        <SectionHeader data-id="030925-fe1551" label={`Select ${t('business unit')}(s)`} />

        <Flex
          data-id="030925-49906b"
          flexDir={['column', 'row']}
          justifyContent="space-between"
          mb="30px"
          w={['full', 'calc(100% - 80px)']}>
          <Flex data-id="030925-eb1088" flexDir="column" pt="3" w="full">
            <Flex align="center" data-id="030925-eb021c" justify="space-between">
              <Text
                color="locationsFormModal.filterTextColor"
                data-id="030925-bf33ef"
                fontFamily="Helvetica"
                fontSize="ssm"
                fontWeight="bold"
                left="none"
                lineHeight="16px"
                mb="5px"
                zIndex={1}>
                Search by {t('business unit')} name
              </Text>
            </Flex>
            <InputGroup
              border="1px solid"
              borderColor="#CBD5E0"
              data-id="030925-4089c5"
              h="42px"
              rounded="10px">
              <InputLeftElement data-id="030925-fe187c" pointerEvents="none">
                <SearchIcon color="businessUnitsModal.searchIcon" data-id="030925-b48bc0" />
              </InputLeftElement>
              <Input
                data-id="030925-3ce182"
                fontSize="14px"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                rounded="10px" />
            </InputGroup>
          </Flex>
        </Flex>

        <Flex data-id="030925-28cc32" mb="30px">
          <Checkbox
            borderColor="businessUnitsModal.checkbox.unchecked.border"
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
                color: checkedBUIds.length === businessUnits.length ? '#282F36' : '#818197',
              },
            }}
            data-id="030925-5ae8a7"
            icon={checkedBUIds.length === businessUnits.length ? <CheckIcon data-id="030925-392b58" stroke="white" strokeWidth="1.5" /> : <MinusIcon data-id="030925-93cf15" />}
            isChecked={checkedBUIds.length > 0}
            key="all"
            onChange={() => handleAllCheckBoxSelectedBU()}
            value="all">
            Select all
          </Checkbox>
        </Flex>

        <CheckboxGroup
          colorScheme="green"
          data-id="030925-4c0f72"
          onChange={(e: any) => handleChange(e)}
          value={trackerItem.businessUnitsIds || []}>
          <VStack alignItems="flex-start" data-id="030925-2dbe81">
            {filteredBU.map((businessUnit) => (
              <Checkbox
                borderColor="businessUnitsModal.checkbox.unchecked.border"
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
                    color: trackerItem?.businessUnitsIds?.includes(businessUnit._id) ? '#282F36' : '#818197',
                  },
                }}
                data-id="030925-ed7506"
                icon={<CheckIcon data-id="030925-f80ed4" stroke="white" strokeWidth="1.5" />}
                key={businessUnit._id}
                value={businessUnit._id}>
                {businessUnit.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Box>
  );
}

export default BusinessUnitsForm;

export const businessUnitsModalStyles = {
  businessUnitsModal: {
    searchIcon: '#818197',
    selectBg: '#ffffff',
    checkbox: {
      unchecked: {
        border: '#CBCCCD',
      },
    },
  },
};
