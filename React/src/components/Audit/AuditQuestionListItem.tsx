import { Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';
import { ActionsIcon, AreaInfoIcon } from '../../icons';
import DocumentThumbnail from '../Documents/DocumentThumbnail';

function AuditQuestionListItem({ question }: { question: TQuestionWithAnswer; handleDelete: () => void }) {
  const { audit, setSelectedQuestion } = useAuditContext();
  const numberOfActions = (question?.answer?.actions || []).length;
  return (
    <HStack
        bgColor="auditItem.listItem.bg"
        border="1px solid #CBD5E0"
        cursor="pointer"
        data-id="030925-62acfc"
        h="90px"
        key={question._id}
        onClick={() => setSelectedQuestion(question)}
        p={4}
        rounded="10px">
      <Stack data-id="030925-b7934c" flexGrow={1} spacing={2}>
        {audit?.auditType?.businessUnitScope === 'answer' && (
          <HStack data-id="030925-873030" spacing={1}>
            <AreaInfoIcon
              data-id="030925-272c13"
              fill="transparent"
              stroke="auditItem.listItem.action.icon" />
            <Text
              color="auditItem.listItem.action.color"
              data-id="030925-0ccc89"
              fontSize="ssm">
              {capitalize(question.answer?.businessUnit?.name)}
            </Text>
          </HStack>
        )}
        <Text data-id="030925-b1cd31" fontSize="smm" noOfLines={1}>
          {question.question}
        </Text>
        <HStack data-id="030925-705d9b" spacing={6}>
          {question.questionsCategory?.useStatus && (
            <Text
              color="auditItem.listItem.action.color"
              data-id="030925-331859"
              fontSize="ssm">
              {capitalize(question.answer?.status)}
            </Text>
          )}
          <HStack data-id="030925-ca360a" spacing={1}>
            <ActionsIcon
              data-id="030925-56441a"
              fill="transparent"
              stroke="auditItem.listItem.action.icon" />
            <Text
              color="auditItem.listItem.action.color"
              data-id="030925-7894f5"
              fontSize="ssm">
              {numberOfActions} {pluralize('Action', numberOfActions)}
            </Text>
          </HStack>
        </HStack>
      </Stack>
      <HStack data-id="030925-f73c7f" spacing={2}>
        {(question.answer?.attachments || []).length >= 1 && (
          <DocumentThumbnail
            data-id="030925-a7fcb7"
            document={question.answer!.attachments![0]}
            key={question.answer!.attachments![0]?.id} />
        )}
        {(question.answer?.attachments || []).length - 1 > 1 && (
          <Flex
            align="center"
            border="1px solid"
            borderColor="documentUploaded.border"
            cursor="default"
            data-id="030925-5c4641"
            h="55px"
            justify="center"
            rounded="3px"
            w="55px">
            +{(question.answer?.attachments || []).length - 1}
          </Flex>
        )}
      </HStack>
    </HStack>
  );
}

export default AuditQuestionListItem;
