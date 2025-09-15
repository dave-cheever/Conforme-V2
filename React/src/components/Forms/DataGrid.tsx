import React from 'react';
import { Controller } from 'react-hook-form';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, GridItem, Input } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface IFormFieldHeadingOption {
  label: string;
  name: string;
  type: 'text' | 'number' | 'dropdown';
  options: string[];
}

interface IFormFieldHeadings {
  colsLabel?: string;
  cols: IFormFieldHeadingOption[];
  rowsLabel?: string;
  rows?: {
    name: string;
    label: string;
  }[];
}

interface IDataGrid extends IField {
  placeholder?: string;
  styles?: {
    textInput?: {
      font?: string;
    };
  };
  headings?: IFormFieldHeadings;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

function DataGrid({ name, label, disabled, validations = {}, control, tooltip, help }: IDataGrid) {
  const validate = useValidate(label || name, validations, definedValidations);

  return (
    <Controller
            control={control}
            data-id="030925-5a1472"
            name={name}
            render={({ field, fieldState }) => {
              const { onChange, onBlur, value } = field;
              const { error } = fieldState;
              const rows = Object.entries(value || {});

              const onCellChange = (e, row) => {
                const newValue = {
                  ...value,
                  [row[0]]: /^-?\d+$/.test(e.target.value) ? parseInt(e.target.value, 10) : e.target.value,
                };
                onChange({ target: { name, value: newValue } });
              };

              const renderRow = (row, index) => (
                <Grid data-id="030925-958959" key={index} templateColumns="repeat(10, 1fr)">
                  <GridItem colSpan={3} data-id="030925-826e16">
                    <Flex align="center" data-id="030925-92fc8c" h="full" w="full">
                      {row[0]}
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={7} data-id="030925-e0236f">
                    <Flex data-id="030925-ba0344" mt="10px">
                      <Input
                        bg="form.textInput.bg"
                        borderColor={error ? 'form.textInput.border.error' : 'form.textInput.border.normal'}
                        borderRadius="8px"
                        borderWidth="1px"
                        color="form.textInput.font"
                        data-id="030925-37a03b"
                        disabled={disabled}
                        onBlur={onBlur}
                        onChange={(e) => onCellChange(e, row)}
                        type="text"
                        value={row[1]} />
                    </Flex>
                  </GridItem>
                </Grid>
              );

              return (
                <Box data-id="030925-f18a41" id={name} w="full">
                  {label && (
                    <Flex
                      align="center"
                      data-id="030925-70ebfb"
                      justify="space-between"
                      mb="none"
                      pt={2}>
                      <Box
                        color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
                        data-id="030925-0290a6"
                        fontSize="14px"
                        fontWeight="bold"
                        left="none"
                        position="static"
                        zIndex={1}>
                        {label}
                        {help && (
                          <Box data-id="030925-8a8ffa" fontSize="11px" mt={3} opacity={0.5}>
                            {help}
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  )}
                  {rows?.map((row, index) => renderRow(row, index))}
                  {error && (
                    <Box
                      color="datepicker.error"
                      data-id="030925-38549b"
                      fontSize="smm"
                      ml={1}
                      mt={1}>
                      {error.message}
                    </Box>
                  )}
                  {tooltip && (
                    <Flex align="center" color="dropdown.tooltip" data-id="030925-3918e6" mt={3}>
                      <InfoOutlineIcon data-id="030925-375fbc" />
                      <Box data-id="030925-dc5fbf" fontSize="11px" ml={2}>
                        {tooltip}
                      </Box>
                    </Flex>
                  )}
                </Box>
              );
            }}
            rules={{ validate }} />
  );
}

export default DataGrid;
