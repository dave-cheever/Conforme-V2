import React from 'react';
import { Box, Flex, Tooltip, Icon, Select } from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const Dropdown = ({ name, label, showDot, tooltip, disabled, value, error, touched, onChange, onBlur, options, placeholder, style }: IFieldComponent) => {
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
      {(label || showDot) && <Flex align='center' justify="space-between" mt="-8px">
        <Box color={(!error || !touched) ? "brand.darkGrey" : "red.500"} fontWeight="bold" fontSize={11} position="relative" left="19px" top="28px" zIndex={2}>
          {label}{tooltip && renderToolTip()}
        </Box>
        {renderDot()}
      </Flex>}
      <Select
        css={{paddingTop:"15px"}}
        {...style}
        borderRadius="8px"
        borderWidth="2px"
        top="5px"
        h="55px"
        color="gray.600"
        borderColor={(!error || !touched) ? "#CBCCCD" : "red.500"}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        name={name}
        isDisabled={disabled}
        cursor="pointer"
        _active={{ bg: "#E2F4F4" }}
        _focus={(!error || !touched) ? { borderColor: "gray.600" } : { borderColor: "red.500" }}
        _disabled={{ opacity: 1, color: "gray.500", borderColor: "gray.200", cursor: "not-allowed" }}
        placeholder={placeholder}
      >
        {(options || []).map(option => <option key={`${name}-${option.value}`} value={option.value}>{option.label}</option>)}
      </Select>
      {renderError()}
    </Box>
  );
};

export default Dropdown;
