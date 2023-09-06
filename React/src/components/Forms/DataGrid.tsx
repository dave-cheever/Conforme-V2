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
    (<Controller
          control={control}
          data-id="d8f077716209"
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
              <Grid data-id="1c28610f8e96" key={index} templateColumns="repeat(10, 1fr)">
                <GridItem colSpan={3} data-id="da5602f7f140">
                  <Flex align="center" data-id="36d3561e35fa" h="full" w="full">
                    {row[0]}
                  </Flex>
                </GridItem>
                <GridItem colSpan={7} data-id="927c32ac73a8">
                  <Flex data-id="46d68032a288" mt="10px">
                    <Input
                      bg="form.textInput.bg"
                      borderColor={error ? 'form.textInput.border.error' : 'form.textInput.border.normal'}
                      borderRadius="8px"
                      borderWidth="1px"
                      color="form.textInput.font"
                      data-id="16bad1cfc3c4"
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
              (<Box data-id="9068527905f8" id={name} w="full">
                {label && (
                  <Flex
                    align="center"
                    data-id="d8ba566829b5"
                    justify="space-between"
                    mb="none"
                    pt={2}>
                    <Box
                      color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
                      data-id="102f33c16bf4"
                      fontSize="14px"
                      fontWeight="bold"
                      left="none"
                      position="static"
                      zIndex={1}>
                      {label}
                      {help && (
                        <Box data-id="282d5df71a7f" fontSize="11px" mt={3} opacity={0.5}>
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
                    data-id="6b49c70d818a"
                    fontSize="smm"
                    ml={1}
                    mt={1}>
                    {error.message}
                  </Box>
                )}
                {tooltip && (
                  <Flex align="center" color="dropdown.tooltip" data-id="0d0d2629492e" mt={3}>
                    <InfoOutlineIcon data-id="aab130620ce2" />
                    <Box data-id="0e12a56a55dd" fontSize="11px" ml={2}>
                      {tooltip}
                    </Box>
                  </Flex>
                )}
              </Box>)
            );
          }}
          rules={{ validate }} />)
  );
}

export default DataGrid;
