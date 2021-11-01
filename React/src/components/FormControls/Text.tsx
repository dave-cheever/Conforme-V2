import React from 'react';
import { Box, Flex, Icon, Input, Tooltip } from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const Text = ({ name, label, showDot, tooltip, disabled, value, validations, placeholder, error, touched, style, variant, onChange, onBlur }: IFieldComponent) => {
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
    <Box id={name} mt={variant !== 'secondaryVariant' ? 2 : 'none'}>
      {(label || showDot) && <Flex pt={2} pb={2} align='center' justify="space-between" mt={variant !== 'secondaryVariant' ? "-30px" : 'none'}>
        <Box 
          color={(!error || !touched) ? "brand.darkGrey" : "red.500"} 
          fontWeight="bold" 
          fontSize={11} 
          position={variant !== 'secondaryVariant' ? "relative" : "static"} 
          left={variant !== 'secondaryVariant' ? "19px" : 'none'} 
          top={variant !== 'secondaryVariant' ? "32px" : 'none'} 
          zIndex={2}
        >
          {label}{tooltip && renderToolTip()}
          {variant === 'secondaryVariant' && placeholder && <Box opacity={.5}>{placeholder}</Box>}
        </Box>
        {renderDot()}
      </Flex>}
      <Input
        {...style}
        borderRadius="8px"
        borderWidth="2px"
        pt={variant !== 'secondaryVariant' && "16px"}
        h={variant !== 'secondaryVariant' ? "55px" : "40px"}
        type="text"
        color="gray.600"
        name={name}
        defaultValue={value}
        borderColor={(!error || !touched) ? "#CBCCCD" : "red.500"}
        _active={{ bg: "#E2F4F4" }}
        _focus={(!error || !touched) ? { borderColor: "gray.600" } : { borderColor: "red.500" }}
        _hover={{ cursor: "auto" }}
        onChange={({ target }) => {
          const { name, value } = target;
          onChange({ target: { name, value } });
        }}
        onBlur={onBlur}
        isDisabled={disabled}
        cursor="pointer"
        _disabled={{ color: "gray.500", borderColor: "gray.200", cursor: "not-allowed" }}
        maxLength={validations && validations.forceMaxLength ? validations && validations.maxLength : undefined}
        placeholder={variant === 'secondaryVariant' ? '' : placeholder}
        _placeholder={{color:(!error || !touched) ? "gray.400" : "brand.darkGrey"}}
      />
      {renderError()}
    </Box>
  );
};

export default Text;
