import React from 'react';
import { Flex, Box, Checkbox as ChakraCheckbox, Tooltip, Icon } from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const Checkbox = ({ name, label, showDot, tooltip, disabled, value, error, touched, style, onChange: onValueChange, onBlur }: IFieldComponent) => {
  const renderFieldCircle = () => {
    if (!showDot) {
      return <Box w="50px" />;
    }
    return <Box flexShrink={0} w='14px' h='14px' mr={1} bg={error ? 'red.500' : 'green.500'} rounded='full' />;
  };

  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return (<Box color="red.500">{error}</Box>);

  };

  const onChange = () => {
    if (disabled) {
      return;
    }
    if (!touched) {
      onBlur({ target: { name } });
    }
    onValueChange({ target: { name, value: !value } });
  };

  const renderToolTip = () => {
    return (<Tooltip hasArrow aria-label={tooltip || ''} label={tooltip} placement="right"><Icon name="info" mb={1} h="14px" /></Tooltip>)
  }

  return (
    <Box id={name}>
      <Flex position='relative' left="-50px" justifyContent='flex-start' alignItems='center' {...style}>
        {renderFieldCircle()}
        <ChakraCheckbox
          css={{
            ".chakra-checkbox__control": {
              borderRadius: "50%",
              width: "21px",
              height: "21px",
              "&[data-checked]": {
                background: "#1C8586",
                borderColor: "#1C8586",
                "&[data-hover]": {
                  background: "#1C8586",
                  borderColor: "#1C8586"
                }
              }
            }
          }}
          py={3}
          isChecked={value}
          isDisabled={disabled}
          onChange={onChange}
        >
          {label}{' '}{tooltip && renderToolTip()}
        </ChakraCheckbox>
      </Flex>
      {renderError()}
    </Box>
  );
};

export default Checkbox;
