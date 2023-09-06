import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk, CheckIcon } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ItextConfirmInput extends IField {
  placeholder?: string;
  defaultvalue?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
};

function TextConfirmInput({
  control,
  name,
  label,
  required,
  tooltip = '',
  validations = {},
  disabled = false,
  defaultvalue,
}: ItextConfirmInput) {
  const inputRef = useRef<any>();
  const [tempValue, setTempValue] = useState(defaultvalue || '');
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    (<Controller
      control={control}
      data-id="c8a5146630d6"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const showButtons = tempValue !== (value || '');

        const { error } = fieldState;
        return (
          (<Box data-id="348dcffffb6f" id={name} w="full">
            {label && (
              <Flex
                align="center"
                data-id="976b630c05b2"
                justify="space-between"
                mb="none"
                pb={2}
                pt={2}>
                <Box
                  color={error ? 'textConfirmInput.labelFont.error' : 'textConfirmInput.labelFont.normal'}
                  data-id="993513339e39"
                  fontSize="ssm"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}>
                  {label}
                  {required && (
                    <Asterisk
                      data-id="c591cf373641"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="textConfirmInput.iconAsterisk"
                      w="9px" />
                  )}{' '}
                  {tooltip && (
                    <Tooltip data-id="cacc49e7c9e8" hasArrow label={tooltip} placement="top">
                      <Icon data-id="60a6b7179f94" h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <Flex data-id="162c66cabf3d">
              <Input
                _active={{
                  bg: disabled ? 'textConfirmInput.disabled.bg' : 'textConfirmInput.activeBg',
                }}
                _disabled={{
                  bg: 'textConfirmInput.disabled.bg',
                  color: 'textConfirmInput.disabled.font',
                  borderColor: 'textConfirmInput.disabled.border',
                  cursor: 'not-allowed',
                }}
                _focus={{
                  borderColor: error ? 'textConfirmInput.border.focus.error' : 'textConfirmInput.border.focus.normal',
                }}
                _hover={{ cursor: 'auto' }}
                _placeholder={{ color: 'textConfirmInput.placeholder' }}
                bg="textConfirmInput.bg"
                borderColor={error ? 'textConfirmInput.border.error' : 'textConfirmInput.border.normal'}
                borderRadius={showButtons ? '8px 0 0 8px' : '8px'}
                borderWidth={showButtons ? '1px 0 1px 1px' : '1px'}
                color="textConfirmInput.font"
                cursor="pointer"
                data-id="c949aac66095"
                defaultValue={tempValue}
                h="40px"
                isDisabled={disabled}
                maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                name={name}
                onBlur={onBlur}
                onChange={(event) => setTempValue(event.target.value)}
                ref={inputRef}
                type="text" />
              {showButtons && (
                <Flex cursor="pointer" data-id="8fa0d1813d8a" direction="column">
                  <Flex
                    align="center"
                    bgColor="textConfirmInput.approve.bg"
                    borderRadius="0 8px 0 0"
                    color="textConfirmInput.approve.font"
                    data-id="f912b692640e"
                    grow={1}
                    justify="center"
                    onClick={() =>
                      onChange({
                        target: { name, value: inputRef.current?.value },
                      })
                    }
                    w={6}>
                    <CheckIcon data-id="90b5006c324a" stroke="textConfirmInput.approve.font" />
                  </Flex>
                  <Flex
                    align="center"
                    bgColor="textConfirmInput.reject.bg"
                    borderRadius="0 0 8px 0"
                    color="textConfirmInput.reject.font"
                    data-id="5f273f6837e6"
                    grow={1}
                    justify="center"
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = value;

                      setTempValue(value);
                    }}
                    w={6}>
                    <CloseIcon data-id="2d8104b5b94d" w="12px" />
                  </Flex>
                </Flex>
              )}
            </Flex>
            {error && (
              <Box
                color="textConfirmInput.error"
                data-id="cfb73023af74"
                fontSize={14}
                ml={1}>
                {error.message}
              </Box>
            )}
          </Box>)
        );
      }}
      rules={{ validate }} />)
  );
}

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
