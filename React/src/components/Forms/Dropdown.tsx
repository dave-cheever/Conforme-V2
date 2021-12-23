import React from 'react';
import { Box, Flex, Select } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { ChevronRight } from '../../icons';

interface IDropdown extends IField {
  placeholder?: string;
  variant?: string;
  options?: {
    label?: string;
    value?: string;
  }[];
  stroke?: string;
  help?: string;
  Icon?: any;
  attributeType?: "Category" | "Regulatory body"
  onAction?: (type?: "Category" | "Regulatory body") => void;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Dropdown = ({ control, name, stroke, label, placeholder = '', tooltip = '', variant, validations = {},
  disabled = false, options = [], help = '', Icon, onAction, attributeType }: IDropdown) => {
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
          <Box w='full' id={name} mt='none'>
            {label && (
              <Flex pt={2} pb={2} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "dropdown.labelFont.error" : "dropdown.labelFont.normal"}
                  fontWeight="bold"
                  fontSize="ssm"
                  position="static"
                  left='none'
                  zIndex={1}
                >
                  {label}
                  {help && <Box fontSize="11px" opacity={.5} mt={3}>{help}</Box>}
                </Box>
              </Flex>
            )}
            <Flex alignItems={Icon ? "center" : ''}>
              <Select
                css={{ paddingTop: "0" }}
                borderRadius="8px"
                borderWidth="1px"
                top="5px"
                fontSize="smm"
                h="42px"
                color="dropdown.font"
                bg="dropdown.bg"
                borderColor={error ? "dropdown.border.error" : "dropdown.border.normal"}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                name={name}
                isDisabled={disabled}
                cursor="pointer"
                _active={{ bg: disabled ? "dropdown.disabled.bg" : "dropdown.activeBg" }}
                _focus={{ borderColor: error ? "dropdown.border.focus.error" : "dropdown.border.focus.normal" }}
                _disabled={{
                  bg: "dropdown.disabled.bg",
                  color: "dropdown.disabled.font",
                  borderColor: "dropdown.disabled.border",
                  cursor: "not-allowed",
                }}
                placeholder={placeholder}
                _placeholder={{ color: 'dropdown.placeholder' }}
                icon={<ChevronRight stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
              >
                {options.map(option => <option key={`${name}-${option.value}`} value={option.value}>{option.label}</option>)}
              </Select>
              {(Icon && onAction) &&
                <Icon
                  stroke={stroke}
                  ml="20px"
                  cursor="pointer"
                  mt="10px"
                  onClick={() => onAction(attributeType)}
                />}
            </Flex>
            {error && <Box fontSize="smm" ml={1} mt={1} color='dropdown.error'>{error.message}</Box>}
            {tooltip &&
              <Flex color='dropdown.tooltip' align='center' mt={3}>
                <InfoOutlineIcon />
                <Box fontSize="11px" ml={2}>{tooltip}</Box>
              </Flex>}
          </Box>
        );
      }}
    />
  );
};

export const dropdownStyles = {
  dropdown: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
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
    tooltip: "#9A9EA1",
    icon: '#818197',
    chevronDownIcon: '#282F36',
  },
};

export default Dropdown;