import React from 'react';
import { Box, Flex, Icon, Textarea as ChakraTextarea, Tooltip } from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const Textarea = ({ name, label, showDot, tooltip, disabled, value, placeholder, error, touched, style, onChange, onBlur }: IFieldComponent) => {
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
      {(label || showDot) && <Flex pt={2} pb={2} align='center' justify="space-between" mt="-25px">
      <Box
          position="relative"
          width='full'
          height='25px'
          left="18px"
          top="35px"
          pt='5px'
          pl='1px'
          bgColor='white'
          fontWeight="bold"
          fontSize={11}
          color={(!error || !touched) ? "brand.darkGrey" : "red.500"}
          zIndex={2}
        >
          {label}:{tooltip && renderToolTip()}
        </Box>
        {renderDot()}
      </Flex>}
      <ChakraTextarea
        {...style}
        _active={{ bg: "#E2F4F4" }}
        _focus={(!error || !touched) ? { borderColor: "gray.600" } : { borderColor: "red.500" }}
        _hover={{}}
        borderColor={(!error || !touched) ? "#CBCCCD" : "red.500"}
        color="gray.600"
        borderRadius="8px"
        borderWidth="2px"
        pt="25px"
        pb="20px"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isDisabled={disabled}
        rows={5}
        _disabled={{ color: "gray.500", borderColor: "gray.200", cursor: "not-allowed" }}
        placeholder= {placeholder}
        _placeholder={{color:(!error || !touched) ? "gray.400" : "brand.darkGrey"}}
      />
      {renderError()}
    </Box>
  );
};

export default Textarea;
