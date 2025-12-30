import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Textarea as ChakraTextarea, Flex, Icon, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ITextarea extends IField {
  readonly placeholder?: string;
  readonly variant?: string;
  readonly rows?: number;
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
  rows = 4,
}: Readonly<ITextarea>) {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
        control={control}
        data-id="000423"
        name={name}
        render={({ field, fieldState }) => {
          const { value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="000424" id={name} mt="none" w="full">
              {label && (
                <Flex
                  align="center"
                  data-id="000425"
                  justify="space-between"
                  mb="none"
                  pb="8px">
                  <Box
                    color={error ? 'textMultilineInput.labelFont.error' : 'textMultilineInput.labelFont.normal'}
                    data-id="000426"
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="100%"
                    left="none"
                    position="static"
                    zIndex={2}>
                    {label}
                    {required && (
                      <Asterisk
                        data-id="000427"
                        fill="questionListElement.iconAsterisk"
                        h="9px"
                        mb="8px"
                        ml="5px"
                        stroke="textMultilineConfirmInput.iconAsterisk"
                        w="9px" />
                    )}{' '}
                    {tooltip && (
                      <Tooltip data-id="000428" hasArrow label={tooltip} placement="top">
                        <Icon data-id="000429" h="14px" mb={1} name="info" />
                      </Tooltip>
                    )}
                  </Box>
                </Flex>
              )}
              {!readMode && (
                <>
                  <ChakraTextarea
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
                    data-id="000430"
                    fontSize="smm"
                    isDisabled={disabled}
                    maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                    placeholder={placeholder}
                    pt="5px"
                    rows={rows}
                    {...field} />
                  {error && (
                    <Box
                      color="textMultilineInput.error"
                      data-id="000431"
                      fontSize={14}
                      ml={1}>
                      {error.message}
                    </Box>
                  )}
                </>
              )}
              {readMode && (
                <Flex data-id="000432" fontSize="smm" minH="40px">
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
