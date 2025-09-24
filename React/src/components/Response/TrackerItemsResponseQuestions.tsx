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
      data-id="000373"
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
    <Stack data-id="000374" spacing="24px">
      <Flex data-id="000375">
        <SectionNumber data-id="000376" value={1} />
        <Stack data-id="000377" direction="column" flex="1" spacing="24px">
          <Box data-id="000378" w="45%">
            <TextInput
              data-id="000379"
              control={control}
              label="Is a copy of the most recent TV licence provided to the reception?"
              name="name"
              placeholder="Add Your answer here"
              validations={{
                notEmpty: true,
              }} />
          </Box>

          <Box data-id="000380" w="30%">
            <Datepicker
              data-id="000381"
              control={control}
              label="Date Completed"
              name="dueDate"
              placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>
      <Flex data-id="000382">
        <SectionNumber data-id="000383" value={2} />
        <Stack data-id="000384" direction="column" flex="1" spacing="24px">
          <Box data-id="000385">
            <Text data-id="000386" fontSize="smm" fontWeight="bold">
              This is a yes / no question like
            </Text>
            <Flex data-id="000387" mt="10px">
              <Button
                data-id="000388"
                bg="TrackerItemsResponseQuestions.button.bg"
                color="TrackerItemsResponseQuestions.button.color"
                fontSize="smm"
                fontWeight="bold"
                p="20px">
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button
                data-id="000389"
                bg="TrackerItemsResponseQuestions.button.bg"
                color="TrackerItemsResponseQuestions.button.color"
                fontSize="smm"
                fontWeight="bold"
                p="20px">
                No
              </Button>
            </Flex>
          </Box>
          <Box data-id="000390" w="30%">
            <Datepicker
              data-id="000391"
              control={control}
              label="Date Completed"
              name="dueDate"
              placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>
      <Flex data-id="000392">
        <SectionNumber data-id="000393" value={3} />
        <Stack data-id="000394" direction="column" flex="1" spacing="24px">
          <Text data-id="000395" fontSize="smm" fontWeight="bold">
            Multi selection question
          </Text>
          <CheckboxGroup data-id="000396" colorScheme="green">
            {[1, 2, 3].map((num) => (
              <Checkbox
                data-id="000397"
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
