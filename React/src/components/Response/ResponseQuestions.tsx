import React, { useEffect, useMemo } from 'react';
import { Stack, Box, Grid } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';

import { isPermitted } from '../can';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import TextConfirmInput from '../Forms/TextConfirmInput';
import Datepicker from '../Forms/Datepicker';

const UPDATE_QUESTIONS = gql`
  mutation ($updateResponseQuestionsModify: UpdateResponseQuestionsModify!) {
    updateQuestions(updateResponseQuestionsModify: $updateResponseQuestionsModify)
  }
`;

const ResponseQuestions = () => {
  const [update] = useMutation(UPDATE_QUESTIONS);
  const { user } = useAppContext();
  const { response, refetch } = useResponseContext();
  const isUserPermitted = useMemo(() => isPermitted({ user, action: 'responses.edit', data: { response } }), [user, response]);
 
  const questions = (response?.questions || []).filter(({ outdated }) => !outdated);
  const {
    control,
    watch,
  } = useForm({
    mode: "all",
    defaultValues: questions?.reduce((acc, { name, value }) => {
      return {
        ...acc,
        [name]: value,
      };
    }, {}),
  });

  const answers = watch();
  useEffect(() => {
    const wasQuestionUpdated = questions.find(({ name, value }) => value !== answers[name]);
    if (wasQuestionUpdated) {
      update({
        variables: {
          updateResponseQuestionsModify: {
            _id: response?._id,
            answers,
          },
        },
      });
      refetch();
    }
  }, [JSON.stringify(answers)]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!response) {
    return null;
  }
  return (
    <Stack w="full" mt={6}>
      <Box fontWeight="700">{questions.length > 0 ? "Item" : "No"} questions</Box>
      <Grid templateColumns="1fr 1fr" gap={4}>
        {questions.map(({ type, name, description, value }) => {
          if (type === 'text') {
            return (
              <TextConfirmInput
                key={name}
                name={name}
                control={control}
                label={name}
                placeholder={description}
                disabled={!isUserPermitted}
                defaultvalue={value as string}
              />
            );
          } else if (type === 'toggle') {
            return null;
            // return (
            //   <Toggle
            //     key={name}
            //     name={name}
            //     control={control}
            //     label={name}
            //     placeholder={description}
            //     disabled={!isUserPermitted}
            //   />
            // );
          } else if (type === 'datePicker') {
            return (
              <Datepicker
                key={name}
                name={name}
                control={control}
                label={name}
                placeholder={description}
                disabled={!isUserPermitted}
              />
            );
          }
          return null;
        })}
      </Grid>
    </Stack>
  );
};

export default ResponseQuestions;
