import { Box, Flex, Icon, Tooltip, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import ReactDatepicker from "react-datepicker";
import { format } from 'date-fns';

import useValidate from '../../hooks/useValidate';
import { IField } from '../../interfaces/IField';
import { DefinedValidations } from '../../interfaces/Validations';
import { Asterisk, CalendarIcon } from '../../icons';
import { useRef } from 'react';

interface IDatepicker extends IField {
  placeholder?: string;
  styles?: {
    textInput?: {
      font?: string
    }
  }
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Datepicker = ({ control, name, label, placeholder = '', tooltip = '', required, validations = {}, disabled = false, styles }: IDatepicker) => {
  const datePickerRef = useRef();
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
          <Box w='full' id={name}>
            {label && (
              <Flex pt={2} align='center' justify="space-between" mb='none'>
                <Box
                  color={error ? "datepicker.labelFont.error" : styles ? styles?.textInput?.font : "datepicker.labelFont.normal"}
                  fontWeight="bold"
                  fontSize="ssm"
                  position="static"
                  left='none'
                  zIndex={2}
                >
                  {label}
                  {required && <Asterisk ml="5px" mb="8px" fill="questionListElement.iconAsterisk" stroke='datepicker.iconAsterisk' w="9px" h="9px" />}
                  {' '}
                  {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                </Box>
              </Flex>
            )}
            <Flex
              pl="3px"
              align='center'
              borderRadius={"8px"}
              borderWidth={"1px"}
              pt='none'
              h="40px"
              mt="5px"
              mb={"-5px"}
              color="datepicker.font"
              bg="datepicker.bg"
              borderColor={error ? "datepicker.border.error" : "datepicker.border.normal"}
              cursor={disabled ? 'not-allowed' : 'pointer'}
              _active={{ bg: disabled ? "datepicker.disabled.bg" : "datepicker.activeBg" }}
              _focus={{ borderColor: error ? "datepicker.border.focus.error" : "datepicker.border.focus.normal" }}
              justify="space-between"
            >
              {disabled
                ? <Text>{value ? format(new Date(value), 'd MMM yyyy') : ''}</Text>
                : <ReactDatepicker
                  dateFormat="d MMM yyyy"
                  name={name}
                  onChange={date => onChange(date)}
                  onCalendarClose={onBlur}
                  selected={value ? new Date(value) : null}
                  placeholderText={placeholder}
                  ref={datePickerRef}
                  disabledKeyboardNavigation
                  showYearDropdown
                  dropdownMode="select"
                  dateFormatCalendar="MMMM"
                />
              }
              <CalendarIcon
                w='14px'
                h='16px'
                mt='-2px'
                mr='15px'
                onClick={() => {
                  // @ts-ignore
                  datePickerRef.current.setOpen(true);
                }}
              />
            </Flex>
            {error && <Box fontSize="smm" ml={1} mt={1} color='datepicker.error'>{error.message}</Box>}
          </Box>
        );
      }}
    />
  );
};

export const datepickerStyles = {
  datepicker: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      normal: '#818197',
      error: '#E53E3E',
    },
    iconAsterisk: '#E93C44',
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
    error: '#E53E3E',
  },
};

export default Datepicker;
