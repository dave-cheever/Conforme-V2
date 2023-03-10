import { useEffect, useState } from 'react';

import { Box, Flex, Icon, Tooltip, useRadioGroup, VStack } from '@chakra-ui/react';

import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import CustomRadioButton from '../CustomRadioButton';

interface ISingleChoices extends IField {
  placeholder?: string;
}

const SingleChoices = ({ name, label, required, tooltip = '', defaultvalue, options, readMode = false, setValue }: ISingleChoices) => {
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
    (<Box data-id="635b684bc6a3" id={name} w="full">
      {label && (
        <Flex
          align="center"
          data-id="cf1cb13db19e"
          justify="space-between"
          mb="none"
          pb={2}
          pt={2}>
          <Box
            color="singleChoices.labelFont.normal"
            data-id="d2d2a99014eb"
            fontSize="ssm"
            fontWeight="bold"
            left="none"
            position="static"
            zIndex={2}>
            {label}
            {required && (
              <Asterisk
                data-id="9d2718a00cd3"
                fill="questionListElement.iconAsterisk"
                h="9px"
                mb="8px"
                ml="5px"
                stroke="questionListElement.iconAsterisk"
                w="9px" />
            )}{' '}
            {tooltip && (
              <Tooltip data-id="eaf9f1a632ad" hasArrow label={tooltip} placement="top">
                <Icon data-id="509d99e9628d" h="14px" mb={1} name="info" />
              </Tooltip>
            )}
          </Box>
        </Flex>
      )}
      <VStack data-id="fa6b61d72e96" {...group} align="stretch">
        {options &&
          options.map(({ label, value }) => {
            const radio = getRadioProps({ value });
            return (
              (<CustomRadioButton
                data-id="57f5ddda9981"
                key={value}
                {...radio}
                fontSize="smm"
                isDisabled={readMode}>
                {label}
              </CustomRadioButton>)
            );
          })}
      </VStack>
    </Box>)
  );
};

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
