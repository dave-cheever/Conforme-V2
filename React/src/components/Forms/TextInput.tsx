import React from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { Asterisk } from '../../icons';

interface ITextInput extends IField {
  placeholder?: string;
  variant?: string;
  initialValue?: string;
  styles?: {
    textInput?: {
      font?: string
    }
  };
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
  uniqueValue: (label, validationValue, value, initialValue) => {
    if (validationValue && value && initialValue !== value.toLowerCase() && (validationValue as string[]).includes(value.toLowerCase())) {
      return `${label} already taken`;
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


const TextInput = ({ control, name, label, placeholder = '', tooltip = '', validations = {}, disabled, required, styles, initialValue }: ITextInput) => {
  const validate = useValidate(label || name, validations, definedValidations, initialValue);
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
              <Flex pt={2} pb={1} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "form.textInput.labelFont.error" : styles ? styles?.textInput?.font : "form.textInput.labelFont.normal"}
                  fontWeight="bold"
                  fontSize="11px"
                  position="static"
                  left='none'
                  zIndex={2}
                >
                  {label}
                  {required && <Asterisk ml="5px" mb="8px" fill="questionListElement.iconAsterisk" stroke='questionListElement.iconAsterisk' />}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                </Box>
              </Flex>
            )}
            <Input
              borderRadius="8px"
              borderWidth="1px"
              h="40px"
              type="text"
              fontSize="smm"
              color="form.textInput.font"
              bg="form.textInput.bg"
              name={name}
              defaultValue={value}
              borderColor={error ? "form.textInput.border.error" : "form.textInput.border.normal"}
              _active={{ bg: disabled ? "form.textInput.disabled.bg" : "form.textInput.activeBg" }}
              _focus={{ borderColor: error ? "form.textInput.border.focus.error" : "form.textInput.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "form.textInput.disabled.bg",
                color: "form.textInput.disabled.font",
                borderColor: "form.textInput.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={placeholder}
              _placeholder={{ fontSize: "smm", color: 'form.textInput.placeholder' }}
            />
            {error && <Box fontSize={14} ml={1} color='form.textInput.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default TextInput;
