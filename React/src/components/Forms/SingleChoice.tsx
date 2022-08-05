import { useEffect, useState } from 'react';

import { Box, Flex, Icon, Tooltip, useRadioGroup, VStack } from '@chakra-ui/react';

import { Asterisk } from '../../icons';
import { IField } from '../../interfaces/IField';
import CustomRadioButton from '../CustomRadioButton';

interface ISingleChoices extends IField {
  placeholder?: string;
}

const SingleChoices = ({
  name,
  label,
  required,
  tooltip = '',
  disabled = false,
  defaultvalue,
  options,
  setValue,
}: ISingleChoices) => {

  const [selectedRadio, setSelectedRadio] = useState<string>(defaultvalue);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: selectedRadio,
    onChange: setSelectedRadio,
  })

  const group = getRootProps()

  useEffect(() => {
    if (selectedRadio !== '' && setValue) setValue(name, selectedRadio)
  }, [selectedRadio])

  return (
    <Box id={name} w="full">
      {label && (
        <Flex align="center" justify="space-between" mb="none" pb={2} pt={2}>
          <Box
            color="singleChoices.labelFont.normal"
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
      <VStack {...group} align='stretch'>
        {options && options.map(({ label, value }) => {
          const radio = getRadioProps({ value })
          return (
            <CustomRadioButton key={value} {...radio} disabled={disabled} fontSize="smm">
              {label}
            </CustomRadioButton>
          )
        })}
      </VStack>
    </Box>
  )
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
