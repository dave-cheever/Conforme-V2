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
    (<Stack
      data-id="d8e159e69caf"
      key={questionsCategory._id}
      pr='10px'
      spacing={4}
      w="full">
      <Text data-id="8a519ddb97be" fontWeight="semibold">{questionsCategory.name}</Text>
      <Stack data-id="d09dcdb06743" spacing={2}>
        {categoryQuestions.map((question) => (
          <AuditQuestionListItem
            data-id="c76e77522e85"
            handleDelete={handleDelete}
            key={question._id}
            question={question} />
        ))}
      </Stack>
    </Stack>)
  );
};

export default AuditQuestionsCategory;
