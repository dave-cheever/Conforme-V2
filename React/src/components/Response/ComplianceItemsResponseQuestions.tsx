import { Box, Flex, Stack, Text } from "@chakra-ui/layout"
import React from "react"
import TextInput from "../Forms/TextInput"
import { useForm } from "react-hook-form";
import Datepicker from "../Forms/Datepicker";
import { Button } from "@chakra-ui/button";
import { Checkbox, CheckboxGroup } from "@chakra-ui/checkbox";

const defaultValues = {
  tvLicense: '',
  dateCompleted: '',
  yesOrNo: '',
  dateCompleted2: '',
  multitask: ''
}

const ComplianceItemsResponseQuestions = () => {
  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: "all",
    defaultValues,
  });
  return (
    <Stack spacing="24px">
      <Flex>
        <SectionNumber value={1} />
        <Stack direction="column" spacing="24px" flex="1">
          <Box w="45%">
            <TextInput
              name="name"
              control={control}
              label="Is a copy of the most recent TV licence provided to the reception?"
              placeholder="Add Your answer here"
              validations={{
                notEmpty: true,
              }}
            />
          </Box>

          <Box w="30%">
            <Datepicker
              control={control}
              name="dueDate"
              label="Date Completed"
              placeholder="dd / mm / yyyy"
            />
          </Box>
        </Stack>
      </Flex>

      <Flex>
        <SectionNumber value={2} />
        <Stack direction="column" spacing="24px" flex="1">
          <Box>
            <Text fontSize="smm" fontWeight="bold">This is a yes / no question like</Text>
            <Flex mt="10px">
              <Button
                color="ComplianceItemsResponseQuestions.button.color"
                bg="ComplianceItemsResponseQuestions.button.bg"
                fontWeight="bold"
                fontSize="smm"
                p="20px"
              >Yes</Button>
              &nbsp;&nbsp;
              <Button
                color="ComplianceItemsResponseQuestions.button.color"
                bg="ComplianceItemsResponseQuestions.button.bg"
                fontWeight="bold"
                fontSize="smm"
                p="20px"
              >No</Button>
            </Flex>
          </Box>
          <Box w="30%">
            <Datepicker
              control={control}
              name="dueDate"
              label="Date Completed"
              placeholder="dd / mm / yyyy"
            />
          </Box>
        </Stack>
      </Flex>

      <Flex>
        <SectionNumber value={3} />
        <Stack direction="column" spacing="24px" flex="1">
          <Text fontSize="smm" fontWeight="bold">Multi selection question</Text>
          <CheckboxGroup colorScheme="green">
            {[1, 2, 3].map(num => {
              return (
                <Checkbox size="lg" borderColor="ComplianceItemsResponseQuestions.checkbox.borderColor" color="ComplianceItemsResponseQuestions.checkbox.color">
                  {`Answer ${num}`}
                </Checkbox>)
            })}
          </CheckboxGroup>
        </Stack>
      </Flex>
    </Stack>
  )
}

const SectionNumber = ({ value }: any) => {
  return (
    <Box
      color="ComplianceItemsResponseQuestions.sectionNumber.color"
      bg="ComplianceItemsResponseQuestions.sectionNumber.bg"
      borderRadius="8px"
      fontWeight="bold"
      fontSize="smm"
      w="38px"
      h="35px"
      mr="20px"
      textAlign="center"
      p="7px"
    >
      {value}
    </Box>
  )
}

export default ComplianceItemsResponseQuestions

export const ComplianceItemsResponseQuestionsStyles = {
  ComplianceItemsResponseQuestions: {
    sectionNumber: {
      bg: "#F0F2F5",
      color: "#282F36",
    },
    button: {
      bg: "#F0F2F5",
      color: "#818197"
    },
    checkbox: {
      color: "#818197",
      borderColor: "#F0F2F5"
    }
  }
}