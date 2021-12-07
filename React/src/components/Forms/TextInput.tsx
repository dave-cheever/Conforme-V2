import React from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';

interface ITextInput extends IField {
  placeholder?: string;
  variant?: string;
  styles?: {
    textInput ?: {
      font?:string
    }
  };
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
};

const TextInput = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false, styles }: ITextInput) => {
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
              <Flex pt={2} pb={2} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "form.textInput.labelFont.error" : styles ?  styles?.textInput?.font : "form.textInput.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={11}
                  position="static"
                  left='none'
                  zIndex={2}
                >
                  {label}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                </Box>
              </Flex>
            )}
            <Input
              borderRadius="8px"
              borderWidth="1px"
              pt='none'
              h="40px"
              type="text"
              fontSize= "smm"
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
