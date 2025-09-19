import { CheckIcon } from '@chakra-ui/icons';
import { Flex, useCheckbox, useRadio } from '@chakra-ui/react';

function CustomRadioButton({ children, ...props }) {
  const { getInputProps } = useRadio(props);
  const { getCheckboxProps } = useCheckbox(props);
  const input: any = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Flex
      alignItems="center"
      as="label"
      color="customRadioButton.textColor"
      cursor={props.isDisabled ? 'no-drop' : 'pointer'}
      data-id="030925-4d810a"
      textAlign="left"
    >
      <input data-id="030925-04f2b8" {...input} />
      <Flex
        data-id="030925-c272c6"
        {...checkbox}
        _checked={{
          bg: props.isDisabled ? 'customRadioButton.disabledBg' : 'customRadioButton.checkedBg',
          color: props.isDisabled ? 'customRadioButton.disabledColor' : 'customRadioButton.checkedIcon',
          borderColor: props.isDisabled ? 'customRadioButton.disabledBorder' : 'customRadioButton.checkedBorder',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        alignItems="center"
        border="1px solid rgba(129, 129, 151, 0.5)"
        borderRadius="50%"
        borderWidth="1px"
        cursor={props.isDisabled ? 'no-drop' : 'pointer'}
        h="20px"
        justifyContent="center"
        mr="10px"
        w={props.isSingleChoice ? '22px' : '20px'}
      >
        {input.checked && <CheckIcon data-id="030925-a39b9c" h="12px" w="12px" />}
      </Flex>
      {children}
    </Flex>
  );
}

export default CustomRadioButton;

export const customRadioButtonStyles = {
  customRadioButton: {
    checkedBg: '#462AC4',
    checkedBorder: '#462AC4',
    checkedIcon: 'white',
    textColor: '#818197',
    disabledBg: '#CBD5E0',
    disabledBorder: '#CBD5E0',
    disabledColor: '#718096',
  },
};
