import React from 'react';

import { Flex } from '@chakra-ui/react';

import { IQuestionChoice } from '../../interfaces/IQuestionChoice';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import QuestionEmailForm from './QuestionEmailForm';
import QuestionMultiChoiceForm from './QuestionMultiChoiceForm';
import QuestionSimpleForm from './QuestionSimpleForm';

const QuestionForm = ({
  setShowQuestionForm,
  questionType,
  addOrUpdateQuestion,
  value,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
  editQuestionIndex,
}) => (
  <Flex
    bg="questionForm.bg"
    boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
    flexDirection="column"
    maxH="calc(100% - 100px)"
    p="20px 25px"
    rounded="10px"
  >
    {(questionType === 'text' ||
      questionType === 'textMultiline' ||
      questionType === 'switch' ||
      questionType === 'datepicker') && (
      <QuestionSimpleForm
        addOrUpdateQuestion={addOrUpdateQuestion}
        editableValue={value as ITrackerQuestion<string>}
        editQuestionIndex={editQuestionIndex}
        questionType={questionType}
        setEditQuestion={setEditQuestion}
        setEditQuestionIndex={setEditQuestionIndex}
        setIsEdit={setIsEdit}
        setShowQuestionForm={setShowQuestionForm}
      />
    )}
    {questionType === 'multipleChoice' && (
      <QuestionMultiChoiceForm
        addOrUpdateQuestion={addOrUpdateQuestion}
        editableValue={value as ITrackerQuestion<IQuestionChoice[]>}
        editQuestionIndex={editQuestionIndex}
        questionType={questionType}
        setEditQuestion={setEditQuestion}
        setEditQuestionIndex={setEditQuestionIndex}
        setIsEdit={setIsEdit}
        setShowQuestionForm={setShowQuestionForm}
      />
    )}
    {questionType === 'email' && (
      <QuestionEmailForm
        addOrUpdateQuestion={addOrUpdateQuestion}
        editableValue={value as ITrackerQuestion<string>}
        editQuestionIndex={editQuestionIndex}
        questionType={questionType}
        setEditQuestion={setEditQuestion}
        setEditQuestionIndex={setEditQuestionIndex}
        setIsEdit={setIsEdit}
        setShowQuestionForm={setShowQuestionForm}
      />
    )}
  </Flex>
);

export default QuestionForm;

export const questionFormStyles = {
  questionForm: {
    bg: 'white',
  },
};
