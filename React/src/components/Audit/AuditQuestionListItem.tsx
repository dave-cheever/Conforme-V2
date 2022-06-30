import { EditIcon } from '@chakra-ui/icons';
import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { useAppContext } from '../../contexts/AppProvider';
import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';
import { ActionsIcon, Eye, Trashcan } from '../../icons';
import { isPermitted } from '../can';
import DocumentThumbnail from '../Documents/DocumentThumbnail';

const AuditQuestionListItem = ({ question, handleDelete }: { question: TQuestionWithAnswer; handleDelete: () => void }) => {
  const { user } = useAppContext();
  const { audit, setSelectedQuestion } = useAuditContext();
  const numberOfActions = (question?.answer?.actions || []).length;
  const isUserPermittedToModify = isPermitted({ user, action: 'audits.edit', data: { audit } });

  return (
    <HStack bgColor="auditItem.listItem.bg" h="90px" key={question._id} p={4} rounded="10px">
      <Stack flexGrow={1} spacing={2}>
        <Text fontSize="smm">{question.question}</Text>
        <HStack>
          <ActionsIcon fill="transparent" stroke="auditItem.listItem.action.icon" />
          <Text color="auditItem.listItem.action.color" fontSize="ssm">
            {numberOfActions} {pluralize('Action', numberOfActions)}
          </Text>
        </HStack>
      </Stack>
      <HStack>
        {question.questionsCategory?.useStatus && (
          <Box mr={2}>
            <Text fontWeight="bold">{capitalize(question.answer?.status)}</Text>
          </Box>
        )}
        {question.answer?.attachments?.map((attachment) => (
          <DocumentThumbnail document={attachment} key={attachment.id} />
        ))}
      </HStack>
      {audit.status === 'upcoming' && isUserPermittedToModify && (
        <Stack>
          <EditIcon cursor="pointer" onClick={() => setSelectedQuestion(question)} stroke="auditItem.listItem.editIcon" />
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
      {(audit.status !== 'upcoming' || !isUserPermittedToModify) && (
        <Stack>
          <Eye cursor="pointer" onClick={() => setSelectedQuestion(question)} stroke="auditItem.listItem.editIcon" />
        </Stack>
      )}
    </HStack>
  );
};

export default AuditQuestionListItem;
