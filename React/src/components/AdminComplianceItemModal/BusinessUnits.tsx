import React, { useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { t } from 'i18next';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { CheckIcon, MinusIcon } from '../../icons';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import SectionHeader from './SectionHeader';

const BusinessUnitsForm = () => {
  const { businessUnits, complianceItem, setValue, trigger } =
    useComplianceItemModalContext();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredBU, setFilteredBU] = useState<IBusinessUnit[]>([]);
  const [checkedBUIds, setCheckedBUIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedBUIds(complianceItem?.businessUnitsIds || []);
  }, [businessUnits]);

  const handleChange = (value) => {
    setCheckedBUIds([...value]);
    setValue('businessUnitsIds', value);
    trigger('businessUnitsIds');
  };

  useEffect(() => {
    const filtered: any = businessUnits.filter((businessUnit) =>
      businessUnit.name?.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredBU(filtered);
  }, [businessUnits, searchText]);

  const handleAllCheckBoxSelectedBU = () => {
    let localCheckedBUIds: string[] = [];
    if (checkedBUIds.length !== businessUnits.length)
      localCheckedBUIds = businessUnits.map((BU) => BU._id!);

    setCheckedBUIds(localCheckedBUIds);
    setValue('businessUnitsIds', localCheckedBUIds);
    trigger('businessUnitsIds');
  };

  return (
    <Box w="full">
      <Flex direction="column">
        <SectionHeader label={`Select ${t('businessUnit')}(s)`} />

        <Flex
          flexDir={['column', 'row']}
          justifyContent="space-between"
          mb="30px"
          w={['full', "calc(100% - 80px)"]}
        >
          <Flex flexDir="column" pt="3" w="full">
            <Flex align="center" justify="space-between">
              <Text
                color="locationsFormModal.filterTextColor"
                fontFamily="Helvetica"
                fontSize="ssm"
                fontWeight="bold"
                left="none"
                lineHeight="16px"
                mb="5px"
                zIndex={1}
              >
                Search by {t('businessUnit')} name
              </Text>
            </Flex>
            <InputGroup
              border="1px solid"
              borderColor="rgba(129, 129, 151, 0.4)"
              h="42px"
              rounded="10px"
            >
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="businessUnitsModal.searchIcon" />
              </InputLeftElement>
              <Input
                fontSize="14px"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                rounded="10px"
              />
            </InputGroup>
          </Flex>
        </Flex>

        <Flex mb="30px">
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
                color:
                  checkedBUIds.length === businessUnits.length
                    ? '#282F36'
                    : '#818197',
              },
            }}
            icon={
              checkedBUIds.length === businessUnits.length ? (
                <CheckIcon stroke="white" strokeWidth="1.5" />
              ) : (
                <MinusIcon />
              )
            }
            isChecked={checkedBUIds.length > 0}
            key="all"
            onChange={() => handleAllCheckBoxSelectedBU()}
            value="all"
          >
            Select all
          </Checkbox>
        </Flex>

        <CheckboxGroup
          colorScheme="green"
          onChange={(e: any) => handleChange(e)}
          value={complianceItem.businessUnitsIds || []}
        >
          <VStack alignItems="flex-start">
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
                    color: complianceItem?.businessUnitsIds?.includes(
                      businessUnit._id,
                    )
                      ? '#282F36'
                      : '#818197',
                  },
                }}
                icon={<CheckIcon stroke="white" strokeWidth="1.5" />}
                key={businessUnit._id}
                value={businessUnit._id}
              >
                {businessUnit.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Box>
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
