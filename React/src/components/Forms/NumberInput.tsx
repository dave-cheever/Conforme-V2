import React from 'react';
import { Box, Flex, Input } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Controller } from 'react-hook-form';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface INumberInput extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const NumberInput = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false, help }: INumberInput) => {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field, fieldState, formState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box w='full' id={name} mt='none'>
            {label && (
              <Flex pt={2} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "numberInput.labelFont.error" : variant === "secondaryVariant" ? "numberInput.labelFont.secondaryVariant" :"numberInput.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={ variant === "secondaryVariant" ? "11px" : "14px" }
                  position="static"
                  left='none'
                  zIndex={1}
                >
                  {label}
                  {help && <Box fontSize="11px" opacity={.5} mt={3}>{help}</Box>}
                </Box>
              </Flex>
            )}
            <Input
              mt="3"
              borderRadius="8px"
              borderWidth="1px"
              pt='none'
              h="42px"
              type="number"
              color="numberInput.font"
              bg="numberInput.bg"
              name={name}
              defaultValue={value}
              borderColor={error ? "numberInput.border.error" : "numberInput.border.normal"}
              _active={{ bg: disabled ? "numberInput.disabled.bg" : "numberInput.activeBg" }}
              _focus={{ borderColor: error ? "numberInput.border.focus.error" : "numberInput.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "numberInput.disabled.bg",
                color: "numberInput.disabled.font",
                borderColor: "numberInput.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={variant === 'secondaryVariant' ? '' : placeholder}
              _placeholder={{ color: 'numberInput.placeholder' }}
            />
            {error && <Box fontSize={14} ml={1} color='numberInput.error'>{error.message}</Box>}
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

export const numberInputStyles = {
  numberInput: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      secondaryVariant: "#818197",
      normal: '#282F36',
      error: '#E53E3E',
    },
    border: {
      normal: '#CBCCCD',
      error: '#E53E3E',
      focus: {
        normal: '#777777',
        error: '#E53E3E',
      },
    },
    activeBg: '#EEEEEE',
    disabled: {
      font: '#2B3236',
      border: '#EEEEEE',
      bg: '#f7f7f7',
    },
    placeholder: '#CBCCCD',
    error: '#E53E3E',
    tooltip: "#9A9EA1",
    icon: '#818197'
  },
};

export default NumberInput;
