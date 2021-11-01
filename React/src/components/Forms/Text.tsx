import React from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';

interface ITextField extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
  maxLength: (label, validationValue, value = '') => {
    if (value.length < validationValue) {
      return `${label} can be maximum ${validationValue} characters length`;
    }
  },
};

const Text = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false }: ITextField) => {
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
              <Flex pt={2} pb={2} align='center' justify="space-between" mt={variant !== 'secondaryVariant' ? "-30px" : 'none'}>
                <Box
                  color={error ? "red.500" : "brand.darkGrey"}
                  fontWeight="bold"
                  fontSize={11}
                  position={variant !== 'secondaryVariant' ? "relative" : "static"}
                  left={variant !== 'secondaryVariant' ? "19px" : 'none'}
                  top={variant !== 'secondaryVariant' ? "32px" : 'none'}
                  zIndex={2}
                >
                  {label}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                  {variant === 'secondaryVariant' && placeholder && <Box opacity={.5}>{placeholder}</Box>}
                </Box>
              </Flex>
            )}
            <Input
              borderRadius="8px"
              borderWidth="2px"
              pt={variant !== 'secondaryVariant' ? "16px" : 'none'}
              h={variant !== 'secondaryVariant' ? "55px" : "40px"}
              type="text"
              color="gray.600"
              name={name}
              defaultValue={value}
              borderColor={error ? "red.500" : "#CBCCCD"}
              _active={{ bg: "#E2F4F4" }}
              _focus={error ? { borderColor: "red.500" } : { borderColor: "gray.600" }}
              _hover={{ cursor: "auto" }}
              onChange={onChange}
              onBlur={onBlur}
              isDisabled={disabled}
              cursor="pointer"
              _disabled={{ color: "gray.500", borderColor: "gray.200", cursor: "not-allowed" }}
              maxLength={validations && validations.forceMaxLength ? validations.maxLength as number : undefined}
              placeholder={variant === 'secondaryVariant' ? '' : placeholder}
              _placeholder={{ color: error ? "brand.darkGrey" : "gray.400" }}
            />
            {error && <Box fontSize={14} ml={1} color='red.500'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default Text;
