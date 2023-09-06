import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Flex, Icon, Textarea, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ITextInputMultiline extends IField {
  placeholder?: string;
  variant?: string;
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
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) return `${label} can be maximum ${validationValue} characters length`;
  },
};

function TextInputMultiline({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled = false,
  required,
  styles,
}: ITextInputMultiline) {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    (<Controller
      control={control}
      data-id="b9256f524c41"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          (<Box data-id="c70ddbf2d879" id={name} mt="none" w="full">
            {label && (
              <Flex
                align="center"
                data-id="8aa867ecac0b"
                justify="space-between"
                mb="none"
                pb={1}
                pt={2}>
                <Box
                  color={error ? 'textInput.labelFont.error' : styles ? styles?.textInput?.font : 'textInput.labelFont.normal'}
                  data-id="152360f1bf7d"
                  fontSize="11px"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}>
                  {label}
                  {required && (
                    <Asterisk
                      data-id="d23da9f910f9"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="questionListElement.iconAsterisk"
                      w="9px" />
                  )}{' '}
                  {tooltip && (
                    <Tooltip data-id="f0ea5d76d863" hasArrow label={tooltip} placement="top">
                      <Icon data-id="1c252e7c06e7" h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <Textarea
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
              bg="textInput.bg"
              borderColor={error ? 'textInput.border.error' : 'textInput.border.normal'}
              borderRadius="8px"
              borderWidth="1px"
              color="textInput.font"
              cursor="pointer"
              data-id="8931ed7e3471"
              defaultValue={value}
              fontSize="smm"
              h="100px"
              isDisabled={disabled}
              maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={placeholder} />
            {error && (
              <Box color="textInput.error" data-id="7ff6b50cf8ca" fontSize={14} ml={1}>
                {error.message}
              </Box>
            )}
          </Box>)
        );
      }}
      rules={{ validate }} />)
  );
}

export default TextInputMultiline;
