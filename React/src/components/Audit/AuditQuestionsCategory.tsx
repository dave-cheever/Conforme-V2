import { Stack, Text } from '@chakra-ui/react';

import { useAuditContext } from '../../contexts/AuditProvider';
import { IQuestionsCategory } from '../../interfaces/IQuestionsCategory';
import AuditQuestionListItem from './AuditQuestionListItem';

function AuditQuestionsCategory({
  questionsCategory,
  handleDelete,
}: {
  questionsCategory: IQuestionsCategory;
  handleDelete: () => void;
}) {
  const { questions } = useAuditContext();
  const categoryQuestions = questions[questionsCategory?._id];
  if (!categoryQuestions) return null;

  return (
    <Stack
        data-id="000239"
        key={questionsCategory?._id}
        pr='10px'
        spacing={4}
        w="full">
      <Text data-id="000240" fontWeight="semibold">{questionsCategory.name}</Text>
      <Stack data-id="000241" spacing={2}>
        {categoryQuestions.map((question) => (
          <AuditQuestionListItem
            data-id="000242"
            handleDelete={handleDelete}
            key={question._id}
            question={question} />
        ))}
      </Stack>
    </Stack>
  );
}

export default AuditQuestionsCategory;
