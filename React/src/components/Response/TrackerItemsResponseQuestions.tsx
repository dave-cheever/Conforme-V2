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
    bg="TrackerItemsResponseQuestions.sectionNumber.bg"
    borderRadius="8px"
    color="TrackerItemsResponseQuestions.sectionNumber.color"
    data-id="64df7364f53f"
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

const TrackerItemsResponseQuestions = () => {
  const { control } = useForm({
    mode: 'all',
    defaultValues,
  });
  return (
    (<Stack data-id="3319ee2a2f45" spacing="24px">
      <Flex data-id="74041453acbb">
        <SectionNumber data-id="2212604f54aa" value={1} />
        <Stack data-id="5d5d23419218" direction="column" flex="1" spacing="24px">
          <Box data-id="9e071e883499" w="45%">
            <TextInput
              control={control}
              data-id="a4b0a7512737"
              label="Is a copy of the most recent TV licence provided to the reception?"
              name="name"
              placeholder="Add Your answer here"
              validations={{
                notEmpty: true,
              }} />
          </Box>

          <Box data-id="e6c9b72d53bc" w="30%">
            <Datepicker
              control={control}
              data-id="70fffc2462fa"
              label="Date Completed"
              name="dueDate"
              placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>
      <Flex data-id="b7dec980064c">
        <SectionNumber data-id="cb3f951b8262" value={2} />
        <Stack data-id="eaf099228eb0" direction="column" flex="1" spacing="24px">
          <Box data-id="a62a65c8b050">
            <Text data-id="222d116964ec" fontSize="smm" fontWeight="bold">
              This is a yes / no question like
            </Text>
            <Flex data-id="3db8ce9023c1" mt="10px">
              <Button
                bg="TrackerItemsResponseQuestions.button.bg"
                color="TrackerItemsResponseQuestions.button.color"
                data-id="514e28bd1421"
                fontSize="smm"
                fontWeight="bold"
                p="20px">
                Yes
              </Button>
              &nbsp;&nbsp;
              <Button
                bg="TrackerItemsResponseQuestions.button.bg"
                color="TrackerItemsResponseQuestions.button.color"
                data-id="59a8e22bd48e"
                fontSize="smm"
                fontWeight="bold"
                p="20px">
                No
              </Button>
            </Flex>
          </Box>
          <Box data-id="0c10d1318adb" w="30%">
            <Datepicker
              control={control}
              data-id="a0d0152b3b6a"
              label="Date Completed"
              name="dueDate"
              placeholder="dd / mm / yyyy" />
          </Box>
        </Stack>
      </Flex>
      <Flex data-id="b879065abad7">
        <SectionNumber data-id="a9bcd60609bc" value={3} />
        <Stack data-id="e14b4c7e4f5e" direction="column" flex="1" spacing="24px">
          <Text data-id="a6818e968780" fontSize="smm" fontWeight="bold">
            Multi selection question
          </Text>
          <CheckboxGroup colorScheme="green" data-id="1f37abed0e86">
            {[1, 2, 3].map((num) => (
              <Checkbox
                borderColor="TrackerItemsResponseQuestions.checkbox.borderColor"
                color="TrackerItemsResponseQuestions.checkbox.color"
                data-id="fc56ae029bc5"
                size="lg">
                {`Answer ${num}`}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Stack>
      </Flex>
    </Stack>)
  );
};

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
