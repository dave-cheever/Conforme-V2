import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Text,
} from '@chakra-ui/react';

import { IQuestion } from '../../interfaces/IQuestion';
import QuestionTile from '../Questions/QuestionTile';
import QuestionForm from '../Questions/QuestionForm';
import QuestionList from '../Questions/QuestionList';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';

const QuestionsForm = () => {
  const {
    complianceItem,
    setValue,
  } = useComplianceItemModalContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [questionType, setQuestionType] = useState<string>("");

  const addQuestion = (question: IQuestion) => {
    const questions = [...(complianceItem.questions || []), question];
    setValue('questions', questions);
  };

  return (
    <Stack w='full' spacing={4} pl={[0, 0, 3]} pb={isDragging ? 'calc(65px + .5rem)' : 0}>
      <Text fontSize='14px' color='adminComplianceItemModal.section.questions.description' opacity='0.7'>
        If you need to add any additional questions regarding this compliance item, you can use this section to create them.
      </Text>
      {!showQuestionForm &&
        <Grid w='full' templateColumns="repeat(3, 1fr)" gap={4} paddingRight='5px'>
          <QuestionTile setQuestionType={setQuestionType} type="text" buttonText="Text input" setShowQuestionForm={setShowQuestionForm} disabled={false} />
          <QuestionTile setQuestionType={setQuestionType} type="toggle" buttonText="Yes / No" setShowQuestionForm={setShowQuestionForm} disabled={false} />
          <QuestionTile setQuestionType={setQuestionType} type="datePicker" buttonText="Date" setShowQuestionForm={setShowQuestionForm} disabled={false} />
        </Grid>
      }
      {showQuestionForm &&
        <QuestionForm
          setShowQuestionForm={setShowQuestionForm}
          questionType={questionType}
          addQuestion={addQuestion}
        />
      }
      {!showQuestionForm &&
        <QuestionList
          setIsDragging={setIsDragging}
          complianceItem={complianceItem}
          handleChange={questions => setValue('questions', questions)}
          disabled={false}
        />
      }
    </Stack>
  );
};

export default QuestionsForm;
