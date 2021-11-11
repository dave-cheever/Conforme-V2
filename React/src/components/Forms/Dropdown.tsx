import React from 'react';
import { Box, Flex, Icon, Select, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';

interface IDropdown extends IField {
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

const Dropdown = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false, options = [] }: IDropdown) => {
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
                  color={error ? "form.dropdown.labelFont.error" : "form.dropdown.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={11}
                  position={variant !== 'secondaryVariant' ? "relative" : "static"}
                  left={variant !== 'secondaryVariant' ? "19px" : 'none'}
                  zIndex={1}
                >
                  {label}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                  {variant === 'secondaryVariant' && placeholder && <Box opacity={.5}>{placeholder}</Box>}
                </Box>
              </Flex>
            )}
            <Select
              css={{ paddingTop: "15px" }}
              borderRadius="8px"
              borderWidth="2px"
              top="5px"
              h="55px"
              color="form.dropdown.font"
              bg="form.dropdown.bg"
              borderColor={error ? "form.dropdown.border.error" : "form.dropdown.border.normal"}
              onBlur={onBlur}
              value={value}
              onChange={onChange}
              name={name}
              isDisabled={disabled}
              cursor="pointer"
              _active={{ bg: disabled ? "form.dropdown.disabled.bg" : "form.dropdown.activeBg" }}
              _focus={{ borderColor: error ? "form.dropdown.border.focus.error" : "form.dropdown.border.focus.normal" }}
              _disabled={{
                bg: "form.dropdown.disabled.bg",
                color: "form.dropdown.disabled.font",
                borderColor: "form.dropdown.disabled.border",
                cursor: "not-allowed",
              }}
              placeholder={placeholder}
              _placeholder={{ color: 'form.dropdown.placeholder' }}
            >
              {options.map(option => <option key={`${name}-${option.value}`} value={option.value}>{option.label}</option>)}
            </Select>
            {error && <Box fontSize={14} ml={1} mt={1} color='form.dropdown.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default Dropdown;
