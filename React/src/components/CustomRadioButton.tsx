import { CheckIcon } from '@chakra-ui/icons';
import { Flex, useRadio } from '@chakra-ui/react';

const CustomRadioButton = ({ children, ...props }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input: any = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Flex alignItems="center" as="label" color="customRadioButton.textColor" cursor="pointer">
      <input {...input} />
      <Flex
        {...checkbox}
        _checked={{
          bg: 'customRadioButton.checkedBg',
          color: 'customRadioButton.checkedIcon',
          borderColor: 'customRadioButton.checkedBorder',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        alignItems="center"
        border="1px solid rgba(129, 129, 151, 0.5)"
        borderRadius="50%"
        borderWidth="1px"
        cursor="pointer"
        h="20px"
        justifyContent="center"
        mr="10px"
        w="20px"
      >
        {input.checked && <CheckIcon h="12px" w="12px" />}
      </Flex>
      {children}
    </Flex>
  );
};

export default CustomRadioButton;

export const customRadioButtonStyles = {
  customRadioButton: {
    checkedBg: '#462AC4',
    checkedBorder: '#462AC4',
    checkedIcon: 'white',
    textColor: '#818197',
  },
};
