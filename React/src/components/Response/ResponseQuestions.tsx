import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';

import { gql, useMutation } from '@apollo/client';
import { Box, Button, Flex, Grid, Stack, Text, useToast } from '@chakra-ui/react';
import { isEqual } from 'lodash';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import usePrompt from '../../hooks/usePrompt';
import { Asterisk, ChevronRight, MessageSquareIcon } from '../../icons';
import { TQuestionValue } from '../../interfaces/TQuestionValue';
import { isPermitted } from '../can';
import Field from '../Forms/Field';

const UPDATE_QUESTIONS = gql`
  mutation ($updateResponseQuestionsModify: UpdateResponseQuestionsModify!) {
    updateResponseQuestions(updateResponseQuestionsModify: $updateResponseQuestionsModify)
  }
`;

const styles = {
  textInput: {
    font: '#1F1F1F',
  },
};

const ResponseQuestions = () => {
  const toast = useToast();
  const [update] = useMutation(UPDATE_QUESTIONS);
  const { user } = useAppContext();
  const { response, snapshot, refetch, setIsQuestionFormDirty, isQuestionFormDirty } = useResponseContext();
  const isUserPermitted = useMemo(() => isPermitted({ user, action: 'responses.edit', data: { response } }), [user, response]);
  const questions = (response?.questions || []).filter(({ outdated }) => !outdated);

  const {
    control,
    watch,
    formState: { isDirty },
  } = useForm({
    mode: 'all',
    defaultValues: questions?.reduce(
      (acc, { name, value }) =>
      ({
        ...acc,
        [name]: value,
      } as { [name: string]: TQuestionValue }),
      {} as { [name: string]: TQuestionValue },
    ),
  });

  const answers = watch();

  const updateResponseQuestions = async () => {
    const wasQuestionUpdated = questions.find(({ name, value }) => !isEqual(value, answers[name]));
    if (wasQuestionUpdated) {
      try {
        await update({
          variables: {
            updateResponseQuestionsModify: {
              _id: response?._id,
              answers,
            },
          },
        });
        setIsQuestionFormDirty(false);
        toast({
          ...toastSuccess,
          description: 'Questions saved',
        });
        refetch();
      } catch (e: any) {
        toast({
          ...toastFailed,
          description: e.message,
        });
      }
    }
  };

  usePrompt(isQuestionFormDirty, 'You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?');

  useEffect(() => {
    setIsQuestionFormDirty(isDirty);
  }, [isDirty]);

  if (!response) return null;

  return (
    <>
      <Prompt
        message="You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?"
        when={isQuestionFormDirty}
      />
      <Stack h="full" minH={['80vh', 0]} mt={2} overflow={['visible', 'auto']} w="full">
        {questions.length > 0 &&
          <Flex>
            <Asterisk
              fill="questionListElement.iconAsterisk"
              h="9px"
              stroke="questionListElement.iconAsterisk"
              w="9px"
            />
            &nbsp;
            <Text
              fontSize='sm'
              fontWeight="semi_medium"
            >Required</Text>
            <br />
          </Flex>
        }
        <Grid gap={4} templateColumns="1fr" w={['full', '80%', '50%']}>
          {questions.length === 0 && (
            <Text color="responseQuestions.NoQuestion.color" fontSize="smm">
              <MessageSquareIcon h="16px" stroke="responseQuestions.NoQuestion.icon" w="16px" />
              &nbsp; This item has no questions yet
            </Text>
          )}
          {questions.map(({ type, name, description, required, value, requiredAnswer, notApplicable }, i) => (
            <Flex key={name}>
              <Box
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
                w="35px"
              >
                {i + 1}
              </Box>
              <Field
                control={control}
                defaultvalue={value}
                disabled={!isUserPermitted || !!snapshot}
                label={name}
                name={name}
                notApplicable={notApplicable}
                placeholder={description}
                required={!!required}
                requiredAnswer={requiredAnswer}
                styles={styles}
                type={type}
              />
            </Flex>
          ))}
        </Grid>
        <br />
        {isUserPermitted && questions.length > 0 && (
          <Flex>
            <Button
              _hover={{ bg: 'responseQuestions.button.hover' }}
              bg="responseQuestions.button.bg"
              color="responseQuestions.button.color"
              fontSize="smm"
              fontWeight="bold"
              onClick={() => updateResponseQuestions()}
            >
              Save
              <ChevronRight ml="5px" />
            </Button>
          </Flex>
        )}
      </Stack>
    </>
  );
};

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
    button: {
      bg: '#462AC4',
      hover: '#462AC4',
      color: '#ffffff',
    },
  },
};
