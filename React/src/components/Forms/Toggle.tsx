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

const Toggle = ({
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
}: IToggle) => {
  const validate = useValidate(label || name, validations, definedValidations);

  return (
    (<Controller
      control={control}
      data-id="3ad8928a513a"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          (<Box
            data-id="c3f5b0997e4f"
            id={name}
            mt={variant !== 'secondaryVariant' ? 2 : 'none'}
            w="full">
            {label && (
              <Flex
                align="center"
                data-id="393f7b83531a"
                justify="space-between"
                mb={variant !== 'secondaryVariant' ? '-32px' : 'none'}
                pt={2}>
                <Box
                  color={error ? 'switch.label.error' : 'switch.label.normal'}
                  data-id="0474a6195b7e"
                  fontSize={variant === 'secondaryVariant' ? '11px' : '14px'}
                  fontWeight="bold"
                  left={variant !== 'secondaryVariant' ? '19px' : 'none'}
                  position={variant !== 'secondaryVariant' ? 'relative' : 'static'}
                  zIndex={1}>
                  {label}{' '}
                  {variant === 'secondaryVariant' && help && (
                    <Box data-id="c9c454df58d8" fontSize="11px" mt={3} opacity={0.5}>
                      {help}
                    </Box>
                  )}
                </Box>
              </Flex>
            )}
            <Flex align="center" data-id="6455de5802b4" mt={3}>
              <SwitchInput
                colorScheme="toogle.color"
                css={{
                  '.chakra-switch__thumb': {
                    '&[data-checked]': {
                      background: '#462AC4',
                    },
                  },
                }}
                data-id="e0281784ed34"
                isChecked={!!value}
                isDisabled={disabled}
                name={name}
                onBlur={onBlur}
                onChange={onChange} />
              <Flex
                color={value ? 'toogle.enableColor' : 'toogle.disableColor'}
                data-id="cdfc596305b2"
                fontSize="14px"
                fontWeight="400"
                ml={3}>
                {value ? trueLabel : falseLabel}
              </Flex>
            </Flex>
            {error && (
              <Box
                color="toogle.label.error"
                data-id="37b95013249f"
                fontSize="smm"
                ml={1}
                mt={1}>
                {error.message}
              </Box>
            )}
            {tooltip && (
              <Flex align="center" color="toogle.tooltipColor" data-id="924d0ad8b449" mt={3}>
                <InfoOutlineIcon data-id="f5049307abc4" />
                <Box data-id="ceb0e0884eda" fontSize="11px" ml={2}>
                  {tooltip}
                </Box>
              </Flex>
            )}
          </Box>)
        );
      }}
      rules={{ validate }} />)
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
