import { Controller } from 'react-hook-form';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Select } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk, ChevronRight } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface IDropdown extends IField {
  placeholder?: string;
  variant?: string;
  options?: {
    label?: string;
    value?: string;
  }[];
  required?: boolean;
  stroke?: string;
  help?: string;
  Icon?: any;
  attributeType?: 'Category' | 'Regulatory body';
  onAction?: (type?: 'Category' | 'Regulatory body') => void;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

function Dropdown({
  control,
  name,
  stroke,
  label,
  placeholder = '',
  required,
  tooltip = '',
  variant,
  validations = {},
  disabled = false,
  options = [],
  help = '',
  Icon,
  onAction,
  attributeType,
}: IDropdown) {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
        control={control}
        data-id="000245"
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="000246" id={name} mt="none" w="full">
              {label && (
                <Flex
                  align="center"
                  data-id="000247"
                  justify="space-between"
                  mb="none"
                  pt={2}>
                  <Box
                    color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
                    data-id="000248"
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="100%"
                    left="none"
                    position="static"
                    zIndex={1}>
                    {label}
                    {required && (
                      <Asterisk
                        data-id="000249"
                        fill="questionListElement.iconAsterisk"
                        h="9px"
                        mb="8px"
                        ml="5px"
                        stroke="questionListElement.iconAsterisk"
                        w="9px" />
                    )}{' '}
                    {help && (
                      <Box data-id="000250" fontSize="11px" mt={3} opacity={0.5}>
                        {help}
                      </Box>
                    )}
                  </Box>
                </Flex>
              )}
              <Flex alignItems={Icon ? 'center' : ''} data-id="000251">
                <Select
                  _active={{
                    bg: disabled ? 'dropdown.disabled.bg' : 'dropdown.activeBg',
                  }}
                  _disabled={{
                    bg: 'dropdown.disabled.bg',
                    color: 'dropdown.disabled.font',
                    borderColor: 'dropdown.disabled.border',
                    cursor: 'not-allowed',
                  }}
                  _focus={{
                    borderColor: error ? 'dropdown.border.focus.error' : 'dropdown.border.focus.normal',
                  }}
                  _placeholder={{ color: 'dropdown.placeholder' }}
                  bg="dropdown.bg"
                  borderColor={error ? 'dropdown.border.error' : 'dropdown.border.normal'}
                  borderRadius="8px"
                  borderWidth="1px"
                  color="dropdown.font"
                  css={{ paddingTop: '0' }}
                  cursor="pointer"
                  data-id="000252"
                  fontSize="smm"
                  h="42px"
                  icon={<ChevronRight
                    data-id="000253"
                    stroke="dropdown.chevronDownIcon"
                    transform="rotate(90deg)"
                    w={6}
                  />}
                  isDisabled={disabled}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder={placeholder}
                  top="5px"
                  value={options.length === 1 ? options[0].value : value || ''}>
                  {options.map((option) => (
                    <option
                      data-id="000254"
                      key={`${name}-${option.value}`}
                      value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {Icon && onAction && !value &&  <Icon
                  cursor="pointer"
                  data-id="000255"
                  ml="20px"
                  mt="10px"
                  onClick={() => onAction(attributeType)}
                  stroke={stroke} />}
              </Flex>
              {error && (
                <Box
                  color="dropdown.error"
                  data-id="000256"
                  fontSize="smm"
                  ml={1}
                  mt={1}>
                  {error.message}
                </Box>
              )}
              {tooltip && (
                <Flex align="center" color="dropdown.tooltip" data-id="000257" mt={3}>
                  <InfoOutlineIcon data-id="000258" />
                  <Box data-id="000259" fontSize="11px" ml={2}>
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

export const dropdownStyles = {
  dropdown: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      secondaryVariant: '#818197',
      normal: '#2B3236',
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
    placeholder: '#282F36',
    error: '#E53E3E',
    tooltip: '#9A9EA1',
    icon: '#818197',
    chevronDownIcon: '#282F36',
  },
};

export default Dropdown;
