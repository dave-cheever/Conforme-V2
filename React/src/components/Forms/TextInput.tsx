import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement, Stack, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';
import { emailRegExp } from '../../utils/regular-expressions';

interface ITextInput extends IField {
  placeholder?: string;
  variant?: string;
  initialValue?: string;
  isUrl?: boolean;
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
      initialValue !== value.trim().toLowerCase() &&
      (validationValue as string[]).includes(value.trim().toLowerCase())
    )
      return `${label} already taken`;
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
  isEmail: (label, validationValue, value) => {
    if (!value.match(emailRegExp)) return 'Invalid Email';
  },
  isUrl: (label, validationValue, value) => {
    const regex = /(www.)?[a-zA-Z0-9@:%._+~#?&//=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._+~#?&//=]*)/;
    if (!value.match(regex)) return 'Invalid URL';
  },
};

function TextInput({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled = false,
  readMode = false,
  required,
  styles,
  initialValue,
  isUrl,
}: ITextInput) {
  const validate = useValidate(label || name, validations, definedValidations, initialValue);
  return (
    <Controller
        control={control}
        data-id="030925-21a7f8"
        name={name}
        render={({ field, fieldState }) => {
          const { value } = field;
          const { error } = fieldState;

          function URLButton() {
            return (
              <Button
                bg="textInput.openLinkButtonBg"
                color="textInput.openLinkButtonColor"
                data-id="030925-3f5f61"
                disabled={!value || error !== undefined}
                fontSize="smm"
                h="1.75rem"
                onClick={() => {
                  if (!error) window.open(value.startsWith('http') ? value : `http://${value}`);
                }}
                w="80px">
                Open link
              </Button>
            );
          }
          return (
            <Box data-id="030925-7c8152" id={name} mt="none" w="full">
              {label && (
                <Flex
                  align="center"
                  data-id="030925-cc853b"
                  justify="space-between"
                  mb="none"
                  pb={1}
                  pt={2}>
                  <Box
                    color={error ? 'textInput.labelFont.error' : styles ? styles?.textInput?.font : 'textInput.labelFont.normal'}
                    data-id="030925-cafe8b"
                    fontSize="11px"
                    fontWeight="bold"
                    left="none"
                    position="static">
                    {label}
                    {required && !readMode && (
                      <Asterisk
                        data-id="030925-b3d8ab"
                        fill="questionListElement.iconAsterisk"
                        h="9px"
                        mb="8px"
                        ml="5px"
                        stroke="questionListElement.iconAsterisk"
                        w="9px" />
                    )}{' '}
                    {tooltip && (
                      <Tooltip data-id="030925-59ddd7" hasArrow label={tooltip} placement="top">
                        <Icon data-id="030925-1ef423" h="14px" mb={1} name="info" />
                      </Tooltip>
                    )}
                  </Box>
                </Flex>
              )}
              {isUrl && placeholder && (
                <Box data-id="030925-e213e5" fontSize="ssm" mb={2}>
                  {placeholder}
                </Box>
              )}
              {!readMode && (
                <InputGroup data-id="030925-f59617">
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
                      borderColor: error ? 'textInput.border.focus.error' : 'textInput.border.focus.normal',
                    }}
                    _hover={{ cursor: 'auto' }}
                    _placeholder={{ fontSize: 'smm', color: 'textInput.placeholder' }}
                    autoComplete="off"
                    bg="textInput.bg"
                    borderColor={error ? 'textInput.border.error' : 'textInput.border.normal'}
                    borderRadius="8px"
                    borderWidth="1px"
                    color="textInput.font"
                    cursor="pointer"
                    data-id="030925-21c48d"
                    fontSize="smm"
                    h="40px"
                    isDisabled={disabled}
                    maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                    placeholder={!isUrl ? placeholder : ''}
                    {...field} />
                  {isUrl && (
                    <InputRightElement data-id="030925-1945da" width="5.6rem">
                      <URLButton data-id="030925-5c3392" />
                    </InputRightElement>
                  )}
                </InputGroup>
              )}
              {readMode && (
                <Stack data-id="030925-3a5685" spacing={2}>
                  <Flex
                    align="center"
                    data-id="030925-796c31"
                    fontSize="smm"
                    minH="40px"
                    wordBreak="break-all">
                    {value || (isUrl && 'No link provided')}
                  </Flex>
                  {isUrl && <URLButton data-id="030925-323ab3" />}
                </Stack>
              )}
              {error && (
                <Box color="textInput.error" data-id="030925-54bf75" fontSize={14} ml={1}>
                  {error.message}
                </Box>
              )}
            </Box>
          );
        }}
        rules={{ validate }} />
  );
}

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
    openLinkButtonBg: '#FFFFFF',
    openLinkButtonColor: '#818197',
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
