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
    <Controller
        data-id="030925-e0db5c"
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="030925-b227e4" id={name} mt="none" w="full">
              {label && (
                <Flex
                  data-id="030925-8961c3"
                  align="center"
                  justify="space-between"
                  mb="none"
                  pb={1}
                  pt={2}>
                  <Box
                    data-id="030925-532bce"
                    color={error ? 'textInput.labelFont.error' : styles ? styles?.textInput?.font : 'textInput.labelFont.normal'}
                    fontSize="11px"
                    fontWeight="bold"
                    left="none"
                    position="static"
                    zIndex={2}>
                    {label}
                    {required && (
                      <Asterisk
                        data-id="030925-8e840e"
                        fill="questionListElement.iconAsterisk"
                        h="9px"
                        mb="8px"
                        ml="5px"
                        stroke="questionListElement.iconAsterisk"
                        w="9px" />
                    )}{' '}
                    {tooltip && (
                      <Tooltip data-id="030925-8b3e1c" hasArrow label={tooltip} placement="top">
                        <Icon data-id="030925-5d38a2" h="14px" mb={1} name="info" />
                      </Tooltip>
                    )}
                  </Box>
                </Flex>
              )}
              <Textarea
                data-id="030925-13a1b3"
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
                fontSize="smm"
                h="100px"
                isDisabled={disabled}
                maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                placeholder={placeholder}
                value={value || ''} />
              {error && (
                <Box data-id="030925-8c12f1" color="textInput.error" fontSize={14} ml={1}>
                  {error.message}
                </Box>
              )}
            </Box>
          );
        }}
        rules={{ validate }} />
  );
}

export default TextInputMultiline;
