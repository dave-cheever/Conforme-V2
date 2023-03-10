import { CheckIcon } from '@chakra-ui/icons';
import { Flex, useRadio } from '@chakra-ui/react';

const CustomRadioButton = ({ children, ...props }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input: any = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    (<Flex
      alignItems="center"
      as="label"
      color="customRadioButton.textColor"
      cursor={props.isDisabled ? "no-drop" : "pointer"}
      data-id="cb1754a2d151">
      <input data-id="d75fbe3f7716" {...input} />
      <Flex
        data-id="360cf6c4cf46"
        {...checkbox}
        _checked={{
          bg: props.isDisabled ? "customRadioButton.disabledBg" : 'customRadioButton.checkedBg',
          color: props.isDisabled ? "customRadioButton.disabledColor" : 'customRadioButton.checkedIcon',
          borderColor: props.isDisabled ? "customRadioButton.disabledBorder" : 'customRadioButton.checkedBorder',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        alignItems="center"
        border="1px solid rgba(129, 129, 151, 0.5)"
        borderRadius="50%"
        borderWidth="1px"
        cursor={props.isDisabled ? "no-drop" : "pointer"}
        h="20px"
        justifyContent="center"
        mr="10px"
        w={props.isSingleChoice ? '22px' : "20px"}>
        {input.checked && <CheckIcon data-id="768733582f53" h="12px" w="12px" />}
      </Flex>
      {children}
    </Flex>)
  );
};

export default CustomRadioButton;

export const customRadioButtonStyles = {
  customRadioButton: {
    checkedBg: '#462AC4',
    checkedBorder: '#462AC4',
    checkedIcon: 'white',
    textColor: '#818197',
    disabledBg: '#E2E8F0',
    disabledBorder: '#E2E8F0',
    disabledColor: '#718096',
  },
};
