import React from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';

interface INumberInput extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const NumberInput = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false }: INumberInput) => {
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
                  color={error ? "form.numberInput.labelFont.error" : "form.numberInput.labelFont.normal"}
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
            <Input
              borderRadius="8px"
              borderWidth="2px"
              pt={variant !== 'secondaryVariant' ? "16px" : 'none'}
              h={variant !== 'secondaryVariant' ? "55px" : "40px"}
              type="number"
              color="form.numberInput.font"
              bg="form.numberInput.bg"
              name={name}
              defaultValue={value}
              borderColor={error ? "form.numberInput.border.error" : "form.numberInput.border.normal"}
              _active={{ bg: disabled ? "form.numberInput.disabled.bg" : "form.numberInput.activeBg" }}
              _focus={{ borderColor: error ? "form.numberInput.border.focus.error" : "form.numberInput.border.focus.normal" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{
                bg: "form.numberInput.disabled.bg",
                color: "form.numberInput.disabled.font",
                borderColor: "form.numberInput.disabled.border",
                cursor: "not-allowed",
              }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={variant === 'secondaryVariant' ? '' : placeholder}
              _placeholder={{ color: 'form.numberInput.placeholder' }}
            />
            {error && <Box fontSize={14} ml={1} color='form.numberInput.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default NumberInput;
