import React from 'react';
import { Controller } from 'react-hook-form';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Input } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface INumberInput extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

function NumberInput({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  variant,
  validations = {},
  disabled = false,
  help,
}: INumberInput) {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
        control={control}
        data-id="000320"
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="000321" id={name} mt="none" w="full">
              {label && (
                <Flex
                  align="center"
                  data-id="000322"
                  justify="space-between"
                  mb="none"
                  pt={2}>
                  <Box
                    color={error ? 'numberInput.labelFont.error' : 'numberInput.labelFont.normal'}
                    data-id="000323"
                    fontSize={variant === 'secondaryVariant' ? '11px' : '14px'}
                    fontWeight="bold"
                    left="none"
                    position="static"
                    zIndex={1}>
                    {label}
                    {help && (
                      <Box data-id="000324" fontSize="11px" mt={3} opacity={0.5}>
                        {help}
                      </Box>
                    )}
                  </Box>
                </Flex>
              )}
              <Input
                _active={{
                  bg: disabled ? 'numberInput.disabled.bg' : 'numberInput.activeBg',
                }}
                _disabled={{
                  bg: 'numberInput.disabled.bg',
                  color: 'numberInput.disabled.font',
                  borderColor: 'numberInput.disabled.border',
                  cursor: 'not-allowed',
                }}
                _focus={{
                  borderColor: error ? 'numberInput.border.focus.error' : 'numberInput.border.focus.normal',
                }}
                _hover={{ cursor: 'auto' }}
                _placeholder={{ color: 'numberInput.placeholder' }}
                bg="numberInput.bg"
                borderColor={error ? 'numberInput.border.error' : 'numberInput.border.normal'}
                borderRadius="8px"
                borderWidth="1px"
                color="numberInput.font"
                cursor="pointer"
                data-id="000325"
                defaultValue={value}
                h="42px"
                isDisabled={disabled}
                maxLength={validations && validations.forceMaxLength ? (validations.maxLength as number) : undefined}
                mt="3"
                name={name}
                onBlur={onBlur}
                onChange={(e) => onChange({ name, target: { value: Number(e.target.value) } })}
                placeholder={variant === 'secondaryVariant' ? '' : placeholder}
                pt="none"
                type="number" />
              {error && (
                <Box color="numberInput.error" data-id="000326" fontSize={14} ml={1}>
                  {error.message}
                </Box>
              )}
              {tooltip && (
                <Flex align="center" color="dropdown.tooltip" data-id="000327" mt={3}>
                  <InfoOutlineIcon data-id="000328" />
                  <Box data-id="000329" fontSize="11px" ml={2}>
                    {tooltip}
                  </Box>
                </Flex>
              )}
            </Box>
          );
        }}
        rules={{ validate }} />
  );
}

export const numberInputStyles = {
  numberInput: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      secondaryVariant: '#818197',
      normal: '#282F36',
      error: '#E53E3E',
    },
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
    tooltip: '#9A9EA1',
    icon: '#818197',
  },
};

export default NumberInput;
