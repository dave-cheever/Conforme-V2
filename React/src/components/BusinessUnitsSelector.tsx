import { useEffect, useState } from 'react';

import { Box, Input, InputGroup, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { useAppContext } from '../contexts/AppProvider';
import { Magnifier } from '../icons';
import { IBusinessUnit } from '../interfaces/IBusinessUnit';
import BusinessUnitsSelectorList from './BusinessUnitsSelectorList';

interface IBusinessUnitsSelector {
  businessUnits: IBusinessUnit[];
  selected: string[];
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelector = ({ businessUnits, selected, note, disabled, handleChange }: IBusinessUnitsSelector) => {
  const { module } = useAppContext();
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState<IBusinessUnit[]>([]);

  const [selectedType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    let filteredBusinessUnits: IBusinessUnit[] = businessUnits || [];
    if (searchText !== '') filteredBusinessUnits = filteredBusinessUnits?.filter(({ name }) => name.includes(searchText));
    if (disabled) filteredBusinessUnits = filteredBusinessUnits?.filter(({ _id }) => selected.includes(_id));

    setFilteredBusinessUnits(filteredBusinessUnits);
  }, [businessUnits, selectedType, searchText, disabled, selected]);

  if (disabled) {
    return (
      <BusinessUnitsSelectorList
        disabled={disabled}
        filteredBusinessUnits={filteredBusinessUnits}
        handleChange={handleChange}
        selected={selected}
      />
    );
  }

  return (
    <Stack w="full">
      <Stack overflow="auto" pb={3} w="full">
        <Box mt="-12px" w="full">
          {/* <Dropdown
            name='type'
            label='Select type'
            value={selectedType}
            options={[
              { value: "", label: "Show all" },
              { value: "Hospital", label: "Show hospitals only" },
              { value: "Corporate", label: "Show corporate only" }
            ]}
            onChange={({ target: { value } }) => setSelectedType(value)}
            style={{ width: 'full' }}
          /> */}
        </Box>
        <>
          <Box py="5px">
            <InputGroup>
              <Input
                borderColor="filterPanel.searchBoxBordercolor"
                borderWidth="1px"
                color="brand.darkGrey"
                fontSize="14px"
                h="40px"
                onChange={({ target: { value } }) => setSearchText(value)}
                pl={8}
                placeholder={module?.type === 'tracker' ? `Search ${pluralize(t('business unit'))}` : 'Search areas'}
                value={searchText}
                w="full"
              />
              <Magnifier bottom="13px" h="12px" left="14px" position="absolute" w="12x" />
            </InputGroup>
          </Box>
          {note && (
            <Text color="businessUnitsSelector.note" fontSize="12px" fontStyle="italic" opacity="0.3">
              {note}
            </Text>
          )}
          <BusinessUnitsSelectorList
            disabled={disabled}
            filteredBusinessUnits={filteredBusinessUnits}
            handleChange={handleChange}
            selected={selected}
          />
        </>
      </Stack>
    </Stack>
  );
};

export default BusinessUnitsSelector;

export const businessUnitsSelectorStyles = {
  businessUnitsSelector: {
    label: '#777777',
    border: {
      normal: '#CBCCCD',
      focus: '#777777',
    },
    note: '#424B50',
    checkbox: {
      border: '#CBCCCD',
      500: '#462AC4',
    },
    list: {
      checkbox: {
        border: '#CBCCCD',
        500: '#462AC4',
      },
      font: {
        normal: '#777777',
        selected: '#FFFFFF',
      },
    },
  },
};
