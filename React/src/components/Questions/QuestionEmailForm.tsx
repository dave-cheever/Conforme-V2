import { useForm } from 'react-hook-form';

import { Button, Flex, Icon, Text } from '@chakra-ui/react';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { OpenMenuArrow } from '../../icons';
import { IQuestionFormBase } from '../../interfaces/IQuestionFormBase';
import { questionHeader } from '../../utils/helpers';
import Checkbox from '../Forms/Checkbox';
import TextInput from '../Forms/TextInput';

function QuestionEmailForm({
  questionType,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
}: IQuestionFormBase<string>) {
  const { trackerItem } = useTrackerItemModalContext();
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
  const questionAlreadyExist = (trackerItem.questions || []).findIndex(({ name }) => name === questionName) > -1;
  return (
    <>
      <Flex alignItems="center" data-id="000508" mb="20px">
        <Text data-id="000509" fontSize="smm" fontWeight="bold">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        data-id="000510"
        label="Question instructions (optional)"
        name="name"
        placeholder="e.g. must be a company email"
        validations={{
          notEmpty: true,
          isEmail: true,
        }}
        variant="secondaryVariant" />
      <Checkbox
        control={control}
        data-id="000511"
        label="Answer is required"
        name="required"
        variant="secondaryVariant" />
      <Flex data-id="000512" justifyContent="space-between" mt="15px">
        <Button
          bg="questionEmailForm.button.secondary.bg"
          color="questionEmailForm.button.secondary.font"
          data-id="000513"
          fontSize="sm"
          fontWeight="700"
          h="27px"
          onClick={() => {
            setShowQuestionForm(false);
            setIsEdit(false);
            setEditQuestionIndex(undefined);
            setEditQuestion('');
          }}
          opacity="0.5"
          p="17px">
          Cancel
        </Button>
        <Button
          bg="questionEmailForm.button.primary.bg"
          color="questionEmailForm.button.primary.font"
          data-id="000514"
          disabled={questionAlreadyExist || Object.keys(errors).length > 0 || !questionName}
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            const question = getValues();
            addOrUpdateQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          p="17px"
          rightIcon={<Icon
            as={OpenMenuArrow}
            data-id="000515"
            stroke="trackerItemModal.tabs.bottomButton.icon"
            transform="rotate(270deg)" />}
          title={questionAlreadyExist ? 'This question already exist' : ''}>
          Save question
        </Button>
      </Flex>
    </>
  );
}

export default QuestionEmailForm;

export const questionEmailFormStyles = {
  questionEmailForm: {
    button: {
      primary: {
        bg: '#462AC4',
        font: '#FFFFFF',
      },
      secondary: {
        bg: '#F0F2F5',
        font: '#818197',
      },
    },
  },
};
