import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ITextInput extends IField {
  placeholder?: string;
  variant?: string;
  initialValue?: string;
  styles?: {
    textInput?: {
      font?: string;
    };
  };
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
  uniqueValue: (label, validationValue, value, initialValue) => {
    if (
      validationValue &&
      value &&
      initialValue !== value.toLowerCase() &&
      (validationValue as string[]).includes(value.toLowerCase())
    )
      return `${label} already taken`;
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue)
      return `${label} can be maximum ${validationValue} characters length`;
  },
  isEmail: (label, validationValue, value) => {
    const regexEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.match(regexEmail)) return 'Invalid Email';
  },
};

const TextInput = ({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled,
  required,
  styles,
  initialValue,
}: ITextInput) => {
  const validate = useValidate(
    label || name,
    validations,
    definedValidations,
    initialValue,
  );
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
              <Flex
                align="center"
                justify="space-between"
                mb="none"
                pb={1}
                pt={2}
              >
                <Box
                  color={
                    error
                      ? 'textInput.labelFont.error'
                      : styles
                      ? styles?.textInput?.font
                      : 'textInput.labelFont.normal'
                  }
                  fontSize="11px"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}
                >
                  {label}
                  {required && (
                    <Asterisk
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px"
                    />
                  )}{' '}
                  {tooltip && (
                    <Tooltip hasArrow label={tooltip} placement="top">
                      <Icon h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <Input
              _active={{
                bg: disabled ? 'textInput.disabled.bg' : 'textInput.activeBg',
              }}
              _disabled={{
                bg: 'textInput.disabled.bg',
                color: 'textInput.disabled.font',
                borderColor: 'textInput.disabled.border',
                cursor: 'not-allowed',
              }}
              _focus={{
                borderColor: error
                  ? 'textInput.border.focus.error'
                  : 'textInput.border.focus.normal',
              }}
              _hover={{ cursor: 'auto' }}
              _placeholder={{ fontSize: 'smm', color: 'textInput.placeholder' }}
              bg="textInput.bg"
              borderColor={
                error ? 'textInput.border.error' : 'textInput.border.normal'
              }
              borderRadius="8px"
              borderWidth="1px"
              color="textInput.font"
              cursor="pointer"
              defaultValue={value}
              fontSize="smm"
              h="40px"
              isDisabled={disabled}
              maxLength={
                validations && validations.forceMaxLength
                  ? (validations.maxLength as number)
                  : undefined
              }
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={placeholder}
            />
            {error && (
              <Box color="textInput.error" fontSize={14} ml={1}>
                {error.message}
              </Box>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
};

export default TextInput;

export const textInputStyles = {
  textInput: {
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
