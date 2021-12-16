import { CheckIcon } from "@chakra-ui/icons";
import { useRadio, Flex } from "@chakra-ui/react";

const CustomRadioButton = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input: any = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Flex as="label" alignItems="center" cursor="pointer" color="customRadioButton.textColor">
      <input {...input} />
      <Flex
        {...checkbox}
        w="20px"
        h="20px"
        mr="10px"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        border="1px solid rgba(129, 129, 151, 0.5)"
        _checked={{
          bg: "customRadioButton.checkedBg",
          color: "customRadioButton.checkedIcon",
          borderColor: "customRadioButton.checkedBorder",
        }}
        _focus={{
          boxShadow: "outline",
        }}
      >
        {input.checked && <CheckIcon w="12px" h="12px" />}
      </Flex>
      {props.children}
    </Flex>
  );
};

export default CustomRadioButton;

export const customRadioButtonStyles = {
  customRadioButton: {
    checkedBg: "#462AC4",
    checkedBorder: "#462AC4",
    checkedIcon: "white",
    textColor:"#818197"
  }
};
