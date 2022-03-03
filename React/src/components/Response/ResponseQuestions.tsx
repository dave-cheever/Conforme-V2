import React, { useEffect, useMemo } from 'react';
import { Stack, Box, Grid, Text, Flex, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { isEqual } from 'lodash';

import { isPermitted } from '../can';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { toastFailed } from '../../bootstrap/config';
import { MessageSquareIcon } from '../../icons';
import Field from '../Forms/Field';
import { IQuestionValue } from '../../interfaces/IQuestion';

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
  const { response, snapshot, refetch } = useResponseContext();
  const isUserPermitted = useMemo(() => isPermitted({ user, action: 'responses.edit', data: { response } }), [user, response]);
  const questions = (response?.questions || []).filter(({ outdated }) => !outdated);

  const {
    control,
    watch,
  } = useForm({
    mode: "all",
    defaultValues:
      questions?.reduce((acc, { name, value }) => {
        return {
          ...acc,
          [name]: value,
        } as { [name: string]: IQuestionValue };
      }, {} as { [name: string]: IQuestionValue }),
  });

  const answers = watch();
  useEffect(() => {
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
          refetch();
        } catch (e: any) {
          toast({
            ...toastFailed,
            description: e.message,
          });
        }
      }
    };
    updateResponseQuestions();
  }, [JSON.stringify(answers)]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!response) {
    return null;
  }

  return (
    <Stack w="full" h="full" minH={["50vh", "none"]} overflow={["visible", "auto"]} mt={2}>
      <Grid
        templateColumns="1fr"
        gap={4}
        w={['full', '80%', '50%']}>
        {questions.length === 0 &&
          <Text
            fontSize="smm"
            color="responseQuestions.NoQuestion.color"
          ><MessageSquareIcon
              stroke="responseQuestions.NoQuestion.icon"
              w="16px"
              h="16px" />&nbsp;
            This item has no questions yet
          </Text>
        }
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
              mt="2px"
            >
              {i + 1}
            </Box>
            <Field
              type={type}
              label={name}
              name={name}
              control={control}
              placeholder={description}
              disabled={!isUserPermitted || !!snapshot}
              required={!!required}
              defaultvalue={value}
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
    },
    NoQuestion: {
      icon: "#818197",
      color: "#818197"
    }
  }
}
