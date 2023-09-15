import { useEffect, useMemo } from 'react';

import { Box, Flex, Grid, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import usePrompt from '../../hooks/usePrompt';
import { MessageSquareIcon } from '../../icons';
import { TQuestionValue } from '../../interfaces/TQuestionValue';
import { isPermitted } from '../can';
import Field from '../Forms/Field';

const styles = {
  textInput: {
    font: '#1F1F1F',
  },
};

function ResponseQuestions({ disabled = false }) {
  const { user } = useAppContext();
  const { response, snapshot, snapshots, setIsQuestionFormDirty, isQuestionFormDirty, activeTab, questionsForm } = useResponseContext();
  const isUserPermitted = useMemo(
    () => isPermitted({ user, action: 'responses.edit', data: { response } }),
    [JSON.stringify(user), JSON.stringify(response)],
  );
  const questions = useMemo(() => {
    if (response.status !== 'draft' || activeTab === 1 || snapshot) return response?.questions || [];
    return snapshots[0]?.questions || [];
  }, [JSON.stringify(response), JSON.stringify(snapshots), snapshot, activeTab]);

  const {
    control,
    formState: { isDirty },
    reset,
    setValue,
  } = questionsForm;

  useEffect(() => {
    reset(
      questions?.reduce(
        (acc, { name, value }) =>
        ({
          ...acc,
          [name]: value || '',
        } as { [name: string]: TQuestionValue }),
        {} as { [name: string]: TQuestionValue },
      ),
    );
  }, [JSON.stringify(questions)]);

  usePrompt(isQuestionFormDirty, 'You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?');

  useEffect(() => {
    setIsQuestionFormDirty(isDirty);
  }, [isDirty]);

  if (!response) return null;
  return (<>
    {/* <Prompt
      data-id="714a60514a03"
      message="You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?"
      when={isQuestionFormDirty} /> */}
    <Stack data-id="31585380bbdd" minH={['80vh', 0]} mt={2} spacing={4} w="full">
      <Grid data-id="076e558d5eec" gap={4} templateColumns="1fr" w={['full', '80%']}>
        {questions.length === 0 && (
          <Text
            color="responseQuestions.NoQuestion.color"
            data-id="b294b8e222fa"
            fontSize="smm">
            <MessageSquareIcon
              data-id="4f22ac2dc6df"
              h="16px"
              stroke="responseQuestions.NoQuestion.icon"
              w="16px" />
            &nbsp; This item has no questions yet
          </Text>
        )}
        {questions.map(({ type, name, description, required, value, requiredAnswer, notApplicable, options }, i) => (
          <Flex data-id="e88fa25ebdc1" key={name}>
            <Box
              bg="responseQuestions.sectionNumber.bg"
              borderRadius="8px"
              color="responseQuestions.sectionNumber.color"
              data-id="ec4e9d988b08"
              fontSize="smm"
              fontWeight="bold"
              h="30px"
              mr="20px"
              mt="2px"
              px="13px"
              py="5px"
              textAlign="center"
              w="35px">
              {i + 1}
            </Box>
            <Field
              control={control}
              data-id="f1b09ba5be88"
              defaultvalue={value}
              disabled={!isUserPermitted || disabled}
              label={name}
              name={name}
              notApplicable={notApplicable}
              options={options}
              placeholder={description}
              readMode={disabled}
              required={!!required}
              requiredAnswer={requiredAnswer}
              setValue={setValue}
              styles={styles}
              type={type} />
          </Flex>
        ))}
      </Grid>
    </Stack>
  </>);
}

export default ResponseQuestions;

export const responseQuestionsStyles = {
  responseQuestions: {
    sectionNumber: {
      bg: '#F0F2F5',
      color: '#282F36',
    },
    NoQuestion: {
      icon: '#818197',
      color: '#818197',
    },
    primaryButton: {
      bg: '#462AC4',
      hover: '#462AC4',
      color: '#ffffff',
    },
    secondaryButton: {
      bg: '#ffffff',
      color: '#000000',
    },
  },
};
