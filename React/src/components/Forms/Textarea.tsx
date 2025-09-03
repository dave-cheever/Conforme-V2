import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Textarea as ChakraTextarea, Flex, Icon, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ITextarea extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
};

function Textarea({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  required,
  validations = {},
  disabled = false,
  readMode = false,
}: ITextarea) {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
        data-id="030925-a90ffc"
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const { value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="030925-52932c" id={name} mt="none" w="full">
              {label && (
                <Flex
                  data-id="030925-20970c"
                  align="center"
                  justify="space-between"
                  mb="none"
                  pb={1}
                  pt={2}>
                  <Box
                    data-id="030925-4564db"
                    color={error ? 'textMultilineInput.labelFont.error' : 'textMultilineInput.labelFont.normal'}
                    fontSize={11}
                    fontWeight="bold"
                    left="none"
                    position="static"
                    zIndex={2}>
                    {label}
                    {required && (
                      <Asterisk
                        data-id="030925-b2a210"
                        fill="questionListElement.iconAsterisk"
                        h="9px"
                        mb="8px"
                        ml="5px"
                        stroke="textMultilineConfirmInput.iconAsterisk"
                        w="9px" />
                    )}{' '}
                    {tooltip && (
                      <Tooltip data-id="030925-4360a6" hasArrow label={tooltip} placement="top">
                        <Icon data-id="030925-c24220" h="14px" mb={1} name="info" />
                      </Tooltip>
                    )}
                  </Box>
                </Flex>
              )}
              {!readMode && (
                <>
                  <ChakraTextarea
                    data-id="030925-6f0184"
                    _active={{
                      bg: disabled ? 'textMultilineInput.disabled.bg' : 'textMultilineInput.activeBg',
                    }}
                    _disabled={{
                      bg: 'textMultilineInput.disabled.bg',
                      color: 'textMultilineInput.disabled.font',
                      borderColor: 'textMultilineInput.disabled.border',
                      cursor: 'not-allowed',
                    }}
                    _focus={{
                      borderColor: error ? 'textMultilineInput.border.focus.error' : 'textMultilineInput.border.focus.normal',
                    }}
                    _hover={{ cursor: 'auto' }}
                    _placeholder={{
                      fontSize: 'smm',
                      color: 'textMultilineInput.placeholder',
                    }}
                    bg="textMultilineInput.bg"
                    borderColor={error ? 'textMultilineInput.border.error' : 'textMultilineInput.border.normal'}
                    borderRadius="8px"
                    borderWidth="1px"
                    color="textMultilineInput.font"
                    cursor="pointer"
                    fontSize="smm"
                    isDisabled={disabled}
                    maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                    placeholder={placeholder}
                    pt="5px"
                    rows={4}
                    {...field} />
                  {error && (
                    <Box
                      data-id="030925-ae890f"
                      color="textMultilineInput.error"
                      fontSize={14}
                      ml={1}>
                      {error.message}
                    </Box>
                  )}
                </>
              )}
              {readMode && (
                <Flex data-id="030925-122282" fontSize="smm" minH="40px">
                  {value}
                </Flex>
              )}
            </Box>
          );
        }}
        rules={{ validate }} />
  );
}

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
