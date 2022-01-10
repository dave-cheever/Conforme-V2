import { Box, Checkbox, Flex, Icon, Stack, Tooltip } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { IField } from '../../interfaces/IField';
import { Asterisk } from '../../icons';

interface IMultipleChoices extends IField {
  placeholder?: string;
  defaultvalue?: any;
}

const MultipleChoices = ({ control, name, label, required, tooltip = '', validations = {}, disabled = false, defaultvalue }: IMultipleChoices) => {
  return (
    <Box w='full' id={name}>
      {label && (
        <Flex pt={2} pb={2} align='center' justify="space-between" mb='none'>
          <Box
            color="multipleChoices.labelFont.normal"
            fontWeight="bold"
            fontSize={11}
            position="static"
            left='none'
            zIndex={2}
          >
            {label}
            {required && <Asterisk ml="10px" stroke='multipleChoices.iconAsterisk' w='9px' h='9px' />}
            {' '}
            {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
          </Box>
        </Flex>
      )}
      {defaultvalue.map(({ label }: { label: string, isCorrect: boolean }, index) => {
        return (
          <Controller
            key={index}
            name={`${name}.${index}.isCorrect`}
            control={control}
            render={({ field, fieldState, formState }) => {
              const { onChange, value } = field;
              return (
                <Stack direction="column">
                  <Checkbox
                    css={{
                      ".chakra-checkbox__control": {
                        borderRadius: '5px',
                        borderWidth: '1px',
                        width: "21px",
                        height: "21px",
                      },
                      ".chakra-checkbox__label": {
                        fontSize: "14px",
                        fontWeight: "normal",
                        color: "#818197"
                      }
                    }}
                    borderColor="multipleChoices.icon.border"
                    colorScheme="form.checkbox.icon"
                    py={1}
                    isChecked={value}
                    isDisabled={disabled}
                    onChange={() => onChange(!value)}
                  >
                    {label}{' '}{tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
                  </Checkbox>
                </Stack>
              )
            }} />
        )
      })}
    </Box>
  )
}

export default MultipleChoices

export const multipleChoicesStyles = {
  multipleChoices: {
    labelFont: {
      normal: '#2B3236',
    },
    iconAsterisk: '#E93C44',
    icon: {
      border: '#CBCCCD',
    },

  }
}