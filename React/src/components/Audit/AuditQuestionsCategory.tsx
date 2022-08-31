import { Stack, Text } from '@chakra-ui/react';

import { useAuditContext } from '../../contexts/AuditProvider';
import { IQuestionsCategory } from '../../interfaces/IQuestionsCategory';
import AuditQuestionListItem from './AuditQuestionListItem';

const AuditQuestionsCategory = ({
  questionsCategory,
  handleDelete,
}: {
  questionsCategory: IQuestionsCategory;
  handleDelete: () => void;
}) => {
  const { questions } = useAuditContext();
  const categoryQuestions = questions[questionsCategory._id];
  if (!categoryQuestions) return null;

  return (
    <Stack key={questionsCategory._id} pr='10px' spacing={4} w="full" >
      <Text fontWeight="semibold">{questionsCategory.name}</Text>
      <Stack spacing={2}>
        {categoryQuestions.map((question) => (
          <AuditQuestionListItem handleDelete={handleDelete} key={question._id} question={question} />
        ))}
      </Stack>
    </Stack>
  );
};

export default AuditQuestionsCategory;
