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
        data-id="030925-aa2abe"
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="030925-a855e0" id={name} mt="none" w="full">
              {label && (
                <Flex
                  data-id="030925-3de144"
                  align="center"
                  justify="space-between"
                  mb="none"
                  pt={2}>
                  <Box
                    data-id="030925-e851a0"
                    color={error ? 'numberInput.labelFont.error' : 'numberInput.labelFont.normal'}
                    fontSize={variant === 'secondaryVariant' ? '11px' : '14px'}
                    fontWeight="bold"
                    left="none"
                    position="static"
                    zIndex={1}>
                    {label}
                    {help && (
                      <Box data-id="030925-7748ce" fontSize="11px" mt={3} opacity={0.5}>
                        {help}
                      </Box>
                    )}
                  </Box>
                </Flex>
              )}
              <Input
                data-id="030925-622ed6"
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
                <Box data-id="030925-5b01a0" color="numberInput.error" fontSize={14} ml={1}>
                  {error.message}
                </Box>
              )}
              {tooltip && (
                <Flex data-id="030925-aea1f1" align="center" color="dropdown.tooltip" mt={3}>
                  <InfoOutlineIcon data-id="030925-706f25" />
                  <Box data-id="030925-7e9230" fontSize="11px" ml={2}>
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
