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

const DataGrid = ({
  name,
  label,
  disabled,
  validations = {},
  control,
  tooltip,
  help,
}: IDataGrid) => {
  const validate = useValidate(label || name, validations, definedValidations);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        const rows = Object.entries(value || {});

        const onCellChange = (e, row) => {
          const newValue = {
            ...value,
            [row[0]]: /^-?\d+$/.test(e.target.value)
              ? parseInt(e.target.value, 10)
              : e.target.value,
          };
          onChange({ target: { name, value: newValue } });
        };

        const renderRow = (row, index) => (
          <Grid key={index} templateColumns="repeat(10, 1fr)">
            <GridItem colSpan={3}>
              <Flex align="center" h="full" w="full">
                {row[0]}
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              <Flex mt="10px">
                <Input
                  bg="form.textInput.bg"
                  borderColor={
                    error
                      ? 'form.textInput.border.error'
                      : 'form.textInput.border.normal'
                  }
                  borderRadius="8px"
                  borderWidth="1px"
                  color="form.textInput.font"
                  disabled={disabled}
                  onBlur={onBlur}
                  onChange={(e) => onCellChange(e, row)}
                  type="text"
                  value={row[1]}
                />
              </Flex>
            </GridItem>
          </Grid>
        );

        return (
          <Box id={name} w="full">
            {label && (
              <Flex align="center" justify="space-between" mb="none" pt={2}>
                <Box
                  color={
                    error
                      ? 'dropdown.labelFont.error'
                      : 'dropdown.labelFont.normal'
                  }
                  fontSize="14px"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={1}
                >
                  {label}
                  {help && (
                    <Box fontSize="11px" mt={3} opacity={0.5}>
                      {help}
                    </Box>
                  )}
                </Box>
              </Flex>
            )}
            {rows?.map((row, index) => renderRow(row, index))}
            {error && (
              <Box color="datepicker.error" fontSize="smm" ml={1} mt={1}>
                {error.message}
              </Box>
            )}
            {tooltip && (
              <Flex align="center" color="dropdown.tooltip" mt={3}>
                <InfoOutlineIcon />
                <Box fontSize="11px" ml={2}>
                  {tooltip}
                </Box>
              </Flex>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
};

export default DataGrid;
