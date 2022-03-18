import React, { useEffect, useState } from "react";
import { Box, Checkbox, CheckboxGroup, Flex, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import { IBusinessUnit } from "../../interfaces/IBusinessUnit";
import { SearchIcon } from "@chakra-ui/icons";
import { CheckIcon, MinusIcon } from "../../icons";
import SectionHeader from "./SectionHeader";

const LocationsForm = () => {
  const { locations, complianceItem, setValue, trigger } = useComplianceItemModalContext();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredLocations, setFilteredLocations] = useState<IBusinessUnit[]>([]);
  const [checkedLocationIds, setCheckedLocationIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedLocationIds(complianceItem?.locationsIds || []);
  }, [locations]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filtered: any = locations.filter((location) =>
      location.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [locations, searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckBoxGroupChange = (value) => {
    setCheckedLocationIds([...value]);
    setValue("locationsIds", value);
    trigger("locationsIds");
  };

  const handleAllCheckBoxSelectedLocations = (event) => {
    let localCheckedLocationsIds: string[] = [];
    if (checkedLocationIds.length !== locations.length) {
      localCheckedLocationsIds = locations.map((location) => location._id!);
    }
    setCheckedLocationIds(localCheckedLocationsIds);
    setValue("locationsIds", localCheckedLocationsIds);
    trigger("locationsIds");
  };

  return (
    <Box w="full">
      <Flex direction="column">
        <SectionHeader label="Select location" />
        <Flex
          flexDir={["column", "row"]}
          justifyContent="space-between"
          mt="25px"
          mb="32px"
        >
          <Flex flexDir="column">
            <Text
              fontFamily="Helvetica"
              fontWeight="bold"
              fontSize="ssm"
              lineHeight="16px"
              color="locationsFormModal.filterTextColor"
              mb="5px"
            >
              Search location by name
            </Text>
            <InputGroup
              w={["full", "190px"]}
              h="42px"
              border="1px solid"
              borderColor="locationsFormModal.inputBorderColor"
              rounded="10px"
            >
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="locationsFormModal.searchIcon" />}
              />
              <Input
                fontSize="smm"
                lineHeight="18px"
                color="locationsFormModal.searchBarText"
                rounded="10px"
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
          </Flex>
        </Flex>
        <Flex mb="33px">
          <Checkbox
            key={"all"}
            value={"all"}
            borderColor="locationsFormModal.checkbox.unchecked.border"
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
                color: checkedLocationIds.length === locations.length ? "#282F36" : "#818197",
              },
            }}
            colorScheme="purpleHeart"
            icon={checkedLocationIds.length === locations.length ? <CheckIcon stroke="white" strokeWidth="1.5" /> : <MinusIcon />}
            isChecked={checkedLocationIds.length > 0}
            onChange={(e: any) => handleAllCheckBoxSelectedLocations(e)}
          >
            Select all
          </Checkbox>
        </Flex>
        <CheckboxGroup
          onChange={(e: any) => handleCheckBoxGroupChange(e)}
          colorScheme="green"
          value={checkedLocationIds || []}
        >
          <VStack alignItems="flex-start">
            {filteredLocations.map((location, index) => (
              <Checkbox
                colorScheme="purpleHeart"
                key={index}
                value={location._id}
                icon={<CheckIcon stroke="white" strokeWidth="1.5" />}
                borderColor="locationsFormModal.checkbox.unchecked.border"
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
                  },
                  ".chakra-checkbox__label": {
                    flexGrow: 1,
                    marginLeft: "10px",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: checkedLocationIds?.includes(location._id!)
                      ? "#282F36"
                      : "#818197",
                  },
                }}
              >
                {location.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Box>
  );
};

export default LocationsForm;

export const locationsFormModalStyles = {
  locationsFormModal: {
    filterTextColor: "#818197",
    searchIcon: "#818197",
    searchBarText: "#818197",
    selectBg: "#FFFFFF",
    selectBorderColor: "rgba(129, 129, 151, 0.4)",
    inputBorderColor: "rgba(129, 129, 151, 0.4)",
    checkbox: {
      unchecked: {
        border: "#CBCCCD",
      },
    },
  },
};
