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
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;

    return undefined;
  },
};

const Datepicker = ({
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
}: IDatepicker) => {
  const datePickerRef = useRef();
  const validate = useValidate(label || name, validations, definedValidations);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value } = field;
        const { error } = fieldState;
        return (
          <Box id={name} w="full">
            {label && (
              <Flex align="center" justify="space-between" mb="none" pt={2}>
                <Box
                  color={error ? 'datepicker.labelFont.error' : styles ? styles?.textInput?.font : 'datepicker.labelFont.normal'}
                  fontSize="ssm"
                  fontWeight="bold"
                  left="none"
                  position="static"
                  zIndex={2}
                >
                  {label}
                  {required && (
                    <Asterisk fill="questionListElement.iconAsterisk" h="9px" mb="8px" ml="5px" stroke="datepicker.iconAsterisk" w="9px" />
                  )}{' '}
                  {tooltip && (
                    <Tooltip hasArrow label={tooltip} placement="top">
                      <Icon h="14px" mb={1} name="info" />
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
              h="42px"
              justify="space-between"
              mb="-5px"
              mt="5px"
              overflow="hidden"
              pt="none"
            >
              {disabled || readMode ? (
                <Text fontSize="smm" pl={readMode ? 0 : 4}>
                  {value ? format(new Date(value), 'd MMM yyyy') : ''}
                </Text>
              ) : (
                <ReactDatepicker
                  calendarStartDay={1}
                  dateFormat="d MMM yyyy"
                  dateFormatCalendar="MMMM"
                  disabledKeyboardNavigation
                  dropdownMode="select"
                  name={name}
                  onCalendarClose={onBlur}
                  onChange={(date) => onChange(date)}
                  placeholderText={placeholder}
                  ref={datePickerRef}
                  selected={value ? new Date(value) : null}
                  showPopperArrow={false}
                  showYearDropdown
                />
              )}
              {!readMode && (
                <CalendarIcon
                  h="16px"
                  ml="5px"
                  mr="10px"
                  mt="-2px"
                  onClick={() => {
                    if (!disabled) (datePickerRef.current as any).setOpen(true);
                  }}
                  stroke="datepicker.font"
                  w="14px"
                />
              )}
            </Flex>
            {error && (
              <Box color="datepicker.error" fontSize="smm" ml={1} mt={1}>
                {error.message}
              </Box>
            )}
          </Box>
        );
      }}
      rules={{ validate }}
    />
  );
};

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
