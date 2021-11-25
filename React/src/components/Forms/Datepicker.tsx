import React, { useRef } from 'react';
import { Box, Flex, Icon, Tooltip, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import { format } from 'date-fns';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { CalendarIcon } from '../../icons';

interface IDatepicker extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Datepicker = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false }: IDatepicker) => {
  const flatpickrRef = useRef();
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
                  color={error ? "form.datepicker.labelFont.error" : "form.datepicker.labelFont.normal"}
                  fontWeight="bold"
                  fontSize={11}
                  position="static"
                  left='none'
                  zIndex={2}
                >
                  {label}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                </Box>
              </Flex>
            )}
            <Flex
              pl={"16px"}
              align='center'
              borderRadius={"8px"}
              borderWidth={"1px"}
              pt='none'
              h="40px"
              mt="5px"
              mb={"-5px"}
              color="form.datepicker.font"
              bg="form.datepicker.bg"
              borderColor={error ? "form.datepicker.border.error" : "form.datepicker.border.normal"}
              cursor={disabled ? 'not-allowed' : 'pointer'}
              _active={{ bg: disabled ? "form.datepicker.disabled.bg" : "form.datepicker.activeBg" }}
              _focus={{ borderColor: error ? "form.datepicker.border.focus.error" : "form.datepicker.border.focus.normal" }}
              justify='space-between'
              onClick={() => {
                if (disabled) {
                  return;
                }
                // @ts-expect-error
                flatpickrRef.current.flatpickr.open();
              }}
            >
              {disabled
                ? <Text>{value ? format(value, 'd MMM yyyy') : ''}</Text>
                : <Flatpickr
                  name={name}
                  onChange={e => onChange(e[0])}
                  onClose={onBlur}
                  value={value}
                  defaultValue={value && new Date(value).toISOString()}
                  ref={flatpickrRef as any}
                />
              }
              <CalendarIcon
                w='14px'
                h='16px'
                mt='-2px'
                mr='15px'
              />
            </Flex>
            {error && <Box fontSize="smm" ml={1} mt={1} color='form.datepicker.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default Datepicker;
