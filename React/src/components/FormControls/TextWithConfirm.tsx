import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex, Icon, Input, Tooltip, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { IFieldComponent } from '../Field';

const TextWithConfirm = ({ name, label, showDot, tooltip, disabled, value, validations, placeholder, error, touched, style, variant, onChange, onBlur }: IFieldComponent) => {
  const inputRef = useRef<HTMLInputElement>();
  const parsedValue = value || '';
  const [tempValue, setTempValue] = useState(parsedValue);

  useEffect(() => {
    if (value === undefined) {
      // Set tempValue to empty string reset the value
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setTempValue('');
    }
  }, [value]);  

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
    <Box id={name} mt={variant !== 'secondaryVariant' ? 2 : 0}>
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
          {label} {validations?.required && <Text as='span' color='red.500'>(required)</Text>} {tooltip && renderToolTip()}
          {variant === 'secondaryVariant' && placeholder && <Box opacity={.5}>{placeholder}</Box>}
        </Box>
        {renderDot()}
      </Flex>}
      <Flex>
        <Input
          {...style}
          borderRadius={tempValue !== parsedValue ? "8px 0 0 8px" : "8px"}
          borderWidth={tempValue !== parsedValue ? "2px 0 2px 2px" : "2px"}
          pt={variant !== 'secondaryVariant' && "16px"}
          h={variant !== 'secondaryVariant' ? "55px" : "40px"}
          type="text"
          color="gray.600"
          name={name}
          defaultValue={parsedValue}
          borderColor={(!error || !touched) ? "#CBCCCD" : "red.500"}
          _active={{ bg: "#E2F4F4" }}
          _focus={(!error || !touched) ? { borderColor: "gray.600" } : { borderColor: "red.500" }}
          _hover={{ cursor: "auto" }}
          onChange={() => setTempValue(inputRef.current?.value)}
          onBlur={onBlur}
          isDisabled={disabled}
          cursor="pointer"
          _disabled={{ color: "gray.500", borderColor: "gray.200", cursor: "not-allowed" }}
          maxLength={validations && validations.forceMaxLength ? validations && validations.maxLength : undefined}
          placeholder={variant === 'secondaryVariant' ? '' : placeholder}
          _placeholder={{ color: (!error || !touched) ? "gray.400" : "brand.darkGrey" }}
          ref={inputRef}
          transition='none'
        />
        {tempValue !== parsedValue && (
          <Flex
            direction='column'
            cursor='pointer'
            color='white'
          >
            <Flex
              grow={1}
              w={6}
              borderRadius="0 8px 0 0"
              align='center'
              justify='center'
              bgColor='brand.bmiGreen'
              onClick={() => onChange({ target: { name, value: inputRef.current?.value } })}
            ><CheckIcon /></Flex>
            <Flex
              grow={1}
              w={6}
              borderRadius="0 0 8px 0"
              align='center'
              justify='center'
              bgColor='brand.primary'
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = parsedValue;
                }
                setTempValue(parsedValue);
              }}
            ><CloseIcon w='12px' /></Flex>
          </Flex>
        )}
      </Flex>
      {renderError()}
    </Box>
  );
};

export default TextWithConfirm;
