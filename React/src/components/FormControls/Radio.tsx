import React from 'react';
import { Flex, Box, Tooltip, Icon, HStack, useRadio, useRadioGroup } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { IFieldComponent } from '../Field';

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Flex as="label" flexDirection="row">
      <input {...input} />
      {props.isChecked ? <Flex h="21px" w="21px" background="#1C8586" borderRadius="50%" mr="10px" alignItems="center" justifyContent="center">
        <CheckIcon color='white' h="10px" w="10px" />
      </Flex> : <Box h="21px" w="21px" border="1px solid #CBCCCD" borderRadius="50%" mr="10px"></Box>}
      <Box
        fontSize="14px"
        fontWeight="bold"
        color="brand.darkGrey"
        {...checkbox}
        cursor="pointer"
        mr="50px"
      >
        {props.children}
      </Box>
    </Flex>
  )
}

const Radio = ({ name, label, showDot, tooltip, disabled, value, error, touched, onChange: onValueChange, onBlur, options }: IFieldComponent) => {

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "radio",
    defaultValue: "",
    onChange: (value) => onValueChange({ target: { name, value: value } })
  })

  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return (<Box color="red.500">{error}</Box>);
  };

  const renderToolTip = () => {
    return (<Tooltip hasArrow aria-label={tooltip || ''} label={tooltip} placement="right"><Icon name="info" mb={1} h="14px" /></Tooltip>)
  }

  const group = getRootProps()

  return (
    <Box id={name}>
      {(label || showDot) && <Flex pt={2} pb={2} align='center' justify="space-between">
        <Box color="gray.600" fontWeight="bold" bg="#ffffff" fontSize={14} position="relative" top="18px" zIndex={2}>
          {label}{tooltip && renderToolTip()}
        </Box>
      </Flex>}
      <HStack {...group} mt="30px" >
        {(options || []).map((option) => {
          const radio = getRadioProps(option)

          return (
            <RadioCard key={option.label} {...radio}>
              {option.label}
            </RadioCard>
          )
        })}
      </HStack>
      {renderError()}
    </Box>
  );
};
export default Radio;