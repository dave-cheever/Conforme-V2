import React, { useEffect, useState } from 'react';
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { SearchIcon } from '@chakra-ui/icons';
import SectionHeader from './SectionHeader';
import { CheckIcon, MinusIcon } from '../../icons';

const BusinessUnitsForm = () => {
  const {
    businessUnits,
    complianceItem,
    setValue, trigger,
  } = useComplianceItemModalContext();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredBU, setFilteredBU] = useState<IBusinessUnit[]>([]);
  const [checkedBUIds, setCheckedBUIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedBUIds(complianceItem?.businessUnitsIds || []);
  }, [businessUnits]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (value) => {
    setCheckedBUIds([...value])
    setValue('businessUnitsIds', value);
    trigger('businessUnitsIds');
  };

  useEffect(() => {
    const filtered: any = businessUnits.filter(businessUnit => businessUnit.name?.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredBU(filtered);
  }, [businessUnits, searchText]);

  const handleAllCheckBoxSelectedBU = (event) => {
    let localCheckedBUIds: string[] = [];
    if (checkedBUIds.length !== businessUnits.length) {
      localCheckedBUIds = businessUnits.map((BU) => BU._id!);
    }
    setCheckedBUIds(localCheckedBUIds);
    setValue("businessUnitsIds", localCheckedBUIds);
    trigger("businessUnitsIds");
  }

  return (
    <Box w='full'>
      <Flex direction='column'>
        <SectionHeader label="Select business unit(s)" />

        <Flex flexDir={["column", "row"]} justifyContent="space-between" mt="25px" mb="32px">
          <Flex flexDir="column">
            <Flex align='center' justify="space-between">
              <Text
                fontFamily="Helvetica"
                color="dropdown.labelFont.secondaryVariant"
                lineHeight="16px"
                fontWeight="bold"
                fontSize="ssm"
                left='none'
                zIndex={1}
                mb='5px'
              >
                Search by business unit name
              </Text>
            </Flex>
            <InputGroup w={["full", "190px"]} h="42px" border="1px solid" borderColor="rgba(129, 129, 151, 0.4)" rounded="10px">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="businessUnitsModal.searchIcon" />}
              />
              <Input fontSize="14px" rounded="10px" placeholder="Search business unit" onChange={e => setSearchText(e.target.value)} />
            </InputGroup>
          </Flex>
        </Flex>

        <Flex mb="33px">
          <Checkbox
            key={"all"}
            value={"all"}
            borderColor="businessUnitsModal.checkbox.unchecked.border"
            css={{
              ".chakra-checkbox__control": {
                borderRadius: "20%",
                borderWidth: "1px",
                width: "21px",
                height: "21px",
                background: "#FFFFFF",
                "&[data-checked]": {
                  background: "#462AC4",
                  borderColor: "#462AC4",
                },
                "&[data-indeterminate]": {
                  background: "#462AC4",
                  borderColor: "#462AC4",
                },
              },
              ".chakra-checkbox__label": {
                flexGrow: 1,
                marginLeft: "10px",
                fontWeight: 400,
                fontSize: "14px",
                color: checkedBUIds.length === businessUnits.length ? "#282F36" : "#818197",
              },
            }}
            colorScheme="purpleHeart"
            icon={checkedBUIds.length === businessUnits.length ? <CheckIcon stroke="white" strokeWidth="1.5" /> : <MinusIcon />}
            isChecked={checkedBUIds.length > 0}
            onChange={(e: any) => handleAllCheckBoxSelectedBU(e)}
          >
            Select all
          </Checkbox>
        </Flex>

        <CheckboxGroup onChange={(e: any) => handleChange(e)} colorScheme="green" value={complianceItem.businessUnitsIds || []}>
          <VStack alignItems="flex-start">
            {filteredBU.map(businessUnit =>
              <Checkbox
                key={businessUnit._id}
                value={businessUnit._id}
                icon={<CheckIcon stroke="white" strokeWidth="1.5" />}
                borderColor="businessUnitsModal.checkbox.unchecked.border"
                css={{
                  ".chakra-checkbox__control": {
                    borderRadius: "20%",
                    borderWidth: '1px',
                    width: "21px",
                    height: "21px",
                    background: "#FFFFFF",
                    "&[data-checked]": {
                      background: "#462AC4",
                      borderColor: "#462AC4",
                    }
                  },
                  ".chakra-checkbox__label": {
                    flexGrow: 1,
                    marginLeft: '10px',
                    fontWeight: 400,
                    fontSize: "14px",
                    color: complianceItem?.businessUnitsIds?.includes(businessUnit._id) ? "#282F36" : "#818197"
                  },
                }}
              >
                {businessUnit.name}
              </Checkbox>)}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Box>
  );
};

export default BusinessUnitsForm;

export const businessUnitsModalStyles = {
  businessUnitsModal: {
    searchIcon: "#818197",
    selectBg: "#ffffff",
    checkbox: {
      unchecked: {
        border: "#CBCCCD"
      }
    }
  }
};
