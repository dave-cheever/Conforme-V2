import { Controller } from 'react-hook-form';

import { Box, Button, Flex, Text } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';

interface ISwitch extends IField {
  placeholder?: string;
  requiredAnswer?: string;
  notApplicable?: boolean;
  variant?: string;
}

const definedValidations: TDefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) return `${label} cannot be empty`;
  },
};

const Switch = ({ control, name, label, required, requiredAnswer, notApplicable, disabled, validations = {} }: ISwitch) => {
  const validate = useValidate(label || name, validations, definedValidations);

  const RenderButton = ({ laterality, value, onchange, name, requiredAnswer }) => (
    <Button
      _hover={disabled ? {} : { bg: 'switch.activebtn.bg', color: 'switch.activebtn.color' }}
      bg={
        laterality === 'left' && value === 'yes'
          ? 'switch.activebtn.bg'
          : laterality === 'right' && value === 'no'
          ? 'switch.activebtn.bg'
          : 'switch.btn.bg'
      }
      color={
        laterality === 'left' && value === 'yes'
          ? 'switch.activebtn.color'
          : laterality === 'right' && value === 'no'
          ? 'switch.activebtn.color'
          : 'switch.btn.color'
      }
      data-id="9c2ec21293ba"
      disabled={requiredAnswer === 'na' || disabled}
      fontSize="smm"
      fontWeight="bold"
      name={name}
      onClick={() => {
        if (disabled) return;
        if ((laterality === 'left' && value === 'yes') || (laterality === 'right' && value === 'no')) onchange('');
        else onchange(laterality === 'left' ? 'yes' : 'no');
      }}
      p="10px 20px">
      {laterality === 'left' ? 'Yes' : 'No'}
    </Button>
  );
  return (
    (<Controller
      control={control}
      data-id="f0da3c22bcd6"
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;
        return (
          (<Box data-id="b1e6ad610c5e">
            <Text
              color="switch.form.labelColor"
              data-id="c604d0fdcae5"
              fontSize="ssm"
              fontWeight="bold"
              pb="10px"
              pt="8px">
              {label}
              {requiredAnswer === 'yes' && value === 'no' && (
                <Box
                  as="span"
                  color="switch.form.labelColor"
                  data-id="7c472a73cb8a"
                  fontSize="xs"
                  fontWeight="medium">
                  {' '}
                  ( The required answer is Yes )
                </Box>
              )}
              {requiredAnswer === 'no' && value === 'yes' && (
                <Box
                  as="span"
                  color="switch.form.labelColor"
                  data-id="5470f6b4b584"
                  fontSize="xs"
                  fontWeight="medium">
                  {' '}
                  ( The required answer is No )
                </Box>
              )}
              {required && (
                <Asterisk
                  data-id="8c639acd19c9"
                  fill="questionListElement.iconAsterisk"
                  h="9px"
                  mb="8px"
                  ml="5px"
                  stroke="questionListElement.iconAsterisk"
                  w="9px" />
              )}
            </Text>
            <Flex data-id="5d9cb745744b">
              <RenderButton
                data-id="3e6a1e2bf6cb"
                laterality="left"
                name={name}
                onchange={onChange}
                requiredAnswer={requiredAnswer}
                value={value} />
              &nbsp;&nbsp;
              <RenderButton
                data-id="00117738024f"
                laterality="right"
                name={name}
                onchange={onChange}
                requiredAnswer={requiredAnswer}
                value={value} />
              {notApplicable && (
                <>
                  &nbsp;&nbsp;
                  <Button
                    _hover={{
                      bg: 'switch.activebtn.bg',
                      color: 'switch.activebtn.color',
                    }}
                    bg={value === 'na' ? 'switch.activebtn.bg' : 'switch.btn.bg'}
                    color={value === 'na' ? 'switch.activebtn.color' : 'switch.btn.color'}
                    data-id="328a1c3707ab"
                    disabled={disabled}
                    fontSize="smm"
                    fontWeight="bold"
                    name={name}
                    onClick={() => {
                      if (value === 'na') {
                        onChange('');
                        return;
                      }
                      onChange('na');
                    }}
                    p="10px 20px">
                    NA
                  </Button>
                </>
              )}
            </Flex>
            {error && (
              <Box
                color="switch.form.textInput.error"
                data-id="681237fa20d8"
                fontSize={14}
                ml={1}>
                {error.message}
              </Box>
            )}
          </Box>)
        );
      }}
      rules={{ validate }} />)
  );
};

export default Switch;

export const switchStyles = {
  switch: {
    btn: {
      bg: '#F0F2F5',
      color: '#818197',
    },
    activebtn: {
      bg: '#462AC4',
      color: '#ffffff',
    },
    form: {
      labelColor: '#2B3236',
      textInput: {
        error: '#E53E3E',
      },
    },
  },
};
