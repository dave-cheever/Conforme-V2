import React, { useEffect, useMemo } from 'react';
import { Stack, Box, Grid, Flex, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { isPermitted } from '../can';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import Fields from './Fields';
import { toastFailed } from '../../bootstrap/config';

const UPDATE_QUESTIONS = gql`
  mutation ($updateResponseQuestionsModify: UpdateResponseQuestionsModify!) {
    updateResponseQuestions(updateResponseQuestionsModify: $updateResponseQuestionsModify)
  }
`;

const styles = {
  textInput: {
    font: 'black'
  }
}
const ResponseQuestions = () => {
  const toast = useToast();
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
    const updateResponseQuestions = async () => {
      const wasQuestionUpdated = questions.find(({ name, value }) => value !== answers[name]);
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
        } catch (e: any) {
          toast({
            ...toastFailed,
            description: e.message,
          });
        }
        refetch();
      }
    };
    updateResponseQuestions();
  }, [JSON.stringify(answers)]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!response) {
    return null;
  }
  return (
    <Stack w="full" h="full" overflow="auto" mt={2}>
      <Grid
        templateColumns="1fr"
        gap={4}
        w={['full', '80%', '50%']}>
        {questions.map(({ type, name, description, required, value }, i) => (
          <Flex key={name}>
            <Box
              color="responseQuestions.sectionNumber.color"
              bg="responseQuestions.sectionNumber.bg"
              borderRadius="8px"
              fontWeight="bold"
              fontSize="smm"
              w="35px"
              h="30px"
              mr="20px"
              textAlign="center"
              px="13px"
              py="5px"
            >
              {i + 1}
            </Box>
            <Fields
              type={type}
              label={name}
              name={name}
              control={control}
              placeholder={description}
              disabled={!isUserPermitted}
              required={!!required}
              defaultvalue={value as string}
              styles={styles}
            />
          </Flex>
        ))}
      </Grid>
    </Stack>
  );
};

export default ResponseQuestions;

export const responseQuestionsStyles = {
  responseQuestions: {
    sectionNumber: {
      bg: "#F0F2F5",
      color: "#282F36",
    }
  }
}
