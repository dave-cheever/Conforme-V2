import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

import { questionHeader } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import TextInput from '../Forms/TextInput';
import Checkbox from '../Forms/Checkbox';
import Textarea from '../Forms/Textarea';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';

const QuestionForm = ({ setShowQuestionForm, questionType, addQuestion }) => {
  const { complianceItem } = useComplianceItemModalContext();
  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    mode: "all",
    defaultValues: {
      name: '',
      description: '',
      required: false,
    },
  });
  const questionName = watch('name');
  const questionAlreadyExist = (complianceItem.questions || []).findIndex(({ name }) => name === questionName) > -1;

  return (
    <Flex bg="questions.form.bg" rounded="10px" p="20px 25px" flexDirection="column" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
      <Flex alignItems="center" mb='20px'>
        <Text fontWeight="bold" fontSize="smm">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        name="name"
        label="Question title"
        variant="secondaryVariant"
        placeholder="e.g. where is the tv?"
        validations={{
          notEmpty: true,
        }}
      />
      <Textarea
        control={control}
        name="description"
        variant="secondaryVariant"
        label="Description"
      />
      <Checkbox
        control={control}
        name="required"
        variant="secondaryVariant"
        label="Answer is required"
      />
      <Flex justifyContent="space-between" mt='15px'>
        <Button
          bg="questions.form.button.primary.bg"
          color="questions.form.button.primary.font"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          onClick={() => {
            const question = getValues();
            addQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          disabled={questionAlreadyExist || Object.keys(errors).length > 0 || !questionName}
          title={questionAlreadyExist ? "This question already exist" : ''}
        >
          Save question
        </Button>
        <Button
          bg="questions.form.button.secondary.bg"
          color="questions.form.button.secondary.font"
          opacity="0.5"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          onClick={() => setShowQuestionForm(false)}
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default QuestionForm;

export const questionFormStyles = {
  questions: {
    form: {
      bg: 'white',
      icon: '#2B3236',
      button: {
        primary: {
          bg: '#462AC4',
          font: '#FFFFFF',
        },
        secondary: {
          bg: '#9A9EA1',
          font: '#FFFFFF',
        },
      }
    },
  },
};
