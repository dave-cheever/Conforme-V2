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
        data-id="000535"
        h="90px"
        key={question._id}
        onClick={() => setSelectedQuestion(question)}
        p={4}
        rounded="10px">
      <Stack data-id="000536" flexGrow={1} spacing={2}>
        {audit?.auditType?.businessUnitScope === 'answer' && (
          <HStack data-id="000537" spacing={1}>
            <AreaInfoIcon
              data-id="000538"
              fill="transparent"
              stroke="auditItem.listItem.action.icon" />
            <Text
              color="auditItem.listItem.action.color"
              data-id="000539"
              fontSize="ssm">
              {capitalize(question.answer?.businessUnit?.name)}
            </Text>
          </HStack>
        )}
        <Text data-id="000540" fontSize="smm" noOfLines={1}>
          {question.question}
        </Text>
        <HStack data-id="000541" spacing={6}>
          {question.questionsCategory?.useStatus && (
            <Text
              color="auditItem.listItem.action.color"
              data-id="000542"
              fontSize="ssm">
              {capitalize(question.answer?.status)}
            </Text>
          )}
          <HStack data-id="000543" spacing={1}>
            <ActionsIcon
              data-id="000544"
              fill="transparent"
              stroke="auditItem.listItem.action.icon" />
            <Text
              color="auditItem.listItem.action.color"
              data-id="000545"
              fontSize="ssm">
              {numberOfActions} {pluralize('Action', numberOfActions)}
            </Text>
          </HStack>
        </HStack>
      </Stack>
      <HStack data-id="000546" spacing={2}>
        {(question.answer?.attachments || []).length >= 1 && (
          <DocumentThumbnail
            data-id="000547"
            document={question.answer!.attachments![0]}
            key={question.answer!.attachments![0]?.id} />
        )}
        {(question.answer?.attachments || []).length - 1 > 1 && (
          <Flex
            align="center"
            border="1px solid"
            borderColor="documentUploaded.border"
            cursor="default"
            data-id="000548"
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
