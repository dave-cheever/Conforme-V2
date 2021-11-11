import React from 'react';
import { Box, Icon, Tooltip, Checkbox as ChakraCheckbox } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';

interface ICheckbox extends IField {
  placeholder?: string;
  variant?: string;
  options?: {
    label: string;
    value: string;
  }[];
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Checkbox = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false, options = [] }: ICheckbox) => {
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
            <ChakraCheckbox
              css={{
                ".chakra-checkbox__control": {
                  borderRadius: "50%",
                  borderWidth: '2px',
                  width: "21px",
                  height: "21px",
                }
              }}
              borderColor="form.checkbox.icon.border"
              colorScheme="form.checkbox.icon"
              py={3}
              isChecked={value}
              isDisabled={disabled}
              onChange={onChange}
            >
              {label}{' '}{tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
            </ChakraCheckbox>
            {error && <Box fontSize={14} ml={1} mt={1} color='form.checkbox.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default Checkbox;
