import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Flex, Icon, Textarea, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
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
    if (value.length < validationValue)
      return `${label} can be maximum ${validationValue} characters length`;
  },
};

const TextInputMultiline = ({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  validations = {},
  disabled = false,
  styles,
}: ITextInputMultiline) => {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box id={name} mt="none" w="full">
            {label && (
              <Flex
                align="center"
                justify="space-between"
                mb="none"
                pb={1}
                pt={2}
              >
                <Box
                  color={
                    error
                      ? 'textInput.labelFont.error'
                      : styles
                      ? styles?.textInput?.font
                      : 'textInput.labelFont.normal'
                  }
                  fontSize="11px"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}
                >
                  {label}{' '}
                  {tooltip && (
                    <Tooltip hasArrow label={tooltip} placement="top">
                      <Icon h="14px" mb={1} name="info" />
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
                borderColor: error
                  ? 'textInput.border.focus.error'
                  : 'textInput.border.focus.normal',
              }}
              _hover={{ cursor: 'auto' }}
              _placeholder={{ fontSize: 'smm', color: 'textInput.placeholder' }}
              bg="textInput.bg"
              borderColor={
                error ? 'textInput.border.error' : 'textInput.border.normal'
              }
              borderRadius="8px"
              borderWidth="1px"
              color="textInput.font"
              cursor="pointer"
              defaultValue={value}
              fontSize="smm"
              h="100px"
              isDisabled={disabled}
              maxLength={
                validations && validations.forceMaxLength
                  ? (validations.maxLength as number)
                  : undefined
              }
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={placeholder}
            />
            {error && (
              <Box color="textInput.error" fontSize={14} ml={1}>
                {error.message}
              </Box>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
};

export default TextInputMultiline;
