import React from 'react';
import { Controller } from 'react-hook-form';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Switch as SwitchInput } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface IToggle extends IField {
  variant?: string;
  help?: string;
  trueLabel?: string;
  falseLabel?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

function Toggle({
  control,
  name,
  label,
  tooltip = '',
  variant = 'secondaryVariant',
  validations = {},
  disabled = false,
  help = '',
  trueLabel = 'Yes',
  falseLabel = 'No',
}: IToggle) {
  const validate = useValidate(label || name, validations, definedValidations);

  return (
    <Controller
        data-id="000433"
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const { error } = fieldState;
          return (
            <Box
                data-id="000434"
                id={name}
                mt={variant !== 'secondaryVariant' ? 2 : 'none'}
                w="full">
              {label && (
                <Flex
                  data-id="000435"
                  align="center"
                  justify="space-between"
                  mb={variant !== 'secondaryVariant' ? '-32px' : 'none'}
                  pt={2}>
                  <Box
                    data-id="000436"
                    color={error ? 'switch.label.error' : 'switch.label.normal'}
                    fontSize={variant === 'secondaryVariant' ? '11px' : '14px'}
                    fontWeight="bold"
                    left={variant !== 'secondaryVariant' ? '19px' : 'none'}
                    position={variant !== 'secondaryVariant' ? 'relative' : 'static'}
                    zIndex={1}>
                    {label}{' '}
                    {variant === 'secondaryVariant' && help && (
                      <Box data-id="000437" fontSize="11px" mt={3} opacity={0.5}>
                        {help}
                      </Box>
                    )}
                  </Box>
                </Flex>
              )}
              <Flex data-id="000438" align="center" mt={3}>
                <SwitchInput
                  data-id="000439"
                  colorScheme="toogle.color"
                  css={{
                    '.chakra-switch__thumb': {
                      '&[data-checked]': {
                        background: '#462AC4',
                      },
                    },
                  }}
                  isChecked={!!value}
                  isDisabled={disabled}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange} />
                <Flex
                  data-id="000440"
                  color={value ? 'toogle.enableColor' : 'toogle.disableColor'}
                  fontSize="14px"
                  fontWeight="400"
                  ml={3}>
                  {value ? trueLabel : falseLabel}
                </Flex>
              </Flex>
              {error && (
                <Box
                  data-id="000441"
                  color="toogle.label.error"
                  fontSize="smm"
                  ml={1}
                  mt={1}>
                  {error.message}
                </Box>
              )}
              {tooltip && (
                <Flex data-id="000442" align="center" color="toogle.tooltipColor" mt={3}>
                  <InfoOutlineIcon data-id="000443" />
                  <Box data-id="000444" fontSize="11px" ml={2}>
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

export default Toggle;

export const toggleStyles = {
  toogle: {
    label: {
      normal: '#282F36',
      error: '#E53E3E',
    },
    enableColor: '#282F36',
    disableColor: '#818197',
    color: {
      50: '#ede9ff',
      100: '#c9bff7',
      200: '#a596ea',
      300: '#816ce1',
      400: '#5d42d7',
      500: '#c9bff7',
      600: '#342094',
      700: '#24166b',
      800: '#150d42',
      900: '#07041c',
    },
    tooltipColor: '#9A9EA1',
  },
};
