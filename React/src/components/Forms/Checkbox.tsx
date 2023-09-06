import { Controller } from 'react-hook-form';

import { Box, Checkbox as ChakraCheckbox, Icon, Tooltip } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ICheckbox extends IField {}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

function Checkbox({ control, name, label, tooltip = '', validations = {}, disabled = false }: ICheckbox) {
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    (<Controller
      control={control}
      data-id="53f5da81a8b5"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;
        return (
          (<Box data-id="b2287ccd03d2" id={name} mt="none">
            <ChakraCheckbox
              borderColor="form.checkbox.icon.border"
              colorScheme="form.checkbox.icon"
              css={{
                '.chakra-checkbox__control': {
                  borderRadius: '5px',
                  borderWidth: '1px',
                  width: '21px',
                  height: '21px',
                },
              }}
              data-id="a1e09eb30b29"
              isChecked={value}
              isDisabled={disabled}
              onChange={() => onChange(!value)}
              py={3}>
              {label}{' '}
              {tooltip && (
                <Tooltip data-id="d3eb0a56c521" hasArrow label={tooltip} placement="top">
                  <Icon data-id="10a9cd23e39f" h="14px" mb={1} name="info" />
                </Tooltip>
              )}
            </ChakraCheckbox>
            {error && (
              <Box
                color="form.checkbox.error"
                data-id="887245f805f8"
                fontSize={14}
                ml={1}
                mt={1}>
                {error.message}
              </Box>
            )}
          </Box>)
        );
      }}
      rules={{ validate }} />)
  );
}

export default Checkbox;
