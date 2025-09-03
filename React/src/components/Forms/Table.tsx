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

function Table({ control, name, label, help, tooltip = '', validations = {}, disabled }: ITable) {
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
            data-id="030925-8bec6e"
            control={control}
            name={name}
            render={({ field, fieldState }) => {
              const { onChange, onBlur, value } = field;
              const { error } = fieldState;
              return (
                <Box data-id="030925-9ff2cf" id={name} mt="none" w="full">
                  {label && (
                    <Flex
                      data-id="030925-e5d64d"
                      align="center"
                      justify="space-between"
                      mb="none"
                      pt={2}>
                      <Box
                        data-id="030925-2ea94b"
                        color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
                        fontSize="14px"
                        fontWeight="bold"
                        left="none"
                        position="static"
                        zIndex={1}>
                        {label}
                        {help && (
                          <Box data-id="030925-721ac0" fontSize="11px" mt={3} opacity={0.5}>
                            {help}
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  )}
                  <Stack data-id="030925-51e95b" mt="10px" w="full">
                    {value?.map((row, index) => (
                      <Flex
                        data-id="030925-5d03a7"
                        align="center"
                        justify="space-between"
                        key={`row-${index}`}>
                        <Flex data-id="030925-785a05" mr={2} w="full">
                          <Input
                            data-id="030925-01f1f4"
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
                            w="full" />
                        </Flex>
                        <Trashcan
                          data-id="030925-fb6a7b"
                          cursor="pointer"
                          onClick={() => removeRow(index, value, onChange)}
                          stroke="form.textInput.font" />
                      </Flex>
                    ))}
                    {(validations.maxLength ? value.length < validations.maxLength : true) && (
                      <Stack
                        data-id="030925-8d67ca"
                        align="center"
                        cursor="pointer"
                        direction="row"
                        onClick={() => addRow(value, onChange)}
                        pl={2}
                        spacing={2}>
                        <PlusIcon data-id="030925-dd1d47" stroke="form.textInput.font" />
                        <Text data-id="030925-77d5ac" color="form.textInput.font">Add row</Text>
                      </Stack>
                    )}
                  </Stack>
                  {error && (
                    <Box data-id="030925-cd6271" color="form.textInput.error" fontSize={14} ml={1}>
                      {error.message}
                    </Box>
                  )}
                  {tooltip && (
                    <Flex data-id="030925-7359a5" align="center" color="dropdown.tooltip" mt={3}>
                      <InfoOutlineIcon data-id="030925-277fab" />
                      <Box data-id="030925-b7b492" fontSize="11px" ml={2}>
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

export default Table;
