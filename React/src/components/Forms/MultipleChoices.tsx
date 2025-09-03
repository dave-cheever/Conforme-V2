import { Controller } from 'react-hook-form';

import { Box, Checkbox, Flex, Icon, Stack, Text, Tooltip } from '@chakra-ui/react';

import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';

interface IMultipleChoices extends IField {
  placeholder?: string;
}

function MultipleChoices({
  control,
  name,
  label,
  required,
  tooltip = '',
  disabled = false,
  readMode = false,
  defaultvalue,
}: IMultipleChoices) {
  return (
    <Box data-id="030925-222ba9" id={name} w="full">
      {label && (
        <Flex
          data-id="030925-68197f"
          align="center"
          justify="space-between"
          mb="none"
          pb={2}
          pt={2}>
          <Box
            data-id="030925-9853d5"
            color="multipleChoices.labelFont.normal"
            fontSize="ssm"
            fontWeight="bold"
            left="none"
            position="static"
            zIndex={2}>
            {label}
            {required && !readMode && (
              <Asterisk
                data-id="030925-07049f"
                fill="questionListElement.iconAsterisk"
                h="9px"
                mb="8px"
                ml="5px"
                stroke="questionListElement.iconAsterisk"
                w="9px" />
            )}{' '}
            {tooltip && (
              <Tooltip data-id="030925-53be8d" hasArrow label={tooltip} placement="top">
                <Icon data-id="030925-674856" h="14px" mb={1} name="info" />
              </Tooltip>
            )}
          </Box>
        </Flex>
      )}
      {defaultvalue?.map(({ label }: { label: string; isCorrect: boolean }, index) => (
        <Controller
          data-id="030925-b8ac0c"
          control={control}
          key={index}
          name={`${name}.${index}.isCorrect`}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <Stack data-id="030925-50e257" direction="column">
                <Checkbox
                  data-id="030925-91d61b"
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
                      opacity: `${readMode ? 1 : disabled ? 0.4 : 1} !important`,
                    },
                  }}
                  isChecked={value}
                  isDisabled={disabled}
                  onChange={() => onChange(!value)}
                  py={1}>
                  <Text
                    data-id="030925-9ed06f"
                    color={readMode ? 'multipleChoices.optionFont.readMode' : 'multipleChoices.optionFont.normal'}
                    fontSize="smm">
                    {label}{' '}
                  </Text>
                  {tooltip && (
                    <Tooltip data-id="030925-fcd5f0" hasArrow label={tooltip} placement="top">
                      <Icon data-id="030925-00d4c1" h="14px" mb={1} name="info" />
                    </Tooltip>
                  )}
                </Checkbox>
              </Stack>
            );
          }} />
      ))}
    </Box>
  );
}

export default MultipleChoices;

export const multipleChoicesStyles = {
  multipleChoices: {
    labelFont: {
      normal: '#2B3236',
    },
    optionFont: {
      normal: '#818197',
      readMode: '#000',
    },
    iconAsterisk: '#E93C44',
    icon: {
      border: '#CBCCCD',
    },
  },
};
