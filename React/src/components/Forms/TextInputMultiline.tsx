import React from 'react';
import { Box, Flex, Icon, Textarea, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ITextInputMultiline extends IField {
  placeholder?: string;
  variant?: string;
  styles?: {
    textInput ?: {
      font?:string
    }
  };
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

const TextInputMultiline = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false, styles }: ITextInputMultiline) => {
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
                  color={error ? "textInput.labelFont.error" : styles ?  styles?.textInput?.font : "textInput.labelFont.normal"}
                  fontWeight="bold"
                  fontSize="11px"
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
            <Textarea
              borderRadius="8px"
              borderWidth="1px"
              h="100px"
              type="text"
              fontSize= "smm"
              color="textInput.font"
              bg="textInput.bg"
              name={name}
              defaultValue={value}
              borderColor={error ? "textInput.border.error" : "textInput.border.normal"}
              _active={{ bg: disabled ? "textInput.disabled.bg" : "textInput.activeBg" }}
              _focus={{ borderColor: error ? "textInput.border.focus.error" : "textInput.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "textInput.disabled.bg",
                color: "textInput.disabled.font",
                borderColor: "textInput.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={placeholder}
              _placeholder={{ fontSize: "smm", color: 'textInput.placeholder' }}
            />
            {error && <Box fontSize={14} ml={1} color='textInput.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default TextInputMultiline;
