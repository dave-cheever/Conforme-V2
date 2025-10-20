import { useRef } from 'react';
import ReactDatepicker from 'react-datepicker';
import { Controller } from 'react-hook-form';

import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { format } from 'date-fns';

import useValidate from '../../hooks/useValidate';
import { Asterisk, CalendarIcon } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface IDatepicker extends IField {
  placeholder?: string;
  styles?: {
    textInput?: {
      font?: string;
    };
  };
  disablePastDate?: boolean;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;

    return undefined;
  },
};

function Datepicker({
  control,
  name,
  label,
  placeholder = '',
  tooltip = '',
  required,
  validations = {},
  disabled = false,
  readMode = false,
  styles,
  disablePastDate = false,
}: IDatepicker) {
  const datePickerRef = useRef();
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
      control={control}
      data-id="000233"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box data-id="000234" id={name} w="full">
            {label && (
              <Flex align="center" data-id="000235" justify="space-between" mb="none" pt={2}>
                <Box
                  color={error ? 'datepicker.labelFont.error' : styles ? styles?.textInput?.font : 'datepicker.labelFont.normal'}
                  data-id="000236"
                  fontSize="ssm"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}
                >
                  {label}
                  {required && (
                    <Asterisk
                      data-id="000237"
                      fill="questionListElement.iconAsterisk"
                      h="9px"
                      mb="8px"
                      ml="5px"
                      stroke="datepicker.iconAsterisk"
                      w="9px"
                    />
                  )}{' '}
                  {tooltip && (
                    <Tooltip data-id="000238" hasArrow label={tooltip} placement="top">
                      <Icon data-id="000239" h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Box>
              </Flex>
            )}
            <Flex
              _active={{
                bg: disabled ? 'datepicker.disabled.bg' : 'datepicker.activeBg',
              }}
              _focus={{
                borderColor: error ? 'datepicker.border.focus.error' : 'datepicker.border.focus.normal',
              }}
              align="center"
              bg={readMode ? 'transparent' : disabled ? 'datepicker.disabled.bg' : 'datepicker.bg'}
              borderColor={
                readMode
                  ? 'transparent'
                  : disabled
                    ? 'datepicker.disabled.border'
                    : error
                      ? 'datepicker.border.error'
                      : 'datepicker.border.normal'
              }
              borderRadius="8px"
              borderWidth="1px"
              color={readMode ? 'datepicker.readMode.font' : 'datepicker.font'}
              cursor={readMode ? 'default' : disabled ? 'not-allowed' : 'pointer'}
              data-id="000240"
              h="42px"
              justify="space-between"
              mb="-5px"
              mt="5px"
              onClick={() => {
                if (!disabled) (datePickerRef.current as any).setOpen(true);
              }}
              overflow="hidden"
              pt="none"
            >
              {disabled || readMode ? (
                <Text data-id="000241" fontSize="smm" pl={readMode ? 0 : 4} w="full">
                  {value ? format(new Date(value), 'd MMM yyyy') : ''}
                </Text>
              ) : (
                <ReactDatepicker
                  calendarStartDay={1}
                  data-id="000242"
                  dateFormat="d MMM yyyy"
                  dateFormatCalendar="MMMM"
                  disabledKeyboardNavigation
                  dropdownMode="select"
                  minDate={disablePastDate ? new Date() : undefined}
                  name={name}
                  onCalendarClose={onBlur}
                  onChange={(date) => {
                    // Create a date that represents the local date without timezone conversion
                    // This prevents the date from shifting when serialized to JSON
                    const localDate = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null;
                    onChange(localDate);
                    setTimeout(() => {
                      if (datePickerRef.current) (datePickerRef.current as any).setOpen(false);
                    }, 0);
                  }}
                  placeholderText={placeholder}
                  ref={datePickerRef}
                  selected={value ? new Date(value) : null}
                  showPopperArrow={false}
                  showYearDropdown
                />
              )}
              {!readMode && <CalendarIcon data-id="000243" h="16px" ml="5px" mr="10px" mt="-2px" stroke="datepicker.font" w="14px" />}
            </Flex>
            {error && (
              <Box color="datepicker.error" data-id="000244" fontSize="smm" ml={1} mt={1}>
                {error.message}
              </Box>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
}

export const datepickerStyles = {
  datepicker: {
    font: '#777777',
    bg: '#FFFFFF',
    labelFont: {
      normal: '#2B3236',
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
    readMode: {
      font: '#000000',
    },
    disabled: {
      border: '#EEEEEE',
      bg: '#f7f7f7',
    },
    error: '#E53E3E',
  },
};

export default Datepicker;
