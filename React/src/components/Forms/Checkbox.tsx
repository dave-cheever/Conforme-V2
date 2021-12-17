import { Box, Icon, Tooltip, Checkbox as ChakraCheckbox } from '@chakra-ui/react';

import { Controller } from 'react-hook-form';
import { DefinedValidations } from '../../interfaces/Validations';
import { IField } from '../../interfaces/IField';
import useValidate from '../../hooks/useValidate';

interface ICheckbox extends IField {}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Checkbox = ({ control, name, label, tooltip = '', validations = {}, disabled = false }: ICheckbox) => {
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
          <Box id={name} mt='none'>
            <ChakraCheckbox
              css={{
                ".chakra-checkbox__control": {
                  borderRadius: '5px',
                  borderWidth: '1px',
                  width: "21px",
                  height: "21px",
                }
              }}
              borderColor="form.checkbox.icon.border"
              colorScheme="form.checkbox.icon"
              py={3}
              isChecked={value}
              isDisabled={disabled}
              onChange={() => {
                onChange(!value);
                onBlur();
              }}
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
