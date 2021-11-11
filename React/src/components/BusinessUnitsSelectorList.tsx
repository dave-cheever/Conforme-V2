import React from "react";
import {
  CheckboxGroup,
  Stack,
  Checkbox,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { IBusinessUnit } from "../interfaces/IBusinessUnit";

interface IBusinessUnitsSelectorList {
  filteredBusinessUnits: IBusinessUnit[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({ filteredBusinessUnits, selected, disabled, handleChange }: IBusinessUnitsSelectorList) => {
  return (
    <CheckboxGroup
      value={selected}
      onChange={value => handleChange({ target: { name: 'businessUnitsIds', value } })}
    >
      <Stack w='full' direction="column">
        {filteredBusinessUnits.map(({ name, _id, imgUrl }) =>
          <Checkbox
            key={_id}
            value={_id}
            cursor={disabled ? 'not-allowed' : 'default'}
            css={{
              ".chakra-checkbox__control": {
                borderRadius: "50%",
                borderWidth: '2px',
                width: "21px",
                height: "21px",
              },
              ".chakra-checkbox__label": {
                flexGrow: 1,
                marginLeft: '1rem',
              },
            }}
            borderColor="businessUnitsSelector.list.checkbox.border"
            colorScheme="businessUnitsSelector.list.checkbox"
          >
            <Flex h='60px' w='full' opacity={disabled ? '0.4' : '1'}>
              <Image w='60px' h='60px' roundedLeft="md" src={imgUrl} objectFit='cover' />
              <Flex
                h='60px'
                px={4}
                grow={1}
                align='center'
                roundedRight='md'
                bg={disabled || selected.includes(_id) ? 'businessUnitsSelector.list.bg.selected' : 'businessUnitsSelector.list.bg.normal'}
              >
                <Text
                  wordBreak='break-all'
                  fontSize='13px'
                  color={disabled || selected.includes(_id) ? 'businessUnitsSelector.list.font.selected' : 'businessUnitsSelector.list.font.normal'}
                  noOfLines={2}
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {name}
                </Text>
              </Flex>
            </Flex>
          </Checkbox>)}
      </Stack>
    </CheckboxGroup>
  );
};

export default BusinessUnitsSelectorList;
