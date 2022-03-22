import { Button } from "@chakra-ui/button"
import { Box, Text, Flex } from "@chakra-ui/layout"
import { Controller } from "react-hook-form"
import useValidate from "../../hooks/useValidate"
import { Asterisk } from "../../icons"
import { IField } from "../../interfaces/IField"
import { DefinedValidations } from "../../interfaces/Validations"

interface ISwitch extends IField {
  placeholder?: string;
  requiredAnswer?: string;
  notApplicable?: boolean;
  variant?: string;
}

const definedValidations: DefinedValidations = {
  notEmpty: (label, validationValue, value) => {
    if (validationValue && !value) {
      return `${label} cannot be empty`;
    }
  },
};

const Switch = ({ control, name, label, required, requiredAnswer, notApplicable, disabled, validations = {} }: ISwitch) => {
  const validate = useValidate(label || name, validations, definedValidations);

  const RenderButton = ({ laterality, value, onchange, name, requiredAnswer }) => (
    <Button
      name={name}
      color={(laterality === "left" && value === "yes") ? "switch.activebtn.color" : (laterality === "right" && value === "no") ? "switch.activebtn.color" : "switch.btn.color"}
      bg={(laterality === "left" && value === "yes") ? "switch.activebtn.bg" : (laterality === "right" && value === "no") ? "switch.activebtn.bg" : "switch.btn.bg"}
      _hover={{ bg: "switch.activebtn.bg", color: "switch.activebtn.color" }}
      fontWeight="bold"
      fontSize="smm"
      p="10px 20px"
      disabled={requiredAnswer === "na" || disabled}
      onClick={() => {
        if (disabled) return;
        if ((laterality === 'left' && value === "yes") || (laterality === 'right' && value === "no")) {
          onchange('');
          return;
        }
        else {
          onchange(laterality === 'left' ? "yes" : "no");
        }
      }}
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
            <Text fontSize="ssm" fontWeight="bold" pt="8px" pb="10px" color="switch.form.labelColor">{label}
              {requiredAnswer === "yes" && value === "no" && <Box as="span" fontSize="xs" fontWeight="medium" color="switch.form.labelColor"> ( The required answer is Yes )</Box>}
              {requiredAnswer === "no" && value === "yes" && <Box as="span" fontSize="xs" fontWeight="medium" color="switch.form.labelColor"> ( The required answer is No )</Box>}
              {required && <Asterisk ml="5px" mb="8px" fill="questionListElement.iconAsterisk" stroke='questionListElement.iconAsterisk' w="9px" h="9px" />}
            </Text>
            <Flex>
              <RenderButton name={name} onchange={onChange} laterality="left" value={value} requiredAnswer={requiredAnswer} />
              &nbsp;&nbsp;
              <RenderButton name={name} onchange={onChange} laterality="right" value={value} requiredAnswer={requiredAnswer} />
              {notApplicable &&
                <>
                  &nbsp;&nbsp;
                  <Button
                    name={name}
                    color={value === "na" ? "switch.activebtn.color" : "switch.btn.color"}
                    bg={value === "na" ? "switch.activebtn.bg" : "switch.btn.bg"}
                    _hover={{ bg: "switch.activebtn.bg", color: "switch.activebtn.color" }}
                    fontWeight="bold"
                    fontSize="smm"
                    p="10px 20px"
                    onClick={() => {
                      if (value === "na") {
                        onChange("");
                        return;
                      }
                      onChange("na");
                    }}
                  >
                    NA
                  </Button>
                </>
              }
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
      labelColor: "#1F1F1F",
      textInput: {
        error: '#E53E3E',
      }
    }
  }
};
