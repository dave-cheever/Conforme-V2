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
  const { response, snapshot, snapshots, setIsQuestionFormDirty, isQuestionFormDirty, questionsForm } = useResponseContext();
  const isUserPermitted = useMemo(
    () => isPermitted({ user, action: 'responses.edit', data: { response } }),
    [JSON.stringify(user), JSON.stringify(response)],
  );

  const questions = useMemo(() => {
    if (snapshot && snapshots[0]?.questions?.length) 
      return snapshots[0].questions;
    
    return response.questions || [];
  }, [
    response.questions,
    snapshots,
    snapshot,
  ]);

  const {
    control,
    formState: { isDirty },
    reset,
    setValue,
  } = questionsForm;

  useEffect(() => {
    reset(
      questions.reduce(
        (acc, { name, value }) => ({
          ...acc,
          [name]: value ?? '',
        }),
        {} as Record<string, TQuestionValue>,
      ),
    );
  }, [questions, reset]);

  usePrompt(isQuestionFormDirty, 'You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?');

  useEffect(() => {
    setIsQuestionFormDirty(isDirty);
  }, [isDirty]);

  if (!response) return null;
  return (
    <>
      {/* <Prompt
        data-id="714a60514a03"
        message="You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?"
        when={isQuestionFormDirty} /> */}
      <Stack data-id="030925-d0a6f5" minH={['80vh', 0]} mt={2} spacing={4} w="full">
        <Grid data-id="030925-b04e89" gap={4} templateColumns="1fr" w={['full', '80%']}>
          {questions.length === 0 && (
            <Text
              data-id="030925-7f079c"
              color="responseQuestions.NoQuestion.color"
              fontSize="smm">
              <MessageSquareIcon
                data-id="030925-0eeff4"
                h="16px"
                stroke="responseQuestions.NoQuestion.icon"
                w="16px" />
              &nbsp; This item has no questions yet
            </Text>
          )}
          {questions.map(({ type, name, description, required, value, requiredAnswer, notApplicable, options }, i) => (
            <Flex data-id="030925-5dd4d1" key={name}>
              <Box
                data-id="030925-612519"
                bg="responseQuestions.sectionNumber.bg"
                borderRadius="8px"
                color="responseQuestions.sectionNumber.color"
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
                data-id="030925-932605"
                control={control}
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
    </>
  );
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
