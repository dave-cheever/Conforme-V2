import React from 'react';
import { Box, Flex, Icon, Textarea as ChakraTextarea, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';

interface ITextarea extends IField {
  placeholder?: string;
  variant?: string;
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

const Textarea = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false }: ITextarea) => {
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
          <Box w='full' id={name} mt={variant !== 'secondaryVariant' ? 2 : 'none'}>
            {label && (
              <Flex pt={2} pb={2} align='center' justify="space-between" mb={variant !== 'secondaryVariant' ? "-32px" : 'none'}>
                <Box
                  color={error ? "form.textarea.labelFont.error" : "form.textarea.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={11}
                  position={variant !== 'secondaryVariant' ? "relative" : "static"}
                  left={variant !== 'secondaryVariant' ? "19px" : 'none'}
                  zIndex={2}
                >
                  {label}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                  {variant === 'secondaryVariant' && placeholder && <Box opacity={.5}>{placeholder}</Box>}
                </Box>
              </Flex>
            )}
            <ChakraTextarea
              borderRadius="8px"
              borderWidth="2px"
              pt={variant !== 'secondaryVariant' ? "25px" : 'none'}
              rows={6}
              type="text"
              color="form.textarea.font"
              bg="form.textarea.bg"
              name={name}
              defaultValue={value}
              borderColor={error ? "form.textarea.border.error" : "form.textarea.border.normal"}
              _active={{ bg: disabled ? "form.textarea.disabled.bg" : "form.textarea.activeBg" }}
              _focus={{ borderColor: error ? "form.textarea.border.focus.error" : "form.textarea.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "form.textarea.disabled.bg",
                color: "form.textarea.disabled.font",
                borderColor: "form.textarea.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={variant === 'secondaryVariant' ? '' : placeholder}
              _placeholder={{ color: 'form.textarea.placeholder' }}
            />
            {error && <Box fontSize={14} ml={1} color='form.textarea.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default Textarea;
