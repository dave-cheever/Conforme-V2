import { Button } from "@chakra-ui/button"
import { Box, Text, Flex } from "@chakra-ui/layout"
import { Controller } from "react-hook-form"
import useValidate from "../../hooks/useValidate"
import { IField } from "../../interfaces/IField"
import { DefinedValidations } from "../../interfaces/Validations"

interface IToggle extends IField {
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

const Toggle = ({ control, name, label, placeholder = '', tooltip = '', variant, validations = {}, disabled = false }: IToggle) => {
  const validate = useValidate(label || name, validations, definedValidations);

  const RenderButton = ({ laterality, value, onchange, name }) => (
    <Button
      name={name}
      color={!value ? "toggle.btn.color" : "toggle.activebtn.color"}
      bg={!value ? "toggle.btn.bg" : "toggle.activebtn.bg"}
      _hover={{ bg: "toggle.activebtn.bg", color: "toggle.activebtn.color" }}
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
            <Text fontSize="ssm" fontWeight="bold" py="10px">{label}</Text>
            <Flex>
              <RenderButton name={name} onchange={onChange} laterality="left" value={value} />
              &nbsp;&nbsp;
              <RenderButton name={name} onchange={onChange} laterality="right" value={!value} />
            </Flex>
            {error && <Box fontSize={14} ml={1} color='toggle.form.textInput.error'>{error.message}</Box>}
          </Box >
        )
      }}
    />
  );
};

export default Toggle;

export const toggleStyles = {
  toggle: {
    btn: {
      bg: "#F0F2F5",
      color: "#818197"
    },
    activebtn: {
      bg: "#462AC4",
      color: "#ffffff"
    },
    form: {
      textInput: {
        error: '#E53E3E',
      }
    }
  }
};
