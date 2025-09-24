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
            data-id="000218"
            control={control}
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
                <Grid data-id="000219" key={index} templateColumns="repeat(10, 1fr)">
                  <GridItem data-id="000220" colSpan={3}>
                    <Flex data-id="000221" align="center" h="full" w="full">
                      {row[0]}
                    </Flex>
                  </GridItem>
                  <GridItem data-id="000222" colSpan={7}>
                    <Flex data-id="000223" mt="10px">
                      <Input
                        data-id="000224"
                        bg="form.textInput.bg"
                        borderColor={error ? 'form.textInput.border.error' : 'form.textInput.border.normal'}
                        borderRadius="8px"
                        borderWidth="1px"
                        color="form.textInput.font"
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
                <Box data-id="000225" id={name} w="full">
                  {label && (
                    <Flex
                      data-id="000226"
                      align="center"
                      justify="space-between"
                      mb="none"
                      pt={2}>
                      <Box
                        data-id="000227"
                        color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
                        fontSize="14px"
                        fontWeight="bold"
                        left="none"
                        position="static"
                        zIndex={1}>
                        {label}
                        {help && (
                          <Box data-id="000228" fontSize="11px" mt={3} opacity={0.5}>
                            {help}
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  )}
                  {rows?.map((row, index) => renderRow(row, index))}
                  {error && (
                    <Box
                      data-id="000229"
                      color="datepicker.error"
                      fontSize="smm"
                      ml={1}
                      mt={1}>
                      {error.message}
                    </Box>
                  )}
                  {tooltip && (
                    <Flex data-id="000230" align="center" color="dropdown.tooltip" mt={3}>
                      <InfoOutlineIcon data-id="000231" />
                      <Box data-id="000232" fontSize="11px" ml={2}>
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
