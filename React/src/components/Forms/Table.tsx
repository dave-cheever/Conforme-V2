import React from 'react';
import { Box, Flex, Input, Stack, useToast } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { PlusIcon, Trashcan } from '../../icons';
import { IFormFieldHeadings } from '../../interfaces/IForm';
import { toastFailed } from '../../bootstrap/config';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface ITable extends IField {
  placeholder?: string;
  variant?: string;
  styles?: {
    textInput?: {
      font?: string
    }
  };
  headings?: IFormFieldHeadings;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) {
      return `${label} can be maximum ${validationValue} characters length`;
    }
  },
  isEmail: (label, validationValue, value) => {
    const regexEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.match(regexEmail)) {
      return "Invalid Email";
    }
  }
};

const Table = ({ control, name, label, headings, placeholder = '', help, tooltip = '', validations = {}, disabled, required, styles }: ITable) => {
  const toast = useToast();
  const validate = useValidate(label || name, validations, definedValidations);

  const addRow = (value, onChange) => {
    if (value[value.length - 1]) {
      const rowIsEmpty = !Object.values(value[value.length - 1]).some((x: any) => x !== '');
      if (rowIsEmpty) {
        toast({
          ...toastFailed,
          description: "Please complete the last row before creating a new one"
        });
        return;
      }
    }
    const newRow = {};
    headings?.cols.forEach(col => newRow[col.name] = '');
    const newValue = [
      ...value,
      newRow
    ];
    onChange({ target: { name, value: newValue } });
  };

  const removeRow = (index, value, onChange) => {
    onChange({ target: { name, value: value.filter((row, i) => i !== index) } });
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box w='full' id={name} mt='none'>
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
            <Stack w='full' mt='10px'>
              {value?.map((row, index) => {
                return (
                  <Flex key={`row-${index}`} justify='space-between' align='center'>
                    <Flex w='full' mr={2}>
                      <Input
                        h="40px"
                        w='full'
                        fontSize="smm"
                        color="form.textInput.font"
                        bg="form.textInput.bg"
                        borderRadius="8px"
                        borderWidth="1px"
                        borderColor={error ? "form.textInput.border.error" : "form.textInput.border.normal"}
                        _active={{ bg: disabled ? "form.textInput.disabled.bg" : "form.textInput.activeBg" }}
                        _focus={{ borderColor: error?.message?.includes(row) ? "form.textInput.border.focus.error" : "form.textInput.border.focus.normal" }}
                        _hover={{ cursor: "auto" }}
                        name={name}
                        value={row}
                        onChange={(e) => {
                          value[index] = /^-?\d+$/.test(e.target.value) ? parseInt(e.target.value) : e.target.value;
                          onChange({ target: { name, value } });
                        }}
                        onBlur={onBlur}
                        disabled={disabled}
                        _disabled={{
                          bg: "form.textInput.disabled.bg",
                          color: "form.textInput.disabled.font",
                          borderColor: "form.textInput.disabled.border",
                          cursor: "not-allowed",
                        }}
                      />
                    </Flex>
                    <Trashcan onClick={() => removeRow(index, value, onChange)} cursor='pointer' />
                  </Flex>
                );
              })}
              {validations?.maxLength && value.length < validations.maxLength && (
                <Box onClick={() => addRow(value, onChange)} pl={2} cursor='pointer'>
                  <PlusIcon /> Add row
                </Box>
              )}
            </Stack>
            {error && <Box fontSize={14} ml={1} color='form.textInput.error'>{error.message}</Box>}
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

export default Table;
