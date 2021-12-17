import React, { useRef, useState } from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { Asterisk, CheckIcon } from '../../icons';

interface ItextConfirmInput extends IField {
  placeholder?: string;
  defaultvalue?: string;
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

const TextConfirmInput = ({ control, name, label, required, tooltip = '', validations = {}, disabled = false, defaultvalue }: ItextConfirmInput) => {
  const inputRef = useRef<any>();
  const [tempValue, setTempValue] = useState(defaultvalue || '');
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field, fieldState, formState }) => {
        const { onChange, onBlur, value } = field;
        const showButtons = tempValue !== (value || '');

        const { error } = fieldState;
        return (
          <Box w='full' id={name}>
            {label && (
              <Flex pt={2} pb={2} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "textConfirmInput.labelFont.error" : "textConfirmInput.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={11}
                  position="static"
                  left='none'
                  zIndex={2}
                >
                  {label}
                  {required && <Asterisk ml="10px" stroke='textConfirmInput.iconAsterisk' w='9px' h='9px' />}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                </Box>
              </Flex>
            )}
            <Flex>
              <Input
                ref={inputRef}
                borderRadius={showButtons ? "8px 0 0 8px" : "8px"}
                borderWidth={showButtons ? "1px 0 1px 1px" : "1px"}
                h={"40px"}
                type="text"
                color="textConfirmInput.font"
                bg="textConfirmInput.bg"
                name={name}
                defaultValue={tempValue}
                borderColor={error ? "textConfirmInput.border.error" : "textConfirmInput.border.normal"}
                _active={{ bg: disabled ? "textConfirmInput.disabled.bg" : "textConfirmInput.activeBg" }}
                _focus={{ borderColor: error ? "textConfirmInput.border.focus.error" : "textConfirmInput.border.focus.normal" }}
                _hover={{ cursor: "auto" }}
                onChange={event => setTempValue(event.target.value)}
                onBlur={onBlur}
                isDisabled={disabled}
                cursor="pointer"
                _disabled={{
                  bg: "textConfirmInput.disabled.bg",
                  color: "textConfirmInput.disabled.font",
                  borderColor: "textConfirmInput.disabled.border",
                  cursor: "not-allowed",
                }}
                maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
                _placeholder={{ color: 'textConfirmInput.placeholder' }}
              />
              {showButtons && (
                <Flex
                  direction='column'
                  cursor='pointer'
                >
                  <Flex
                    grow={1}
                    w={6}
                    borderRadius="0 8px 0 0"
                    align='center'
                    justify='center'
                    bgColor='textConfirmInput.approve.bg'
                    color='textConfirmInput.approve.font'
                    onClick={() => onChange({ target: { name, value: inputRef.current?.value } })}
                  ><CheckIcon stroke='textConfirmInput.approve.font' /></Flex>
                  <Flex
                    grow={1}
                    w={6}
                    borderRadius="0 0 8px 0"
                    align='center'
                    justify='center'
                    bgColor='textConfirmInput.reject.bg'
                    color='textConfirmInput.reject.font'
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.value = value;
                      }
                      setTempValue(value);
                    }}
                  ><CloseIcon w='12px' /></Flex>
                </Flex>
              )}
            </Flex>
            {error && <Box fontSize={14} ml={1} color='textConfirmInput.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default TextConfirmInput;

export const textConfirmInputStyles = {
  textConfirmInput: {
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
    approve: {
      font: '#FFFFFF',
      bg: '#007000',
    },
    reject: {
      font: '#FFFFFF',
      bg: '#E53E3E',
    },
  },
};
