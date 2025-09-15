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
        control={control}
        data-id="030925-28b724"
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const { error } = fieldState;
          return (
            <Box
                data-id="030925-dbf53e"
                id={name}
                mt={variant !== 'secondaryVariant' ? 2 : 'none'}
                w="full">
              {label && (
                <Flex
                  align="center"
                  data-id="030925-737700"
                  justify="space-between"
                  mb={variant !== 'secondaryVariant' ? '-32px' : 'none'}
                  pt={2}>
                  <Box
                    color={error ? 'switch.label.error' : 'switch.label.normal'}
                    data-id="030925-1f4cf8"
                    fontSize={variant === 'secondaryVariant' ? '11px' : '14px'}
                    fontWeight="bold"
                    left={variant !== 'secondaryVariant' ? '19px' : 'none'}
                    position={variant !== 'secondaryVariant' ? 'relative' : 'static'}
                    zIndex={1}>
                    {label}{' '}
                    {variant === 'secondaryVariant' && help && (
                      <Box data-id="030925-2e9303" fontSize="11px" mt={3} opacity={0.5}>
                        {help}
                      </Box>
                    )}
                  </Box>
                </Flex>
              )}
              <Flex align="center" data-id="030925-31189f" mt={3}>
                <SwitchInput
                  colorScheme="toogle.color"
                  css={{
                    '.chakra-switch__thumb': {
                      '&[data-checked]': {
                        background: '#462AC4',
                      },
                    },
                  }}
                  data-id="030925-911565"
                  isChecked={!!value}
                  isDisabled={disabled}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange} />
                <Flex
                  color={value ? 'toogle.enableColor' : 'toogle.disableColor'}
                  data-id="030925-f2bc38"
                  fontSize="14px"
                  fontWeight="400"
                  ml={3}>
                  {value ? trueLabel : falseLabel}
                </Flex>
              </Flex>
              {error && (
                <Box
                  color="toogle.label.error"
                  data-id="030925-6c1906"
                  fontSize="smm"
                  ml={1}
                  mt={1}>
                  {error.message}
                </Box>
              )}
              {tooltip && (
                <Flex align="center" color="toogle.tooltipColor" data-id="030925-ab8582" mt={3}>
                  <InfoOutlineIcon data-id="030925-b49b97" />
                  <Box data-id="030925-f51050" fontSize="11px" ml={2}>
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
