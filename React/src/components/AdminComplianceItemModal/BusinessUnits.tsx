import React, { useEffect, useState } from 'react';
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Select, VStack } from "@chakra-ui/react";

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { SearchIcon } from '@chakra-ui/icons';
import SectionHeader from './SectionHeader';

const BusinessUnitsForm = () => {
  const {
    businessUnits,
    complianceItem,
    setValue, trigger,
  } = useComplianceItemModalContext();

  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredBU, setFilteredBU] = useState<IBusinessUnit[]>([]);

  const handleChange = (value) => {
    setValue('businessUnitsIds', value);
    trigger('businessUnitsIds');
  };
  
  useEffect(() => {
    const tempLocations: string[] = []
    businessUnits.forEach(businessUnit => {
      if(businessUnit.region && !tempLocations.includes(businessUnit.region)) {
        tempLocations.push(businessUnit.region)
      } 
    })
    setLocations(tempLocations);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnits]);

  useEffect(() => {
    const filtered: any = businessUnits.filter(businessUnit => 
      selectedLocation 
        ? businessUnit.region === selectedLocation && businessUnit.name?.toLowerCase().includes(searchText.toLowerCase()) 
        : businessUnit.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBU(filtered);
  }, [businessUnits, searchText, selectedLocation]);

  return (
    <Box w='full'>
      <Flex direction='column'>
        <SectionHeader label="Select business unit(s)" display={["none","flex"]}/>
        
        <Flex flexDir={["column", "row"]} justifyContent="space-between" mt={["0px","10px"]} mb="30px">
          <Flex flexDir="column" >
          <Flex pt={2} align='center' justify="space-between" mb='none'>
            <Box
              color={"dropdown.labelFont.secondaryVariant"}
              fontWeight="bold"
              fontSize="11px"
              position="static"
              left='none'
              zIndex={1}
            >
              Select business unit(s)
            </Box>
          </Flex>
          <Select 
            w={["full", "190px"]} 
            h="42px"
            mb={["15px","0"]}
            bg="businessUnitsModal.selectBg" 
            border="1px solid" 
            borderColor="rgba(129, 129, 151, 0.4)" 
            placeholder="Location" 
            onChange={(e)=> setSelectedLocation(e.target.value)}
          >
            {locations.map(location => <option key={location} value={location}>{location}</option>)}
          </Select>
          </Flex>
          <Flex flexDir="column">
          <Flex pt={2} align='center' justify="space-between" mb='none'>
            <Box
              color={"dropdown.labelFont.secondaryVariant"}
              fontWeight="bold"
              fontSize="11px"
              position="static"
              left='none'
              zIndex={1}
            >
              Search by business unit name
            </Box>
          </Flex>
          <InputGroup w={["full", "190px"]} h="42px" border="1px solid" borderColor="rgba(129, 129, 151, 0.4)" rounded="5px">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="businessUnitsModal.searchIcon" />}
            />
            <Input fontSize="14px" placeholder="Search business unit" onChange={e => setSearchText(e.target.value)} />
          </InputGroup>
          </Flex>
        </Flex>

        <CheckboxGroup onChange={(e: any) => handleChange(e)} colorScheme="green" value={complianceItem.businessUnitsIds || []}>
          <VStack alignItems="flex-start">
            {filteredBU.map(businessUnit =>
              <Checkbox 
                key={businessUnit._id}
                value={businessUnit._id}
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
                    marginLeft: '1rem',
                    fontWeight: 400,
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
