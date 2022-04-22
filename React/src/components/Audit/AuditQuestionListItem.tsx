import { EditIcon } from '@chakra-ui/icons';
import { HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import pluralize from 'pluralize';

import {
  TQuestionWithAnswer,
  useAuditContext,
} from '../../contexts/AuditProvider';
import { ActionsIcon, Trashcan } from '../../icons';
import DocumentThumbnail from '../Documents/DocumentThumbnail';

const AuditQuestionListItem = ({
  question,
  handleDelete,
}: {
  question: TQuestionWithAnswer;
  handleDelete: () => void;
}) => {
  const { audit, setSelectedQuestion } = useAuditContext();
  const numberOfActions = (question?.answer?.actions || []).length;
  return (
    <HStack
      bgColor="auditItem.listItem.bg"
      h="90px"
      key={question._id}
      p={4}
      rounded="10px"
    >
      <Stack flexGrow={1} spacing={2}>
        <Text fontSize="smm">{question.question}</Text>
        <HStack>
          <ActionsIcon
            fill="transparent"
            stroke="auditItem.listItem.action.icon"
          />
          <Text color="auditItem.listItem.action.color" fontSize="ssm">
            {numberOfActions} {pluralize('Action', numberOfActions)}
          </Text>
        </HStack>
      </Stack>
      <HStack>
        {question.answer?.attachments?.map((attachment) => (
          <DocumentThumbnail document={attachment} key={attachment.id} />
        ))}
      </HStack>
      {audit.status === 'inProgress' && (
        <Stack>
          <EditIcon
            cursor="pointer"
            onClick={() => setSelectedQuestion(question)}
            stroke="auditItem.listItem.editIcon"
          />
          <Spacer />
          <Trashcan
            cursor="pointer"
            onClick={() => {
              setSelectedQuestion(question);
              handleDelete();
            }}
            stroke="auditItem.listItem.deleteIcon"
          />
        </Stack>
      )}
    </HStack>
  );
};

export default AuditQuestionListItem;
