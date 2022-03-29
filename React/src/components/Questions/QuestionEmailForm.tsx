import { useForm } from 'react-hook-form';

import { Button, Flex, Text } from '@chakra-ui/react';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { IQuestionFormBase } from '../../interfaces/IQuestionFormBase';
import { questionHeader } from '../../utils/helpers';
import Checkbox from '../Forms/Checkbox';
import TextInput from '../Forms/TextInput';

const QuestionEmailForm = ({
  questionType,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
}: IQuestionFormBase<string>) => {
  const { complianceItem } = useComplianceItemModalContext();
  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      required: false,
    },
  });
  const questionName = watch('name');
  const questionAlreadyExist =
    (complianceItem.questions || []).findIndex(
      ({ name }) => name === questionName,
    ) > -1;
  return (
    <>
      <Flex alignItems="center" mb="20px">
        <Text fontSize="smm" fontWeight="bold">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        label="Question instructions (optional)"
        name="name"
        placeholder="e.g. must be a company email"
        validations={{
          notEmpty: true,
          isEmail: true,
        }}
        variant="secondaryVariant"
      />
      <Checkbox
        control={control}
        label="Answer is required"
        name="required"
        variant="secondaryVariant"
      />
      <Flex justifyContent="space-between" mt="15px">
        <Button
          bg="questionEmailForm.button.primary.bg"
          color="questionEmailForm.button.primary.font"
          disabled={
            questionAlreadyExist ||
            Object.keys(errors).length > 0 ||
            !questionName
          }
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            const question = getValues();
            addOrUpdateQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          p="17px"
          title={questionAlreadyExist ? 'This question already exist' : ''}
        >
          Save question
        </Button>
        <Button
          bg="questionEmailForm.button.secondary.bg"
          color="questionEmailForm.button.secondary.font"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            setShowQuestionForm(false);
            setIsEdit(false);
            setEditQuestionIndex(undefined);
            setEditQuestion('');
          }}
          opacity="0.5"
          p="17px"
        >
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default QuestionEmailForm;

export const questionEmailFormStyles = {
  questionEmailForm: {
    button: {
      primary: {
        bg: '#462AC4',
        font: '#FFFFFF',
      },
      secondary: {
        bg: '#9A9EA1',
        font: '#FFFFFF',
      },
    },
  },
};
