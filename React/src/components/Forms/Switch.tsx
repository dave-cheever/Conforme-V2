import React from 'react';
import { Box, Flex, Switch as SwitchInput } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';


interface IDropdown extends IField {
  variant?: string;
  help?: string;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Switch = ({ control, name, label, tooltip = '', variant, validations = {}, disabled = false, help = '' }: IDropdown) => {
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
                  color={error ? "form.dropdown.labelFont.error" : "form.dropdown.labelFont.normal"}
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
            <SwitchInput
                colorScheme="form.switch.color"
                mt={3}
                onBlur={onBlur}
                value={value}
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
            {error && <Box fontSize="smm" ml={1} mt={1} color='form.dropdown.error'>{error.message}</Box>}
            {tooltip && 
            <Flex  color='form.dropdown.tooltip' align='center' mt={3}>
              <InfoOutlineIcon/>
              <Box fontSize="11px" ml={2}>{tooltip}</Box>
            </Flex>}
          </Box>
        );
      }}
    />
  );
};

export default Switch;
