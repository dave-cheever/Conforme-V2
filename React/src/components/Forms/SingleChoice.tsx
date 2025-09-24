import { useEffect, useState } from 'react';

import { Box, Flex, Icon, Tooltip, useRadioGroup, VStack } from '@chakra-ui/react';

import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import CustomRadioButton from '../CustomRadioButton';

interface ISingleChoices extends IField {
  placeholder?: string;
}

function SingleChoices({ name, label, required, tooltip = '', defaultvalue, options, readMode = false, setValue }: ISingleChoices) {
  const [selectedRadio, setSelectedRadio] = useState<string>(defaultvalue);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: selectedRadio,
    onChange: setSelectedRadio,
  });

  const group = getRootProps();

  useEffect(() => setSelectedRadio(defaultvalue || ''), [defaultvalue])

  useEffect(() => {
    if (selectedRadio !== '' && setValue) setValue(name, selectedRadio);
  }, [selectedRadio]);

  return (
    <Box data-id="000330" id={name} w="full">
      {label && (
        <Flex
          data-id="000331"
          align="center"
          justify="space-between"
          mb="none"
          pb={2}
          pt={2}>
          <Box
            data-id="000332"
            color="singleChoices.labelFont.normal"
            fontSize="ssm"
            fontWeight="bold"
            left="none"
            position="static"
            zIndex={2}>
            {label}
            {required && (
              <Asterisk
                data-id="000333"
                fill="questionListElement.iconAsterisk"
                h="9px"
                mb="8px"
                ml="5px"
                stroke="questionListElement.iconAsterisk"
                w="9px" />
            )}{' '}
            {tooltip && (
              <Tooltip data-id="000334" hasArrow label={tooltip} placement="top">
                <Icon data-id="000335" h="14px" mb={1} name="info" />
              </Tooltip>
            )}
          </Box>
        </Flex>
      )}
      <VStack data-id="000336" {...group} align="stretch">
        {options &&
          options.map(({ label, value }) => {
            const radio = getRadioProps({ value });
            return (
              <CustomRadioButton
                  data-id="000337"
                  key={value}
                  {...radio}
                  fontSize="smm"
                  isDisabled={readMode}>
                {label}
              </CustomRadioButton>
            );
          })}
      </VStack>
    </Box>
  );
}

export default SingleChoices;

export const singleChoicesStyles = {
  singleChoices: {
    labelFont: {
      normal: '#2B3236',
    },
    iconAsterisk: '#E93C44',
    icon: {
      border: '#CBCCCD',
    },
  },
};
