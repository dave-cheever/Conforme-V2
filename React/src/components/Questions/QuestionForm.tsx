import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import QuestionIcon from './QuestionIcon';
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
    <Flex bg="adminComplianceItemModal.section.questions.form.bg" rounded="10px" p="37px 18px 18px 18px" flexDirection="column">
      <Flex alignItems="center" mb='20px' ml={2}>
        <QuestionIcon type={questionType} w='50px' h='50px' color='adminComplianceItemModal.section.questions.form.icon' />
        <Text ml="17px" fontWeight="semi_medium" fontSize="md">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        name="name"
        label="Question"
        placeholder="Type your question"
        validations={{
          notEmpty: true,
        }}
      />
      <Textarea
        control={control}
        name="description"
        label="Description"
        placeholder="Describe your question"
      />
      <Checkbox
        control={control}
        name="required"
        label="Is answer required?"
      />
      <Flex justifyContent="space-between" mt='15px'>
        <Button
          bg="adminComplianceItemModal.section.questions.form.button.primary.bg"
          color="adminComplianceItemModal.section.questions.form.button.primary.font"
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
          bg="adminComplianceItemModal.section.questions.form.button.secondary.bg"
          color="adminComplianceItemModal.section.questions.form.button.secondary.font"
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
