import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Textarea, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk, CheckIcon } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ItextMultilineConfirmInput extends IField {
  placeholder?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
};

function TextMultilineConfirmInput({
  control,
  name,
  label,
  required,
  tooltip = '',
  validations = {},
  disabled = false,
  defaultvalue,
}: ItextMultilineConfirmInput) {
  const inputRef = useRef<any>();
  const [tempValue, setTempValue] = useState(defaultvalue || '');
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
        control={control}
        data-id="000408"
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const showButtons = tempValue !== (value || '');

          const { error } = fieldState;
          return (
            <Box data-id="000409" id={name} w="full">
              {label && (
                <Flex
                  align="center"
                  data-id="000410"
                  justify="space-between"
                  mb="none"
                  pb={2}
                  pt={2}>
                  <Box
                    color={error ? 'textMultilineConfirmInput.labelFont.error' : 'textMultilineConfirmInput.labelFont.normal'}
                    data-id="000411"
                    fontSize="ssm"
                    fontWeight="bold"
                    left="none"
                    position="static"
                    zIndex={2}>
                    {label}
                    {required && (
                      <Asterisk
                        data-id="000412"
                        fill="questionListElement.iconAsterisk"
                        h="9px"
                        mb="8px"
                        ml="5px"
                        stroke="textMultilineConfirmInput.iconAsterisk"
                        w="9px" />
                    )}{' '}
                    {tooltip && (
                      <Tooltip data-id="000413" hasArrow label={tooltip} placement="top">
                        <Icon data-id="000414" h="14px" mb={1} name="info" />
                      </Tooltip>
                    )}
                  </Box>
                </Flex>
              )}
              <Flex data-id="000415">
                <Textarea
                  _active={{
                    bg: disabled ? 'textMultilineConfirmInput.disabled.bg' : 'textMultilineConfirmInput.activeBg',
                  }}
                  _disabled={{
                    bg: 'textMultilineConfirmInput.disabled.bg',
                    color: 'textMultilineConfirmInput.disabled.font',
                    borderColor: 'textMultilineConfirmInput.disabled.border',
                    cursor: 'not-allowed',
                  }}
                  _focus={{
                    borderColor: error ? 'textMultilineConfirmInput.border.focus.error' : 'textMultilineConfirmInput.border.focus.normal',
                  }}
                  _hover={{ cursor: 'auto' }}
                  _placeholder={{
                    color: 'textMultilineConfirmInput.placeholder',
                  }}
                  bg="textMultilineConfirmInput.bg"
                  borderColor={error ? 'textMultilineConfirmInput.border.error' : 'textMultilineConfirmInput.border.normal'}
                  borderRadius={showButtons ? '8px 0 0 8px' : '8px'}
                  borderWidth={showButtons ? '1px 0 1px 1px' : '1px'}
                  color="textMultilineConfirmInput.font"
                  cursor="pointer"
                  data-id="000416"
                  defaultValue={tempValue}
                  h="40px"
                  isDisabled={disabled}
                  maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                  name={name}
                  onBlur={onBlur}
                  onChange={(event) => setTempValue(event.target.value)}
                  ref={inputRef} />
                {showButtons && (
                  <Flex cursor="pointer" data-id="000417" direction="column">
                    <Flex
                      align="center"
                      bgColor="textMultilineConfirmInput.approve.bg"
                      borderRadius="0 8px 0 0"
                      color="textMultilineConfirmInput.approve.font"
                      data-id="000418"
                      grow={1}
                      justify="center"
                      onClick={() =>
                        onChange({
                          target: { name, value: inputRef.current?.value },
                        })
                      }
                      w={6}>
                      <CheckIcon data-id="000419" stroke="textMultilineConfirmInput.approve.font" />
                    </Flex>
                    <Flex
                      align="center"
                      bgColor="textMultilineConfirmInput.reject.bg"
                      borderRadius="0 0 8px 0"
                      color="textMultilineConfirmInput.reject.font"
                      data-id="000420"
                      grow={1}
                      justify="center"
                      onClick={() => {
                        if (inputRef.current) inputRef.current.value = value;

                        setTempValue(value);
                      }}
                      w={6}>
                      <CloseIcon data-id="000421" w="12px" />
                    </Flex>
                  </Flex>
                )}
              </Flex>
              {error && (
                <Box
                  color="textMultilineConfirmInput.error"
                  data-id="000422"
                  fontSize={14}
                  ml={1}>
                  {error.message}
                </Box>
              )}
            </Box>
          );
        }}
        rules={{ validate }} />
  );
}

export default TextMultilineConfirmInput;

export const textMultilineConfirmInputStyles = {
  textMultilineConfirmInput: {
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
