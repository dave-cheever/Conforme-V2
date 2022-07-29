import React from 'react';
import { useForm } from 'react-hook-form';

import { Box, Button, Checkbox, CheckboxGroup, Flex, Stack, Text } from '@chakra-ui/react';

import Datepicker from '../Forms/Datepicker';
import TextInput from '../Forms/TextInput';

const defaultValues = {
  tvLicense: '',
  dateCompleted: '',
  yesOrNo: '',
  dateCompleted2: '',
  multitask: '',
};

const SectionNumber = ({ value }: any) => (
  <Box
    bg="ComplianceItemsResponseQuestions.sectionNumber.bg"
    borderRadius="8px"
    color="ComplianceItemsResponseQuestions.sectionNumber.color"
    fontSize="smm"
    fontWeight="bold"
    h="35px"
    mr="20px"
    p="7px"
    textAlign="center"
    w="38px"
  >
    {value}
  </Box>
);

const ComplianceItemsResponseQuestions = () => {
  const { control } = useForm({
    mode: 'all',
    defaultValues,
  });
  return (
    <Stack spacing="24px">
      <Flex>
        <SectionNumber value={1} />
        <Stack direction="column" flex="1" spacing="24px">
          <Box w="45%">
            <TextInput
              control={control}
              label="Is a copy of the most recent TV licence provided to the reception?"
              name="name"
              placeholder="Add Your answer here"
              validations={{
                notEmpty: true,
              }}
            />
          </Box>

          <Box w="30%">
            <Datepicker control={control} label="Date Completed" name="dueDate" placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>

      <Flex>
        <SectionNumber value={2} />
        <Stack direction="column" flex="1" spacing="24px">
          <Box>
            <Text fontSize="smm" fontWeight="bold">
              This is a yes / no question like
            </Text>
            <Flex mt="10px">
              <Button
                bg="ComplianceItemsResponseQuestions.button.bg"
                color="ComplianceItemsResponseQuestions.button.color"
                fontSize="smm"
                fontWeight="bold"
                p="20px"
              >
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button
                bg="ComplianceItemsResponseQuestions.button.bg"
                color="ComplianceItemsResponseQuestions.button.color"
                fontSize="smm"
                fontWeight="bold"
                p="20px"
              >
                No
              </Button>
            </Flex>
          </Box>
          <Box w="30%">
            <Datepicker control={control} label="Date Completed" name="dueDate" placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>

      <Flex>
        <SectionNumber value={3} />
        <Stack direction="column" flex="1" spacing="24px">
          <Text fontSize="smm" fontWeight="bold">
            Multi selection question
          </Text>
          <CheckboxGroup colorScheme="green">
            {[1, 2, 3].map((num) => (
              <Checkbox
                borderColor="ComplianceItemsResponseQuestions.checkbox.borderColor"
                color="ComplianceItemsResponseQuestions.checkbox.color"
                size="lg"
              >
                {`Answer ${num}`}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default ComplianceItemsResponseQuestions;

export const ComplianceItemsResponseQuestionsStyles = {
  ComplianceItemsResponseQuestions: {
    sectionNumber: {
      bg: '#F0F2F5',
      color: '#282F36',
    },
    button: {
      bg: '#F0F2F5',
      color: '#818197',
    },
    checkbox: {
      color: '#818197',
      borderColor: '#F0F2F5',
    },
  },
};
