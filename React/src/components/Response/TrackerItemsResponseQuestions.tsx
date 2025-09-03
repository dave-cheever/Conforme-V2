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

function SectionNumber({ value }: any) {
  return (
    <Box
      data-id="030925-7dd599"
      bg="TrackerItemsResponseQuestions.sectionNumber.bg"
      borderRadius="8px"
      color="TrackerItemsResponseQuestions.sectionNumber.color"
      fontSize="smm"
      fontWeight="bold"
      h="35px"
      mr="20px"
      p="7px"
      textAlign="center"
      w="38px">
      {value}
    </Box>
  );
}

function TrackerItemsResponseQuestions() {
  const { control } = useForm({
    mode: 'all',
    defaultValues,
  });
  return (
    <Stack data-id="030925-ee87d6" spacing="24px">
      <Flex data-id="030925-3dc815">
        <SectionNumber data-id="030925-cea769" value={1} />
        <Stack data-id="030925-5a8f0c" direction="column" flex="1" spacing="24px">
          <Box data-id="030925-2e1cae" w="45%">
            <TextInput
              data-id="030925-001611"
              control={control}
              label="Is a copy of the most recent TV licence provided to the reception?"
              name="name"
              placeholder="Add Your answer here"
              validations={{
                notEmpty: true,
              }} />
          </Box>

          <Box data-id="030925-117447" w="30%">
            <Datepicker
              data-id="030925-a6e6fb"
              control={control}
              label="Date Completed"
              name="dueDate"
              placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>
      <Flex data-id="030925-b629e7">
        <SectionNumber data-id="030925-4b06b7" value={2} />
        <Stack data-id="030925-ab4546" direction="column" flex="1" spacing="24px">
          <Box data-id="030925-33a60c">
            <Text data-id="030925-3e5aef" fontSize="smm" fontWeight="bold">
              This is a yes / no question like
            </Text>
            <Flex data-id="030925-e5a522" mt="10px">
              <Button
                data-id="030925-121b80"
                bg="TrackerItemsResponseQuestions.button.bg"
                color="TrackerItemsResponseQuestions.button.color"
                fontSize="smm"
                fontWeight="bold"
                p="20px">
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button
                data-id="030925-a921b5"
                bg="TrackerItemsResponseQuestions.button.bg"
                color="TrackerItemsResponseQuestions.button.color"
                fontSize="smm"
                fontWeight="bold"
                p="20px">
                No
              </Button>
            </Flex>
          </Box>
          <Box data-id="030925-41b17b" w="30%">
            <Datepicker
              data-id="030925-d2bcdf"
              control={control}
              label="Date Completed"
              name="dueDate"
              placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>
      <Flex data-id="030925-fb7d5f">
        <SectionNumber data-id="030925-ada9a0" value={3} />
        <Stack data-id="030925-7ca023" direction="column" flex="1" spacing="24px">
          <Text data-id="030925-9b24e6" fontSize="smm" fontWeight="bold">
            Multi selection question
          </Text>
          <CheckboxGroup data-id="030925-867e10" colorScheme="green">
            {[1, 2, 3].map((num) => (
              <Checkbox
                data-id="030925-cb3a6b"
                borderColor="TrackerItemsResponseQuestions.checkbox.borderColor"
                color="TrackerItemsResponseQuestions.checkbox.color"
                size="lg">
                {`Answer ${num}`}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Stack>
      </Flex>
    </Stack>
  );
}

export default TrackerItemsResponseQuestions;

export const TrackerItemsResponseQuestionsStyles = {
  TrackerItemsResponseQuestions: {
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
