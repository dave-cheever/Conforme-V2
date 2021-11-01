import React from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const Number = ({ name, label, showDot, tooltip, disabled, value, validations, error, touched, onChange, onBlur }: IFieldComponent) => {
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
    return <Box fontSize={14} ml={1} color='red.500'>{error}</Box>;
  };

  const renderToolTip = () => {
    return (<Tooltip hasArrow aria-label={tooltip || ''} label={tooltip} placement="right"><Icon name="info" mb={1} h="14px" /></Tooltip>);
  };

  return (
    <Box id={name}>
      {(label || showDot) && <Flex pt={2} pb={2} align='center' justify="space-between" mt="-30px">
        <Box color={(!error || !touched) ? "brand.darkGrey" : "red.500"} fontWeight="bold" fontSize={11} position="relative" left="19px" top="32px" zIndex={2}>
          {label}{tooltip && renderToolTip()}
        </Box>
        {renderDot()}
      </Flex>}
      <Input
        borderRadius="8px"
        borderWidth="2px"
        pt="16px"
        h="55px"
        mt={label || showDot ? 0 : 0}
        type="number"
        color="gray.600"
        cursor="pointer"
        name={name}
        value={value}
        borderColor={(!error || !touched) ? "#CBCCCD" : "red.500"}
        _active={{ bg: "#E2F4F4" }}
        _focus={(!error || !touched) ? { borderColor: "gray.600" } : { borderColor: "red.500" }}
        onChange={onChange}
        onBlur={onBlur}
        isDisabled={disabled}
        min={1}
        step={1}
        _disabled={{ color: "gray.500", borderColor: "gray.200", cursor: "not-allowed" }}
      />
      {renderError()}
    </Box>
  );
};

export default Number;
