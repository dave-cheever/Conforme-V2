import React from 'react';
import { Flex } from '@chakra-ui/layout';
import QuestionMultiChoiceForm from './QuestionMultiChoiceForm';
import QuestionSimpleForm from './QuestionSimpleForm';
import QuestionEmailForm from './QuestionEmailForm';

const QuestionForm = ({ setShowQuestionForm, questionType, addQuestion }) => {
   return (
    <Flex bg="questionForm.bg" maxH="calc(100% - 100px)" rounded="10px" p="20px 25px" flexDirection="column" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
      {(questionType === 'text' || questionType === 'switch' || questionType === 'datepicker')&& (
        <QuestionSimpleForm
          questionType={questionType}
          addQuestion={addQuestion}
          setShowQuestionForm={setShowQuestionForm}
        />)}
      {questionType === 'multipleChoice' && (
        <QuestionMultiChoiceForm
          questionType={questionType}
          addQuestion={addQuestion}
          setShowQuestionForm={setShowQuestionForm}
        />
      )}
      {questionType === 'email' && (
        <QuestionEmailForm
          questionType={questionType}
          addQuestion={addQuestion}
          setShowQuestionForm={setShowQuestionForm}
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