import React from 'react';

import { Flex } from '@chakra-ui/react';

import { IQuestionChoice } from '../../interfaces/IQuestionChoice';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import QuestionEmailForm from './QuestionEmailForm';
import QuestionMultiChoiceForm from './QuestionMultiChoiceForm';
import QuestionSimpleForm from './QuestionSimpleForm';
import QuestionSingleChoiceForm from './QuestionSingleChoiceForm';

function QuestionForm({
  setShowQuestionForm,
  questionType,
  addOrUpdateQuestion,
  value,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
  editQuestionIndex,
}) {
  return (
    <Flex
      data-id="030925-5f1447"
      bg="questionForm.bg"
      boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
      flexDirection="column"
      p="20px 25px"
      rounded="10px">
      {(questionType === 'text' ||
        questionType === 'textMultiline' ||
        questionType === 'switch' ||
        questionType === 'url' ||
        questionType === 'datepicker') && (
        <QuestionSimpleForm
          data-id="030925-dbc6b4"
          addOrUpdateQuestion={addOrUpdateQuestion}
          editableValue={value as ITrackerQuestion<string>}
          editQuestionIndex={editQuestionIndex}
          questionType={questionType}
          setEditQuestion={setEditQuestion}
          setEditQuestionIndex={setEditQuestionIndex}
          setIsEdit={setIsEdit}
          setShowQuestionForm={setShowQuestionForm} />
      )}
      {questionType === 'multipleChoice' && (
        <QuestionMultiChoiceForm
          data-id="030925-27a2a0"
          addOrUpdateQuestion={addOrUpdateQuestion}
          editableValue={value as ITrackerQuestion<IQuestionChoice[]>}
          editQuestionIndex={editQuestionIndex}
          questionType={questionType}
          setEditQuestion={setEditQuestion}
          setEditQuestionIndex={setEditQuestionIndex}
          setIsEdit={setIsEdit}
          setShowQuestionForm={setShowQuestionForm} />
      )}
      {questionType === 'singleChoice' && (
        <QuestionSingleChoiceForm
          data-id="030925-614749"
          addOrUpdateQuestion={addOrUpdateQuestion}
          editableValue={value as ITrackerQuestion<string>}
          editQuestionIndex={editQuestionIndex}
          questionType={questionType}
          setEditQuestion={setEditQuestion}
          setEditQuestionIndex={setEditQuestionIndex}
          setIsEdit={setIsEdit}
          setShowQuestionForm={setShowQuestionForm} />
      )}
      {questionType === 'email' && (
        <QuestionEmailForm
          data-id="030925-56a02d"
          addOrUpdateQuestion={addOrUpdateQuestion}
          editableValue={value as ITrackerQuestion<string>}
          editQuestionIndex={editQuestionIndex}
          questionType={questionType}
          setEditQuestion={setEditQuestion}
          setEditQuestionIndex={setEditQuestionIndex}
          setIsEdit={setIsEdit}
          setShowQuestionForm={setShowQuestionForm} />
      )}
    </Flex>
  );
}

export default QuestionForm;

export const questionFormStyles = {
  questionForm: {
    bg: 'white',
  },
};
