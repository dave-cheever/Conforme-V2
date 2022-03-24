import React from 'react';
import { Box, Flex, Icon, Textarea as ChakraTextarea, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';
import { Asterisk } from '../../icons';

interface ITextarea extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: TDefinedValidations = {
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
};

const Textarea = ({ control, name, label, placeholder = '', tooltip = '', variant, required, validations = {}, disabled = false }: ITextarea) => {
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
              <Flex pt={2} pb={1} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "textMultilineInput.labelFont.error" : "textMultilineInput.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={11}
                  position="static"
                  left='none'
                  zIndex={2}
                >
                  {label}
                  {required && <Asterisk ml="5px" mb="8px" fill="questionListElement.iconAsterisk" stroke='textMultilineConfirmInput.iconAsterisk' />}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                </Box>
              </Flex>
            )}
            <ChakraTextarea
              borderRadius="8px"
              borderWidth="1px"
              pt='5px'
              rows={4}
              type="text"
              fontSize="smm"
              color="textMultilineInput.font"
              bg="textMultilineInput.bg"
              name={name}
              defaultValue={value}
              borderColor={error ? "textMultilineInput.border.error" : "textMultilineInput.border.normal"}
              _active={{ bg: disabled ? "textMultilineInput.disabled.bg" : "textMultilineInput.activeBg" }}
              _focus={{ borderColor: error ? "textMultilineInput.border.focus.error" : "textMultilineInput.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "textMultilineInput.disabled.bg",
                color: "textMultilineInput.disabled.font",
                borderColor: "textMultilineInput.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={placeholder}
              _placeholder={{ fontSize: "smm", color: 'textMultilineInput.placeholder' }}
            />
            {error && <Box fontSize={14} ml={1} color='textMultilineInput.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default Textarea;

export const textMultilineInputStyles = {
  textMultilineInput: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      normal: '#2B3236',
      error: '#E53E3E',
    },
    iconAsterisk: '#E93C44',
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
  },
};
