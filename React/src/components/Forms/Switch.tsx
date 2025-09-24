import { Controller } from 'react-hook-form';

import { Box, Button, Flex, Text } from '@chakra-ui/react';

import useValidate from '../../hooks/useValidate';
import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import { TDefinedValidations } from '../../interfaces/TValidations';
import SwitchButton from './SwitchButton';

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

function Switch({ control, name, label, required, requiredAnswer, notApplicable, disabled, validations = {} }: ISwitch) {
  const validate = useValidate(label || name, validations, definedValidations);

  return (
    <Controller
        data-id="000338"
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const { onChange, value } = field;
          const { error } = fieldState;
          return (
            <Box data-id="000339">
              <Text
                data-id="000340"
                color="switch.form.labelColor"
                fontSize="ssm"
                fontWeight="bold"
                pb="10px"
                pt="8px">
                {label}
                {requiredAnswer === 'yes' && value === 'no' && (
                  <Box
                    data-id="000341"
                    as="span"
                    color="switch.form.labelColor"
                    fontSize="xs"
                    fontWeight="medium">
                    {' '}
                    ( The required answer is Yes )
                  </Box>
                )}
                {requiredAnswer === 'no' && value === 'yes' && (
                  <Box
                    data-id="000342"
                    as="span"
                    color="switch.form.labelColor"
                    fontSize="xs"
                    fontWeight="medium">
                    {' '}
                    ( The required answer is No )
                  </Box>
                )}
                {required && (
                  <Asterisk
                    data-id="000343"
                    fill="questionListElement.iconAsterisk"
                    h="9px"
                    mb="8px"
                    ml="5px"
                    stroke="questionListElement.iconAsterisk"
                    w="9px" />
                )}
              </Text>
              <Flex data-id="000344">
                <SwitchButton
                  data-id="000345"
                  disabled={disabled}
                  laterality="left"
                  name={name}
                  onchange={onChange}
                  requiredAnswer={requiredAnswer}
                  value={value} />
                &nbsp;&nbsp;
                <SwitchButton
                  data-id="000346"
                  disabled={disabled}
                  laterality="right"
                  name={name}
                  onchange={onChange}
                  requiredAnswer={requiredAnswer}
                  value={value} />
                {notApplicable && (
                  <>
                    &nbsp;&nbsp;
                    <Button
                      data-id="000347"
                      _hover={{
                        bg: 'switch.activebtn.bg',
                        color: 'switch.activebtn.color',
                      }}
                      bg={value === 'na' ? 'switch.activebtn.bg' : 'switch.btn.bg'}
                      color={value === 'na' ? 'switch.activebtn.color' : 'switch.btn.color'}
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
                  data-id="000348"
                  color="switch.form.textInput.error"
                  fontSize={14}
                  ml={1}>
                  {error.message}
                </Box>
              )}
            </Box>
          );
        }}
        rules={{ validate }} />
  );
}

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
