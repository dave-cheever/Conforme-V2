import React from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Input,
} from '@chakra-ui/react';

import { IField } from '../../interfaces/IField';
import useValidate from '../../hooks/useValidate';
import { TDefinedValidations } from '../../interfaces/TValidations';
import { Controller } from 'react-hook-form';
import { InfoOutlineIcon } from '@chakra-ui/icons';


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
      font?: string
    }
  }
  headings?: IFormFieldHeadings;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};


const DataGrid = ({ name, label, disabled, validations = {}, control, tooltip, help }: IDataGrid) => {

  const validate = useValidate(label || name, validations, definedValidations);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        const rows = Object.entries(value || {});

        const onCellChange = (e, row) => {
          const newValue = {
            ...value,
            [row[0]]: /^-?\d+$/.test(e.target.value) ? parseInt(e.target.value) : e.target.value,
          };
          onChange({ target: { name, value: newValue } });
        }

        const renderRow = (row, index) => {
          return (
            <Grid templateColumns="repeat(10, 1fr)" key={row[0]}>
              <GridItem colSpan={3}>
                <Flex w='full' h='full' align='center'>{row[0]}</Flex>
              </GridItem>
              <GridItem colSpan={7}>
                <Flex mt='10px'>
                  <Input
                    type='text'
                    value={row[1]}
                    onChange={(e) => onCellChange(e, row)}
                    onBlur={onBlur}
                    disabled={disabled}
                    color="form.textInput.font"
                    bg="form.textInput.bg"
                    borderRadius="8px"
                    borderWidth="1px"
                    borderColor={error ? "form.textInput.border.error" : "form.textInput.border.normal"}
                  />
                </Flex>
              </GridItem>
            </Grid>
          );
        };

        return (
          <Box w='full' id={name}>
            {label && (
              <Flex pt={2} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "dropdown.labelFont.error" : "dropdown.labelFont.normal"}
                  fontWeight="bold"
                  fontSize="14px"
                  position="static"
                  left='none'
                  zIndex={1}
                >
                  {label}
                  {help && <Box fontSize="11px" opacity={.5} mt={3}>{help}</Box>}
                </Box>
              </Flex>
            )}
            {rows?.map((row, index) => renderRow(row, index))}
            {error && <Box fontSize="smm" ml={1} mt={1} color='datepicker.error'>{error.message}</Box>}
            {tooltip &&
              <Flex color='dropdown.tooltip' align='center' mt={3}>
                <InfoOutlineIcon />
                <Box fontSize="11px" ml={2}>{tooltip}</Box>
              </Flex>}
          </Box>
        );
      }}
    />
  );
};

export default DataGrid;
