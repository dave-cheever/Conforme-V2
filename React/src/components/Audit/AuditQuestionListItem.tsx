import { EditIcon } from '@chakra-ui/icons';
import { Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { useAppContext } from '../../contexts/AppProvider';
import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';
import useDevice from '../../hooks/useDevice';
import { ActionsIcon, AreaInfoIcon, Eye, Trashcan } from '../../icons';
import Can, { isPermitted } from '../can';
import DocumentThumbnail from '../Documents/DocumentThumbnail';

const AuditQuestionListItem = ({ question, handleDelete }: { question: TQuestionWithAnswer; handleDelete: () => void }) => {
  const { user } = useAppContext();
  const { audit, setSelectedQuestion } = useAuditContext();
  const numberOfActions = (question?.answer?.actions || []).length;
  const isUserPermittedToModify = isPermitted({ user, action: 'audits.edit', data: { audit } });
  const device = useDevice();
  return (
    <HStack
      bgColor="auditItem.listItem.bg"
      h="90px"
      key={question._id}
      onClick={device === 'mobile' ? () => setSelectedQuestion(question) : () => {}}
      p={4}
      rounded="10px"
    >
      <Stack flexGrow={1} spacing={2}>
        {audit?.auditType?.businessUnitScope === 'answer' && (
          <HStack spacing={1}>
            <AreaInfoIcon fill="transparent" stroke="auditItem.listItem.action.icon" />
            <Text color="auditItem.listItem.action.color" fontSize="ssm">
              {capitalize(question.answer?.businessUnit?.name)}
            </Text>
          </HStack>
        )}
        <Text fontSize="smm" noOfLines={1}>
          {question.question}
        </Text>
        <HStack spacing={6}>
          {question.questionsCategory?.useStatus && (
            <Text color="auditItem.listItem.action.color" fontSize="ssm">
              {capitalize(question.answer?.status)}
            </Text>
          )}
          <HStack spacing={1}>
            <ActionsIcon fill="transparent" stroke="auditItem.listItem.action.icon" />
            <Text color="auditItem.listItem.action.color" fontSize="ssm">
              {numberOfActions} {pluralize('Action', numberOfActions)}
            </Text>
          </HStack>
        </HStack>
      </Stack>
      <HStack spacing={2}>
        {(question.answer?.attachments || []).length >= 1 && (
          <DocumentThumbnail document={question.answer!.attachments![0]} key={question.answer!.attachments![0]?.id} />
        )}
        {(question.answer?.attachments || []).length - 1 > 1 && (
          <Flex
            align="center"
            border="1px solid"
            borderColor="documentUploaded.border"
            cursor="default"
            h="55px"
            justify="center"
            rounded="3px"
            w="55px"
          >
            +{(question.answer?.attachments || []).length - 1}
          </Flex>
        )}
      </HStack>
      {audit.status === 'upcoming' && isUserPermittedToModify && (
        <Stack>
          <EditIcon cursor="pointer" onClick={() => setSelectedQuestion(question)} stroke="auditItem.listItem.editIcon" />
          <Can
            action="answers.delete"
            data={{ answer: question?.answer, audit }}
            yes={() => (
              <>
                <Spacer />
                <Trashcan
                  cursor="pointer"
                  onClick={() => {
                    setSelectedQuestion(question);
                    handleDelete();
                  }}
                  stroke="auditItem.listItem.deleteIcon"
                />
              </>
            )}
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
