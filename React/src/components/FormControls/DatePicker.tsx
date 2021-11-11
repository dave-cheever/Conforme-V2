import React, { useRef } from 'react';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import { Flex, Box, Tooltip, Icon, Text } from '@chakra-ui/react';
import moment from 'moment';

import { IFieldComponent } from '../Field';
import { CalendarIcon } from '../../icons';

const styleProps = {
  datepicker: (disabled, error, touched, variant) => ({
    pl: "16px",
    align: 'center',
    borderRadius: "8px",
    borderWidth: "2px",
    pt: variant !== 'secondaryVariant' ? "16px" : 'none',
    h: variant !== 'secondaryVariant' ? "55px" : "40px",
    mb: "-5px",
    color: disabled ? 'gray.500' : 'gray.600',
    borderColor: (!error || !touched) ? "#CBCCCD" : "red.500",
    cursor: disabled ? 'not-allowed' : 'pointer',
    _active: { bg: "#E2F4F4" },
    _focus: { borderColor: "gray.500" }
  }),
};
const DatePicker = ({ name, label, showDot, tooltip, disabled, value, error, validations, touched, variant, placeholder, onChange, onBlur }: IFieldComponent) => {
  const flatpickrRef = useRef();
  const options = {
    altInput: true,
    altFormat: "J M Y",
    defaultDate: value,
    static: variant === 'secondaryVariant',
    clickOpens: false,
  };

  const renderDot = () => {
    if (!showDot) {
      return <Box w="50px" />;
    }
    return <Box flexShrink={0} w='14px' h='14px' mr={1} bg={error ? 'red.500' : 'green.500'} rounded='full' />;
  };

  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return <Box pt="7px" fontSize={14} ml={1} color='red.500'>{error}</Box>;
  };

  const renderToolTip = () => {
    return (<Tooltip hasArrow aria-label={tooltip || ''} label={tooltip} placement="right"><Icon name="info" mb={1} h="14px" /></Tooltip>);
  };

  return (
    <Box id={name}>
      {(label || showDot) && (
        <Flex
          pt={variant !== 'secondaryVariant' ? 2 : "10px"}
          pb={2}
          align='center'
          justify="space-between"
          mt={variant !== 'secondaryVariant' ? "-18px" : 'none'}
        >
          <Box
            color={(!error || !touched) ? "brand.darkGrey" : "red.500"}
            fontWeight="bold"
            fontSize={11}
            position={variant !== 'secondaryVariant' ? "relative" : "static"}
            left={variant !== 'secondaryVariant' ? "19px" : 'none'}
            top={variant !== 'secondaryVariant' ? "32px" : 'none'}
            zIndex={2}
          >
            {label} {validations?.required && <Text as='span' color='red.500'>(required)</Text>} {tooltip && renderToolTip()}
            {variant === 'secondaryVariant' && placeholder && <Box opacity={.5}>{placeholder}</Box>}
          </Box>
          {renderDot()}
        </Flex>
      )}
      <Flex
        {...styleProps.datepicker(disabled, error, touched, variant)}
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
          ? <Text>{value ? moment(value).format('D MMM YYYY') : ' '}</Text>
          : <Flatpickr
            name={name}
            onChange={e => onChange({ target: { name, value: e[0] } })}
            onClose={() => onBlur({ target: { name } })}
            options={options}
            value={value}
            // ref={flatpickrRef}
          />
        }
        <CalendarIcon
          w='14px'
          h='16px'
          mt={variant !== 'secondaryVariant' ? '-15px' : '-2px'}
          mr='15px'
        />
      </Flex>
      {renderError()}
    </Box>
  );
};

export default DatePicker;
