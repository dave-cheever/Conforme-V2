import React from 'react';
import { Controller } from 'react-hook-form';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Input, Stack, Text, useToast } from '@chakra-ui/react';

import { toastFailed } from '../../bootstrap/config';
import useValidate from '../../hooks/useValidate';
import { PlusIcon, Trashcan } from '../../icons';
import { IField } from '../../interfaces/IField';
import { IFormFieldHeadings } from '../../interfaces/IForm';
import { TDefinedValidations } from '../../interfaces/TValidations';
import { emailRegExp } from '../../utils/regular-expressions';

interface ITable extends IField {
  placeholder?: string;
  variant?: string;
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
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
  isEmail: (label, validationValue, value) => {
    if (!value.match(emailRegExp)) return 'Invalid Email';
  },
};

const Table = ({ control, name, label, help, tooltip = '', validations = {}, disabled }: ITable) => {
  const toast = useToast();
  const validate = useValidate(label || name, validations, definedValidations);

  const addRow = (value, onChange) => {
    // TODO: Update the table to new settings approach
    // if (value[value.length - 1]) {
    //   const rowIsEmpty = !Object.values(value[value.length - 1]).some((x: any) => x !== '');
    //   if (rowIsEmpty) {
    //     toast({
    //       ...toastFailed,
    //       description: 'Please complete the last row before creating a new one',
    //     });
    //     return;
    //   }
    // }
    // const newRow = {};
    // headings?.cols.forEach((col) => {
    //   newRow[col.name] = '';
    // });
    // const newValue = [...value, newRow];
    if (value.some((v) => v === '')) {
      toast({
        ...toastFailed,
        description: 'Please complete all rows before creating a new one.',
      });
      return;
    }
    onChange({ target: { name, value: [...value, ''] } });
  };

  const removeRow = (index, value, onChange) => {
    onChange({
      target: { name, value: value.filter((row, i) => i !== index) },
    });
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box id={name} mt="none" w="full">
            {label && (
              <Flex align="center" justify="space-between" mb="none" pt={2}>
                <Box
                  color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
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
            <Stack mt="10px" w="full">
              {value?.map((row, index) => (
                <Flex align="center" justify="space-between" key={`row-${index}`}>
                  <Flex mr={2} w="full">
                    <Input
                      _active={{
                        bg: disabled ? 'form.textInput.disabled.bg' : 'form.textInput.activeBg',
                      }}
                      _disabled={{
                        bg: 'form.textInput.disabled.bg',
                        color: 'form.textInput.disabled.font',
                        borderColor: 'form.textInput.disabled.border',
                        cursor: 'not-allowed',
                      }}
                      _focus={{
                        borderColor: error?.message?.includes(row)
                          ? 'form.textInput.border.focus.error'
                          : 'form.textInput.border.focus.normal',
                      }}
                      _hover={{ cursor: 'auto' }}
                      bg="form.textInput.bg"
                      borderColor={error ? 'form.textInput.border.error' : 'form.textInput.border.normal'}
                      borderRadius="8px"
                      borderWidth="1px"
                      color="form.textInput.font"
                      disabled={disabled}
                      fontSize="smm"
                      h="40px"
                      name={name}
                      onBlur={onBlur}
                      onChange={(e) => {
                        value[index] = /^-?\d+$/.test(e.target.value) ? parseInt(e.target.value, 10) : e.target.value;
                        onChange({ target: { name, value } });
                      }}
                      value={row}
                      w="full"
                    />
                  </Flex>
                  <Trashcan cursor="pointer" onClick={() => removeRow(index, value, onChange)} stroke="form.textInput.font" />
                </Flex>
              ))}
              {(validations.maxLength ? value.length < validations.maxLength : true) && (
                <Stack align="center" cursor="pointer" direction="row" onClick={() => addRow(value, onChange)} pl={2} spacing={2}>
                  <PlusIcon stroke="form.textInput.font" />
                  <Text color="form.textInput.font">Add row</Text>
                </Stack>
              )}
            </Stack>
            {error && (
              <Box color="form.textInput.error" fontSize={14} ml={1}>
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

export default Table;
