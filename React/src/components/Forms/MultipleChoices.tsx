import { Controller } from 'react-hook-form';

import { Box, Checkbox, Flex, Icon, Stack, Tooltip } from '@chakra-ui/react';

import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';

interface IMultipleChoices extends IField {
  placeholder?: string;
}

const MultipleChoices = ({
  control,
  name,
  label,
  required,
  tooltip = '',
  disabled = false,
  defaultvalue,
}: IMultipleChoices) => (
  <Box id={name} w="full">
    {label && (
      <Flex align="center" justify="space-between" mb="none" pb={2} pt={2}>
        <Box
          color="multipleChoices.labelFont.normal"
          fontSize="ssm"
          fontWeight="bold"
          left="none"
          position="static"
          zIndex={2}
        >
          {label}
          {required && (
            <Asterisk
              fill="questionListElement.iconAsterisk"
              h="9px"
              mb="8px"
              ml="5px"
              stroke="questionListElement.iconAsterisk"
              w="9px"
            />
          )}{' '}
          {tooltip && (
            <Tooltip hasArrow label={tooltip} placement="top">
              <Icon h="14px" mb={1} name="info" />
            </Tooltip>
          )}
        </Box>
      </Flex>
    )}
    {defaultvalue?.map(
      ({ label }: { label: string; isCorrect: boolean }, index) => (
        <Controller
          control={control}
          key={index}
          name={`${name}.${index}.isCorrect`}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <Stack direction="column">
                <Checkbox
                  borderColor="multipleChoices.icon.border"
                  colorScheme="form.checkbox.icon"
                  css={{
                    '.chakra-checkbox__control': {
                      borderRadius: '5px',
                      borderWidth: '1px',
                      width: '21px',
                      height: '21px',
                    },
                    '.chakra-checkbox__label': {
                      fontSize: '14px',
                      fontWeight: 'normal',
                      color: '#818197',
                    },
                  }}
                  isChecked={value}
                  isDisabled={disabled}
                  onChange={() => onChange(!value)}
                  py={1}
                >
                  {label}{' '}
                  {tooltip && (
                    <Tooltip hasArrow label={tooltip} placement="top">
                      <Icon h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Checkbox>
              </Stack>
            );
          }}
        />
      ),
    )}
  </Box>
);

export default MultipleChoices;

export const multipleChoicesStyles = {
  multipleChoices: {
    labelFont: {
      normal: '#2B3236',
    },
    iconAsterisk: '#E93C44',
    icon: {
      border: '#CBCCCD',
    },
  },
};
