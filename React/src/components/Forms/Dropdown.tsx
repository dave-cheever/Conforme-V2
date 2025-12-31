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
                pb="6px" >
                <Box
                  color={error ? 'dropdown.labelFont.error' : 'dropdown.labelFont.normal'}
                  data-id="000248"
                  fontSize="16px"
                  fontWeight="500"
                  lineHeight="100%"
                  left="none"
                  position="static">
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
                </Box>
              </Flex>
            )}
            {help && (
              <Box data-id="000250" fontSize="11px" mb="6px" opacity={0.6}>
                {help}
              </Box>
            )}
            <Flex alignItems={Icon ? 'center' : 'stretch'} data-id="000251" w="full">
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
                _hover={{
                  borderColor: error ? 'dropdown.border.error' : 'dropdown.border.hover',
                }}
                _placeholder={{ 
                  color: 'dropdown.placeholder',
                  fontSize: 'smm',
                }}
                bg="dropdown.bg"
                borderColor={error ? 'dropdown.border.error' : 'dropdown.border.normal'}
                borderRadius="8px"
                borderWidth="1px"
                color="dropdown.font"
                cursor="pointer"
                data-id="000252"
                fontSize="smm"
                h="40px"
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
                sx={{
                  '& > option': {
                    bg: 'dropdown.bg',
                    color: 'dropdown.font',
                    fontSize: '14px !important',
                  },
                  '& > option:hover': {
                    bg: 'dropdown.optionHover',
                  },
                  '& > option:checked': {
                    bg: 'dropdown.optionSelected',
                    color: 'dropdown.font',
                  },
                }}
                value={value || ''}
                w="full">
                {options.map((option) => {
                  const maxLength = 55;
                  const truncatedLabel = option.label && option.label.length > maxLength
                    ? `${option.label.substring(0, maxLength)}...`
                    : option.label;
                  return (
                    <option
                      data-id="000254"
                      key={`${name}-${option.value}`}
                      value={option.value}
                      title={option.label}
                      >
                      {truncatedLabel}
                    </option>
                  );
                })}
              </Select>
              {Icon && onAction && !value && (
                <Box
                  alignSelf="center"
                  data-id="000255"
                  ml="12px">
                  <Icon
                    cursor="pointer"
                    data-id="000255"
                    onClick={() => onAction(attributeType)}
                    stroke={stroke} />
                </Box>
              )}
            </Flex>
            {error && (
              <Box
                color="dropdown.error"
                data-id="000256"
                fontSize="12px"
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
      hover: '#999999',
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
    tooltip: '#9A9EA1',
    icon: '#818197',
    chevronDownIcon: '#282F36',
    optionHover: '#F5F5F5',
    optionSelected: '#E8F4F8',
  },
};

export default Dropdown;
