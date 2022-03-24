import React from 'react';
import { Flex } from '@chakra-ui/layout';
import QuestionMultiChoiceForm from './QuestionMultiChoiceForm';
import QuestionSimpleForm from './QuestionSimpleForm';
import QuestionEmailForm from './QuestionEmailForm';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import { IQuestionChoice } from '../../interfaces/IQuestionChoice';

const QuestionForm = ({
  setShowQuestionForm,
  questionType,
  addOrUpdateQuestion,
  value,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
  editQuestionIndex
}) => {
  return (
    <Flex bg="questionForm.bg" maxH="calc(100% - 100px)" rounded="10px" p="20px 25px" flexDirection="column" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
      {(questionType === 'text' || questionType === 'textMultiline' || questionType === 'switch' || questionType === 'datepicker') && (
        <QuestionSimpleForm
          questionType={questionType}
          addOrUpdateQuestion={addOrUpdateQuestion}
          setShowQuestionForm={setShowQuestionForm}
          editableValue={value as ITrackerQuestion<string>}
          setIsEdit={setIsEdit}
          setEditQuestionIndex={setEditQuestionIndex}
          setEditQuestion={setEditQuestion}
          editQuestionIndex={editQuestionIndex}
        />)}
      {questionType === 'multipleChoice' && (
        <QuestionMultiChoiceForm
          questionType={questionType}
          addOrUpdateQuestion={addOrUpdateQuestion}
          setShowQuestionForm={setShowQuestionForm}
          editableValue={value as ITrackerQuestion<IQuestionChoice[]>}
          setIsEdit={setIsEdit}
          setEditQuestionIndex={setEditQuestionIndex}
          setEditQuestion={setEditQuestion}
          editQuestionIndex={editQuestionIndex}
        />
      )}
      {questionType === 'email' && (
        <QuestionEmailForm
          questionType={questionType}
          addOrUpdateQuestion={addOrUpdateQuestion}
          setShowQuestionForm={setShowQuestionForm}
          editableValue={value as ITrackerQuestion<string>}
          setIsEdit={setIsEdit}
          setEditQuestionIndex={setEditQuestionIndex}
          setEditQuestion={setEditQuestion}
          editQuestionIndex={editQuestionIndex}
        />
      )}
    </Flex>
  );
};

export default QuestionForm;

export const questionFormStyles = {
  questionForm: {
    bg: "white"
  }
}