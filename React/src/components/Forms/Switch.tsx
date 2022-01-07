import { Button } from "@chakra-ui/button"
import { Box, Text, Flex } from "@chakra-ui/layout"
import { Controller } from "react-hook-form"
import useValidate from "../../hooks/useValidate"
import { Asterisk } from "../../icons"
import { IField } from "../../interfaces/IField"
import { DefinedValidations } from "../../interfaces/Validations"

interface ISwitch extends IField {
  placeholder?: string;
  variant?: string;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Switch = ({ control, name, label, required, validations = {} }: ISwitch) => {
  const validate = useValidate(label || name, validations, definedValidations);

  const RenderButton = ({ laterality, value, onchange, name }) => (
    <Button
      name={name}
      color={!value ? "switch.btn.color" : "switch.activebtn.color"}
      bg={!value ? "switch.btn.bg" : "switch.activebtn.bg"}
      _hover={{ bg: "switch.activebtn.bg", color: "switch.activebtn.color" }}
      fontWeight="bold"
      fontSize="smm"
      p="10px 20px"
      onClick={() => onchange(laterality === 'left')}
    >{laterality === 'left' ? 'Yes' : 'No'}</Button>
  )
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field, fieldState, formState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;
        return (
          < Box >
            <Text fontSize="11px" fontWeight="700" pt="8px" pb="10px" color="switch.form.labelColor">{label}
            {required && <Asterisk ml="5px" mb="10px"  fill="questionListElement.iconAsterisk" stroke='questionListElement.iconAsterisk' w="9px" h="9px"/>}
            </Text>
            <Flex>
              <RenderButton name={name} onchange={onChange} laterality="left" value={value} />
              &nbsp;&nbsp;
              <RenderButton name={name} onchange={onChange} laterality="right" value={value === false} />
            </Flex>
            {error && <Box fontSize={14} ml={1} color='switch.form.textInput.error'>{error.message}</Box>}
          </Box >
        )
      }}
    />
  );
};

export default Switch;

export const switchStyles = {
  switch: {
    btn: {
      bg: "#F0F2F5",
      color: "#818197"
    },
    activebtn: {
      bg: "#462AC4",
      color: "#ffffff"
    },
    form: {
      labelColor:"#1F1F1F",
      textInput: {
        error: '#E53E3E',
      }
    }
  }
};
