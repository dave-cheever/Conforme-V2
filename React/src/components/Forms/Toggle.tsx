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
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

const Toggle = ({
  control,
  name,
  label,
  tooltip = '',
  variant = 'secondaryVariant',
  validations = {},
  disabled = false,
  help = '',
}: IToggle) => {
  const validate = useValidate(label || name, validations, definedValidations);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box
            id={name}
            mt={variant !== 'secondaryVariant' ? 2 : 'none'}
            w="full"
          >
            {label && (
              <Flex
                align="center"
                justify="space-between"
                mb={variant !== 'secondaryVariant' ? '-32px' : 'none'}
                pt={2}
              >
                <Box
                  color={error ? 'switch.label.error' : 'switch.label.normal'}
                  fontSize={14}
                  fontWeight="bold"
                  left={variant !== 'secondaryVariant' ? '19px' : 'none'}
                  position={
                    variant !== 'secondaryVariant' ? 'relative' : 'static'
                  }
                  zIndex={1}
                >
                  {label}{' '}
                  {variant === 'secondaryVariant' && help && (
                    <Box fontSize="11px" mt={3} opacity={0.5}>
                      {help}
                    </Box>
                  )}
                </Box>
              </Flex>
            )}
            <Flex align="center" mt={3}>
              <SwitchInput
                colorScheme="toogle.color"
                css={{
                  '.chakra-switch__thumb': {
                    '&[data-checked]': {
                      background: '#462AC4',
                    },
                  },
                }}
                isChecked={value}
                isDisabled={disabled}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
              <Flex
                color={value ? 'toogle.enableColor' : 'toogle.disableColor'}
                fontSize="14px"
                fontWeight="400"
                ml={3}
                mt={-1}
              >
                {value ? 'Enabled' : 'Disabled'}
              </Flex>
            </Flex>
            {error && (
              <Box color="toogle.label.error" fontSize="smm" ml={1} mt={1}>
                {error.message}
              </Box>
            )}
            {tooltip && (
              <Flex align="center" color="toogle.tooltipColor" mt={3}>
                <InfoOutlineIcon />
                <Box fontSize="11px" ml={2}>
                  {tooltip}
                </Box>
              </Flex>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
};

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
