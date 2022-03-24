import React from 'react';
import { Box, Flex, Switch as SwitchInput } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';


interface IToggle extends IField {
  variant?: string;
  help?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Toggle = ({ control, name, label, tooltip = '', variant = 'secondaryVariant', validations = {}, disabled = false, help = '' }: IToggle) => {
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
              <Flex pt={2} align='center' justify="space-between" mb={variant !== 'secondaryVariant' ? "-32px" : 'none'}>
                <Box
                  color={error ? "switch.label.error" : "switch.label.normal"}
                  fontWeight="bold"
                  fontSize={14}
                  position={variant !== 'secondaryVariant' ? "relative" : "static"}
                  left={variant !== 'secondaryVariant' ? "19px" : 'none'}
                  zIndex={1}
                >
                  {label}
                  {' '}
                  {variant === 'secondaryVariant' && help && <Box fontSize="11px" opacity={.5} mt={3}>{help}</Box>}
                </Box>
              </Flex>
            )}
            <Flex align="center" mt={3}>
              <SwitchInput
                  colorScheme="toogle.color"
                  onBlur={onBlur}
                  isChecked={value}
                  onChange={onChange}
                  name={name}
                  isDisabled={disabled}
                  css={{
                      ".chakra-switch__thumb": {
                          "&[data-checked]": {
                          background: "#462AC4"
                          }
                      }
                  }}
              />
            <Flex ml={3} fontSize="14px" fontWeight="400" mt={-1} color={value ? "toogle.enableColor" : "toogle.disableColor"}>{value ? "Enabled": "Disabled"}</Flex>
            </Flex>
            {error && <Box fontSize="smm" ml={1} mt={1} color='toogle.label.error'>{error.message}</Box>}
            {tooltip && 
            <Flex  color='toogle.tooltipColor' align='center' mt={3}>
              <InfoOutlineIcon/>
              <Box fontSize="11px" ml={2}>{tooltip}</Box>
            </Flex>}
          </Box>
        );
      }}
    />
  );
};

export default Toggle;

export const toggleStyles = {
  toogle: {
    label:{
      normal: "#282F36",
      error: "#E53E3E"
    },
    enableColor: "#282F36",
    disableColor: "#818197",
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
    tooltipColor: "#9A9EA1"
  }
};
