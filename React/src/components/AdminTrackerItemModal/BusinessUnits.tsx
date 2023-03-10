import React, { useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from '@chakra-ui/react';
import { t } from 'i18next';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { CheckIcon, MinusIcon } from '../../icons';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import SectionHeader from './SectionHeader';

const BusinessUnitsForm = () => {
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
    (<Box data-id="f141c47ab1b0" w="full">
      <Flex data-id="c150a9a23760" direction="column">
        <SectionHeader data-id="9a2182481534" label={`Select ${t('business unit')}(s)`} />

        <Flex
          data-id="cea8c3cc108e"
          flexDir={['column', 'row']}
          justifyContent="space-between"
          mb="30px"
          w={['full', 'calc(100% - 80px)']}>
          <Flex data-id="03d8d76ed893" flexDir="column" pt="3" w="full">
            <Flex align="center" data-id="ce95df9ca000" justify="space-between">
              <Text
                color="locationsFormModal.filterTextColor"
                data-id="3f2210756fb8"
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
              borderColor="rgba(129, 129, 151, 0.4)"
              data-id="180ab2bd2761"
              h="42px"
              rounded="10px">
              <InputLeftElement data-id="79f326d1b662" pointerEvents="none">
                <SearchIcon color="businessUnitsModal.searchIcon" data-id="95e2721aca0b" />
              </InputLeftElement>
              <Input
                data-id="4fbbe6ecdc21"
                fontSize="14px"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                rounded="10px" />
            </InputGroup>
          </Flex>
        </Flex>

        <Flex data-id="70481d1a51ef" mb="30px">
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
            data-id="97ebd4717bf9"
            icon={checkedBUIds.length === businessUnits.length ? <CheckIcon data-id="bd1bb2c1d250" stroke="white" strokeWidth="1.5" /> : <MinusIcon data-id="8e0dedd1b411" />}
            isChecked={checkedBUIds.length > 0}
            key="all"
            onChange={() => handleAllCheckBoxSelectedBU()}
            value="all">
            Select all
          </Checkbox>
        </Flex>

        <CheckboxGroup
          colorScheme="green"
          data-id="54ec979e4aa2"
          onChange={(e: any) => handleChange(e)}
          value={trackerItem.businessUnitsIds || []}>
          <VStack alignItems="flex-start" data-id="d4d327f3df3b">
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
                data-id="5beea56ef91f"
                icon={<CheckIcon data-id="6ff98aa91917" stroke="white" strokeWidth="1.5" />}
                key={businessUnit._id}
                value={businessUnit._id}>
                {businessUnit.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Box>)
  );
};

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
